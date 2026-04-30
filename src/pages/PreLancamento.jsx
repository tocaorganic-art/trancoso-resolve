import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck, MapPin, Star, Users, Building2, Wrench } from "lucide-react";

const AUDIENCE = [
  {
    icon: Users,
    title: "Moradores",
    desc: "Encontre rapidamente prestadores de confiança para manutenção, reformas, eventos, bem-estar e serviços do cotidiano — sempre priorizando quem é daqui.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Building2,
    title: "Empresários, pousadas e restaurantes",
    desc: "Organize serviços para seus hóspedes e clientes, encontre fornecedores locais e tenha uma vitrine para divulgar sua marca dentro da comunidade.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Wrench,
    title: "Prestadores e autônomos",
    desc: "Mostre seu trabalho, conquiste novos clientes e construa reputação em uma plataforma que entende a realidade de Trancoso.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const STRENGTHS = [
  {
    icon: MapPin,
    title: "Prioridade para quem é daqui",
    desc: "Prestadores e empresas de Trancoso têm destaque na busca, para que o dinheiro circule dentro do vilarejo.",
  },
  {
    icon: ShieldCheck,
    title: "Curadoria e verificação",
    desc: "Cada profissional passa por checagem antes de aparecer na plataforma, protegendo a reputação dos bons prestadores.",
  },
  {
    icon: Star,
    title: "Reputação construída na comunidade",
    desc: "Avaliações reais de clientes locais que ajudam os melhores profissionais a se destacarem.",
  },
];

const TYPES = [
  { value: "morador", label: "Morador" },
  { value: "prestador", label: "Prestador / autônomo" },
  { value: "empresario", label: "Empresário / pousada / restaurante" },
  { value: "outro", label: "Outro" },
];

export default function PreLancamento() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", type: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [preType, setPreType] = useState(""); // "cliente" | "prestador"

  const openForm = (type) => {
    setPreType(type);
    setForm((f) => ({
      ...f,
      type: type === "prestador" ? "prestador" : "",
    }));
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.type) {
      setError("Preencha nome, e-mail e quem você é.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.entities.LeadPreLancamento.create({
        email: form.email,
        name: form.name,
        whatsapp: form.whatsapp,
        type: form.type === "prestador" || form.type === "autônomo" ? "prestador" : "cliente",
      });
      setSubmitted(true);
      setShowForm(false);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
              alt="Trancoso Resolve"
              className="h-8 w-8"
            />
            <span className="font-bold text-slate-900 text-base">Trancoso Resolve</span>
          </div>
          <button
            onClick={() => openForm("cliente")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Quero participar →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex items-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-700/10" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-16 md:pb-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            ✦ Pré-lançamento
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-5">
            Trancoso Resolve
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-4 max-w-xl">
            Conectando quem vive, trabalha e investe em Trancoso
          </p>
          <p className="text-base text-white/65 leading-relaxed mb-8 max-w-xl">
            Uma plataforma feita por e para a comunidade. Aqui, moradores, pousadas, restaurantes e prestadores se encontram para resolver o dia a dia, fortalecer negócios e valorizar o que é local.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openForm("cliente")}
              className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-900/40"
            >
              Quero ser cliente
            </button>
            <button
              onClick={() => openForm("prestador")}
              className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white/10 border border-white/25 hover:bg-white/20 text-white font-bold text-base transition-all backdrop-blur-sm"
            >
              Sou prestador ou empresário
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <span className="text-white/50 text-sm">Receba serviços de prestadores verificados da comunidade.</span>
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="py-16 md:py-24 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center mb-3">
            Para quem é o Trancoso Resolve?
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">
            Desenvolvido para atender toda a comunidade de Trancoso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AUDIENCE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-2xl border p-6 ${item.color}`}>
                  <Icon className={`w-8 h-8 mb-4 ${item.iconColor}`} />
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMO FORTALECEMOS ── */}
      <section className="py-16 md:py-24 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center mb-12">
            Como fortalecemos a comunidade
          </h2>
          <div className="space-y-6">
            {STRENGTHS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-5 items-start p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO DE PRÉ-LANÇAMENTO ── */}
      <section id="form-section" className="py-16 md:py-24 px-5 bg-slate-900">
        <div className="max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Você está na lista! 🎉</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Avisaremos você assim que o Trancoso Resolve abrir.<br />Fique de olho no seu e-mail.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                  ✦ Acesso antecipado
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  Quero participar do pré-lançamento
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Deixe seus dados para receber acesso antecipado, novidades e oportunidades exclusivas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-3xl p-7 shadow-2xl">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Nome *</label>
                  <Input
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">E-mail *</label>
                  <Input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">WhatsApp</label>
                  <Input
                    type="tel"
                    placeholder="(__) _____-____"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    className="h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Usaremos este número apenas para conectar você com prestadores e clientes verificados. Seu contato não será exibido publicamente.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">Quem é você? *</label>
                  <div className="grid grid-cols-1 gap-2">
                    {TYPES.map((t) => (
                      <label
                        key={t.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          form.type === t.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={t.value}
                          checked={form.type === t.value}
                          onChange={() => setForm((f) => ({ ...f, type: t.value }))}
                          className="accent-blue-600"
                        />
                        <span className={`text-sm font-medium ${form.type === t.value ? "text-blue-700" : "text-slate-700"}`}>
                          {t.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-bold text-base rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  {loading ? "Cadastrando..." : "Quero participar do pré-lançamento →"}
                </Button>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Seus dados serão usados apenas para comunicação sobre a Trancoso Resolve e oportunidades em Trancoso. Sem spam.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 py-6 text-center">
        <p className="text-slate-600 text-xs">© 2025 Trancoso Resolve · Trancoso, Bahia · Todos os direitos reservados</p>
      </footer>
    </div>
  );
}