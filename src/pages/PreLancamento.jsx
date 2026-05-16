import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TOTAL_VAGAS = 50;
const CTA_URL = "/SejaPrestador";
// Contador regressivo até 19/05/2025 às 00:00 (horário de Brasília)
const DEADLINE = new Date("2025-05-19T00:00:00-03:00").getTime();

const BENEFICIOS = [
  { emoji: "🤖", title: "Novos clientes todo dia com Toca TrIA", desc: "Nossa IA conecta você automaticamente com quem precisa do seu serviço em Trancoso." },
  { emoji: "⭐", title: "Perfil em destaque na vitrine oficial", desc: "Seu nome aparece no topo das buscas durante toda a fase de lançamento." },
  { emoji: "📊", title: "Estatísticas de visualizações e cliques", desc: "Saiba exatamente quantas pessoas viram e clicaram no seu perfil a cada semana." },
  { emoji: "💰", title: "Dashboard financeiro completo", desc: "Organize orçamentos, receitas e histórico de pagamentos em um só lugar." },
  { emoji: "🛡️", title: "Verificação de antecedentes", desc: "Ganhe o badge de prestador verificado e aumente sua credibilidade com novos clientes." },
  { emoji: "📅", title: "Agenda integrada", desc: "Gerencie todos os seus pedidos e horários diretamente na plataforma." },
];

const CHECKLIST = [
  "60 dias grátis após o primeiro pagamento",
  'Selo exclusivo "Prestador Pioneiro"',
  "Prioridade nos resultados de busca",
  "Acesso antecipado a novos recursos",
];

const PASSOS = [
  { num: "1", title: "Faça seu pré-cadastro em 2 minutos", desc: "Informe seu nome, especialidade e WhatsApp. Sem cartão de crédito agora." },
  { num: "2", title: "Nossa equipe valida seu perfil", desc: "Verificamos seus dados e ativamos sua vitrine digital em até 24h." },
  { num: "3", title: "Comece a receber pedidos", desc: "O Toca TrIA começa a conectar você com clientes de Trancoso automaticamente." },
];

const FAQS = [
  { q: "Preciso pagar agora?", a: "Não. O pré-cadastro é completamente gratuito. Você só paga quando decidir ativar sua vitrine." },
  { q: "Os 60 dias valem mesmo?", a: "Sim. Ao pagar a primeira mensalidade, você ganha 60 dias grátis sem nenhuma cobrança adicional. Garantido para os 50 primeiros." },
  { q: "Posso ser autônomo ou MEI?", a: "Sim. A plataforma aceita prestadores com CPF, MEI e CNPJ. Qualquer profissional pode participar." },
  { q: "Posso cancelar depois?", a: "Sim, sem multa conforme os termos do plano. Você tem total liberdade para cancelar quando quiser." },
];

const SERVICOS_CATEGORIAS = [
  "Elétrica",
  "Obras / Reforma",
  "Faxina / Diarista",
  "Piscineiro",
  "Beleza",
  "Jardinagem",
  "Cozinheiro",
  "Outro",
];

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.floor(timeLeft / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return { days, hours, mins, secs, expired: timeLeft <= 0 };
}

