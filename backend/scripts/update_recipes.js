/**
 * Script para actualizar TODAS as receitas no banco de dados
 * com descrições e modos de preparo AUTÊNTICOS moçambicanos.
 * 
 * Fontes: "Comida Tradicional de Moçambique" (Paola Rolletta),
 *         "Cozinha Moçambicana" (Jeny Sulemange),
 *         "Gastronomia Moçambicana" (Yanny Menete),
 *         mmo.co.mz, soficia.com
 */

const db = require('../config/database');

const recipes = [
    {
        id: 1,
        title: 'Matapa',
        description: 'Prato emblemático de Moçambique, a Matapa é feita com folhas de mandioca piladas no pilão com amendoim e cozidas em leite de coco fresco. Originária das províncias do sul (Maputo, Gaza e Inhambane), é um dos símbolos da culinária moçambicana, servida tradicionalmente com arroz branco e camarão seco.',
        region: 'Maputo',
        difficulty: 'medio',
        prep_time_min: 30,
        cook_time_min: 45,
        calories: 380,
        protein: 18,
        carbs: 25,
        fat: 22,
        instructions: `1. Seleccione folhas de mandioca jovens e tenras (as mais escuras e velhas são amargas). Lave-as bem em água corrente, retirando os talos duros. Sacuda o excesso de água e reserve num alguidar.
2. Coloque as folhas de mandioca lavadas no PILÃO (almofariz de madeira tradicional) juntamente com 5 dentes de alho descascados e uma colher de chá de sal grosso. Pile vigorosamente durante 15-20 minutos, usando movimentos rítmicos e fortes com a mão do pilão, até as folhas ficarem completamente trituradas e formarem uma pasta verde homogénea e húmida. A pasta está pronta quando já não se vêem pedaços inteiros de folha.
3. Torrer o amendoim cru numa frigideira seca em lume médio durante 5-8 minutos, mexendo constantemente para não queimar. Os amendoins estão prontos quando a película ficares solta e o aroma for intenso e acastanhado. Deixe arrefecer e descasque friccionando entre as palmas das mãos.
4. Coloque o amendoim torrado no pilão e pile até obter uma pasta cremosa e oleosa, durante cerca de 10 minutos. A pasta deve soltar o óleo natural do amendoim — se ficar seca, continue a pilar mais.
5. Para extrair o leite de coco fresco: rale a polpa de 1 coco maduro usando um ralador tradicional. Misture a polpa ralada com 2 chávenas de água morna e esprema firmemente com as mãos sobre um crivo ou pano fino. O primeiro leite (espesso) deve ser reservado separadamente — este é o leite gordo. Adicione mais água à polpa e esprema novamente para obter o segundo leite (mais diluído).
6. Numa panela grande de fundo grosso, coloque a pasta de folhas de mandioca piladas e cubra com o segundo leite de coco (o mais diluído). Leve ao lume médio e deixe ferver. Reduza o lume para brando e cozinhe durante 25-30 minutos, mexendo de vez em quando com colher de pau para não agarrar ao fundo.
7. Após 25 minutos, adicione a pasta de amendoim e misture bem até incorporar completamente. Junte o camarão seco (previamente lavado e demolhado) se disponível. Continue a cozinhar em lume brando durante mais 10 minutos, mexendo regularmente.
8. Nos últimos 5 minutos de cozedura, adicione o primeiro leite de coco (o gordo e espesso) e mexa delicadamente. Ajuste o sal e adicione piripíri fresco picado a gosto. A Matapa está pronta quando tiver uma consistência cremosa e aveludada, com cor verde-acastanhada e aroma intenso de coco e amendoim.
9. Sirva imediatamente num prato fundo, acompanhada de arroz branco cozido ao vapor. Tradicionalmente, a Matapa é comida com as mãos, usando o arroz para apanhar a pasta. Pode-se decorar com camarões inteiros por cima.`
    },
    {
        id: 2,
        title: 'Xiguinha',
        description: 'Prato tradicional do sul de Moçambique, particularmente de Inhambane e Gaza. A verdadeira Xiguinha é feita com folhas de CACANA (uma planta trepadeira selvagem), cozidas com mandioca, amendoim pilado e leite de coco. NÃO é feita com quiabo — essa é uma confusão comum. É um prato de raízes profundas na culinária Tsonga/Changana.',
        region: 'Gaza',
        difficulty: 'medio',
        prep_time_min: 25,
        cook_time_min: 40,
        calories: 320,
        protein: 14,
        carbs: 35,
        fat: 15,
        instructions: `1. Colha ou adquira folhas de CACANA frescas (planta trepadeira silvestre com folhas verde-escuras e lobuladas). Lave cuidadosamente cada folha em várias águas para remover terra e impurezas. A cacana é uma planta que cresce nas machambas e matas do sul de Moçambique.
2. Descasque a mandioca fresca, corte em pedaços médios (cerca de 5cm) e lave bem. Coloque numa panela grande com água suficiente para cobrir e cozinhe em lume forte durante 20-25 minutos até ficar completamente macia — quando espetada com um garfo, deve desfazer-se facilmente sem resistência.
3. Enquanto a mandioca cozinha, prepare o amendoim: torre 2 chávenas de amendoim cru numa frigideira seca em lume médio durante 5-8 minutos, agitando constantemente. Quando estiverem dourados e a soltar a película, retire do lume, deixe arrefecer e PILE no pilão até obter uma pasta grossa e oleosa.
4. Coloque as folhas de cacana lavadas numa panela separada com um pouco de água (apenas para cobrir o fundo). Cozinhe em lume médio durante 15-20 minutos até as folhas ficarem macias e mudarem de cor (de verde vivo para verde-escuro). As folhas devem estar bem tenras ao toque.
5. Escorra a mandioca cozida e transfira para a panela das folhas de cacana. Com uma colher de pau, esmague parcialmente a mandioca contra as paredes da panela, misturando com as folhas — a mandioca não deve ficar completamente desfeita, mas sim em pedaços irregulares que absorvem os sabores.
6. Extraia leite de coco fresco: rale 1 coco maduro, misture com água morna e esprema com as mãos sobre um pano fino ou crivo. Reserve o leite gordo (primeira extracção) separadamente do leite fino (segunda extracção).
7. Adicione primeiro o leite de coco fino à mistura de cacana e mandioca. Junte a pasta de amendoim pilado e mexa bem com colher de pau. Cozinhe em lume brando durante 15 minutos SEM MEXER MUITO — a tradição diz que mexer demais estraga a textura da Xiguinha.
8. Nos últimos 5 minutos, adicione o leite de coco gordo por cima e deixe incorporar suavemente. Tempere com sal a gosto. A Xiguinha está pronta quando tiver uma consistência espessa e cremosa, com a mandioca bem integrada nas folhas e o sabor característico do coco e amendoim.
9. Sirva quente em prato fundo, directamente da panela. Tradicionalmente, a Xiguinha é comida como prato principal, podendo ser acompanhada de arroz ou simplesmente consumida sozinha. É um prato de conforto das famílias do sul de Moçambique.`
    },
    {
        id: 3,
        title: 'Caril de Frango Moçambicano',
        description: 'O caril moçambicano distingue-se pela generosa utilização de leite de coco fresco, piripíri e temperos locais. Diferente dos curries asiáticos, o caril moçambicano é mais suave, cremoso e aromático, reflectindo a influência da culinária indiana adaptada durante séculos em Moçambique, especialmente na Ilha de Moçambique e Inhambane.',
        region: 'Sofala',
        difficulty: 'medio',
        prep_time_min: 20,
        cook_time_min: 45,
        calories: 420,
        protein: 32,
        carbs: 18,
        fat: 25,
        instructions: `1. Corte o frango em pedaços médios (8-10 peças), lavando bem com limão e água fria para remover qualquer cheiro. Tempere generosamente com sal, 6 dentes de alho esmagados no almofariz, sumo de 2 limões e piripíri fresco picado. Deixe marinar durante no mínimo 30 minutos (idealmente 2 horas no frigorífico) para que os sabores penetrem na carne.
2. Pique finamente 2 cebolas grandes, 4 tomates maduros e 1 pimento verde. O corte fino é importante porque os legumes devem desfazer-se durante a cozedura, formando um molho espesso e homogéneo — isto é a base (refogado) de qualquer prato moçambicano.
3. Aqueça 3 colheres de sopa de óleo de cozinha numa panela grande de fundo grosso em lume forte. Quando o óleo estiver bem quente (quase a fumegar), coloque os pedaços de frango e frite durante 4-5 minutos de cada lado até ficarem dourados e com crosta. Não mexa muito — deixe criar uma bela capa dourada. Retire e reserve num prato.
4. No mesmo óleo (agora com os sucos do frango), reduza o lume para médio e adicione a cebola picada. Refogue durante 5-7 minutos, mexendo com colher de pau, até a cebola ficar translúcida e ligeiramente dourada. Adicione o tomate picado e o pimento e continue a refogar por mais 5-8 minutos até o tomate se desfazer completamente e formar uma pasta avermelhada.
5. Extraia o leite de coco fresco: rale 1 coco maduro, misture com 3 chávenas de água morna e esprema firmemente sobre um crivo. Junte o leite fino ao refogado e mexa bem. Se usar leite de coco de lata, use uma lata inteira.
6. Devolva os pedaços de frango à panela, submergindo-os no molho. Adicione 1 folha de louro, 1 pau de canela pequeno e sal a gosto. Tape a panela e cozinhe em lume brando durante 30-35 minutos, virando o frango uma vez a meio da cozedura.
7. Nos últimos 10 minutos, destape a panela e aumente ligeiramente o lume para que o molho reduza e engrosse. O caril está no ponto quando o molho tiver uma consistência cremosa e o frango estiver tão macio que se separe facilmente do osso. Ajuste o sal e a intensidade do piripíri.
8. Finalize com um fio de leite de coco gordo por cima, umas folhas de coentro fresco picado e rodelas de limão. Sirva imediatamente com arroz branco perfumado ou arroz de coco. O caril moçambicano melhora de sabor no dia seguinte — guarde no frigorífico e reaqueça suavemente.`
    },
    {
        id: 4,
        title: 'Arroz com Feijão Nhemba',
        description: 'O feijão nhemba (feijão-frade ou feijão macunde) é um dos leguminosas mais importantes na alimentação moçambicana, cultivado extensivamente no centro e sul do país. Este prato combina o feijão nhemba com arroz e leite de coco, criando uma refeição completa em proteínas, muito popular nas famílias moçambicanas.',
        region: 'Nacional',
        difficulty: 'facil',
        prep_time_min: 15,
        cook_time_min: 50,
        calories: 390,
        protein: 16,
        carbs: 55,
        fat: 10,
        instructions: `1. Na noite anterior, coloque 2 chávenas de feijão nhemba (feijão-frade seco) numa tigela grande e cobre com água fria abundante (o triplo do volume do feijão). Deixe demolhar durante 8-12 horas. Este passo é essencial para reduzir o tempo de cozedura e tornar o feijão mais digestível.
2. No dia seguinte, escorra a água do demolho e lave o feijão em água corrente. Transfira para uma panela grande com água fresca (cerca de 4 dedos acima do feijão). Leve ao lume forte até levantar fervura. Reduza para lume médio-brando e cozinhe durante 30-40 minutos com a panela semi-tapada. O feijão está cozido quando se esmaga facilmente entre os dedos, mas ainda mantém a forma.
3. Enquanto o feijão cozinha, pique finamente 1 cebola grande e 2 tomates maduros. Descasque e esmague 3 dentes de alho no almofariz com um pouco de sal — o sal ajuda a triturar o alho mais facilmente.
4. Numa panela separada, aqueça 2 colheres de sopa de óleo em lume médio. Adicione a cebola e refogue durante 5 minutos, mexendo regularmente com colher de pau, até ficar transparente e aromática. Junte o alho esmagado e frite por mais 1 minuto até soltar aroma.
5. Adicione o tomate picado ao refogado e cozinhe durante 5-8 minutos, esmagando com as costas da colher, até formar uma pasta vermelha e o óleo começar a separar-se dos lados — este é o sinal de que o refogado está pronto.
6. Lave 2 chávenas de arroz em 3-4 águas até a água sair limpa. Adicione o arroz ao refogado e mexa bem durante 1-2 minutos para que cada grão fique envolvido no tempero e no óleo. Este passo dá sabor e evita que o arroz fique pegajoso.
7. Escorra o feijão nhemba cozido e junte ao arroz na panela. Adicione leite de coco (1 chávena) e água suficiente para cobrir o arroz (geralmente o dobro do volume). Tempere com sal, mexa uma vez e tape a panela. Cozinhe em lume brando durante 15-18 minutos sem abrir a tampa — o vapor é essencial para cozer o arroz uniformemente.
8. Após 15 minutos, verifique se o arroz está cozido e a água foi absorvida. Se necessário, adicione um pouco mais de água quente e cozinhe mais 5 minutos. Desligue o lume e deixe repousar 5 minutos com a tampa fechada. Solte o arroz com um garfo e sirva quente, decorando com folhas de coentro fresco.`
    },
    {
        id: 5,
        title: 'Peixe Grelhado com Molho de Coco',
        description: 'O peixe grelhado em brasas é uma tradição costeira de Moçambique, especialmente em Inhambane, Vilankulo e Ilha de Moçambique. A técnica de grelhar sobre carvão de mangal ou acácia dá um sabor defumado único, e o molho de coco e piripíri é a assinatura moçambicana que transforma um simples peixe grelhado numa experiência gastronómica memorável.',
        region: 'Inhambane',
        difficulty: 'medio',
        prep_time_min: 20,
        cook_time_min: 30,
        calories: 350,
        protein: 35,
        carbs: 8,
        fat: 18,
        instructions: `1. Escolha um peixe fresco inteiro (carapau, corvina ou garoupa de 800g-1kg). Verifique a frescura: os olhos devem ser brilhantes e saltados, as guelras vermelhas e a carne firme ao toque. Peça ao peixeiro para escamar e esviscerar, mas mantenha a cabeça — dá sabor e apresentação.
2. Faça 3-4 cortes diagonais em ambos os lados do peixe, com cerca de 2cm de profundidade. Estes cortes permitem que a marinada penetre na carne e que o peixe cozinhe uniformemente. Lave bem com limão e água fria.
3. Prepare a marinada no almofariz: esmague 6 dentes de alho com 1 colher de chá de sal grosso, piripíri fresco (a gosto) e sumo de 3 limões. Misture com 2 colheres de sopa de azeite. Esfregue esta marinada por todo o peixe, incluindo dentro dos cortes e na barriga. Deixe marinar durante 20-30 minutos.
4. Prepare as brasas: acenda o carvão com antecedência (30-40 minutos antes). As brasas estão prontas quando estiverem cobertas de cinza branca e sem chamas visíveis — o calor deve ser moderado e uniforme. Se puser a mão a 15cm da grelha, deve aguentar 4-5 segundos.
5. Unte a grelha com óleo usando um pano embebido para evitar que o peixe agarre. Coloque o peixe na grelha sobre as brasas moderadas. Grelhe durante 8-10 minutos de cada lado, SEM VIRAR MAIS QUE UMA VEZ. Quando virar, faça-o com cuidado usando duas espátulas para não partir. O peixe está pronto quando a pele estiver dourada e estaladiça e a carne se soltar facilmente da espinha.
6. Enquanto o peixe grelha, prepare o molho de coco: rale meio coco fresco e extraia o leite espremendo com as mãos sobre um pano. Numa panela pequena, refogue meia cebola picada fina em 1 colher de azeite durante 3 minutos. Junte 1 tomate picado e cozinhe 3 minutos.
7. Adicione o leite de coco ao refogado, junte piripíri picado e sumo de meio limão. Cozinhe em lume brando durante 5-8 minutos até o molho engrossar ligeiramente. O molho deve ter uma cor branca-rosada e consistência cremosa. Ajuste o sal.
8. Retire o peixe da grelha e coloque num prato de servir grande. Regue com o molho de coco quente por cima. Decore com rodelas de limão, piripíri inteiro e folhas de coentro fresco. Sirva imediatamente com arroz de coco ou batata-doce assada. Tradicionalmente, come-se o peixe grelhado directamente com as mãos nas barracas de praia de Inhambane.`
    },
    {
        id: 6,
        title: 'Puré de Mandioca',
        description: 'A mandioca é o tubérculo mais consumido em Moçambique, base da alimentação de milhões de famílias. O puré de mandioca é uma forma cremosa e reconfortante de preparar este alimento fundamental, enriquecido com leite de coco que lhe confere uma suavidade e sabor tipicamente moçambicano. É o acompanhamento perfeito para carís e grelhados.',
        region: 'Nacional',
        difficulty: 'facil',
        prep_time_min: 15,
        cook_time_min: 30,
        calories: 200,
        protein: 3,
        carbs: 40,
        fat: 4,
        instructions: `1. Escolha mandioca fresca e firme — quando cortada, o interior deve ser branco puro, sem veios escuros ou manchas azuladas (sinal de deterioração). Descasque com uma faca afiada, retirando tanto a casca exterior castanha como a película rosada interior. Corte em pedaços de 5-6cm de comprimento e retire o fio central fibroso se existir.
2. Lave os pedaços de mandioca em água corrente fria. Coloque numa panela grande com água suficiente para cobrir completamente (mais 3 dedos acima). Adicione 1 colher de chá de sal. Leve ao lume forte e deixe ferver. Quando levantar fervura, reduza para lume médio.
3. Cozinhe durante 25-35 minutos, dependendo da frescura e variedade. A mandioca está pronta quando um garfo penetrar facilmente sem resistência e os pedaços começarem a apresentar pequenas fissuras na superfície. Alguns pedaços podem ficar translúcidos — isso é normal e indica boa cozedura.
4. Escorra toda a água de cozedura. Devolva a mandioca à panela (sem lume) e deixe evaporar o excesso de humidade durante 2-3 minutos — isto resulta num puré mais firme e menos aguado.
5. Enquanto a mandioca está quente, esmague-a vigorosamente com um esmagador de batatas ou com as costas de um garfo grande. A mandioca moçambicana tende a ser mais fibrosa que a batata, por isso é preciso esmagar com força e paciência. Continue até obter uma massa homogénea sem grumos.
6. Aqueça meia chávena de leite de coco (fresco ou de lata) numa panela pequena em lume brando — não deixe ferver. Adicione o leite de coco quente ao puré, pouco a pouco, mexendo vigorosamente com colher de pau. Adicione apenas a quantidade necessária para obter a consistência desejada — cremoso mas não líquido.
7. Se desejar, adicione 1 colher de sopa de manteiga ou margarina e misture bem. Ajuste o sal. Para um toque moçambicano extra, pode-se adicionar uma pitada de noz-moscada ou umas gotas de limão. O puré deve ficar liso, cremoso e com sabor suave de coco.
8. Sirva o puré de mandioca quente, fazendo um poço no centro onde se pode colocar molho de caril ou carne. Decore com um fio de azeite de coco e uma pitada de piripíri em pó. É o acompanhamento ideal para frango à Zambeziana, caril de camarão ou peixe grelhado.`
    },
    {
        id: 7,
        title: 'Salada de Couve Moçambicana',
        description: 'A couve é um dos vegetais mais acessíveis e nutritivos em Moçambique, presente nos mercados de todo o país. Esta salada combina a couve finamente cortada com tomate, cebola, limão e piripíri — o tempero tipicamente moçambicano que transforma qualquer prato simples. É o acompanhamento obrigatório de grelhados e carís em todo o país.',
        region: 'Nacional',
        difficulty: 'facil',
        prep_time_min: 15,
        cook_time_min: 0,
        calories: 60,
        protein: 3,
        carbs: 8,
        fat: 2,
        instructions: `1. Seleccione folhas de couve fresca e de cor verde intensa, evitando folhas amareladas ou murchas. Separe as folhas do talo central, que é duro e fibroso. Lave cada folha individualmente em água corrente para remover terra e possíveis insectos. Para uma lavagem mais completa, deixe as folhas de molho em água com vinagre ou limão durante 5 minutos.
2. Empilhe 5-6 folhas de couve, enrole-as firmemente como um charuto apertado. Com uma faca bem afiada, corte o rolo em tiras muito finas (2-3mm de largura) — esta técnica chama-se chiffonade e é essencial para que a couve fique macia e absorva bem o tempero. Quanto mais fino o corte, melhor a textura da salada.
3. Coloque a couve cortada numa tigela grande. Se as tiras forem longas, corte-as ao meio. Para amaciar a couve crua, adicione uma pitada generosa de sal e massaje as folhas com as mãos durante 2-3 minutos, apertando e esfregando — este processo quebra as fibras e torna a couve mais macia e verde brilhante.
4. Corte 2 tomates maduros e firmes ao meio, retire as sementes e corte em cubos pequenos (1cm). Pique finamente meia cebola roxa (ou branca). Se tiver, pique 1 piripíri fresco (sem sementes, se quiser menos picante). Adicione tudo à tigela com a couve massajada.
5. Prepare o molho: numa tigela pequena, misture o sumo de 2 limões frescos, 2 colheres de sopa de azeite virgem extra, sal a gosto e uma pitada de piripíri em pó. Bata com um garfo até emulsionar ligeiramente. O equilíbrio entre o ácido do limão e a gordura do azeite é o segredo do tempero moçambicano.
6. Regue a salada com o molho e misture delicadamente com as mãos ou com dois garfos, garantindo que todas as tiras de couve ficam envolvidas no tempero. Prove e ajuste o sal, limão ou piripíri conforme o gosto.
7. Deixe a salada repousar durante 5-10 minutos à temperatura ambiente antes de servir — este tempo permite que os sabores se mesclem e a couve amoleça ligeiramente com a acidez do limão. A couve deve manter alguma crocância.
8. Sirva como acompanhamento de qualquer prato moçambicano — frango à Cafreal, peixe grelhado, caril de camarão ou simplesmente com arroz e feijão. Opcionalmente, decore com rodelas finas de limão e folhas de coentro fresco por cima. Esta salada mantém-se bem no frigorífico por até 24 horas.`
    },
    {
        id: 8,
        title: 'Caril de Legumes com Coco',
        description: 'Caril vegetariano preparado ao estilo moçambicano, com legumes da época cozidos lentamente em leite de coco fresco e temperados com piripíri. Este prato reflecte a riqueza agrícola de Moçambique, especialmente da província da Zambézia, e prova que a culinária moçambicana oferece opções vegetarianas igualmente saborosas e nutritivas.',
        region: 'Zambézia',
        difficulty: 'facil',
        prep_time_min: 20,
        cook_time_min: 35,
        calories: 220,
        protein: 6,
        carbs: 30,
        fat: 10,
        instructions: `1. Prepare os legumes: descasque e corte 2 batatas médias em cubos de 3cm; descasque e corte 300g de abóbora em cubos semelhantes; raspe e corte 2 cenouras em rodelas de 1cm; lave e corte 200g de couve em tiras. Separe os legumes em dois grupos — os duros (batata, abóbora, cenoura) e os macios (couve) — pois têm tempos de cozedura diferentes.
2. Pique finamente 1 cebola grande, 3 tomates maduros e 4 dentes de alho. Se tiver piripíri fresco, pique 1-2 unidades finamente, retirando as sementes se preferir menos picante. Esta base aromática — cebola, tomate, alho e piripíri — é o refogado clássico moçambicano.
3. Numa panela grande de fundo grosso, aqueça 3 colheres de sopa de óleo de cozinha em lume médio. Quando o óleo estiver quente, adicione a cebola picada e refogue durante 5-6 minutos, mexendo regularmente com colher de pau, até ficar dourada e aromática. o aroma deve ser doce e rico.
4. Junte o alho picado e o piripíri, fritando durante mais 1 minuto (cuidado para não queimar o alho — fica amargo). Adicione o tomate picado e 1 colher de sopa de caril em pó (ou açafrão-da-terra + cominho). Cozinhe durante 5-8 minutos, esmagando o tomate com as costas da colher, até formar uma pasta espessa e o óleo começar a separar-se nas bordas — este é o sinal de que o refogado está perfeito.
5. Adicione primeiro os legumes mais duros — batata, abóbora e cenoura. Mexa bem para envolver no refogado. Adicione 1 chávena de água quente, tape a panela e cozinhe em lume médio durante 12-15 minutos até os legumes começarem a amolecer, mas ainda firmes.
6. Extraia o leite de coco fresco (ou use 1 lata de 400ml) e adicione à panela. Mexa delicadamente para não partir os legumes. Adicione sal a gosto e deixe cozinhar em lume brando durante mais 10 minutos com a panela semi-tapada.
7. Nos últimos 5 minutos de cozedura, adicione a couve cortada em tiras por cima dos outros legumes (não mexa, deixe cozinhar no vapor). A couve precisa apenas de 5 minutos para ficar tenra mas ainda com cor verde vibrante. Se adicionar antes, fica demasiado mole e perde a cor.
8. Prove e ajuste o tempero — o caril deve ter um equilíbrio entre o doce da abóbora e do coco, o picante do piripíri e o aromático do caril em pó. Sirva em prato fundo com arroz branco ou arroz de coco. Decore com folhas de coentro fresco e uma rodela de limão. Este caril fica ainda mais saboroso no dia seguinte.`
    }
];

async function updateRecipes() {
    console.log('🍳 Actualizando receitas com informações autênticas moçambicanas...\n');

    for (const recipe of recipes) {
        try {
            await db.query(
                `UPDATE recipes SET 
          title = ?,
          description = ?,
          instructions = ?,
          region = ?,
          difficulty = ?,
          prep_time_min = ?,
          cook_time_min = ?,
          calories = ?,
          protein = ?,
          carbs = ?,
          fat = ?
        WHERE id = ?`,
                [
                    recipe.title,
                    recipe.description,
                    recipe.instructions,
                    recipe.region,
                    recipe.difficulty,
                    recipe.prep_time_min,
                    recipe.cook_time_min,
                    recipe.calories,
                    recipe.protein,
                    recipe.carbs,
                    recipe.fat,
                    recipe.id
                ]
            );
            console.log(`  ✅ #${recipe.id} ${recipe.title} — actualizada com sucesso`);
        } catch (err) {
            console.error(`  ❌ #${recipe.id} ${recipe.title} — ERRO:`, err.message);
        }
    }

    console.log('\n🇲🇿 Todas as receitas foram actualizadas com sucesso!');
    process.exit(0);
}

updateRecipes();
