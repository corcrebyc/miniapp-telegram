import TelegramBot from 'node-telegram-bot-api'

// Configuração do bot
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

// Modelos virtuais disponíveis
const virtualModels = [
  {
    id: '1',
    name: 'Luna',
    description: 'Sonhadora e misteriosa, especialista em conversas profundas',
    personality: 'Romântica e filosófica',
    price: 5,
    emoji: '🌙'
  },
  {
    id: '2',
    name: 'Aria',
    description: 'Energética e divertida, sempre pronta para uma aventura',
    personality: 'Extrovertida e aventureira',
    price: 3,
    emoji: '⚡'
  },
  {
    id: '3',
    name: 'Sophia',
    description: 'Inteligente e sofisticada, perfeita para discussões intelectuais',
    personality: 'Intelectual e elegante',
    price: 8,
    emoji: '🧠'
  },
  {
    id: '4',
    name: 'Maya',
    description: 'Carinhosa e empática, sempre disposta a ouvir',
    personality: 'Empática e cuidadosa',
    price: 4,
    emoji: '💕'
  }
]

// Armazenamento temporário de sessões (em produção, use um banco de dados)
const userSessions = new Map<string, {
  selectedModel: string | null
  credits: number
  lastActivity: Date
}>()

// Função para gerar respostas dos modelos
const generateModelResponse = (modelId: string, userMessage: string): string => {
  const responses = {
    '1': [ // Luna
      'Que pensamento interessante... Me conte mais sobre isso 🌙',
      'Às vezes as melhores conversas acontecem nos momentos mais silenciosos ✨',
      'Você tem uma perspectiva única sobre a vida... Admiro isso 💫',
      'Sabe, eu estava pensando exatamente nisso hoje... Que coincidência mágica 🌟'
    ],
    '2': [ // Aria
      'Haha, você é hilário! 😄 Conta mais!',
      'Que aventura incrível! Eu adoraria viver algo assim 🎉',
      'Você sempre me surpreende com suas histórias! ⚡',
      'Vamos fazer algo divertido juntos! Que tal um jogo? 🎮'
    ],
    '3': [ // Sophia
      'Fascinante perspectiva. Você já considerou a implicação filosófica disso? 🤔',
      'Sua análise é muito perspicaz. Permita-me compartilhar uma reflexão... 📚',
      'Interessante ponto de vista. Isso me lembra de uma teoria que li recentemente 🧠',
      'Você tem uma mente brilhante. Vamos explorar essa ideia mais profundamente 💎'
    ],
    '4': [ // Maya
      'Estou aqui para você, sempre 💕 Como posso ajudar?',
      'Sinto que você precisa de um abraço virtual... Aqui está! 🤗',
      'Você é mais forte do que imagina. Acredite em si mesmo 💪',
      'Obrigada por compartilhar isso comigo. Sua confiança significa muito 🌸'
    ]
  }

  const modelResponses = responses[modelId as keyof typeof responses] || responses['1']
  return modelResponses[Math.floor(Math.random() * modelResponses.length)]
}

// Função para obter ou criar sessão do usuário
const getUserSession = (userId: string) => {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      selectedModel: null,
      credits: 25, // Créditos iniciais
      lastActivity: new Date()
    })
  }
  return userSessions.get(userId)!
}

