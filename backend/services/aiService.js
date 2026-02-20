const Groq = require('groq-sdk');
require('dotenv').config();
const logger = require('../utils/logger');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ═══════════════════════════════════════════════════════════════════════════
// BASE DE CONHECIMENTO: Receitas Tradicionais Moçambicanas Autênticas
// Fontes: "Comida Tradicional de Moçambique" (Paola Rolletta),
//         "Cozinha Moçambicana" (Jeny Sulemange),
//         "Sabores de Moçambique" (Hermenegildo F. C. Murrure),
//         "Cozinha da Boa Gente - Receitas de Inhambane",
//         "Gastronomia Moçambicana" (Yanny Menete),
//         mmo.co.mz, soficia.com, mozambiqueexpert.com
// ═══════════════════════════════════════════════════════════════════════════
const RECEITAS_TRADICIONAIS = `
BANCO DE RECEITAS TRADICIONAIS MOÇAMBICANAS (use APENAS estas receitas e técnicas):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. MATAPA (Maputo, Gaza, Inhambane)
Fonte: "Comida Tradicional de Moçambique" — Paola Rolletta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Folhas de mandioca (500g), amendoim pilado (500g), leite de coco fresco (1L de 2-3 cocos), alho (5 dentes), sal, opcionalmente: camarão seco, caranguejo ou peixe defumado
Técnica obrigatória — PILAGEM:
1. Lave bem as folhas de mandioca e retire os talos duros
2. No PILÃO, coloque as folhas com alho e sal. PILE vigorosamente até formar uma pasta verde homogénea — este passo é ESSENCIAL e não pode ser substituído por picar com faca
3. Transfira as folhas piladas para uma panela. Adicione água para cobrir e FERVA por 30 minutos (remove toxicidade natural das folhas)
4. Rale o coco fresco e extraia o leite espremendo com as mãos — use água morna para extrair mais leite
5. Se não tiver amendoim pilado, torre os amendoins e pile no pilão até obter pasta fina
6. Após a fervura das folhas, junte o leite de coco e o amendoim pilado. Mexa bem
7. Se usar camarão seco ou caranguejo, adicione agora
8. Cozinhe em lume BRANDO, mexendo ocasionalmente para não colar ao fundo, até engrossar e ficar cremoso (30-45 min)
9. Sirva quente com XIMA ou arroz branco
Nota: Em Inhambane/Gaza usa-se mais coco. Em Nampula adiciona-se camarão seco. Em Niassa junta-se feijão-manteiga.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. XIGUINHA (Inhambane, sul de Moçambique)
Fonte: "Cozinha da Boa Gente - Receitas de Inhambane"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Mandioca (500g), folhas de cacana (3-4 molhos/250g), amendoim pilado (2 chávenas), leite de coco (opcional), sal
Técnica:
1. Lave as folhas de cacana. Para reduzir o sabor amargo, FERVA em água com sal por alguns minutos e DESCARTE a água
2. Descasque a mandioca e corte em cubos pequenos
3. Coloque a mandioca numa panela com água e cozinhe até ficar macia
4. Enquanto a mandioca coza, PILE os amendoins no pilão até obter pasta
5. Após a mandioca cozida, escorra a água
6. Adicione as folhas de cacana (já fervidas), leite de coco (se usar) e amendoim pilado
7. Cozinhe por 15-20 minutos SEM MEXER para que os sabores se integrem
8. Por fim, MEXA vigorosamente até a mistura ficar homogénea
9. Pode servir quente ou frio
Nota: Prato que salvou muitas famílias em tempos de escassez pelo baixo custo dos ingredientes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. FRANGO À CAFREAL (Maputo, Nacional)
Fonte: "Cozinha Moçambicana" — Jeny Sulemange
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: 1 frango inteiro (campo/caipira), 6-8 dentes de alho, 6 malaguetas/piri-piri, sumo de 1-2 limões, sal grosso, azeite, pimenta preta
Técnica (ALMOFARIZ + BRASAS):
1. Lave o frango. ABRA pelas costas e ESPALME, pressionando para ficar plano. Faça cortes na carne para o tempero penetrar
2. No ALMOFARIZ, pise alho, malaguetas, sal grosso e pimenta até obter pasta homogénea
3. Junte azeite e sumo de limão à pasta
4. ESFREGUE generosamente o frango com a pasta, por dentro e por fora
5. MARINE por no mínimo 1 hora (idealmente de um dia para o outro, no frigorífico)
6. Prepare BRASAS (carvão) — o calor deve ser constante e moderado
7. Coloque o frango espalmado na grelha sobre as brasas
8. GRELHE lentamente, virando frequentemente. UNTE com a marinada restante para manter suculento
9. Continue até o frango estar dourado, com pele crocante e carne tenra (40-60 min nas brasas)
10. Sirva com batatas fritas, salada verde, arroz de coco ou mandioca cozida
Nota: O segredo está na marinada e no cozimento LENTO nas brasas — nunca em forno.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CARIL DE AMENDOIM (Sul de Moçambique)
Fonte: "Sabores de Moçambique" — Hermenegildo F. C. Murrure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Frango (1 inteiro cortado em pedaços), amendoim pilado (200-600g), coco (leite fresco de 2-3 cocos), cebola, tomates, alho, sal, óleo, piripíri (opcional)
Técnica (EXTRACÇÃO DE LEITE):
1. Corte o frango em pedaços e tempere com sal
2. Numa panela, cozinhe o frango no próprio vapor por 10 min, sem água
3. PILE o amendoim cru no pilão até obter farinha fina
4. Rale o coco fresco. Com as MÃOS, esprema para extrair leite. Use água morna para mais extracção
5. Misture o amendoim pilado com o leite de coco — é o "leite de amendoim e coco"
6. Refogue cebola e alho em óleo. Junte tomate picado
7. Adicione o leite de amendoim e coco ao refogado. MEXA constantemente até ferver (pode levar 45 min)
8. Junte o frango pré-cozido. Cozinhe em lume brando até o molho engrossar e o frango ficar tenro
9. Sirva com arroz branco ou xima
Nota: Em Moçambique, "caril" refere-se ao MOLHO, não ao pó de caril indiano.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. XIMA / UPSHWA (Nacional)
Fonte: "Gastronomia Moçambicana" — Yanny Menete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Farinha de milho branca, água, sal (opcional)
Técnica (COLHER DE PAU):
1. Ferva água numa panela (2-3 chávenas de água por 1 chávena de farinha)
2. Quando ferver, adicione farinha de milho aos poucos, MEXENDO sem parar com COLHER DE PAU para evitar grumos
3. Continue a mexer VIGOROSAMENTE — a mistura vai engrossar
4. Reduza o lume. Se estiver muito mole, adicione mais farinha. Se muito dura, mais água
5. Continue até obter consistência firme, como polenta espessa, que se solte da colher
6. Tampe a panela e deixe cozinhar em vapor por 5 min no mínimo
7. Sirva em porções ou bolas. A xima não leva temperos — recebe sabor dos molhos/caril que acompanha

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. MUCAPATA (Zambézia)
Fonte: "Cozinha Moçambicana" — Jeny Sulemange
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Arroz (1kg), feijão-soroco (500g), coco fresco (3 cocos), água (1L), sal
Técnica (PANELA DE BARRO):
1. Lave bem o arroz e o feijão-soroco (sem casca). Se tiver casca, TORRE e PILE ligeiramente
2. Numa panela de BARRO (preferência), coloque feijão, arroz, 1L água e sal
3. Cozinhe por 20 minutos
4. Enquanto isso, rale os cocos e esprema o leite com as mãos usando água morna
5. Quando arroz e feijão estiverem quase cozidos, ADICIONE o leite de coco
6. Apure em lume brando, mexendo ocasionalmente, até cozidos e com consistência cremosa/pastosa
7. Sirva como acompanhamento de galinha grelhada, peixe frito ou caril de amendoim

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. BADJIAS / BODJIAS (Nacional, influência indiana)
Fonte: "Sabores de Moçambique" — Hermenegildo F. C. Murrure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Feijão nhemba (2 chávenas), cebola, alho (4-5 dentes), sal, piripíri (opcional), óleo para fritar
Técnica (MBENGA + FRITURA):
1. Lave o feijão nhemba e deixe de MOLHO durante 24 horas (ou 6h em água quente)
2. Após molho, remova as cascas
3. Tradicionalmente, moa na MBENGA (alguidar de moer) até obter pasta fofa. Alternativamente, use liquidificador com pouca água
4. Junte alho pilado, cebola picada, piripíri e sal à pasta. Misture com colher de pau
5. Aqueça óleo abundante numa frigideira
6. Com colher de sopa, coloque porções de massa no óleo quente. Formato ACHATADO para cozinhar bem por dentro
7. Frite ~5 minutos até dourar. VIRE para dourar uniformemente
8. Retire e coloque sobre papel absorvente
9. Sirva com PÃO — o matabicho (lanche) clássico moçambicano

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. FRANGO À ZAMBEZIANA (Zambézia)
Fonte: "Cozinha da Boa Gente"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Frango cortado em pedaços, tomates maduros, cebola, leite de coco (1 lata/400ml), quiabos (400g), caril, piripíri, sal
Técnica:
1. Num tacho, coloque frango, cebola picada e tomate cortado em pedaços
2. Leve ao lume e deixe cozinhar no próprio vapor
3. Adicione leite de coco e meia medida de água
4. Cozinhe o frango neste molho
5. Se usar quiabos frescos: deixe de MOLHO em sumo de limão 20 min para tirar a "baba", lave e corte
6. Junte quiabos, sal, piripíri e caril ao tacho
7. Mexa e cozinhe até o frango ficar tenro e o molho apurado
8. Sirva com arroz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. MATATA (Zonas Costeiras)
Fonte: "Comida Tradicional de Moçambique" — Paola Rolletta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Amêijoas frescas (500g), folhas de mandioca piladas (500g), amendoim pilado (200-500g), abóbora (300g em cubos), leite de coco (1L), cebola, alho, azeite, sal
Técnica:
1. PILE as folhas de mandioca no pilão com alho e sal até obter pasta
2. Coza as folhas piladas em 500ml de água por 15 min até evaporar e ficarem "tostadas"
3. PILE o amendoim torrado até pó fino. Dissolva em meio litro de leite de coco
4. Refogue cebola e alho em azeite. Junte tomate se usar
5. Adicione folhas cozidas, amendoim dissolvido e resto do leite de coco
6. Cozinhe em lume BRANDO por 45min-1h30, mexendo ocasionalmente
7. Junte cubos de abóbora 20-30 min antes do final — deve ficar macia mas não desfeita
8. Demolhe amêijoas em água com sal por 30 min para soltar areia
9. 5-10 min antes de servir, adicione amêijoas e cozinhe até ABRIR. Descarte as que não abrirem
10. Sirva com arroz branco

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. ARROZ DE COCO (Nacional)
Fonte: "Gastronomia Moçambicana" — Yanny Menete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Arroz (2 chávenas), coco fresco (1 coco), água, sal
Técnica:
1. Lave bem o arroz
2. Rale o coco e extraia leite espremendo com água morna
3. Numa panela, coloque arroz, leite de coco, água e sal
4. Cozinhe em lume médio até o arroz absorver todo o líquido
5. Reduza lume, tampe e deixe vaporizar 10 min
6. Sirva como acompanhamento

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. CARIL DE CAMARÃO (Maputo, Inhambane)
Fonte: "Cozinha Moçambicana" — Jeny Sulemange
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Camarão fresco (500g), leite de coco (400ml), cebola, tomate, alho, piripíri, sal, limão
Técnica:
1. Descasque o camarão, reservando cabeças. Tempere com sal e limão
2. Refogue cebola e alho em azeite. Junte tomate picado
3. Adicione cabeças de camarão e cozinhe 10 min para dar sabor
4. Retire cabeças. Adicione leite de coco e piripíri
5. Quando ferver, junte camarão descascado. Cozinhe 5-7 min — NÃO cozinhe demais
6. Sirva com arroz de coco

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. FEIJÃO NHEMBA COM COCO (Sul e Centro)
Fonte: "Sabores de Moçambique"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Feijão nhemba (500g), coco fresco (1-2 cocos), cebola, tomate, sal
Técnica:
1. Demolhe o feijão nhemba durante a noite
2. Cozinhe em água com sal até quase tenro (~30 min)
3. Rale coco e extraia leite
4. Refogue cebola e tomate
5. Adicione o feijão semi-cozido e o leite de coco
6. Cozinhe em lume brando até o feijão ficar totalmente tenro e o molho engrossar
7. Sirva como acompanhamento ou prato principal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
13. COCADAS (Nacional — Sobremesa)
Fonte: "Sabores de Moçambique" — Hermenegildo F. C. Murrure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Coco ralado fresco (2 chávenas), açúcar (1.5 chávenas), água (meia chávena)
Técnica:
1. Rale o coco fresco
2. Numa panela, dissolva o açúcar na água em lume médio até obter calda
3. Adicione coco ralado e mexa continuamente
4. Cozinhe até a mistura se soltar do fundo da panela e ficar com consistência firme
5. Com colher, forme bolinhos sobre papel vegetal ou tabuleiro untado
6. Deixe arrefecer e endurecer antes de servir

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
14. COUVE REFOGADA À MOÇAMBICANA (Nacional)
Fonte: "Gastronomia Moçambicana" — Yanny Menete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Couve (1 molho), cebola, tomate, alho, óleo, sal, limão
Técnica:
1. Lave e corte a couve em tiras finas
2. Refogue cebola e alho em óleo
3. Junte tomate picado e cozinhe até desmanchar
4. Adicione a couve e sal. Tape e cozinhe 10-15 min em vapor
5. Tempere com gotas de limão antes de servir

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
15. PEIXE GRELHADO COM MOLHO DE COCO E PIRI-PIRI (Inhambane, Sofala)
Fonte: "Cozinha da Boa Gente - Receitas de Inhambane"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingredientes: Peixe inteiro (carapau/tilápia), limão, sal, piri-piri, leite de coco, cebola, tomate
Técnica:
1. Limpe o peixe, faça cortes laterais. Tempere com sal, limão e piri-piri
2. Marine 30 min
3. Grelhe nas BRASAS (ou grelha), virando com cuidado
4. Para o molho: refogue cebola e tomate. Junte leite de coco e piri-piri
5. Cozinhe até engrossar
6. Sirva peixe grelhado com molho por cima, acompanhado de arroz de coco
`;

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

