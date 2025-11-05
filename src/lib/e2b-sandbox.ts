// Arquivo TypeScript para compatibilidade com Next.js
import { E2B } from "e2b";

// Inicializar cliente E2B
const e2b = new E2B(process.env.E2B_API_KEY);

export async function createNodejsSandbox() {
  try {
    const sandbox = await e2b.createSandbox("nodejs");
    console.log("Novo sandbox ID:", sandbox.id);
    return sandbox;
  } catch (error) {
    console.error("Erro ao criar sandbox:", error);
    throw error;
  }
}

export async function connectToSandbox(sandboxId: string) {
  try {
    const sandbox = await e2b.connectSandbox(sandboxId);
    console.log("Conectado ao sandbox:", sandboxId);
    return sandbox;
  } catch (error) {
    console.error("Erro ao conectar ao sandbox:", error);
    throw error;
  }
}

export async function connectOrCreateSandbox(sandboxId: string) {
  let sandbox;
  try {
    // Tentar conectar ao sandbox existente
    sandbox = await e2b.connectSandbox(sandboxId);
    console.log("Conectado ao sandbox existente:", sandboxId);
  } catch (err: any) {
    // Se não encontrar, criar um novo
    if (err.message && err.message.includes("wasn't found")) {
      console.log("Sandbox não encontrado, criando novo...");
      sandbox = await e2b.createSandbox("nodejs");
      console.log("Novo sandbox criado:", sandbox.id);
    } else {
      throw err;
    }
  }
  return sandbox;
}

// Função para verificar se a API key está configurada
export function checkE2BConfig(): boolean {
  return !!process.env.E2B_API_KEY;
}