const Groq = require('groq-sdk');
require('dotenv').config();
const logger = require('../utils/logger');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Parse JSON from AI response (handles markdown code blocks + control chars)
const parseAIResponse = (content) => {
  if (!content) return null;

  // Step 1: Strip markdown code fences
  let cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

  // Step 2: Extract JSON object
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    logger.warn('parseAIResponse: nenhum JSON encontrado na resposta. Conteúdo bruto:', { content });
    return null;
  }
  let jsonStr = cleaned.substring(start, end + 1);

  // Step 3: Try parsing as-is first (works if AI returns valid JSON)
  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    logger.warn('JSON parse directo falhou, limpando control chars dentro de strings...', { error: e1.message });
  }

  // Step 4: Fix control characters ONLY inside double-quoted string values
  try {
    jsonStr = jsonStr.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
      return match
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    });
    return JSON.parse(jsonStr);
  } catch (e2) {
    logger.error('JSON parse falhou completamente. Conteúdo bruto:', { content, error: e2.message });
    return null;
  }
};

// Analyze image to detect products (improved multi-product prompt)
exports.analyzeImage = async (imageBase64) => {
  const systemPrompt = `Você é um especialista em identificação de produtos alimentares em imagens, com conhecimento profundo de itens moçambicanos e africanos.

TAREFA: Analise CUIDADOSAMENTE a imagem e identifique TODOS os produtos e itens visíveis.

REGRAS OBRIGATÓRIAS:
1. Examine TODA a imagem sistematicamente — canto a canto, frente e fundo
2. Identifique CADA produto individual, mesmo que haja muitos na imagem
3. Se houver múltiplas unidades do mesmo item, liste uma vez mas indique a quantidade estimada
4. Considere produtos parcialmente visíveis ou no fundo da imagem
5. Inclua produtos embalados (leia rótulos se visíveis), frutas, vegetais, carnes, grãos, temperos, etc.
6. Para cada item, indique o NÍVEL DE CONFIANÇA real (0.5 = incerto, 0.95 = muito seguro)
7. Se NÃO houver produtos ou alimentos na imagem, retorne com "no_food": true

PRODUTOS MOÇAMBICANOS COMUNS (priorize estes nomes):
- Matapa, couve, repolho, tomate, cebola, alho, piri-piri
- Mandioca (cassava), batata doce, abóbora, quiabo, feijão nhemba/manteiga
- Arroz, milho, farinha de milho, amendoim/mafurra
- Peixe (carapau, tilápia, prego), camarão, frango, carne de vaca
- Coco, leite de coco, limão, lima, manga, papaia, banana
- Óleo de cozinha, sal, açúcar, massas, enlatados

FORMATO DE RESPOSTA (JSON):
{
  "products": [
    {
      "name": "nome em português",
      "local_name": "nome local se diferente",
      "emoji": "emoji",
      "confidence": 0.95,
      "category": "categoria",
      "estimated_quantity": "2 unidades"
    }
  ],
  "total_found": número_total,
  "no_food": false,
  "image_quality": "boa|media|fraca",
  "suggestions": "dica para melhor foto se qualidade fraca"
}

Categorias: vegetal, fruta, proteina, grao, tempero, lacteo, oleo, cereal, bebida, outro.

IMPORTANTE: 
- Retorne APENAS o JSON, sem texto adicional
- Liste TODOS os itens, mesmo os pequenos ou parcialmente visíveis`;

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: attempt === 0 ? 0.2 : 0.1,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const parsed = parseAIResponse(content);

      if (parsed) {
        // Handle both 'products' and legacy 'ingredients' keys
        const items = parsed.products || parsed.ingredients || [];
        if (Array.isArray(items)) {
          parsed.products = items.map(item => ({
            name: item.name || 'Desconhecido',
            local_name: item.local_name || item.name || '',
            emoji: item.emoji || '🥄',
            confidence: Math.max(0, Math.min(1, parseFloat(item.confidence) || 0.5)),
            category: item.category || 'outro',
            estimated_quantity: item.estimated_quantity || '1'
          }));
          parsed.total_found = parsed.products.length;
          // Keep legacy key for compatibility with existing DB/Frontend if needed
          parsed.ingredients = parsed.products;
        }

        logger.info(`AI scan: ${parsed.total_found || 0} produtos detectados`);
        return parsed;
      }

      logger.warn(`AI scan: resposta inválida na tentativa ${attempt + 1}, tentando novamente...`);
    } catch (err) {
      logger.error(`AI scan erro (tentativa ${attempt + 1}):`, { error: err.message });
      if (attempt === MAX_RETRIES - 1) throw err;
    }
  }

  return { products: [], ingredients: [], total_found: 0, no_food: true, message: 'Não foi possível processar a imagem.' };
};