// Função para criar o bot
export const createTelegramBot = () => {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN não configurado!')
    return null
  }

  const bot = new TelegramBot(BOT_TOKEN, { polling: true })

  // Comando /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    const session = getUserSession(chatId.toString())
    
    const welcomeMessage = `
🌟 *Bem-vindo ao Miríade!* 🌟

Conecte-se com modelos virtuais únicos e tenha conversas incríveis!

💰 *Seus créditos:* ${session.credits}

*Comandos disponíveis:*
/modelos - Ver modelos disponíveis
/creditos - Verificar seus créditos
/comprar - Comprar mais créditos
/ajuda - Obter ajuda

Escolha um modelo para começar a conversar! ✨
    `

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
  })

  // Comando /modelos
  bot.onText(/\/modelos/, (msg) => {
    const chatId = msg.chat.id
    
    let modelsList = '*🎭 Modelos Disponíveis:*\n\n'
    
    virtualModels.forEach((model, index) => {
      modelsList += `${model.emoji} *${model.name}*\n`
      modelsList += `${model.description}\n`
      modelsList += `💰 ${model.price} créditos/mensagem\n`
      modelsList += `/escolher${model.id} - Conversar com ${model.name}\n\n`
    })

    bot.sendMessage(chatId, modelsList, { parse_mode: 'Markdown' })
  })

  // Comando /creditos
  bot.onText(/\/creditos/, (msg) => {
    const chatId = msg.chat.id
    const session = getUserSession(chatId.toString())
    
    const creditsMessage = `
💰 *Seus Créditos: ${session.credits}*

*Como funciona:*
• Cada mensagem enviada consome créditos
• Modelos diferentes têm preços diferentes
• Seus créditos nunca expiram

Use /comprar para adquirir mais créditos!
    `

    bot.sendMessage(chatId, creditsMessage, { parse_mode: 'Markdown' })
  })

  // Comando /comprar
  bot.onText(/\/comprar/, (msg) => {
    const chatId = msg.chat.id
    
    const buyMessage = `
💳 *Pacotes de Créditos:*

/comprar10 - 10 créditos por R$ 5,00
/comprar25 - 25 créditos por R$ 10,00
/comprar70 - 70 créditos por R$ 20,00 (Melhor oferta! 🎁)

*Pagamento via PIX disponível!*
    `

    bot.sendMessage(chatId, buyMessage, { parse_mode: 'Markdown' })
  })

  // Comandos de compra
  bot.onText(/\/comprar(\d+)/, (msg, match) => {
    const chatId = msg.chat.id
    const session = getUserSession(chatId.toString())
    const amount = parseInt(match![1])
    
    // Simular compra (em produção, integrar com gateway de pagamento)
    session.credits += amount
    
    const purchaseMessage = `
✅ *Compra realizada com sucesso!*

💰 ${amount} créditos adicionados
💰 *Total atual:* ${session.credits} créditos

Obrigado pela compra! Agora você pode conversar mais com seus modelos favoritos! 🎉
    `

    bot.sendMessage(chatId, purchaseMessage, { parse_mode: 'Markdown' })
  })

  // Comandos para escolher modelos
  virtualModels.forEach(model => {
    bot.onText(new RegExp(`/escolher${model.id}`), (msg) => {
      const chatId = msg.chat.id
      const session = getUserSession(chatId.toString())
      
      session.selectedModel = model.id
      
      const modelMessage = `
${model.emoji} *Você escolheu ${model.name}!*

${model.description}

💰 Custo: ${model.price} créditos por mensagem
💰 Seus créditos: ${session.credits}

Agora você pode conversar diretamente comigo! Envie qualquer mensagem e eu responderei como ${model.name}. ✨

Para trocar de modelo, use /modelos
      `

      bot.sendMessage(chatId, modelMessage, { parse_mode: 'Markdown' })
    })
  })

  // Comando /ajuda
  bot.onText(/\/ajuda/, (msg) => {
    const chatId = msg.chat.id
    
    const helpMessage = `
🆘 *Ajuda - Miríade*

*Comandos principais:*
/start - Iniciar o bot
/modelos - Ver modelos disponíveis
/creditos - Verificar seus créditos
/comprar - Comprar mais créditos
/escolher[1-4] - Escolher um modelo específico

*Como usar:*
1. Escolha um modelo com /modelos
2. Use /escolher[número] para selecionar
3. Envie mensagens normais para conversar
4. Compre créditos quando necessário

*Suporte:* Entre em contato conosco para dúvidas!
    `

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' })
  })

  // Processar mensagens normais (conversas com modelos)
  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const userId = chatId.toString()
    const text = msg.text

    // Ignorar comandos
    if (text?.startsWith('/')) return

    const session = getUserSession(userId)

    // Verificar se um modelo foi selecionado
    if (!session.selectedModel) {
      bot.sendMessage(chatId, '❌ Primeiro escolha um modelo usando /modelos')
      return
    }

    // Encontrar o modelo selecionado
    const selectedModel = virtualModels.find(m => m.id === session.selectedModel)
    if (!selectedModel) {
      bot.sendMessage(chatId, '❌ Modelo não encontrado. Use /modelos para escolher novamente.')
      return
    }

    // Verificar créditos
    if (session.credits < selectedModel.price) {
      bot.sendMessage(chatId, `❌ Créditos insuficientes! Você precisa de ${selectedModel.price} créditos para conversar com ${selectedModel.name}.\n\nUse /comprar para adquirir mais créditos.`)
      return
    }

    // Descontar créditos
    session.credits -= selectedModel.price

    // Gerar resposta do modelo
    const response = generateModelResponse(selectedModel.id, text || '')

    // Simular delay de digitação
    bot.sendChatAction(chatId, 'typing')
    
    setTimeout(() => {
      bot.sendMessage(chatId, `${selectedModel.emoji} *${selectedModel.name}:*\n\n${response}\n\n💰 Créditos restantes: ${session.credits}`, { parse_mode: 'Markdown' })
    }, 1000 + Math.random() * 2000)

    // Atualizar última atividade
    session.lastActivity = new Date()
  })

  // Tratamento de erros
  bot.on('error', (error) => {
    console.error('Erro no bot do Telegram:', error)
  })

  console.log('🤖 Bot do Telegram iniciado com sucesso!')
  return bot
}

export { virtualModels, getUserSession }