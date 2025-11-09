// Implementação mock para demonstração - compatível com browser
// Em produção, essas chamadas devem ser feitas via API routes do Next.js

interface MockSandbox {
  id: string;
  status: 'active' | 'creating' | 'stopped';
  createdAt: Date;
}

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Gerar ID aleatório para sandbox
const generateSandboxId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export async function createNodejsSandbox(): Promise<MockSandbox> {
  try {
    // Simular criação de sandbox
    await delay(2000); // Simular delay de criação
    
    const sandbox: MockSandbox = {
      id: generateSandboxId(),
      status: 'active',
      createdAt: new Date()
    };
    
    console.log("Novo sandbox criado (mock):", sandbox.id);
    return sandbox;
  } catch (error) {
    console.error("Erro ao criar sandbox:", error);
    throw new Error("Falha ao criar sandbox. Verifique sua configuração E2B.");
  }
}

export async function connectToSandbox(sandboxId: string): Promise<MockSandbox> {
  try {
    // Simular conexão
    await delay(1500);
    
    // Simular sandbox não encontrado para alguns IDs
    if (sandboxId.length < 10) {
      throw new Error(`Sandbox '${sandboxId}' wasn't found`);
    }
    
    const sandbox: MockSandbox = {
      id: sandboxId,
      status: 'active',
      createdAt: new Date(Date.now() - 3600000) // 1 hora atrás
    };
    
    console.log("Conectado ao sandbox (mock):", sandboxId);
    return sandbox;
  } catch (error) {
    console.error("Erro ao conectar ao sandbox:", error);
    throw error;
  }
}

export async function connectOrCreateSandbox(sandboxId: string): Promise<MockSandbox> {
  try {
    // Tentar conectar ao sandbox existente
    const sandbox = await connectToSandbox(sandboxId);
    console.log("Conectado ao sandbox existente (mock):", sandboxId);
    return sandbox;
  } catch (err: any) {
    // Se não encontrar, criar um novo
    if (err.message && err.message.includes("wasn't found")) {
      console.log("Sandbox não encontrado, criando novo (mock)...");
      const newSandbox = await createNodejsSandbox();
      console.log("Novo sandbox criado (mock):", newSandbox.id);
      return newSandbox;
    } else {
      throw err;
    }
  }
}

// Função para verificar se a API key está configurada
export function checkE2BConfig(): boolean {
  // Em um ambiente real, isso verificaria process.env.E2B_API_KEY
  // Para demo, vamos simular que está configurado
  if (typeof window !== 'undefined') {
    // No browser, simular configuração
    return true;
  }
  return !!process.env.E2B_API_KEY;
}