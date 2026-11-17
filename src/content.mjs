// Conteúdo editorial do site EFS Brasil — derivado do "Livro de Referência 2026" e da minuta de 90 artigos.
// Regras: sem dados inventados; metas de rede, grêmios, expansão e plano de execução ficam de fora;
// juventude aparece somente quando prevista nos artigos (6, 9, 60–64 e 81).

export const YOUTH_ARTS = [6, 9, 60, 61, 62, 63, 64, 81];

export const NOTICE_MODEL =
  "O Estatuto da Floresta Sustentável — EFS Brasil é uma minuta de projeto de lei federal. Seu conteúdo não constitui legislação vigente e depende de análise jurídica, avaliação de impacto, iniciativa adequada e deliberação pelos órgãos competentes.";

export const chapters = [
  {
    n: 1, short: "Disposições preliminares", title: "Disposições preliminares",
    kicker: "O ponto de partida: objeto, âmbito, princípios e conceitos.",
    resumo: [
      "O art. 1º define o propósito integrado do Estatuto: prevenir danos ambientais, restaurar ecossistemas, reduzir resíduos, proteger as águas e a biodiversidade, melhorar a fiscalização e fortalecer comunidades que conservam a natureza.",
      "A lei seria federal: aplica-se às ações e aos programas federais nela previstos. Estados, Distrito Federal e Municípios participariam por cooperação, nos limites de suas competências (art. 2º). O art. 3º reúne dez princípios — da prevenção e precaução à legalidade, proporcionalidade, contraditório e ampla defesa — e o art. 4º define os termos que atravessam todo o texto."
    ],
    pontos: [
      ["Art. 2º", "Aplica-se às ações e programas federais; entes locais cooperam por instrumentos jurídicos cabíveis."],
      ["Art. 3º", "Dez princípios, entre eles reparação integral do dano, prioridade da restauração, transparência, justiça socioambiental e transição produtiva justa."],
      ["Art. 4º", "Oito definições: pegada ambiental, restauração ecológica, alerta ambiental, comunidade guardiã, embalagem biodegradável ou compostável, área sensível, grande empreendimento e ambiente regulatório experimental."]
    ],
    limites: [
      ["Art. 4º, III", "Alerta ambiental é apenas informação que indica possível dano e ainda depende de validação."],
      ["Art. 4º, VIII", "Ambiente regulatório experimental não afasta licenças, normas de saúde, proteção ambiental, direitos fundamentais nem responsabilidade por dano."]
    ],
    efeito: "Cria uma linguagem comum e uma régua de princípios para todos os capítulos, reduzindo ambiguidades na aplicação da lei."
  },
  {
    n: 2, short: "Justiça socioambiental e participação", title: "Justiça socioambiental e participação",
    kicker: "Quem está mais exposto ao risco deve ser considerado primeiro — com critérios públicos.",
    resumo: [
      "O capítulo busca impedir que a poluição, os riscos climáticos e os custos da transição ecológica recaiam de forma desproporcional sobre grupos vulnerabilizados (art. 5º). A priorização pode considerar a exposição de povos indígenas, comunidades quilombolas e tradicionais, crianças e adolescentes, pessoas idosas, pessoas com deficiência e outros grupos, sempre por critérios públicos, objetivos e ligados ao risco socioambiental (art. 6º).",
      "O art. 7º lista deveres de prevenção dos órgãos competentes, o art. 8º protege direitos territoriais e culturais e o art. 9º garante canais acessíveis de consulta, denúncia e acompanhamento."
    ],
    pontos: [
      ["Art. 5º", "A política ambiental deve prevenir a distribuição desproporcional de poluição, riscos climáticos e custos da transição."],
      ["Art. 7º", "Identificar riscos (poluição, escassez hídrica, calor extremo, enchentes, incêndios, desmatamento) e priorizar água potável, saneamento, arborização, restauração e prevenção de desastres em áreas mais expostas."],
      ["Art. 9º", "Canais acessíveis de consulta, denúncia e acompanhamento. A participação de escolas, estudantes e cidadãos é voluntária e não substitui a fiscalização estatal.", true]
    ],
    limites: [
      ["Art. 5º", "A proteção não exclui nem reduz os direitos assegurados a qualquer pessoa."],
      ["Art. 6º", "A priorização exige critérios públicos, objetivos e ligados ao risco — não é uma fórmula abstrata para conceder ou retirar direitos."],
      ["Art. 8º", "A consulta é realizada quando exigida pela Constituição, pela legislação ou por tratado aplicável."]
    ],
    efeito: "Busca que as ações ambientais cheguem primeiro a quem está mais exposto a riscos, com transparência sobre os critérios e participação informada."
  },
  {
    n: 3, short: "Governança e cooperação", title: "Governança e cooperação",
    kicker: "Coordenação federal sem criar autarquia e sem subordinar Estados e Municípios.",
    resumo: [
      "O art. 10 institui o Sistema de Cooperação EFS Brasil, integrado às estruturas existentes do SISNAMA e aos sistemas públicos de recursos hídricos, resíduos, saneamento, educação, ciência, saúde, proteção civil e planejamento urbano.",
      "A coordenação federal ficaria com o Ministério do Meio Ambiente e Mudança do Clima, por unidade administrativa existente, que poderá usar a denominação funcional ANFS (art. 11). Em até 180 dias da vigência, os órgãos federais publicariam um protocolo de cooperação com pontos focais, prioridades, prazos, padrões de dados e indicadores (art. 13)."
    ],
    pontos: [
      ["Art. 11", "ANFS é uma denominação funcional: não cria autarquia, pessoa jurídica, cargo ou função pública."],
      ["Art. 12", "MMA e IBAMA integram a coordenação; ICMBio, ANA e outros órgãos participam conforme suas atribuições."],
      ["Art. 13", "Protocolo de cooperação em até 180 dias da vigência, com responsabilidades, segurança, auditoria e indicadores."]
    ],
    limites: [
      ["Art. 12", "Sem subordinação hierárquica de Estados, DF e Municípios e sem transferência automática de poder de polícia, licenciamento ou autorização."],
      ["Livro, cap. 20", "A criação de uma autarquia exigiria outro desenho normativo, análise de iniciativa, estrutura, cargos, orçamento e controles."]
    ],
    efeito: "Busca integrar o que já existe — em vez de duplicar estruturas — para que alertas e responsabilidades não se percam entre órgãos."
  },
  {
    n: 4, short: "Resíduos e infraestrutura urbana", title: "Resíduos e infraestrutura urbana",
    kicker: "Do descarte irregular ao ecoponto: alerta antes da saturação.",
    resumo: [
      "O capítulo proíbe abandonar, lançar ou depositar resíduos em vias, praças, parques, sistemas de drenagem, margens e leitos de corpos hídricos e outros locais não autorizados (art. 14), reafirma os deveres do gerador (art. 15) e prevê ecopontos, pontos de entrega voluntária, estações de coleta seletiva e equipamentos inteligentes com base em diagnóstico territorial, acessibilidade, segurança, capacidade e fonte de custeio (art. 16).",
      "Quando houver sensores, o sistema deve alertar antes da saturação, preferencialmente a 80% da capacidade útil, e o prestador inicia a resposta em até quatro horas se o contrato assim previr e for tecnicamente viável (art. 17)."
    ],
    pontos: [
      ["Art. 16", "Prioridade para áreas com maior geração de resíduos ou maior risco de descarte irregular."],
      ["Art. 17", "Alerta preferencialmente a 80% da capacidade útil; resposta em até 4 h quando prevista em contrato e viável."],
      ["Art. 18", "Instalações devem prevenir vazamentos, contaminação por águas pluviais, vetores e riscos à saúde."]
    ],
    limites: [
      ["Art. 17", "Falha de sensor não gera penalidade automática; o descumprimento precisa ser comprovado e apurado nos termos do contrato e da lei."],
      ["Art. 18", "Multas contratuais ambientais só têm a destinação prevista no contrato e na legislação orçamentária."],
      ["Livro, cap. 8", "Equipamento inteligente apoia o serviço público; não é solução autossuficiente. Recomenda-se piloto comparando áreas com e sem sensores."]
    ],
    efeito: "Busca reduzir transbordamentos e pontos de descarte irregular ao antecipar a coleta e direcionar a infraestrutura para onde há mais risco."
  },
  {
    n: 5, short: "Embalagens e Regra dos 120 Dias", title: "Embalagens, Regra dos 120 Dias e Selo Verde",
    kicker: "Alegação de biodegradabilidade só com prova — método, ambiente e resultado declarados.",
    resumo: [
      "Para as categorias abrangidas por regulamento técnico, só poderá ser comercializada embalagem com alegação de biodegradabilidade ou compostabilidade quando houver certificação do desempenho exigido em até 120 dias, nas condições de ensaio declaradas e segundo método normalizado (art. 19). Desintegração física e biodegradação são medidas separadamente, além de ecotoxicidade, fragmentos persistentes e substâncias perigosas (art. 20).",
      "O certificado identifica ambiente de ensaio, método, resultado e destinação correta, e os laudos ficam consultáveis por QR Code (art. 21). São proibidas alegações ambientais falsas, enganosas ou mais amplas que a evidência (art. 23), e as sacolas plásticas fósseis de uso único seriam eliminadas progressivamente, com transição de até 3, 5 e 7 anos conforme o porte da empresa (arts. 24 e 25)."
    ],
    pontos: [
      ["Art. 19", "Regra dos 120 Dias: certificação do desempenho exigido, nas condições de ensaio declaradas."],
      ["Art. 22", "Ensaios de campo em ambientes brasileiros pertinentes, inclusive Amazônia, Cerrado e Mata Atlântica, quando tecnicamente aplicável."],
      ["Art. 24", "Eliminação progressiva de sacolas plásticas fósseis de uso único: até 3 anos (grandes), 5 (médias) e 7 (micro e pequenas)."],
      ["Art. 25", "Exceções limitadas a necessidades sanitárias, médicas, de segurança alimentar e acondicionamento de resíduos; apoio técnico às empresas menores."]
    ],
    limites: [
      ["Art. 20", "O prazo de 120 dias, isoladamente, não comprova conformidade."],
      ["Art. 22", "O ensaio de campo não substitui o método laboratorial; nenhum certificado pode prometer degradação em ambiente não avaliado."],
      ["Art. 88", "A exigência de desempenho só se aplica após a publicação dos métodos, critérios e regras de rotulagem; a proibição de alegações enganosas vale desde a vigência."],
      ["Livro, cap. 9", "Não é promessa de que toda embalagem desapareça em 120 dias em qualquer lugar. Ponto de redação: o título do capítulo V cita o Selo Verde, mas ele é instituído no art. 29 (capítulo VI)."]
    ],
    efeito: "Busca dar ao consumidor e ao comércio informação verificável sobre embalagens e reduzir o greenwashing, com transição gradual para empresas de diferentes portes."
  },
  {
    n: 6, short: "Segurança química e rotulagem", title: "Segurança química e rotulagem ambiental",
    kicker: "Substâncias de risco, alimentos e o Selo Verde EFS Brasil.",
    resumo: [
      "O capítulo proíbe, em embalagens, substâncias vedadas pela legislação sanitária ou ambiental (art. 26), exige que embalagens em contato com alimentos cumpram os limites legais de migração química (art. 27) e permite que a autoridade competente determine retirada, recolhimento ou outra medida de controle quando houver risco relevante, com decisão que indique o risco e o lote abrangido (art. 28).",
      "O art. 29 institui o Selo Verde EFS Brasil, de implantação progressiva, após consulta pública e avaliação de impacto regulatório. Ele poderá informar o Índice de Impacto Biótico (IIB), desintegração e biodegradação com prazo e ambiente de ensaio, origem e rastreabilidade, composição e QR Code para consulta de laudos (art. 30)."
    ],
    pontos: [
      ["Art. 27", "É proibido afirmar “atoxicidade absoluta” sem critério de comprovação definido."],
      ["Art. 29", "Selo Verde: critérios, auditoria e certificação independente definidos por regulamento técnico."],
      ["Art. 31", "O Selo está sujeito a auditoria, revisão, suspensão ou retirada; fraude e adulteração de laudos são apuradas conforme a lei."]
    ],
    limites: [
      ["Art. 31", "O Selo não substitui licenciamento nem prova, sozinho, que um produto é ambientalmente superior em todos os aspectos."],
      ["Livro, cap. 26", "A metodologia do IIB ainda precisa ser definida e validada; ele não pode ser anunciado como científico antes disso."],
      ["Livro, cap. 10", "O Selo não certifica segurança alimentar nem substitui registro, autorização ou avaliação sanitária obrigatória."]
    ],
    efeito: "Busca reduzir exposição a substâncias de risco e dar um instrumento auditável de informação, sem criar um regime técnico paralelo ao sanitário."
  },
  {
    n: 7, short: "Restauração e urbanismo regenerativo", title: "Restauração ecológica e urbanismo regenerativo",
    kicker: "Evitar, minimizar, restaurar e só então compensar — com 105% de referência.",
    resumo: [
      "O art. 32 adota a hierarquia de mitigação: evitar o impacto, minimizar o dano inevitável, restaurar o local e compensar impactos residuais apenas quando a lei permitir. Grandes empreendimentos de construção civil sujeitos a licenciamento apresentariam um Plano de Restauração Nativa quando exigido pela avaliação ambiental ou pela regulamentação; o enquadramento inicial poderá considerar área construída acima de 5.000 m² ou condomínio com mais de 50 unidades (art. 33).",
      "Como referência de planejamento, o plano buscaria restaurar ao menos 105% da área total do terreno (art. 34), com pelo menos 40 espécies nativas em projetos de grande escala (art. 35) e 20 anos de manutenção como referência de responsabilidade (art. 36). Os arts. 39 e 40 tratam da iluminação: temperatura de cor de até 2.700 K em áreas sensíveis e redução a até 10% da intensidade quando não houver circulação."
    ],
    pontos: [
      ["Art. 34", "Referência: restaurar área equivalente a pelo menos 105% do terreno, priorizando a mesma bacia hidrográfica e corredores de biodiversidade."],
      ["Art. 37", "Áreas restauradas podem ser protegidas por servidão ambiental ou restrição administrativa; monitoramento por sensoriamento remoto, vistorias e indicadores."],
      ["Art. 38", "Assistência técnica e financiamento para incorporar infraestrutura verde em habitação de interesse social."],
      ["Arts. 39–40", "Iluminação com menos poluição luminosa para a fauna noturna, mantidas segurança viária, acessibilidade e emergências."]
    ],
    limites: [
      ["Art. 32", "A compensação não autoriza degradação evitável nem afasta o dever de reparar o dano."],
      ["Art. 37", "Demolição ou restrição grave não é automática: exige base legal, decisão motivada e procedimento."],
      ["Livro, cap. 26", "Os limites de 5.000 m² e 50 unidades são gatilhos de triagem, não substitutos da avaliação ambiental; 105%, 2.700 K e 10% precisam de validação técnica."]
    ],
    efeito: "Busca que novos empreendimentos deixem mais área restaurada do que ocupam, com diversidade de espécies, manutenção de longo prazo e menos impacto sobre a fauna noturna."
  },
  {
    n: 8, short: "Proteção das águas", title: "Proteção das águas",
    kicker: "Rios, nascentes e aquíferos: prevenir, monitorar, responder.",
    resumo: [
      "Rios, córregos, lagos, nascentes, aquíferos e demais ecossistemas aquáticos receberiam proteção preventiva, monitoramento e restauração, considerando saúde humana, vida aquática, qualidade da água e usos legalmente estabelecidos (art. 41). É proibido lançar efluentes em desacordo com padrões legais de emissão, qualidade, outorga ou licenciamento, com tratamento definido conforme carga poluidora, corpo receptor e risco sanitário (art. 42).",
      "Quem causar derramamento ou incidente de poluição deve conter a fonte, comunicar imediatamente as autoridades, adotar medidas de emergência e recuperar o dano (art. 43). Em risco grave e atual, os órgãos encaminham relatório fundamentado em até 12 horas aos órgãos de controle e ao Ministério Público (art. 45)."
    ],
    pontos: [
      ["Art. 42", "Tratamento terciário ou avançado exigido quando a legislação ou avaliação técnica motivada determinar."],
      ["Art. 44", "Restauração aquática: remoção de contaminantes, recuperação de margens e repovoamento com espécies nativas; proibida a introdução de exóticas que aumente o risco."],
      ["Art. 45", "Relatório fundamentado em até 12 horas após confirmados elementos mínimos de risco grave e atual."]
    ],
    limites: [
      ["Art. 42", "Não impõe tratamento terciário universal."],
      ["Art. 45", "O prazo não limita nem predetermina decisão de qualquer autoridade ou órgão judicial; a minuta não cria o Juizado Especial das Águas."],
      ["Livro, cap. 12", "É preciso definir “elementos mínimos”, destinatários e regime de plantão, e respeitar a gestão por bacias da Política Nacional de Recursos Hídricos."]
    ],
    efeito: "Busca resposta mais rápida e organizada a incidentes de poluição hídrica e mais clareza sobre quem comunica, a quem e em quanto tempo."
  },
  {
    n: 9, short: "Dados, plataforma e IA", title: "Dados, plataforma e inteligência artificial",
    kicker: "Tecnologia para triar alertas — nunca para punir sozinha.",
    resumo: [
      "A Plataforma Digital EFS Brasil seria desenvolvida ou integrada, conforme viabilidade técnica e orçamentária, para reunir canal acessível de denúncia, dados públicos de satélite, sensores, água, resíduos e restauração, consulta a certificados e laudos, painéis de metas e gastos, orientação de conformidade e registros auditáveis de evidências (art. 46).",
      "Satélites, imagens aéreas, drones operados legalmente, sensores e inteligência artificial poderão apoiar a triagem de alertas (art. 48). O art. 49 é a salvaguarda central: resultado automatizado é indício preliminar, e nenhuma sanção definitiva, bloqueio patrimonial ou restrição de direito pode decorrer exclusivamente de sistema automatizado."
    ],
    pontos: [
      ["Art. 47", "Observância das leis de acesso à informação e de proteção de dados; acesso restrito a dados que identifiquem denunciantes."],
      ["Art. 49", "Decisão cabe à autoridade competente, após validação humana, análise de provas e motivação."],
      ["Art. 50", "Documentação de finalidade, limitações e taxa de erro; direito de contestar erro material; auditoria de falsos positivos e vieses territoriais."]
    ],
    limites: [
      ["Art. 46", "A plataforma depende de viabilidade técnica e orçamentária; deve integrar sistemas existentes em vez de duplicá-los."],
      ["Livro, cap. 13", "Mapa ou algoritmo pode confundir mudança sazonal, manejo autorizado, nuvem ou erro de georreferenciamento com irregularidade — por isso é triagem, não culpabilização."]
    ],
    efeito: "Busca mais capacidade de monitoramento e transparência, com garantias contra erro, viés e punição automática."
  },
  {
    n: 10, short: "Instrumentos econômicos e financiamento", title: "Instrumentos econômicos e financiamento",
    kicker: "Pegada ambiental, Pedágio Ambiental (fórmula), incentivos e dois fundos — todos condicionados à lei.",
    resumo: [
      "A pegada ambiental de grandes indústrias e empreendimentos de elevado impacto seria medida de forma progressiva, setorialmente adequada, comparável e auditável (art. 51). O art. 52 apresenta como referência técnica a fórmula PA = (C × α) + (H × β) + (R × γ), em que C são emissões em tCO₂e, H o consumo de água em m³, R os resíduos não reciclados em kg e α, β e γ coeficientes a definir em lei.",
      "O art. 53 é expresso: a fórmula não autoriza cobrança. A minuta também prevê estudar incentivo temporário para embalagens de desempenho superior (art. 54), e institui o Fundo de Transição Tecnológica e o Fundo de Amparo ao Guardião como instrumentos financeiros de execução orçamentária, sem personalidade jurídica própria (arts. 55 a 58)."
    ],
    pontos: [
      ["Art. 55", "Fundo de Transição Tecnológica: pesquisa, inovação industrial limpa, substituição de substâncias perigosas, ecodesign, tratamento de resíduos e rastreabilidade."],
      ["Art. 57", "Fundo de Amparo ao Guardião: assistência técnica, capacitação e infraestrutura produtiva sustentável de povos e comunidades tradicionais, agricultores familiares e cooperativas."],
      ["Art. 59", "Seleção de projetos por mérito ambiental, adicionalidade, equidade territorial, custo-efetividade e prevenção de conflitos de interesse."]
    ],
    limites: [
      ["Art. 53", "Tributo, taxa ou encargo compulsório depende de lei específica com natureza, incidência, base de cálculo, destinação e garantias de defesa."],
      ["Art. 54", "Alíquota zero ou crédito fiscal dependem de lei tributária específica, validação técnica e estimativa de impacto."],
      ["Arts. 56 e 58", "Percentuais de destinação de multas e do Pedágio são propostas condicionadas à autorização legal e orçamentária — nunca automáticas."]
    ],
    efeito: "Busca direcionar recursos para inovação limpa e para quem conserva, com regras de seleção públicas — sem criar cobrança nem renúncia sem lei própria."
  },
  {
    n: 11, short: "Guardiões da Floresta e comunidades", title: "Guardiões da Floresta e comunidades",
    kicker: "Educação ambiental prática, ciência cidadã e apoio a quem conserva.",
    resumo: [
      "O Programa Guardiões da Floresta Sustentável (PGFS) promoveria educação ambiental prática, ciência cidadã, cultura de regeneração e participação juvenil, com materiais didáticos, sementes nativas adequadas, formação, oficinas e apoio a viveiros escolares (art. 60). As redes de ensino elaborariam, em até dois anos, plano de integração progressiva do Monitoramento Ativo do Bioma Local aos currículos, respeitada a autonomia dos sistemas de ensino (art. 62).",
      "A adesão das escolas é formalizada pela rede ou unidade escolar; quem não aderir não é excluído dos conteúdos curriculares, e atividades de campo e coleta de dados por menores exigem supervisão, autorizações e proteção de dados (art. 63). Os arts. 64 a 67 tratam do apoio às comunidades guardiãs, da proteção de conhecimentos tradicionais, da orientação a empresas e da extensão de prazo de adaptação de até 24 meses."
    ],
    pontos: [
      ["Art. 60", "PGFS: educação ambiental prática, ciência cidadã e participação juvenil.", true],
      ["Art. 63", "Adesão formal da escola; não adesão não exclui estudantes dos conteúdos curriculares; supervisão, autorizações e proteção de dados para menores.", true],
      ["Art. 64", "Apoio a comunidades guardiãs, considerando resultados ambientais, distribuição de benefícios, segurança alimentar e inclusão de mulheres e jovens.", true],
      ["Art. 65", "Respeito a direitos territoriais e culturais; benefício econômico não autoriza acesso indevido a conhecimentos tradicionais."],
      ["Art. 67", "Extensão de prazo de adaptação de até 24 meses, por decisão motivada, com plano de conformidade."]
    ],
    limites: [
      ["Art. 61", "O texto traz referências de planejamento para o PGFS condicionadas a orçamento, capacidade técnica, segurança e avaliação de resultados; veja a redação integral."],
      ["Art. 62", "A integração aos currículos respeita diretrizes nacionais, autonomia dos sistemas de ensino e segurança escolar."],
      ["Art. 67", "A extensão de prazo não afasta medidas urgentes, reparação do dano nem obrigações essenciais de segurança."]
    ],
    efeito: "Busca formar cultura de regeneração nas escolas, de forma voluntária e segura, e apoiar com assistência técnica as comunidades que já conservam ecossistemas."
  },
  {
    n: 12, short: "Protocolo contra desmatamento e fogo ilícito", title: "Protocolo contra desmatamento ilegal e uso ilícito do fogo",
    kicker: "Integrar alertas, triar em até 24 horas e agir com base legal.",
    resumo: [
      "O Protocolo de Tolerância Zero prioriza a Amazônia e atua em todos os biomas, distinguindo infrações de manejo integrado do fogo e de queimadas legalmente autorizadas (art. 68). Ele integra sensoriamento remoto, focos de calor, alertas comunitários, dados de autorização e licenciamento e fiscalização de campo; alertas de alto risco são triados com prioridade e meta operacional de até 24 horas (art. 69).",
      "Diante de indícios concretos e risco de agravamento, a autoridade competente pode aplicar embargo cautelar, suspensão, apreensão ou outra medida expressamente prevista em lei, com delimitação da área, fundamentação e contraditório posterior (art. 71). A retomada de atividade depende da cessação do risco, da regularização e da recuperação exigida (art. 72)."
    ],
    pontos: [
      ["Art. 70", "Planos de contingência para períodos críticos, com canais de comunicação, logística e critérios de prioridade."],
      ["Art. 73", "Restrições a crédito rural, benefícios públicos ou contratação exigem fundamento legal, critérios objetivos e procedimento; identidade de denunciantes com acesso restrito."],
      ["Art. 74", "Omissão injustificada diante de alerta confiável é comunicada à autoridade competente para apuração individualizada."]
    ],
    limites: [
      ["Art. 69", "Meta operacional de 24 horas não é promessa de que todo alerta seja confirmado e resolvido em um dia; impossibilidades são registradas e justificadas."],
      ["Art. 73", "Bloqueio de contas e indisponibilidade de ativos dependem de decisão judicial, salvo medida administrativa expressamente autorizada por lei."],
      ["Art. 74", "Não há presunção automática de improbidade ou crime."]
    ],
    efeito: "Busca resposta mais rápida e coordenada a desmatamento e fogo ilícitos, sem confundir práticas autorizadas com infração."
  },
  {
    n: 13, short: "Infrações, sanções e garantias", title: "Infrações, sanções e garantias",
    kicker: "Oito infrações administrativas, dosimetria explicada e devido processo.",
    resumo: [
      "No âmbito da competência administrativa federal, o art. 75 lista oito infrações: descartar resíduos em local proibido, distribuir sacolas vedadas após o prazo, fazer alegação ambiental falsa ou usar certificado adulterado, descumprir requisito de segurança ou rastreabilidade de embalagem, descumprir plano de restauração exigível, lançar efluente em desacordo com padrão ou omitir comunicação de incidente, adulterar evidência ou obstruir fiscalização e descumprir obrigação expressa da lei após o prazo de adaptação.",
      "As sanções incluem advertência, multa de R$ 5 mil a R$ 50 milhões, multa diária de até R$ 1 milhão para infração continuada, apreensão e suspensão ou embargo, com decisão que explique o cálculo e respeite a proporcionalidade (art. 76). O art. 77 admite agravamento em até dez vezes em hipóteses específicas, com teto final de R$ 50 milhões."
    ],
    pontos: [
      ["Art. 76", "Dosimetria considera gravidade, extensão do dano, risco, vantagem obtida, reincidência, capacidade econômica, cooperação e reparação voluntária; vedada dupla punição pelo mesmo fato."],
      ["Art. 78", "Auto de infração com conduta, provas e enquadramento; acesso às provas, defesa, decisão motivada, recurso e correção de erro material."],
      ["Art. 79", "Reparação civil não é substituída por multa; conversão de multa em serviço ambiental exige previsão legal e equivalência ambiental."]
    ],
    limites: [
      ["Art. 80", "Não cria crime por expressão genérica, não autoriza bloqueio patrimonial automático e não presume improbidade ou crime."],
      ["Art. 77", "O agravamento só se aplica a resíduos perigosos em área especialmente protegida ou dano hídrico excepcional, com nexo demonstrado."],
      ["Livro, cap. 17", "Valores e dosimetria precisam ser harmonizados com a Lei nº 9.605/1998 e o Decreto nº 6.514/2008 para evitar dupla tipificação."]
    ],
    efeito: "Busca sanções proporcionais e previsíveis, com garantias de defesa — para que a fiscalização seja efetiva sem ser arbitrária."
  },
  {
    n: 14, short: "Transparência, avaliação e controle", title: "Transparência, avaliação e controle",
    kicker: "Relatórios trimestrais, dados abertos e revisão sem retrocesso.",
    resumo: [
      "A coordenação federal publicaria relatórios trimestrais sobre alertas, tempo de resposta, inspeções, sanções definitivas, cobertura vegetal, áreas restauradas, qualidade das águas, resíduos, embalagens, participação escolar e execução financeira (art. 81).",
      "Dados agregados seriam disponibilizados em formatos abertos e interoperáveis, com metodologia, data de atualização e histórico (art. 82). A execução seria avaliada por indicadores públicos e auditorias, e projeções sem fonte verificável não seriam apresentadas como resultados confirmados (art. 83)."
    ],
    pontos: [
      ["Art. 81", "Relatórios trimestrais com alertas, tempos de resposta, inspeções, cobertura vegetal, qualidade das águas, resíduos e execução financeira."],
      ["Art. 82", "Dados abertos e interoperáveis sempre que viável e seguro, protegendo dados pessoais e a localização de denunciantes."],
      ["Art. 83", "Auditoria avalia custos, resultados ambientais, distribuição territorial, impactos sociais e falsos positivos."]
    ],
    limites: [
      ["Art. 84", "Alterações de metas não podem reduzir proteção legal já assegurada nem dispensar obrigações vigentes sem fundamento jurídico."],
      ["Livro, cap. 25", "Resultados de um piloto ou região não podem ser extrapolados automaticamente para o Brasil; estimativas exigem período, método e incerteza."]
    ],
    efeito: "Busca permitir que qualquer pessoa acompanhe o que foi feito, com que método e a que custo."
  },
  {
    n: 15, short: "Regulamentação, transição e vigência", title: "Regulamentação, transição e disposições finais",
    kicker: "Como a lei se torna realidade: regulamento, orçamento, prazos e vigência.",
    resumo: [
      "O Poder Executivo regulamentaria a lei, publicando notas técnicas sobre métodos de ensaio, certificação, indicadores, sistemas digitais e procedimentos, com consulta pública e análise de alternativas em temas de impacto relevante (art. 85). Medidas que criem despesa obrigatória, renúncia de receita, nova estrutura ou obrigação relevante dependem de estimativa de impacto, fonte de custeio e compatibilidade com PPA, LDO, LOA e a legislação fiscal (art. 86).",
      "A transição ocorreria por etapas, com referências máximas de três anos para grandes empresas, cinco para médias e sete para micro e pequenas (art. 87). A lei seria aplicada em harmonia com a Constituição e as demais leis ambientais, mantidas as normas mais protetivas (art. 89) e entraria em vigor 180 dias após a publicação (art. 90)."
    ],
    pontos: [
      ["Art. 85", "Regulamentação com notas técnicas e consulta pública."],
      ["Art. 86", "Estimativa de impacto orçamentário e identificação da fonte de custeio antes de criar despesa ou renúncia."],
      ["Art. 89", "Harmonização com a legislação ambiental, de resíduos, saneamento, águas, licenciamento, educação, saúde, consumidor, dados e responsabilidade fiscal."]
    ],
    limites: [
      ["Art. 86", "A criação de cargo, órgão ou autarquia exige instrumento e iniciativa constitucionalmente adequados."],
      ["Livro, cap. 18", "Os 180 dias do art. 13 e os 180 dias do art. 90 podem somar até 360 dias entre publicação e protocolo; o regulamento deve explicitar o marco inicial."]
    ],
    efeito: "Busca garantir que a lei seja executável: com regras técnicas claras, orçamento compatível e prazos de adaptação realistas."
  }
];