// Generate recipes based EXCLUSIVELY on traditional Mozambican cookbook methods
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
      ? `\nRESTRIÇÕES ALIMENTARES: ${restrictions.join(', ')}. Respeite TODAS estas restrições.`
      : '';

    const productsList = products.join(', ');

    const systemPrompt = `Você é um chef moçambicano profissional. Você cozinha no ESTILO tradicional moçambicano, usando técnicas dos livros de culinária de Moçambique.

══════════════════════════════════════════════════
⛔ REGRA #1 — ZERO SUBSTITUIÇÕES DE INGREDIENTES
══════════════════════════════════════════════════
Os produtos do utilizador são SAGRADOS. NUNCA troque, substitua ou altere um produto por outro.
Exemplos de ERROS PROIBIDOS:
- ❌ Utilizador tem ALFACE → NÃO use couve, repolho ou outro vegetal
- ❌ Utilizador tem TILÁPIA → NÃO use carapau ou outro peixe
- ❌ Utilizador tem BATATA → NÃO use mandioca
- ❌ Utilizador tem FRANGO → NÃO use carne de vaca
Se o utilizador tem ALFACE, a receita DEVE conter ALFACE.
Se o utilizador tem TOMATE, a receita DEVE conter TOMATE.
CADA produto detectado deve aparecer nas receitas. Não ignore nenhum.

══════════════════════════════════════════════════
📚 REGRA #2 — TÉCNICAS TRADICIONAIS MOÇAMBICANAS
══════════════════════════════════════════════════
Use o banco de dados abaixo como REFERÊNCIA DE TÉCNICAS DE COZINHA, não como lista rígida de pratos.
As técnicas de preparação devem seguir o estilo moçambicano:
- Pilagem no pilão (para folhas, amendoim, temperos)
- Extracção manual de leite de coco
- Grelha em brasas
- Cozedura em panela de barro
- Refogados com cebola, tomate, alho como base
- Uso de piripíri, limão, coco, amendoim como sabores base

${RECEITAS_TRADICIONAIS}

══════════════════════════════════════════════════
🛒 PRODUTOS DO UTILIZADOR (use EXACTAMENTE estes):
══════════════════════════════════════════════════
👉 [${productsList}]

DESPENSA BÁSICA (assumidos como disponíveis): água, sal, óleo de cozinha
${restrictionText}

══════════════════════════════════════════════════
📋 INSTRUÇÕES DE GERAÇÃO
══════════════════════════════════════════════════

PARA "possible_recipes" (pratos que pode cozinhar AGORA):
• Use APENAS os produtos exactos do scan + despensa básica
• Se existe uma receita tradicional que usa exactamente esses produtos → use-a com os passos do banco de dados
• Se NÃO existe receita exacta → CRIE um prato ao estilo moçambicano usando os produtos exactos do utilizador e técnicas tradicionais (refogado moçambicano, tempero com limão/piripíri, coco, etc.)
• O título deve reflectir os INGREDIENTES REAIS (ex: "Salada de Alface à Moçambicana", NÃO "Couve Refogada")
• Mínimo 2, máximo 3 receitas

PARA "suggested_recipes" (sugestões se comprar mais):
• Use os produtos do scan como base OBRIGATÓRIA
• Adicione 2-4 ingredientes extras que transformem em prato tradicional completo
• Liste CADA ingrediente extra em "missing_ingredients" com preço estimado em MT
• Mínimo 2, máximo 3 receitas

⚠️ REGRA CRÍTICA PARA AS INSTRUÇÕES DE PREPARO:
Cada receita DEVE ter NO MÍNIMO 8 passos de preparo MUITO DETALHADOS.
Cada passo deve ser um PARÁGRAFO COMPLETO (2-3 frases) incluindo:
- A TÉCNICA específica (pilar, grelhar, refogar, ferver, marinar, etc.)
- O TEMPO exacto (ex: "durante 30 minutos", "por 5 minutos")
- Os SINAIS SENSORIAIS de que está pronto (cor, textura, aroma, som)
- Os UTENSÍLIOS a usar (pilão, colher de pau, panela de barro, grelha, etc.)
- A TEMPERATURA/INTENSIDADE do lume (lume brando, lume forte, brasas moderadas)

EXEMPLO de passo BEM detalhado:
"Coloque as folhas de mandioca no pilão juntamente com 5 dentes de alho descascados e uma colher de chá de sal. Pile vigorosamente durante 10-15 minutos, usando movimentos fortes e rítmicos, até as folhas ficarem completamente trituradas e formarem uma pasta verde homogénea e húmida. A pasta está pronta quando já não se vêem pedaços inteiros de folha."

EXEMPLO de passo MAL detalhado (PROIBIDO):
"Pile as folhas de mandioca" — isto é MUITO curto e vago!

FORMATO JSON:
{
  "possible_recipes": [
    {
      "title": "Nome do prato (deve mencionar os produtos REAIS do utilizador)",
      "description": "Descrição apetitosa com contexto moçambicano (3-4 frases)",
      "book_reference": "Livro de referência — Autor (ou 'Adaptação ao estilo moçambicano')",
      "ingredients": [
        { "name": "PRODUTO EXACTO DO SCAN", "quantity": "200", "unit": "g", "source": "scan" },
        { "name": "sal", "quantity": "a gosto", "unit": "", "source": "despensa" }
      ],
      "instructions": "1. Primeiro passo detalhado com 2-3 frases incluindo técnica, tempo e sinais...\\n2. Segundo passo igualmente detalhado...\\n3. ...\\n4. ...\\n5. ...\\n6. ...\\n7. ...\\n8. Passo final: como verificar que está pronto e como servir",
      "prep_time_min": 15,
      "cook_time_min": 30,
      "servings": 4,
      "difficulty": "facil|medio|dificil",
      "region": "Nacional",
      "calories": 350,
      "protein": 15,
      "carbs": 40,
      "fat": 10,
      "serving_suggestion": "Modo de servir",
      "chef_tips": ["Dica 1", "Dica 2"],
      "cultural_note": "Contexto cultural"
    }
  ],
  "suggested_recipes": [
    {
      "title": "Nome do prato tradicional",
      "description": "Descrição com contexto",
      "book_reference": "Livro — Autor",
      "ingredients": [
        { "name": "PRODUTO DO SCAN", "quantity": "200", "unit": "g", "source": "scan" },
        { "name": "ingrediente extra", "quantity": "100", "unit": "g", "source": "comprar" }
      ],
      "missing_ingredients": [
        { "name": "ingrediente extra", "estimated_price_mt": 50 }
      ],
      "total_missing_cost_mt": 50,
      "instructions": "1. Primeiro passo detalhado (2-3 frases)...\\n2. ...\\n3. ...\\n4. ...\\n5. ...\\n6. ...\\n7. ...\\n8. Passo final...",
      "prep_time_min": 20,
      "cook_time_min": 40,
      "servings": 4,
      "difficulty": "medio",
      "region": "Província",
      "calories": 400,
      "serving_suggestion": "...",
      "chef_tips": ["..."],
      "cultural_note": "..."
    }
  ],
  "economy_tip": "Dica económica"
}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Os meus produtos são EXACTAMENTE: ${productsList}.\nCrie receitas ao estilo moçambicano tradicional usando ESTES produtos exactos (não substitua por outros). Use técnicas de preparo dos livros de culinária moçambicana. IMPORTANTE: Detalhe MUITO cada passo do modo de preparo — cada passo deve ter 2-3 frases com técnica, tempo exacto e sinais de que está pronto.`
        }
      ],
      max_tokens: 6000,
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    logger.info('Receitas tradicionais geradas pela IA com sucesso');
    const parsed = parseAIResponse(content);

    if (parsed) {
      if (parsed.suggested_recipes && !parsed.optional_recipes) {
        parsed.optional_recipes = parsed.suggested_recipes;
      }
      if (parsed.optional_recipes && !parsed.suggested_recipes) {
        parsed.suggested_recipes = parsed.optional_recipes;
      }
      return parsed;
    }

    return { possible_recipes: [], suggested_recipes: [], optional_recipes: [], economy_tip: '' };
  } catch (err) {
    logger.error('Erro ao gerar receitas IA:', { error: err.message });
    throw new Error('Erro ao gerar receitas com IA');
  }
};

