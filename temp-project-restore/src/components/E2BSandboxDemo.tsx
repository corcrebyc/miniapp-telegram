"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Terminal, Link, AlertTriangle, CheckCircle, Copy } from "lucide-react";
import { createNodejsSandbox, connectToSandbox, connectOrCreateSandbox, checkE2BConfig } from "@/lib/e2b-sandbox";

export default function E2BSandboxDemo() {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectId, setConnectId] = useState("iaoedlld28kb0e21k823l"); // Pré-popular com o ID fornecido
  const [hasE2BConfig, setHasE2BConfig] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Verificar se a configuração E2B está disponível
    setHasE2BConfig(checkE2BConfig());
    
    // Conectar automaticamente ao sandbox fornecido
    if (checkE2BConfig()) {
      connectToTargetSandbox();
    }
  }, []);

  const connectToTargetSandbox = async () => {
    const targetId = "iaoedlld28kb0e21k823l";
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const sandbox = await connectOrCreateSandbox(targetId);
      setSandboxId(sandbox.id);
    } catch (err: any) {
      setError(`Erro ao conectar ao sandbox ${targetId}: ${err.message}`);
      console.error("Erro:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Verificar se a Clipboard API está disponível
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback para navegadores que não suportam Clipboard API
        fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      console.warn('Clipboard API falhou, usando fallback:', err);
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback: Não foi possível copiar texto: ', err);
    }
    
    document.body.removeChild(textArea);
  };

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
      setConnectId(""); // Limpar o campo após sucesso
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

  const resetDemo = () => {
    setSandboxId(null);
    setError(null);
    setConnectId("iaoedlld28kb0e21k823l"); // Resetar para o ID original
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            E2B Sandbox Manager
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Conectado ao Sandbox: <span className="font-mono text-blue-600 dark:text-blue-400">iaoedlld28kb0e21k823l</span>
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

        {sandboxId && (
          <Card className="mb-6 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        Sandbox conectado com sucesso!
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-green-600 dark:text-green-500 text-sm font-mono">
                          ID: {sandboxId}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(sandboxId)}
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {copied && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Copiado!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Ativo
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetDemo}
                      className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Nova Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de conexão rápida em destaque */}
        <Card className="mb-6 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Terminal className="w-5 h-5" />
              Conectar ao Sandbox Alvo
            </CardTitle>
            <CardDescription>
              Conectar automaticamente ao sandbox: <span className="font-mono">iaoedlld28kb0e21k823l</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={connectToTargetSandbox} 
              disabled={isCreating || isConnecting || !hasE2BConfig}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando ao Sandbox...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Conectar ao Sandbox iaoedlld28kb0e21k823l
                </>
              )}
            </Button>
          </CardContent>
        </Card>

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
                placeholder="Digite o ID do sandbox (min. 10 caracteres)"
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

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Conexão</CardTitle>
              <CardDescription>
                Estado atual do sandbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{sandboxId ? `✅ Conectado\nID: ${sandboxId}\nStatus: Ativo` : `⏳ Aguardando conexão\nID: iaoedlld28kb0e21k823l\nStatus: Pendente`}</code>
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