export const instruments = [
  { id: "regra-120-dias", nome: "Regra dos 120 Dias", arts: [19, 20, 21, 22, 88], chap: 5,
    oque: "Embalagem com alegação de biodegradabilidade ou compostabilidade só é comercializada com certificação do desempenho exigido em até 120 dias, nas condições de ensaio declaradas e por método normalizado.",
    prevê: ["Desintegração física e biodegradação medidas separadamente (art. 20).", "Certificado com ambiente, método, resultado e destinação correta; laudos por QR Code (art. 21).", "Ensaios de campo em ambientes brasileiros pertinentes, quando aplicáveis (art. 22)."],
    naoE: ["Não é promessa de que toda embalagem se degrada em 120 dias em qualquer lugar.", "O prazo isolado não comprova conformidade (art. 20).", "A exigência só vale depois da publicação de métodos e critérios (art. 88)."] },
  { id: "selo-verde", nome: "Selo Verde EFS Brasil e IIB", arts: [29, 30, 31], chap: 6,
    oque: "Selo de implantação progressiva, com critérios, auditoria e certificação independente definidos por regulamento técnico, após consulta pública e avaliação de impacto regulatório.",
    prevê: ["Pode informar Índice de Impacto Biótico, desintegração e biodegradação, origem e composição (art. 30).", "QR Code para consultar laudos e certificados.", "Auditoria, revisão, suspensão ou retirada (art. 31)."],
    naoE: ["Não substitui licenciamento nem prova superioridade ambiental em todos os aspectos.", "O IIB ainda não tem metodologia definida e validada.", "Não certifica segurança alimentar."] },
  { id: "restauracao-105", nome: "Plano de Restauração Nativa e regra dos 105%", arts: [32, 33, 34, 35, 36, 37], chap: 7,
    oque: "Grandes empreendimentos de construção civil sujeitos a licenciamento apresentariam plano para restaurar, como referência, ao menos 105% da área do terreno, com diversidade de espécies nativas e manutenção por 20 anos.",
    prevê: ["Hierarquia: evitar, minimizar, restaurar, compensar (art. 32).", "Referência de 40 espécies nativas em projetos de grande escala (art. 35).", "Proteção por servidão ambiental ou restrição administrativa (art. 37)."],
    naoE: ["Compensação não autoriza degradação evitável.", "Gatilhos de 5.000 m² ou 50 unidades são referência de triagem.", "Demolição ou restrição grave nunca é automática."] },
  { id: "ecopontos", nome: "Ecopontos e estações inteligentes", arts: [14, 15, 16, 17, 18], chap: 4,
    oque: "Rede de ecopontos, pontos de entrega voluntária e estações de coleta seletiva, com alerta de capacidade quando houver sensores.",
    prevê: ["Prioridade a áreas com mais resíduos ou maior risco de descarte irregular (art. 16).", "Alerta preferencialmente a 80% da capacidade útil (art. 17).", "Resposta em até 4 h quando prevista em contrato e viável."],
    naoE: ["Falha de sensor não gera penalidade automática.", "Não transfere toda a obrigação ao município ou ao cidadão.", "Instalar sem garantir coleta e destinação apenas desloca o problema."] },
  { id: "pedagio-ambiental", nome: "Pedágio Ambiental (fórmula de referência)", arts: [51, 52, 53], chap: 10,
    oque: "Fórmula técnica PA = (C × α) + (H × β) + (R × γ) para medir a pegada ambiental de grandes indústrias e empreendimentos de elevado impacto: carbono, água e resíduos não reciclados.",
    prevê: ["Mensuração progressiva, comparável e auditável (art. 51).", "Coeficientes α, β e γ a definir em instrumento legal adequado (art. 52)."],
    naoE: ["A fórmula NÃO autoriza cobrança (art. 53).", "Qualquer encargo exige lei específica com natureza, incidência, base e defesa.", "Não pode ser contado como receita antes de lei e arrecadação."] },
  { id: "fundos", nome: "Fundo de Transição Tecnológica e Fundo de Amparo ao Guardião", arts: [55, 56, 57, 58, 59], chap: 10,
    oque: "Dois instrumentos financeiros de execução orçamentária, sem personalidade jurídica própria: um para inovação limpa e substituição de substâncias perigosas; outro para assistência técnica e infraestrutura de comunidades que conservam.",
    prevê: ["Fontes possíveis: dotações, doações, cooperação e receitas legalmente instituídas.", "Critérios públicos de mérito ambiental, adicionalidade e equidade territorial (art. 59)."],
    naoE: ["Percentuais de multas e do Pedágio são propostas, nunca automáticos.", "Dependem de autorização legal, orçamento e de não contrariar vinculações.", "Não são entes com CNPJ próprio."] },
  { id: "protocolo-tolerancia-zero", nome: "Protocolo de Tolerância Zero", arts: [68, 69, 70, 71, 72, 73, 74], chap: 12,
    oque: "Monitoramento integrado contra desmatamento ilegal, supressão irregular de vegetação e uso ilícito do fogo, com prioridade para a Amazônia e atuação em todos os biomas.",
    prevê: ["Triagem de alertas de alto risco com meta operacional de até 24 h (art. 69).", "Medidas cautelares com delimitação, fundamentação e contraditório posterior (art. 71).", "Planos de contingência para períodos críticos (art. 70)."],
    naoE: ["Não trata manejo integrado do fogo e queimadas autorizadas como infração.", "Meta de 24 h não é garantia de resolução em um dia.", "Sem presunção automática de improbidade ou crime."] },
  { id: "plataforma-digital", nome: "Plataforma Digital e validação humana", arts: [46, 47, 48, 49, 50], chap: 9,
    oque: "Plataforma para denúncia acessível, dados públicos de satélite e sensores, consulta a laudos, painéis e registros auditáveis de evidências.",
    prevê: ["Uso de satélites, drones legais, sensores e IA para triagem (art. 48).", "Validação humana obrigatória antes de qualquer sanção (art. 49).", "Documentação de limitações e taxa de erro; direito de contestar (art. 50)."],
    naoE: ["Resultado automatizado é indício preliminar, não prova.", "Nenhuma sanção, bloqueio ou restrição por sistema automatizado isolado.", "Dados de denunciantes têm acesso restrito."] },
  { id: "pgfs", nome: "Programa Guardiões da Floresta Sustentável (PGFS)", arts: [60, 61, 62, 63, 64], chap: 11, youth: true,
    oque: "Educação ambiental prática, ciência cidadã e participação juvenil, com materiais, sementes nativas adequadas, formação e apoio a viveiros escolares.",
    prevê: ["Plano das redes de ensino para integrar o Monitoramento Ativo do Bioma Local aos currículos em até dois anos (art. 62).", "Adesão formal da escola; supervisão, autorizações e proteção de dados de menores (art. 63).", "Apoio a comunidades guardiãs, com inclusão de mulheres e jovens (art. 64)."],
    naoE: ["A não adesão não exclui estudantes dos conteúdos curriculares.", "Respeita a autonomia dos sistemas de ensino e a segurança escolar.", "Participação de escolas e estudantes não substitui a fiscalização estatal (art. 9º)."] },
  { id: "iluminacao", nome: "Iluminação amiga da fauna noturna", arts: [39, 40], chap: 7,
    oque: "Iluminação externa nova ou substituída em áreas naturais, parques e unidades de conservação reduz a poluição luminosa, com temperatura de cor de até 2.700 K em áreas sensíveis.",
    prevê: ["Intensidade reduzida a até 10% do nível normal quando não houver circulação (art. 40).", "Impossibilidade técnica documentada e compensada por medida equivalente."],
    naoE: ["Não pode comprometer segurança viária, acessibilidade ou resposta a emergências.", "Parâmetros dependem de validação com estudos de fauna e engenharia."] },
  { id: "sistema-cooperacao", nome: "Sistema de Cooperação e ANFS", arts: [10, 11, 12, 13], chap: 3,
    oque: "Coordenação federal pelo MMA, integrada ao SISNAMA, com protocolo de cooperação publicado em até 180 dias da vigência.",
    prevê: ["Cooperação com Estados, DF e Municípios por convênios, acordos, consórcios e comissões previstas em lei (art. 13)."],
    naoE: ["ANFS não cria autarquia, pessoa jurídica, cargo ou função (art. 11).", "Sem subordinação hierárquica nem transferência automática de poder de polícia (art. 12)."] },
  { id: "tutela-urgente", nome: "Relatório de 12 horas em risco hídrico grave", arts: [45], chap: 8,
    oque: "Em risco grave e atual a águas, os órgãos encaminham relatório fundamentado aos órgãos de controle, ao Ministério Público e à representação judicial competente, quando cabível.",
    prevê: ["Prazo de até 12 horas após confirmar elementos mínimos de risco."],
    naoE: ["Não cria juizado especializado.", "Não obriga nem predetermina decisão de nenhuma autoridade ou órgão judicial."] }
];

