import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Heart, TrendingUp, Brain, ImageIcon, ChevronDown } from "lucide-react";

const MISSION_ITEMS = [
  {
    icon: TrendingUp,
    color: "text-amber-400",
    title: "Dashboard Financeiro",
    desc: "Gerencie trabalhos e finanças pessoais em um único lugar. Controle de dívidas com IA.",
  },
  {
    icon: Brain,
    color: "text-purple-400",
    title: "Toca TrIA",
    desc: "Inteligência artificial robusta para gestão financeira, agenda e recomendações personalizadas.",
  },
  {
    icon: ImageIcon,
    color: "text-emerald-400",
    title: "Toca Vision",
    desc: "Crie imagens profissionais com IA para divulgar seus serviços e atrair mais clientes.",
  },
];

export default function PreLancamento() {
  const [form, setForm] = useState({ email: "", name: "", type: "cliente" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMission, setShowMission] = useState(false);

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">

      {/* ─── LADO ESQUERDO — Hero com imagem ─── */}
      <div
        className="relative lg:flex-1 min-h-[45vh] lg:min-h-screen flex flex-col justify-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-800/30" />

        {/* Logo topo */}
        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
          <img
            src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve"
            className="h-9 w-9"
          />
          <span className="font-bold text-white text-lg tracking-wide">Trancoso Resolve</span>
        </div>

        {/* Texto hero */}
        <div className="relative z-10 p-8 lg:p-12 pb-12">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            ✦ Lançamento em breve
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Sua Expertise<br />no Coração de<br />
            <span className="text-amber-400">Trancoso</span>
          </h1>
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed max-w-md">
            Junte-se à rede exclusiva de profissionais que atende clientes de alto padrão em um dos destinos mais desejados do Brasil.
          </p>

          {/* Selos */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["Profissionais verificados", "IA integrada", "Trancoso, Bahia"].map((tag) => (
              <span
                key={tag}
                className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LADO DIREITO — Card de acesso ─── */}
      <div className="lg:w-[460px] flex flex-col justify-center px-6 py-10 lg:px-12 bg-slate-950 lg:overflow-y-auto">

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Você está na lista! 🎉</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Avisaremos você assim que o Trancoso Resolve abrir.<br />Fique de olho no seu email.
            </p>
          </div>
        ) : (
          <>
            {/* ── Bloco Login ── */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">Entrar na minha conta</h2>
              <p className="text-slate-400 text-sm mb-6">
                Já faz parte da rede Trancoso Resolve? Entre para continuar.
              </p>

              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">Entrar com</p>

              <div className="space-y-2">
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Continuar com Google
                </button>
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                >
                  <img src="https://www.microsoft.com/favicon.ico" className="w-4 h-4" alt="Microsoft" />
                  Continuar com Microsoft
                </button>
              </div>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs">ou entre com seu e-mail</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full py-3 rounded-xl border border-white/15 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
              >
                Continuar com e-mail / senha
              </button>
            </div>

            {/* Divisor */}
            <div className="border-t border-white/10 mb-8" />

            {/* ── Bloco Cadastro / acesso antecipado ── */}
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Cadastro de Cliente ou Prestador</h2>
              <p className="text-slate-400 text-sm mb-5">
                Ainda não faz parte do Trancoso Resolve? Preencha seus dados e receba acesso antecipado às ferramentas exclusivas <strong className="text-white">Toca TrIA</strong> e <strong className="text-white">Toca Vision</strong>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nome completo</label>
                  <Input
                    placeholder="Digite seu nome completo"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="h-11 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Endereço de e-mail *</label>
                  <Input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="h-11 bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-amber-400"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Quero me cadastrar como</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "cliente" }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.type === "cliente"
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-white/10 text-slate-500 hover:border-white/20"
                      }`}
                    >
                      👤 Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "prestador" }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.type === "prestador"
                          ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-slate-500 hover:border-white/20"
                      }`}
                    >
                      🔧 Prestador
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-bold text-base rounded-xl border-0 mt-1"
                  style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
                >
                  {loading ? "Cadastrando..." : "Concluir cadastro →"}
                </Button>

                <p className="text-xs text-slate-500 text-center pt-1">
                  Sem spam. Apenas um email quando lançarmos. 🔒
                </p>
              </form>
            </div>
          </>
        )}

        {/* ── Nossa Missão (expansível) ── */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <button
            onClick={() => setShowMission((v) => !v)}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Nossa Missão</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showMission ? "rotate-180" : ""}`} />
          </button>

          {showMission && (
            <div className="mt-4 space-y-3">
              <p className="text-slate-400 text-xs leading-relaxed">
                Fortalecer a comunidade local por meio da criação de empregos e da facilitação do acesso a serviços de qualidade — com tecnologia de ponta e IA.
              </p>
              {MISSION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 bg-white/5 rounded-xl p-3">
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                    <div>
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          © 2025 Trancoso Resolve · Trancoso, Bahia
        </p>
      </div>
    </div>
  );
}