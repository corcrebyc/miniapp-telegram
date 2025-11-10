/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para evitar problemas com dependências do servidor
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Não incluir dependências do servidor no bundle do cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'node-telegram-bot-api': false,
      }
    }
    return config
  },
  
  // Configurações de build
  experimental: {
    serverComponentsExternalPackages: ['node-telegram-bot-api']
  },
  
  // Otimizações
  swcMinify: true,
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig