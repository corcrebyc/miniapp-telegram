const { E2B } = require("e2b");

// Inicializar cliente E2B
const e2b = new E2B(process.env.E2B_API_KEY);

async function createNodejsSandbox() {
  try {
    const sandbox = await e2b.createSandbox("nodejs");
    console.log("Novo sandbox ID:", sandbox.id);
    return sandbox;
  } catch (error) {
    console.error("Erro ao criar sandbox:", error);
    throw error;
  }
}

async function connectToSandbox(sandboxId) {
  try {
    const sandbox = await e2b.connectSandbox(sandboxId);
    console.log("Conectado ao sandbox:", sandboxId);
    return sandbox;
  } catch (error) {
    console.error("Erro ao conectar ao sandbox:", error);
    throw error;
  }
}

async function connectOrCreateSandbox(sandboxId) {
  let sandbox;
  try {
    // Tentar conectar ao sandbox existente
    sandbox = await e2b.connectSandbox(sandboxId);
    console.log("Conectado ao sandbox existente:", sandboxId);
  } catch (err) {
    // Se não encontrar, criar um novo
    if (err.message.includes("wasn't found")) {
      console.log("Sandbox não encontrado, criando novo...");
      sandbox = await e2b.createSandbox("nodejs");
      console.log("Novo sandbox criado:", sandbox.id);
    } else {
      throw err;
    }
  }
  return sandbox;
}

// Exportar as funções para uso em outros arquivos
module.exports = {
  createNodejsSandbox,
  connectToSandbox,
  connectOrCreateSandbox
};

// Executar se for chamado diretamente
if (require.main === module) {
  createNodejsSandbox()
    .then(sandbox => {
      console.log("Sandbox pronto para uso!");
    })
    .catch(error => {
      console.error("Falha na criação do sandbox:", error);
    });
}