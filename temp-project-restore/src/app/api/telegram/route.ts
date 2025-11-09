import { NextRequest, NextResponse } from 'next/server'
import { createTelegramBot } from '@/lib/telegram-bot'

// Inicializar o bot (apenas uma vez)
let bot: any = null

export async function POST(request: NextRequest) {
  try {
    // Inicializar bot se ainda não foi inicializado
    if (!bot) {
      bot = createTelegramBot()
      if (!bot) {
        return NextResponse.json(
          { error: 'Bot não configurado. Verifique TELEGRAM_BOT_TOKEN' },
          { status: 500 }
        )
      }
    }

    const body = await request.json()
    
    // Processar webhook do Telegram
    if (body.message) {
      // O bot já está configurado para polling, então este webhook é opcional
      console.log('Mensagem recebida via webhook:', body.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no webhook do Telegram:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook do Telegram Bot - Miríade',
    status: 'ativo',
    timestamp: new Date().toISOString()
  })
}