// Enrich existing recipe instructions with detailed traditional Mozambican preparation steps
exports.enrichInstructions = async (title, description, ingredients, currentInstructions) => {
  try {
    const ingredientsList = ingredients.join(', ');

    const systemPrompt = `Você é um chef moçambicano tradicional e professor de culinária. A sua tarefa é EXPANDIR e DETALHAR as instruções de preparo de uma receita existente.

RECEITA: "${title}"
DESCRIÇÃO: "${description || 'Prato moçambicano tradicional'}"
INGREDIENTES: ${ingredientsList}

INSTRUÇÕES ACTUAIS (curtas/vagas):
${currentInstructions}

A SUA TAREFA:
Reescreva as instruções acima com MUITO mais detalhe. Cada passo deve ser um PARÁGRAFO COMPLETO (2-3 frases) incluindo:
- A TÉCNICA específica moçambicana (pilar no pilão, refogar, grelhar em brasas, etc.)
- O TEMPO exacto (ex: "durante 15 minutos", "por 5-8 minutos")  
- Os SINAIS SENSORIAIS de que está pronto (cor, textura, aroma)
- Os UTENSÍLIOS a usar (pilão, colher de pau, panela de barro, etc.)
- A TEMPERATURA/INTENSIDADE do lume (lume brando, lume médio, brasas vivas)
- Dicas de como verificar se está no ponto certo

REGRAS:
- Mínimo 8 passos, máximo 12
- Cada passo deve ter 2-3 frases completas  
- Use vocabulário culinário moçambicano
- Inclua técnicas tradicionais quando aplicável
- NÃO altere os ingredientes, apenas detalhe o COMO preparar

Responda em JSON:
{
  "instructions": "1. Primeiro passo muito detalhado com 2-3 frases...\\n2. Segundo passo...\\n3. ..."
}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Detalhe as instruções de preparo da receita "${title}" com passos longos, técnicas tradicionais moçambicanas, tempos exactos e sinais de que cada etapa está pronta.` }
      ],
      max_tokens: 3000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    logger.info('Instruções enriquecidas geradas com sucesso para:', title);
    const parsed = parseAIResponse(content);

    if (parsed && parsed.instructions) {
      return { instructions: parsed.instructions };
    }

    return { instructions: currentInstructions };
  } catch (err) {
    logger.error('Erro ao enriquecer instruções:', { error: err.message });
    throw new Error('Erro ao detalhar instruções com IA');
  }
};