export const effects = [
  { area: "Florestas e biomas", tag: "Prevenção e resposta", mec: "Protocolo de Tolerância Zero com monitoramento integrado (satélite, focos de calor, alertas comunitários, licenciamento) e triagem de alertas de alto risco em até 24 h.", ef: "Menos tempo entre o alerta e a resposta; mais coordenação entre órgãos; distinção clara entre infração e manejo autorizado do fogo.", cond: "Depende de capacidade operacional, validação do alerta e competências legais (arts. 68–74).", ind: "Tempo entre alerta e resposta; alertas validados; cobertura vegetal.", arts: "68–74", img: "canopy" },
  { area: "Águas", tag: "Proteção e incidentes", mec: "Proteção preventiva, controle de efluentes, dever de contenção e comunicação imediata de incidentes e relatório em até 12 h em risco grave.", ef: "Respostas mais rápidas a derramamentos e descargas irregulares; responsabilização de quem causa o dano.", cond: "Exige definir “elementos mínimos” de risco grave e respeitar a gestão por bacias (arts. 41–45).", ind: "Qualidade da água; incidentes com resposta verificada.", arts: "41–45" },
  { area: "Cidades e resíduos", tag: "Infraestrutura urbana", mec: "Proibição de descarte irregular, ecopontos e estações de coleta seletiva, alerta a 80% da capacidade e resposta operacional em até 4 h quando contratada.", ef: "Menos transbordamento e menos pontos críticos de descarte; coleta planejada por dados.", cond: "Depende de diagnóstico territorial, fonte de custeio e destinação final adequada (arts. 14–18).", ind: "Taxa de transbordamento; tempo entre alerta e coleta; custo por tonelada.", arts: "14–18" },
  { area: "Embalagens e consumo", tag: "Informação verificável", mec: "Regra dos 120 Dias, proibição de alegações ambientais falsas ou enganosas, laudos por QR Code, Selo Verde e eliminação progressiva de sacolas fósseis de uso único.", ef: "Consumidor e comércio com informação conferível; menos greenwashing; transição gradual por porte da empresa.", cond: "Métodos de ensaio e critérios técnicos precisam ser publicados antes (art. 88).", ind: "Certificados válidos e laudos auditados; produtos com alegações corrigidas.", arts: "19–31", img: "water-none" },
  { area: "Restauração e urbanismo", tag: "Regeneração", mec: "Plano de Restauração Nativa com referência de 105% da área do terreno, 40 espécies nativas, 20 anos de manutenção e iluminação amiga da fauna.", ef: "Novos grandes empreendimentos deixando mais área restaurada do que ocupam; mais diversidade e menos poluição luminosa.", cond: "Os parâmetros precisam de validação técnica e regionalização por bioma (arts. 32–40).", ind: "Hectares em recuperação; sobrevivência por espécie; conectividade.", arts: "32–40" },
  { area: "Comunidades e justiça socioambiental", tag: "Equidade", mec: "Priorização por critérios públicos de exposição ao risco, proteção de direitos territoriais e culturais, Fundo de Amparo ao Guardião e pagamento por serviços ambientais.", ef: "Apoio técnico e infraestrutura a quem conserva ecossistemas, sem exigir renúncia a direitos.", cond: "Fundos dependem de fonte legal e execução orçamentária (arts. 5–9, 57–58, 64–65).", ind: "Participação de comunidades; distribuição de benefícios por território.", arts: "5–9; 57–65" },
  { area: "Educação e participação", tag: "Juventude prevista nos artigos", mec: "Programa Guardiões da Floresta Sustentável, com educação ambiental prática e ciência cidadã, adesão voluntária das escolas e proteção de dados de menores.", ef: "Mais contato dos estudantes com o bioma local, com supervisão e sem excluir quem não aderir.", cond: "Respeita a autonomia dos sistemas de ensino e a segurança escolar (arts. 9, 60–63).", ind: "Escolas participantes com autorização; qualidade dos dados produzidos.", arts: "9; 60–64", youth: true },
  { area: "Transparência e segurança jurídica", tag: "Controle", mec: "Relatórios trimestrais, dados abertos, validação humana obrigatória, direito de contestar, dosimetria explicada e vedação de dupla punição.", ef: "Fiscalização com prova, defesa e motivação; sociedade acompanhando resultados e gastos.", cond: "Exige harmonização com a Lei nº 9.605/1998 e o Decreto nº 6.514/2008 (arts. 49–50, 75–84).", ind: "Dados atualizados; falsos positivos; decisões revertidas.", arts: "46–50; 75–84" },
  { area: "Economia e inovação", tag: "Transição produtiva", mec: "Fundo de Transição Tecnológica, ecodesign, orientação a micro e pequenas empresas e prazos de adaptação de 3, 5 e 7 anos com extensão possível de até 24 meses.", ef: "Transição com tempo e apoio técnico, em vez de ruptura; incentivo à inovação limpa.", cond: "Incentivos fiscais e destinação de receitas exigem lei específica e estimativa de impacto (arts. 54–56, 66–67, 86–87).", ind: "Projetos apoiados; execução financeira publicada no prazo.", arts: "54–56; 66–67; 86–87" }
];