function CountdownBox({ value, label }) {
  return (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <div style={{
        background: "rgba(0,0,0,0.35)", border: "1px solid rgba(251,191,36,0.4)",
        borderRadius: 10, padding: "10px 14px", marginBottom: 6,
      }}>
        <span style={{ fontSize: "clamp(1.5rem, 6vw, 2.2rem)", fontWeight: 900, color: "#fbbf24", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, overflow: "hidden", marginBottom: 10,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          padding: "16px 18px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "#34d399", fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginTop: 12 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function PreLancamento() {
  const [vagasRestantes, setVagasRestantes] = useState(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", categoria: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const countdown = useCountdown(DEADLINE);

  useEffect(() => {
    base44.entities.LeadPreLancamento.list("-created_date", 200)
      .then((leads) => {
        const prestadores = leads.filter(l => l.type === "prestador").length;
        setVagasRestantes(Math.max(0, TOTAL_VAGAS - prestadores));
      })
      .catch(() => setVagasRestantes(46));
  }, [submitted]);

  const scrollToForm = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setForm(f => ({ ...f, whatsapp: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp) { setError("Preencha nome e WhatsApp."); return; }
    setLoading(true); setError("");
    try {
      await base44.entities.LeadPreLancamento.create({
        name: form.name,
        whatsapp: form.whatsapp,
        phone: form.whatsapp,
        service_interest: form.categoria,
        type: "prestador",
        source: "prelancamento-50vagas",
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const vagas = vagasRestantes ?? "...";
  const vagasNum = typeof vagasRestantes === "number" ? vagasRestantes : 46;
  const preenchidas = TOTAL_VAGAS - vagasNum;
  const progressoPct = Math.min(100, (preenchidas / TOTAL_VAGAS) * 100);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: "#fff",
      minHeight: "100vh",
      background: "linear-gradient(160deg, rgba(3,30,22,0.88) 0%, rgba(2,20,15,0.94) 100%), url('https://media.base44.com/images/public/68eb21726a9614db4a82ba99/ab7f3d171_generated_image.png') center/cover no-repeat fixed",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(52,211,153,0.7); }
          50% { opacity: 0.8; transform: scale(1.35); box-shadow: 0 0 0 7px rgba(52,211,153,0); }
        }
        .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .btn-cta {
          background: #10b981;
          color: #fff; border: none; border-radius: 999px;
          font-weight: 800; cursor: pointer; letter-spacing: 0.3px;
          min-height: 52px; display: inline-flex; align-items: center; justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(16,185,129,0.4);
          text-decoration: none;
        }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(16,185,129,0.55); opacity: 0.95; }
        .btn-cta:active { transform: translateY(0); }
        .pl-input, .pl-select {
          width: 100%; padding: 14px 16px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px; color: #fff; font-size: 1rem; outline: none;
          transition: border-color 0.2s; box-sizing: border-box;
        }
        .pl-input::placeholder { color: rgba(255,255,255,0.4); }
        .pl-input:focus, .pl-select:focus { border-color: #34d399; background: rgba(255,255,255,0.13); }
        .pl-select option { background: #054335; color: #fff; }
        .pl-select { cursor: pointer; appearance: none; }
        .sec-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.4) 30%, rgba(52,211,153,0.6) 50%, rgba(52,211,153,0.4) 70%, transparent);
          margin: 0;
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 1.9rem !important; }
          .offer-card { padding: 28px 20px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ── MINI HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(3,35,26,0.88)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(52,211,153,0.2)",
        paddingTop: "max(10px, env(safe-area-inset-top))",
        paddingBottom: 10, paddingLeft: 20, paddingRight: 20,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
              alt="Trancoso Resolve" style={{ height: 26, width: 26, flexShrink: 0 }} />
            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#fff", whiteSpace: "nowrap" }}>Trancoso Resolve</span>
          </div>
          <button className="btn-cta" onClick={scrollToForm}
            style={{ padding: "8px 16px", fontSize: "0.78rem", minHeight: 36 }}>
            Garantir vaga →
          </button>
        </div>
      </header>

      <div style={{ paddingTop: 56 }}>

        {/* ══════════════ HERO ══════════════ */}
        <section className="section-pad" style={{ padding: "60px 24px 52px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>

          {/* Logo centralizada */}
          <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 56, marginBottom: 20 }} />

          {/* Badge pré-lançamento */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.45)",
            borderRadius: 999, padding: "6px 16px 6px 10px",
            fontSize: "0.78rem", fontWeight: 700, color: "#34d399", marginBottom: 24, letterSpacing: "0.3px",
          }}>
            <span className="pulse-dot" style={{ width: 9, height: 9, borderRadius: "50%", background: "#34d399", display: "inline-block", flexShrink: 0 }} />
            Pré-lançamento · Vagas de Fundador
          </div>

          <h1 className="hero-title" style={{
            fontSize: "clamp(1.95rem, 7vw, 3rem)", fontWeight: 900, lineHeight: 1.1,
            marginBottom: 18, color: "#fff", letterSpacing: "-0.5px",
            textShadow: "0 2px 24px rgba(0,0,0,0.4)",
          }}>
            Seja um dos <em style={{ fontStyle: "italic", color: "#34d399" }}>50 primeiros prestadores</em> da Trancoso Resolve
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 3vw, 1.12rem)", color: "rgba(255,255,255,0.75)",
            lineHeight: 1.72, maxWidth: 500, margin: "0 auto 36px",
          }}>
            Garanta sua vitrine digital oficial em Trancoso e ganhe{" "}
            <strong style={{ color: "#34d399" }}>60 dias grátis</strong>{" "}
            ao pagar a primeira mensalidade.
          </p>

          {/* Contador regressivo */}
          {!countdown.expired ? (
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.5px", fontWeight: 600, textTransform: "uppercase" }}>
                ⏳ Oferta encerra em
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <CountdownBox value={countdown.days} label="dias" />
                <CountdownBox value={countdown.hours} label="horas" />
                <CountdownBox value={countdown.mins} label="min" />
                <CountdownBox value={countdown.secs} label="seg" />
              </div>
            </div>
          ) : (
            <div style={{
              marginBottom: 32, display: "inline-block",
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 10, padding: "10px 20px",
              fontSize: "0.88rem", color: "#fca5a5", fontWeight: 700,
            }}>
              ⚠️ Período de oferta encerrado — vagas ainda disponíveis
            </div>
          )}

          {/* Barra de progresso de vagas */}
          <div style={{ maxWidth: 420, margin: "0 auto 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
                {preenchidas} vagas preenchidas
              </span>
              <span style={{ fontSize: "0.82rem", color: "#fbbf24", fontWeight: 800 }}>
                {vagas} restantes de {TOTAL_VAGAS}
              </span>
            </div>
            <div style={{ height: 12, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progressoPct}%`,
                background: "linear-gradient(90deg, #10b981, #34d399)",
                borderRadius: 999, transition: "width 0.8s ease",
              }} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
              Atualizado em tempo real
            </p>
          </div>

          {/* CTA principal */}
          <a href={CTA_URL} className="btn-cta" style={{ padding: "16px 40px", fontSize: "1.05rem", width: "100%", maxWidth: 380, display: "flex", margin: "0 auto" }}>
            QUERO GARANTIR MINHA VAGA
          </a>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
            Leva menos de 2 minutos • Sem cartão de crédito agora
          </p>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ BENEFÍCIOS ══════════════ */}
        <section className="section-pad" style={{ padding: "56px 24px", background: "rgba(0,0,0,0.18)" }}>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            <p style={secLabel}>Por que entrar agora?</p>
            <h2 style={secTitle}>Tudo para crescer em Trancoso</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              {BENEFICIOS.map((b) => (
                <div key={b.title} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(52,211,153,0.18)",
                  backdropFilter: "blur(6px)", borderRadius: 14, padding: "16px 18px",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                  }}>{b.emoji}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "#fff", marginBottom: 4 }}>{b.title}</p>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ OFERTA ══════════════ */}
        <section className="section-pad" style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <p style={secLabel}>Oferta exclusiva</p>
            <h2 style={secTitle}>Para os 50 primeiros fundadores</h2>

            {/* Card oferta */}
            <div className="offer-card" style={{
              marginTop: 32, background: "rgba(255,255,255,0.07)",
              border: "1.5px solid rgba(251,191,36,0.45)",
              backdropFilter: "blur(16px)", borderRadius: 24, padding: "36px 32px", textAlign: "center",
              boxShadow: "0 8px 48px rgba(0,0,0,0.3)",
            }}>
              <span style={{ fontSize: "2.2rem" }}>🎁</span>
              <h3 style={{ fontSize: "clamp(1.2rem, 4vw, 1.7rem)", fontWeight: 900, color: "#fff", marginTop: 12, marginBottom: 20, lineHeight: 1.25 }}>
                Pague a 1ª mensalidade e ganhe{" "}
                <em style={{ color: "#fbbf24" }}>60 dias grátis</em>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, textAlign: "left" }}>
                {CHECKLIST.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", color: "#34d399", fontWeight: 900,
                    }}>✓</span>
                    <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.88)" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Alerta escassez */}
              <div style={{
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.45)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 24,
              }}>
                <p style={{ fontSize: "0.85rem", color: "#fca5a5", fontWeight: 700, margin: 0 }}>
                  ⚠️ Depois das 50 vagas, sem bônus de 60 dias
                </p>
              </div>

              <a href={CTA_URL} className="btn-cta" style={{ padding: "15px 36px", fontSize: "1rem", width: "100%", maxWidth: 360, display: "flex", margin: "0 auto" }}>
                GARANTIR MINHA VAGA AGORA
              </a>
              <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.35)", marginTop: 10 }}>
                ✔ CPF, MEI ou CNPJ · ✔ Pix, boleto ou cartão · ✔ Cancele quando quiser
              </p>
            </div>
          </div>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ COMO FUNCIONA ══════════════ */}
        <section className="section-pad" style={{ padding: "56px 24px", background: "rgba(0,0,0,0.18)" }}>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <p style={secLabel}>Simples assim</p>
            <h2 style={secTitle}>Como funciona na prática</h2>
            <div style={{ marginTop: 36 }}>
              {PASSOS.map((p, i) => (
                <div key={p.num} style={{
                  display: "flex", gap: 18, alignItems: "flex-start",
                  padding: "20px 0",
                  borderBottom: i < PASSOS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: "#10b981",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: "1rem", color: "#fff",
                    boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
                  }}>{p.num}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff", marginBottom: 4 }}>{p.title}</p>
                    <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ FORMULÁRIO DE CAPTURA ══════════════ */}
        <section id="contato" className="section-pad" style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <p style={secLabel}>Entre na lista</p>
            <h2 style={{ ...secTitle, marginBottom: 8 }}>Prefere que a gente entre em contato?</h2>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "0.86rem", marginBottom: 32, lineHeight: 1.6 }}>
              Preencha abaixo e nossa equipe entra em contato pelo WhatsApp para te ajudar.
            </p>

            {submitted ? (
              <div style={{
                textAlign: "center", padding: "40px 24px",
                background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: 20,
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#34d399", marginBottom: 8 }}>Recebemos seu contato!</h3>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  Nossa equipe vai entrar em contato pelo WhatsApp em breve para finalizar seu cadastro de fundador.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="pl-input" type="text" placeholder="Nome completo"
                  value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="pl-input" type="tel" placeholder="WhatsApp (73) 99999-9999"
                  value={form.whatsapp} onChange={handlePhone} />
                <select className="pl-select" value={form.categoria}
                  onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}>
                  <option value="">Categoria de serviço (opcional)</option>
                  {SERVICOS_CATEGORIAS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {error && <p style={{ color: "#f87171", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>}
                <button type="submit" className="btn-cta" disabled={loading}
                  style={{ padding: "16px", fontSize: "1rem", width: "100%", marginTop: 4 }}>
                  {loading ? "Enviando..." : "QUERO SER CONTATADO"}
                </button>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                  🔒 Seus dados são seguros e não serão compartilhados.
                </p>
              </form>
            )}
          </div>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ FAQ ══════════════ */}
        <section className="section-pad" style={{ padding: "56px 24px", background: "rgba(0,0,0,0.18)" }}>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <p style={secLabel}>Dúvidas</p>
            <h2 style={{ ...secTitle, marginBottom: 32 }}>Perguntas frequentes</h2>
            {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </section>

        <div className="sec-divider" />

        {/* ══════════════ CTA FINAL ══════════════ */}
        <section className="section-pad" style={{ padding: "72px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h2 style={{
              fontSize: "clamp(1.5rem, 5vw, 2.2rem)", fontWeight: 900, color: "#fff",
              lineHeight: 1.15, marginBottom: 12, textShadow: "0 2px 20px rgba(0,0,0,0.35)",
            }}>
              Não perca sua vaga de pioneiro em Trancoso.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", marginBottom: 6, lineHeight: 1.6 }}>
              Restam <strong style={{ color: "#fbbf24" }}>{vagas}</strong> vagas com 60 dias grátis.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.84rem", marginBottom: 36 }}>
              Quando esgotarem, a oferta encerra.
            </p>
            <a href={CTA_URL} className="btn-cta" style={{ padding: "18px 44px", fontSize: "1.1rem", width: "100%", maxWidth: 380, display: "flex", margin: "0 auto 16px" }}>
              CADASTRAR AGORA
            </a>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto" }}>
              *Exemplos de resultados são ilustrativos e representam o potencial da plataforma.
            </p>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", padding: "32px 20px",
          background: "rgba(3,28,22,0.85)", backdropFilter: "blur(8px)", textAlign: "center",
        }}>
          <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 28, marginBottom: 14 }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
            {[
              { href: "https://www.instagram.com/trancosoresolve/", label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { href: "https://www.facebook.com/share/1B7w8mmbMN/", label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { href: "https://wa.me/5573998283579", label: "WhatsApp", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
            ].map(({ href, label, d }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
                onMouseOver={e => e.currentTarget.style.color = "#fff"}
                onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>Trancoso Resolve · trancosoresolve.com.br</p>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", marginTop: 4 }}>© 2026 · Todos os direitos reservados</p>
        </footer>

      </div>
    </div>
  );
}

const secLabel = {
  fontSize: "0.71rem", fontWeight: 700, letterSpacing: "1.6px",
  textTransform: "uppercase", color: "#34d399", textAlign: "center", marginBottom: 8,
};

const secTitle = {
  fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 800,
  color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 0,
};