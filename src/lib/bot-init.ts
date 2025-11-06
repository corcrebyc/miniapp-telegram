import { createTelegramBot } from '@/lib/telegram-bot'

// Inicializar o bot quando o servidor iniciar
const initBot = () => {
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log('🚀 Inicializando bot do Telegram...')
    createTelegramBot()
  } else {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN não configurado. Bot não será iniciado.')
    console.log('📝 Para configurar o bot:')
    console.log('1. Crie um bot com @BotFather no Telegram')
    console.log('2. Adicione TELEGRAM_BOT_TOKEN=seu_token no arquivo .env.local')
    console.log('3. Reinicie o servidor')
  }
}

// Inicializar apenas no servidor (não no build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  initBot()
}

export { initBot }