export const params = [
  { v: 90, u: "", l: "artigos distribuídos em 15 capítulos", a: "Texto integral" },
  { v: 15, u: "", l: "capítulos, da disposição preliminar à vigência", a: "Estrutura" },
  { v: 120, u: "dias", l: "Regra dos 120 Dias: desempenho certificado nas condições declaradas", a: "Art. 19" },
  { v: 105, u: "%", l: "referência de área a restaurar sobre a área do terreno", a: "Art. 34" },
  { v: 40, u: "espécies", l: "nativas como referência em projetos de grande escala", a: "Art. 35" },
  { v: 20, u: "anos", l: "de manutenção da restauração como referência", a: "Art. 36" },
  { v: 80, u: "%", l: "da capacidade útil: alerta antes da saturação", a: "Art. 17" },
  { v: 24, u: "h", l: "meta operacional de triagem de alertas de alto risco", a: "Art. 69" },
  { v: 12, u: "h", l: "para relatório fundamentado em risco hídrico grave e atual", a: "Art. 45" },
  { v: 180, u: "dias", l: "de vacatio legis e para o protocolo de cooperação", a: "Arts. 90 e 13" }
];

export const guards = [
  ["Não cria autarquia", "A denominação ANFS é funcional: não cria pessoa jurídica, cargo ou função (art. 11)."],
  ["A fórmula não cobra", "O Pedágio Ambiental é referência técnica; cobrança exige lei específica (art. 53)."],
  ["IA só triagem", "Nenhuma sanção, bloqueio ou restrição de direito por sistema automatizado isolado (art. 49)."],
  ["Defesa garantida", "Auto de infração, acesso às provas, recurso e correção de erro material (art. 78)."],
  ["Sem crime genérico", "A minuta não cria crime por expressão genérica nem bloqueio patrimonial automático (art. 80)."],
  ["Estados e Municípios", "Cooperação sem subordinação hierárquica e sem transferir poder de polícia (art. 12)."],
  ["Fundos condicionados", "Destinação de multas e receitas só se a lei e o orçamento permitirem (arts. 56 e 58)."],
  ["Direitos preservados", "Nenhuma medida autoriza deslocamento arbitrário ou apropriação de conhecimentos tradicionais (art. 8º)."]
];

