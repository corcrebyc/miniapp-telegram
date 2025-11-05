"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Terminal, Link, AlertTriangle } from "lucide-react";
import { createNodejsSandbox, connectToSandbox, connectOrCreateSandbox, checkE2BConfig } from "@/lib/e2b-sandbox";

export default function E2BSandboxDemo() {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectId, setConnectId] = useState("");
  const [hasE2BConfig, setHasE2BConfig] = useState(false);

  useEffect(() => {
    // Verificar se a configuração E2B está disponível
    setHasE2BConfig(checkE2BConfig());
  }, []);

  const createSandbox = async () => {
    if (!hasE2BConfig) {
      setError("E2B_API_KEY não configurada. Configure nas variáveis de ambiente.");
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      const sandbox = await createNodejsSandbox();
      setSandboxId(sandbox.id);
    } catch (err: any) {
      setError(`Erro ao criar sandbox: ${err.message}`);
      console.error("Erro:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const connectToExistingSandbox = async () => {
    if (!connectId.trim()) {
      setError("Por favor, insira um ID de sandbox válido.");
      return;
    }

    if (!hasE2BConfig) {
      setError("E2B_API_KEY não configurada. Configure nas variáveis de ambiente.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const sandbox = await connectToSandbox(connectId);
      setSandboxId(sandbox.id);
    } catch (err: any) {
      setError(`Erro ao conectar ao sandbox: ${err.message}`);
      console.error("Erro:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOrCreateFallback = async (targetId: string) => {
    if (!hasE2BConfig) {
      setError("E2B_API_KEY não configurada. Configure nas variáveis de ambiente.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const sandbox = await connectOrCreateSandbox(targetId);
      setSandboxId(sandbox.id);
    } catch (err: any) {
      setError(`Erro ao conectar ou criar sandbox: ${err.message}`);
      console.error("Erro:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            E2B Sandbox Manager
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Crie novos sandboxes ou conecte-se a sandboxes existentes
          </p>
        </div>

        {!hasE2BConfig && (
          <Card className="mb-6 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-amber-700 dark:text-amber-400 font-medium">
                    Configuração Necessária
                  </p>
                </div>
                <p className="text-amber-600 dark:text-amber-500 text-sm mt-2">
                  Para usar o E2B Sandbox, você precisa configurar a variável de ambiente E2B_API_KEY.
                  Clique no banner laranja acima para configurar suas variáveis de ambiente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Criar Novo Sandbox
              </CardTitle>
              <CardDescription>
                Crie um novo sandbox Node.js usando E2B
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={createSandbox} 
                disabled={isCreating || isConnecting || !hasE2BConfig}
                className="w-full"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando Sandbox...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Criar Sandbox
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Conectar a Sandbox Existente
              </CardTitle>
              <CardDescription>
                Conecte-se a um sandbox já criado usando seu ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Digite o ID do sandbox"
                value={connectId}
                onChange={(e) => setConnectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isCreating || isConnecting || !hasE2BConfig}
              />
              <Button 
                onClick={connectToExistingSandbox} 
                disabled={isCreating || isConnecting || !connectId.trim() || !hasE2BConfig}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Conectar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Conectar ou Criar (Fallback)
            </CardTitle>
            <CardDescription>
              Tenta conectar a um sandbox específico, se não existir, cria um novo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => connectOrCreateFallback("iaoedlld28kb0e21k823l")} 
              disabled={isCreating || isConnecting || !hasE2BConfig}
              className="w-full"
              size="lg"
              variant="secondary"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4 mr-2" />
                  Conectar ou Criar (ID: iaoedlld28kb0e21k823l)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {sandboxId && (
          <Card className="mb-6 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      Sandbox conectado com sucesso!
                    </p>
                    <p className="text-green-600 dark:text-green-500 text-sm mt-1">
                      ID: {sandboxId}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Ativo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Sandbox</CardTitle>
              <CardDescription>
                Código para criar um novo sandbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{`import { E2B } from "e2b";

const e2b = new E2B(process.env.E2B_API_KEY);
const sandbox = await e2b.createSandbox("nodejs");
console.log("Novo sandbox ID:", sandbox.id);`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conectar a Sandbox</CardTitle>
              <CardDescription>
                Código para conectar a um sandbox existente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-blue-400 text-sm">
                  <code>{`const sandbox = await e2b.connectSandbox("iaoedlld28kb0e21k823l");`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conectar ou Criar</CardTitle>
              <CardDescription>
                Lógica de fallback para criar se não existir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-purple-400 text-sm">
                  <code>{`let sandbox;
try {
  sandbox = await e2b.connectSandbox("iaoedlld28kb0e21k823l");
} catch (err) {
  if (err.message.includes("wasn't found")) {
    sandbox = await e2b.createSandbox("nodejs");
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}