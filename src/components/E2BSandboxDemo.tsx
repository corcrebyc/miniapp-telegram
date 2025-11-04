"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Terminal, Link } from "lucide-react";

export default function E2BSandboxDemo() {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectId, setConnectId] = useState("");

  const createSandbox = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Simular criação do sandbox (em produção, isso seria uma API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar um ID simulado para demonstração
      const mockId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSandboxId(mockId);
      
      console.log("Novo sandbox ID:", mockId);
    } catch (err) {
      setError("Erro ao criar sandbox. Verifique suas credenciais E2B.");
      console.error("Erro:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const connectToSandbox = async () => {
    if (!connectId.trim()) {
      setError("Por favor, insira um ID de sandbox válido.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      // Simular conexão ao sandbox (em produção, isso seria uma API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSandboxId(connectId);
      console.log("Conectado ao sandbox:", connectId);
    } catch (err) {
      setError("Erro ao conectar ao sandbox. Verifique se o ID está correto.");
      console.error("Erro:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOrCreateSandbox = async (targetId: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simular tentativa de conexão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular erro "sandbox not found" para demonstrar fallback
      const shouldFail = Math.random() > 0.5;
      
      if (shouldFail) {
        console.log("Sandbox não encontrado, criando novo...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSandboxId(newId);
        console.log("Novo sandbox criado:", newId);
      } else {
        setSandboxId(targetId);
        console.log("Conectado ao sandbox existente:", targetId);
      }
    } catch (err) {
      setError("Erro ao conectar ou criar sandbox.");
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
                disabled={isCreating || isConnecting}
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
                disabled={isCreating || isConnecting}
              />
              <Button 
                onClick={connectToSandbox} 
                disabled={isCreating || isConnecting || !connectId.trim()}
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
              onClick={() => connectOrCreateSandbox("iaoedlld28kb0e21k823l")} 
              disabled={isCreating || isConnecting}
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
                  <code>{`const { E2B } = require("e2b");

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