export const pendencias = [
  ["Iniciativa e competência", "Revisar cada dispositivo quanto a matéria reservada ao Executivo, criação de atribuições e limites federativos."],
  ["Orçamento e impacto", "Memória de cálculo por programa e exercício; compatibilidade com PPA, LDO e LOA; art. 113 do ADCT e Lei de Responsabilidade Fiscal."],
  ["Natureza do Pedágio Ambiental", "Definir se será tributo, taxa, cobrança por uso ou outro mecanismo; definir unidades e coeficientes."],
  ["Regra dos 120 Dias", "Definir categorias, ambientes e métodos de ensaio, percentuais mínimos, ecotoxicidade, fragmentos persistentes e destinação real."],
  ["Selo Verde e IIB", "Criar metodologia, auditoria, independência, acreditação de laboratórios e regras de suspensão e recurso."],
  ["Regra dos 105%", "Justificar a base de cálculo, a equivalência ecológica, a permanência e a conectividade."],
  ["Critérios de grande empreendimento", "Confirmar os limites de 5.000 m² e 50 unidades como gatilhos de triagem, sem substituir avaliações legais."],
  ["Iluminação", "Validar 2.700 K e 10% de intensidade com estudos de fauna, engenharia, segurança viária e acessibilidade."],
  ["Água e urgência", "Definir “risco grave e atual”, elementos mínimos e destinatários do relatório de 12 horas."],
  ["Plataforma e dados", "Relatório de impacto à proteção de dados, retenção, perfis de acesso e proteção de denunciantes."],
  ["Fundos e destinação de multas", "Enquadramento orçamentário, fonte legal e controle, evitando duplicidade de vinculações."],
  ["Sanções", "Harmonizar valores, teto, multa diária e agravantes com a legislação ambiental existente."],
  ["Fogo e desmatamento", "Compatibilizar o Protocolo com o Código Florestal e a Política Nacional de Manejo Integrado do Fogo."],
  ["Prazos", "Harmonizar os 180 dias do art. 90 com os 180 dias do art. 13."],
  ["Dados macroeconômicos", "Valores econômicos não foram tratados como confirmados: faltam estudos originais, período, unidade, metodologia e fonte."]
];

