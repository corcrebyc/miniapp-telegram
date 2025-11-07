// Inicialização condicional do bot do Telegram
const initBot = async () => {
  // Só executar no servidor
  if (typeof window !== 'undefined') {
    return
  }

  // Só executar em desenvolvimento ou se explicitamente configurado
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_TELEGRAM_BOT) {
    console.log('🤖 Bot do Telegram desabilitado em produção (use ENABLE_TELEGRAM_BOT=true para habilitar)')
    return
  }

  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      console.log('🚀 Inicializando bot do Telegram...')
      const { createTelegramBot } = await import('@/lib/telegram-bot')
      createTelegramBot()
    } catch (error) {
      console.error('❌ Erro ao inicializar bot do Telegram:', error)
    }
  } else {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN não configurado. Bot não será iniciado.')
    console.log('📝 Para configurar o bot:')
    console.log('1. Crie um bot com @BotFather no Telegram')
    console.log('2. Adicione TELEGRAM_BOT_TOKEN=seu_token no arquivo .env.local')
    console.log('3. Reinicie o servidor')
  }
}

// Inicializar apenas no servidor
if (typeof window === 'undefined') {
  initBot()
}

export { initBot }