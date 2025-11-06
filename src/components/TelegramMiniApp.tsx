'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Heart, 
  Star, 
  Crown, 
  Sparkles, 
  MessageCircle,
  User,
  Settings,
  Wallet
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'model'
  timestamp: Date
  modelId?: string
}

interface VirtualModel {
  id: string
  name: string
  avatar: string
  description: string
  personality: string
  price: number
  rating: number
  isOnline: boolean
  specialty: string
}

const virtualModels: VirtualModel[] = [
  {
    id: '1',
    name: 'Luna',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    description: 'Sonhadora e misteriosa, especialista em conversas profundas',
    personality: 'Romântica e filosófica',
    price: 5,
    rating: 4.9,
    isOnline: true,
    specialty: 'Conversas íntimas'
  },
  {
    id: '2',
    name: 'Aria',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    description: 'Energética e divertida, sempre pronta para uma aventura',
    personality: 'Extrovertida e aventureira',
    price: 3,
    rating: 4.8,
    isOnline: true,
    specialty: 'Entretenimento'
  },
  {
    id: '3',
    name: 'Sophia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    description: 'Inteligente e sofisticada, perfeita para discussões intelectuais',
    personality: 'Intelectual e elegante',
    price: 8,
    rating: 4.95,
    isOnline: false,
    specialty: 'Conversas intelectuais'
  },
  {
    id: '4',
    name: 'Maya',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    description: 'Carinhosa e empática, sempre disposta a ouvir',
    personality: 'Empática e cuidadosa',
    price: 4,
    rating: 4.7,
    isOnline: true,
    specialty: 'Apoio emocional'
  }
]

export default function TelegramMiniApp() {
  const [activeTab, setActiveTab] = useState('models')
  const [selectedModel, setSelectedModel] = useState<VirtualModel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [userCredits, setUserCredits] = useState(25)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateModelResponse = (model: VirtualModel, userMessage: string): string => {
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

    const modelResponses = responses[model.id as keyof typeof responses] || responses['1']
    return modelResponses[Math.floor(Math.random() * modelResponses.length)]
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel) return

    if (userCredits < selectedModel.price) {
      alert('Créditos insuficientes! Compre mais créditos para continuar.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setUserCredits(prev => prev - selectedModel.price)

    // Simular delay de digitação
    setTimeout(() => {
      const modelResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateModelResponse(selectedModel, inputMessage),
        sender: 'model',
        timestamp: new Date(),
        modelId: selectedModel.id
      }

      setMessages(prev => [...prev, modelResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const startChat = (model: VirtualModel) => {
    setSelectedModel(model)
    setActiveTab('chat')
    setMessages([
      {
        id: 'welcome',
        content: `Olá! Eu sou a ${model.name} 😊 ${model.description}. Como posso tornar seu dia mais especial?`,
        sender: 'model',
        timestamp: new Date(),
        modelId: model.id
      }
    ])
  }

  const buyCredits = (amount: number) => {
    setUserCredits(prev => prev + amount)
    alert(`${amount} créditos adicionados com sucesso!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Miríade
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{userCredits}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="models" className="data-[state=active]:bg-purple-600">
              <User className="w-4 h-4 mr-2" />
              Modelos
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-purple-600">
              <Wallet className="w-4 h-4 mr-2" />
              Créditos
            </TabsTrigger>
          </TabsList>

          {/* Modelos Tab */}
          <TabsContent value="models" className="p-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Escolha seu Modelo Virtual</h2>
              <p className="text-purple-200">Conecte-se com personalidades únicas</p>
            </div>

            {virtualModels.map((model) => (
              <Card key={model.id} className="bg-black/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-purple-400">
                        <AvatarImage src={model.avatar} alt={model.name} />
                        <AvatarFallback>{model.name[0]}</AvatarFallback>
                      </Avatar>
                      {model.isOnline && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{model.name}</h3>
                        {model.price >= 7 && <Crown className="w-4 h-4 text-yellow-400" />}
                      </div>
                      
                      <p className="text-sm text-purple-200 mb-2">{model.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{model.rating}</span>
                        </div>
                        <Badge variant="secondary" className="bg-purple-600/50">
                          {model.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-purple-200">Preço: </span>
                          <span className="text-yellow-400 font-semibold">{model.price} créditos/msg</span>
                        </div>
                        
                        <Button 
                          onClick={() => startChat(model)}
                          disabled={!model.isOnline}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {model.isOnline ? 'Conversar' : 'Offline'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="p-4">
            {selectedModel ? (
              <div className="space-y-4">
                {/* Chat Header */}
                <Card className="bg-black/30 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-purple-400">
                        <AvatarImage src={selectedModel.avatar} alt={selectedModel.name} />
                        <AvatarFallback>{selectedModel.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{selectedModel.name}</h3>
                        <p className="text-sm text-green-400">Online agora</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-purple-200">Custo por mensagem</p>
                        <p className="text-yellow-400 font-semibold">{selectedModel.price} créditos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="bg-black/30 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-0">
                    <ScrollArea className="h-96 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-2xl ${
                                message.sender === 'user'
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                  : 'bg-black/40 text-purple-100 border border-purple-500/20'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-black/40 border border-purple-500/20 p-3 rounded-2xl">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Mensagem para ${selectedModel.name}...`}
                    className="bg-black/30 border-purple-500/20 text-white placeholder:text-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || userCredits < selectedModel.price}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {userCredits < selectedModel.price && (
                  <div className="text-center p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                    <p className="text-red-300">Créditos insuficientes! Compre mais na aba Créditos.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhum modelo selecionado</h3>
                <p className="text-purple-200 mb-4">Escolha um modelo na aba "Modelos" para começar a conversar</p>
                <Button 
                  onClick={() => setActiveTab('models')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Ver Modelos
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="p-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Seus Créditos</h2>
              <div className="text-4xl font-bold text-yellow-400 mb-2">{userCredits}</div>
              <p className="text-purple-200">Créditos disponíveis</p>
            </div>

            <div className="grid gap-4">
              <Card className="bg-black/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-center">Pacotes de Créditos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Pacote Básico</p>
                      <p className="text-sm text-purple-200">10 créditos</p>
                    </div>
                    <Button 
                      onClick={() => buyCredits(10)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      R$ 5,00
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Pacote Popular</p>
                      <p className="text-sm text-purple-200">25 créditos</p>
                    </div>
                    <Button 
                      onClick={() => buyCredits(25)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      R$ 10,00
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border-2 border-yellow-500/30">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        Pacote Premium
                        <Crown className="w-4 h-4 text-yellow-400" />
                      </p>
                      <p className="text-sm text-purple-200">60 créditos + 10 bônus</p>
                    </div>
                    <Button 
                      onClick={() => buyCredits(70)}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    >
                      R$ 20,00
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-center">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-purple-200">
                  <p>• Cada mensagem enviada consome créditos</p>
                  <p>• Modelos diferentes têm preços diferentes</p>
                  <p>• Modelos premium oferecem conversas mais sofisticadas</p>
                  <p>• Seus créditos nunca expiram</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}