export const refs = [
  ["Constituição Federal de 1988 (texto compilado)", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"],
  ["Lei Complementar nº 140/2011 — cooperação ambiental", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp140.htm"],
  ["Lei nº 6.938/1981 — Política Nacional do Meio Ambiente", "https://www.planalto.gov.br/ccivil_03/leis/l6938.htm"],
  ["Lei nº 12.305/2010 — Política Nacional de Resíduos Sólidos", "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm"],
  ["Lei nº 9.433/1997 — Política Nacional de Recursos Hídricos", "https://www.planalto.gov.br/ccivil_03/leis/l9433.htm"],
  ["Lei nº 12.651/2012 — Código Florestal", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"],
  ["Lei nº 9.795/1999 — Política Nacional de Educação Ambiental", "https://www.planalto.gov.br/ccivil_03/leis/l9795.htm"],
  ["Lei nº 14.926/2024 — educação ambiental, clima e riscos", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14926.htm"],
  ["Lei nº 14.119/2021 — Pagamento por Serviços Ambientais", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14119.htm"],
  ["Lei nº 13.709/2018 — LGPD", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"],
  ["Lei nº 12.527/2011 — Lei de Acesso à Informação", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"],
  ["Lei Complementar nº 101/2000 — Responsabilidade Fiscal", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm"],
  ["Decreto nº 10.411/2020 — Análise de Impacto Regulatório", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10411.htm"],
  ["Lei nº 15.190/2025 — Lei Geral do Licenciamento Ambiental", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15190.htm"],
  ["Lei nº 15.300/2025 — Licenciamento Ambiental Especial", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15300.htm"],
  ["Lei nº 14.944/2024 — Política Nacional de Manejo Integrado do Fogo", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14944.htm"],
  ["Lei Complementar nº 95/1998 — técnica legislativa", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp95compilado.htm"],
  ["Decreto nº 6.514/2008 — infrações e sanções administrativas ambientais", "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6514compilado.htm"],
  ["Lei nº 9.605/1998 — Crimes Ambientais", "https://www.planalto.gov.br/ccivil_03/leis/l9605.htm"],
  ["Lei nº 11.445/2007 — saneamento básico", "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/lei/l11445compilado.htm"]
];

export const glossary = [
  ["ANFS", "Autoridade Nacional da Floresta Sustentável. Na minuta, denominação funcional de coordenação por unidade administrativa existente, sem criação de autarquia, pessoa jurídica, cargo ou função (art. 11)."],
  ["CAR", "Cadastro Ambiental Rural, instrumento do Código Florestal para registro de informações ambientais dos imóveis rurais."],
  ["EFS Brasil", "Estatuto da Floresta Sustentável: a proposta de projeto de lei federal com 90 artigos e 15 capítulos descrita neste site."],
  ["FTT", "Fundo de Transição Tecnológica: instrumento financeiro proposto, sem personalidade jurídica própria (art. 55)."],
  ["FAG", "Fundo de Amparo ao Guardião: instrumento financeiro proposto, sem personalidade jurídica própria (art. 57)."],
  ["IIB", "Índice de Impacto Biótico: conceito previsto no Selo Verde, cuja metodologia ainda precisa ser definida e validada (art. 30)."],
  ["IA", "Inteligência artificial; na minuta, ferramenta de apoio à triagem, sem substituir a validação humana (art. 49)."],
  ["LAI", "Lei de Acesso à Informação (Lei nº 12.527/2011)."],
  ["LGPD", "Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)."],
  ["MMA", "Ministério do Meio Ambiente e Mudança do Clima."],
  ["PA", "Pedágio Ambiental. Na minuta, a fórmula é referência técnica e o art. 53 esclarece que não autoriza cobrança."],
  ["PGFS", "Programa Guardiões da Floresta Sustentável, programa proposto de educação ambiental prática e ciência cidadã (art. 60)."],
  ["PNMA, PNRH, PNRS", "Políticas Nacionais do Meio Ambiente, de Recursos Hídricos e de Resíduos Sólidos."],
  ["SISNAMA", "Sistema Nacional do Meio Ambiente."],
  ["Vacatio legis", "Período entre a publicação de uma lei e o início de sua vigência (180 dias no art. 90)."]
];
