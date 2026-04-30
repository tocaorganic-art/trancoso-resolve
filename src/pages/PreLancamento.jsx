import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, MapPin, Star, Zap, Users, Heart, TrendingUp, Brain, Image } from "lucide-react";

const CATEGORIES = [
  { emoji: "🧹", label: "Limpeza" },
  { emoji: "⚡", label: "Eletricista" },
  { emoji: "🔧", label: "Encanador" },
  { emoji: "🍳", label: "Chef" },
  { emoji: "🌿", label: "Jardinagem" },
  { emoji: "🚗", label: "Motorista" },
  { emoji: "📸", label: "Fotografia" },
  { emoji: "🎵", label: "DJ / Som" },
];

export default function PreLancamento() {
  const [form, setForm] = useState({ email: "", name: "", type: "cliente" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);
    setError("");
    try {
      await base44.entities.LeadPreLancamento.create({
        email: form.email,
        name: form.name,
        type: form.type,
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0072FF] via-[#0099CC] to-[#00C8A0] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4">
        <img
          src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
          alt="Trancoso Resolve"
          className="h-9 w-9"
        />
        <span className="font-bold text-white text-lg">Trancoso Resolve</span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-4 h-4" /> Lançamento em breve em Trancoso
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl mb-4">
          O serviço certo,<br />na hora certa,<br />em Trancoso.
        </h1>

        <p className="text-white/85 text-lg max-w-md mb-8 leading-relaxed">
          Conectamos turistas, moradores e proprietários de casas aos melhores profissionais locais verificados.
        </p>

        {/* Categorias */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-lg">
          {CATEGORIES.map((c) => (
            <span
              key={c.label}
              className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-full font-medium"
            >
              {c.emoji} {c.label}
            </span>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-left">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Você está na lista! 🎉</h2>
              <p className="text-slate-500 text-sm">
                Avisaremos você assim que o Trancoso Resolve abrir. Fique de olho no seu email.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Seja o primeiro a saber</h2>
              <p className="text-slate-500 text-sm mb-5">
                Cadastre seu email e receba acesso antecipado quando lançarmos.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Seu nome (opcional)"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-11"
                />
                <Input
                  type="email"
                  placeholder="Seu melhor email *"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="h-11"
                />

                {/* Tipo */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: "cliente" }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      form.type === "cliente"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    👤 Sou cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: "prestador" }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      form.type === "prestador"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    🔧 Sou prestador
                  </button>
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-bold text-base rounded-full"
                  style={{ background: "linear-gradient(135deg, #0072FF, #00C8A0)" }}
                >
                  {loading ? "Cadastrando..." : "Quero acesso antecipado →"}
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  Sem spam. Apenas 1 email quando lançarmos. 🔒
                </p>
              </form>
            </>
          )}
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/90">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Trancoso, Bahia</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Profissionais verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span className="text-sm">Com IA integrada</span>
          </div>
        </div>

        {/* Missão */}
        <div className="mt-16 w-full max-w-3xl px-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 text-left border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Nossa Missão</h2>
            </div>
            <p className="text-white/90 text-base leading-relaxed mb-8">
              Fortalecer a comunidade local por meio da criação de empregos e da facilitação do acesso a serviços de qualidade. Queremos garantir um impacto positivo e duradouro na vida de cada usuário.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                <TrendingUp className="w-8 h-8 text-yellow-300 mb-3" />
                <h3 className="font-bold text-white mb-1">Dashboard Financeiro</h3>
                <p className="text-white/75 text-sm leading-relaxed">
                  Gerencie seus trabalhos <em>e</em> suas finanças pessoais diárias em um único lugar. Controle de dívidas com IA.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                <Brain className="w-8 h-8 text-purple-300 mb-3" />
                <h3 className="font-bold text-white mb-1">Inteligência Artificial</h3>
                <p className="text-white/75 text-sm leading-relaxed">
                  IA robusta para sugestões de gestão financeira, organização de agenda e recomendações personalizadas.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                <Image className="w-8 h-8 text-green-300 mb-3" />
                <h3 className="font-bold text-white mb-1">Geração de Imagens</h3>
                <p className="text-white/75 text-sm leading-relaxed">
                  Crie imagens personalizadas com IA para divulgar seus serviços e atrair mais clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center pb-6 text-white/50 text-xs">
        © 2025 Trancoso Resolve · www.trancosoresolve.com.br
      </footer>
    </div>
  );
}