// Generate Mozambican recipes from products
exports.generateRecipes = async (products, dietaryProfile = {}) => {
  try {
    const restrictions = [];
    if (dietaryProfile.gluten_free) restrictions.push('sem glúten');
    if (dietaryProfile.vegan) restrictions.push('vegano');
    if (dietaryProfile.vegetarian) restrictions.push('vegetariano');
    if (dietaryProfile.low_sugar) restrictions.push('baixo açúcar');
    if (dietaryProfile.diabetic) restrictions.push('adequado para diabéticos');
    if (dietaryProfile.child_diet) restrictions.push('adequado para crianças');
    if (dietaryProfile.athlete) restrictions.push('rico em proteínas para atleta');
    if (dietaryProfile.elderly) restrictions.push('fácil digestão para idoso');
    if (dietaryProfile.pregnant) restrictions.push('nutritivo para gestante');

    const restrictionText = restrictions.length > 0
      ? `\nRestrições alimentares: ${restrictions.join(', ')}.`
      : '';

    const productsList = products.join(', ');

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Você é um chef moçambicano experiente e nutricionista. O utilizador tem EXACTAMENTE estes produtos: [${productsList}].

REGRA CRÍTICA PARA "possible_recipes":
- Use APENAS e SOMENTE os produtos listados acima como base principal
- Cada receita DEVE conter pelo menos um dos produtos fornecidos
- Ingredientes básicos de despensa (água, sal, óleo) podem ser assumidos como disponíveis
- Todas as receitas devem ser pratos moçambicanos reais

REGRA PARA "optional_recipes":
- Podem usar produtos adicionais não disponíveis
- Devem listar TODOS os produtos que faltam em "missing_ingredients"

REGRA SOBRE DETALHES (MUITO IMPORTANTE):
- As instruções devem ter NO MÍNIMO 6 passos detalhados
- Cada passo deve explicar a técnica, tempo e o que observar
- Adicione "serving_suggestion", "chef_tips" e "cultural_note"

Retorne APENAS um JSON válido:
{
  "possible_recipes": [
    {
      "title": "Prato",
      "description": "Descrição",
      "instructions": "1. Passo...\n2. Passo...\n3. Passo...\n4. Passo...\n5. Passo...\n6. Passo...",
      "prep_time_min": 15,
      "cook_time_min": 30,
      "servings": 4,
      "difficulty": "facil",
      "region": "Maputo",
      "calories": 350,
      "ingredients": [
        { "name": "produto da lista", "quantity": "200", "unit": "g" }
      ],
      "serving_suggestion": "...",
      "chef_tips": ["..."],
      "cultural_note": "..."
    }
  ],
  "optional_recipes": [
    {
      "title": "Nome",
      "ingredients": [
        { "name": "produto", "quantity": "200", "unit": "g" }
      ],
      "missing_ingredients": ["produto que falta"]
    }
  ],
  "economy_tip": "..."
}`
        },
        {
          role: 'user',
          content: `Produtos: ${productsList}.${restrictionText} Gere 2 receitas possíveis e 2 opcionais.`
        }
      ],
      max_tokens: 4000,
      temperature: 0.5
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    return parsed || { possible_recipes: [], optional_recipes: [], economy_tip: '' };
  } catch (err) {
    logger.error('Erro ao gerar receitas IA:', { error: err.message });
    throw new Error('Erro ao gerar receitas com IA');
  }
};
