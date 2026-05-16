import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TOTAL_VAGAS = 50;

const BENEFICIOS = [
  { emoji: "🤖", title: "Toca TrIA trabalha por você", desc: "IA que conecta seu perfil aos clientes certos automaticamente, sem você precisar ficar online." },
  { emoji: "⭐", title: "Visibilidade prioritária de fundador", desc: "Os 50 primeiros aparecem no topo das buscas durante toda a fase de lançamento." },
  { emoji: "🛡️", title: "Perfil verificado e confiável", desc: "Badge oficial que transmite credibilidade e aumenta conversão com novos clientes." },
  { emoji: "📈", title: "Relatórios semanais de performance", desc: "Saiba quantas pessoas viram e clicaram no seu perfil toda semana." },
  { emoji: "💬", title: "Suporte local via WhatsApp", desc: "Equipe de Trancoso pronta para ajudar. Sem robô, sem fila." },
];

const PASSOS = [
  { num: "1", title: "Cadastre-se em 2 minutos", desc: "Nome, especialidade, telefone e foto. Pronto." },
  { num: "2", title: "Pague a 1ª mensalidade", desc: "Pix, boleto ou cartão. Valor único para ativar." },
  { num: "3", title: "Ganhe 60 dias grátis", desc: "Sem cobrar nada a mais. Use, teste, cresça." },
  { num: "4", title: "Receba clientes automaticamente", desc: "O Toca TrIA começa a conectar você com moradores e empresários de Trancoso." },
];

const CHECKLIST = [
  "Perfil completo com portfólio e avaliações",
  'Badge exclusivo "Fundador Trancoso Resolve"',
  "Acesso ao Toca Vision — análise de demanda local",
  "Suporte VIP nos primeiros 3 meses",
  "Preço de fundador fixo por 12 meses",
];

const SERVICOS = [
  "Eletricista",
  "Piscineiro",
  "Diarista",
  "Canalizador",
  "Jardineiro",
  "Pintor",
  "Cozinheiro",
  "Outro",
];

const DIVIDER = () => (
  <div style={{
    height: 2,
    background: "linear-gradient(90deg, transparent 0%, rgba(0,174,239,0.5) 30%, rgba(0,114,255,0.7) 50%, rgba(0,174,239,0.5) 70%, transparent 100%)",
    margin: 0,
    position: "relative",
    zIndex: 10,
  }} />
);

export default function PreLancamento() {
  const [vagasRestantes, setVagasRestantes] = useState(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", servico: "", type: "prestador" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.entities.LeadPreLancamento.list("-created_date", 200)
      .then((leads) => {
        const prestadores = leads.filter(l => l.type === "prestador").length;
        setVagasRestantes(Math.max(0, TOTAL_VAGAS - prestadores));
      })
      .catch(() => setVagasRestantes(46));
  }, [submitted]);

  const scrollToForm = () => {
    document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp) {
      setError("Preencha nome e WhatsApp.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.entities.LeadPreLancamento.create({
        name: form.name,
        whatsapp: form.whatsapp,
        phone: form.whatsapp,
        service_interest: form.servico,
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

  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setForm((f) => ({ ...f, whatsapp: v }));
  };

  const vagas = vagasRestantes ?? "...";
  const CTA_URL = "/SejaPrestador";

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#fff",
      minHeight: "100vh",
      position: "relative",
      background: "linear-gradient(160deg, rgba(6,78,59,0.82) 0%, rgba(5,67,53,0.90) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80') center/cover no-repeat",
      backgroundAttachment: "fixed",
    }}>
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(52,211,153,0.6); }
          50% { opacity: 0.85; transform: scale(1.3); box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
        .pulse-green { animation: pulse-green 1.8s ease-in-out infinite; }

        .btn-primary {
          background: #10b981;
          color: #fff; border: none; border-radius: 999px;
          font-weight: 800; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.2px;
          min-height: 56px;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .pl-wrapper { position: relative; z-index: 10; }

        /* Input styles */
        .pl-input {
          width: 100%; padding: 14px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px; color: #fff;
          font-size: 1rem; outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .pl-input::placeholder { color: rgba(255,255,255,0.45); }
        .pl-input:focus { border-color: #00AEEF; }
        .pl-select {
          width: 100%; padding: 14px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px; color: #fff;
          font-size: 1rem; outline: none;
          cursor: pointer; appearance: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .pl-select option { background: #054335; color: #fff; }
        .pl-select:focus { border-color: #00AEEF; }

        @media (max-width: 480px) {
          .pl-section { padding-left: 20px !important; padding-right: 20px !important; }
          .pl-hero-title { font-size: 2rem !important; letter-spacing: -0.5px !important; }
          .pl-offer-card { padding: 28px 20px !important; }
          .pl-hero-cta { width: 100% !important; max-width: 360px !important; font-size: 1rem !important; }
          .pl-final-cta { width: 100% !important; max-width: 360px !important; }
          .pl-header-badges { display: none !important; }
        }
      `}</style>

      <div className="pl-wrapper">

        {/* ── HEADER ── */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(4, 50, 38, 0.85)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(52,211,153,0.2)",
          paddingTop: "max(12px, env(safe-area-inset-top))",
          paddingBottom: 12, paddingLeft: 20, paddingRight: 20,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
                alt="Trancoso Resolve" style={{ height: 28, width: 28, flexShrink: 0 }}
              />
              <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff", whiteSpace: "nowrap" }}>Trancoso Resolve</span>
            </div>

            <div className="pl-header-badges" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" }}>
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)" }}>⏱️ 2 minutos</span>
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)" }}>💳 Sem cartão</span>
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)" }}>🤖 Toca TrIA</span>
            </div>

            <button className="btn-primary" onClick={scrollToForm}
              style={{ padding: "9px 18px", fontSize: "0.8rem", fontWeight: 700, minHeight: 40, flexShrink: 0 }}>
              Garantir vaga →
            </button>
          </div>
        </header>

        {/* Espaço para header fixo */}
        <div style={{ height: 56 }} />

        {/* ── HERO ── */}
        <section className="pl-section" style={{ padding: "64px 24px 56px", textAlign: "center", maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Badge com bolinha verde pulsando */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(52, 211, 153, 0.12)", border: "1px solid rgba(52, 211, 153, 0.5)",
            borderRadius: 999, padding: "6px 16px 6px 10px",
            fontSize: "0.78rem", fontWeight: 700, color: "#34d399",
            marginBottom: 28, letterSpacing: "0.3px",
          }}>
            <span className="pulse-green" style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "#34d399", display: "inline-block", flexShrink: 0,
            }} />
            Pré-lançamento · Vagas de Fundador
          </div>

          <h1 className="pl-hero-title" style={{
            fontSize: "clamp(2rem, 8vw, 3.2rem)", fontWeight: 900,
            lineHeight: 1.08, marginBottom: 20,
            color: "#fff", letterSpacing: "-1px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            Seja um dos{" "}
            <em style={{ fontStyle: "italic", color: "#34d399" }}>50 fundadores</em>{" "}
            de Trancoso.
          </h1>

          <p style={{
            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
            color: "rgba(255,255,255,0.72)", lineHeight: 1.7,
            maxWidth: 500, margin: "0 auto 32px",
          }}>
            Garanta agora e receba <strong style={{ color: "#34d399" }}>60 dias grátis</strong> ao pagar a primeira mensalidade. Sua vitrine digital oficial está esperando por você.
          </p>

          {/* Contador card sutil */}
          <div style={{
            margin: "0 auto 32px",
            background: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: 16, padding: "20px 28px",
            display: "inline-block", textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}>
            <span style={{ fontSize: "clamp(2.8rem, 10vw, 4rem)", fontWeight: 900, color: "#fbbf24", lineHeight: 1, display: "block" }}>
              {vagas}
            </span>
            <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 600 }}>
              vagas restantes de <strong>{TOTAL_VAGAS}</strong> disponíveis
            </p>
          </div>

          {/* CTA full-width no mobile */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a href={CTA_URL} style={{ textDecoration: "none", width: "100%", maxWidth: 360 }}>
              <button className="btn-primary pl-hero-cta" style={{
                padding: "16px 40px", fontSize: "1.05rem",
                width: "100%", maxWidth: 360,
              }}>
                Garantir minha vaga →
              </button>
            </a>
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: 12 }}>
            Leva 2 minutos · Sem cartão · Cancele quando quiser
          </p>
        </section>

        <DIVIDER />

        {/* ── BENEFÍCIOS ── */}
        <section className="pl-section" style={{ padding: "56px 24px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.15)" }}>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            <p style={secLabel}>Por que entrar agora</p>
            <h2 style={secTitle}>Tudo que você precisa para crescer em Trancoso</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
              {BENEFICIOS.map((b) => (
                <div key={b.title} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(52,211,153,0.2)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 14, padding: "16px 18px",
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.25rem",
                  }}>
                    {b.emoji}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.91rem", color: "#fff", marginBottom: 3 }}>{b.title}</p>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DIVIDER />

        {/* ── CARTÃO DE OFERTA ── */}
        <section className="pl-section" style={{ padding: "56px 24px", position: "relative", zIndex: 10 }}>
          <div className="pl-offer-card" style={{
            maxWidth: 580, margin: "0 auto",
            background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(52,211,153,0.35)",
            backdropFilter: "blur(16px)",
            borderRadius: 24, padding: "36px 32px", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}>
            <span style={{ fontSize: "2rem" }}>🎁</span>
            <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 900, color: "#fff", marginTop: 12, marginBottom: 8, lineHeight: 1.2 }}>
              Pague a 1ª mensalidade<br />
              e ganhe{" "}
              <em style={{ fontStyle: "italic", color: "#34d399" }}>60 dias grátis</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.87rem", marginBottom: 24, lineHeight: 1.6 }}>
              Somente para os 50 primeiros fundadores. Sem pegadinhas, sem renovação automática.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, textAlign: "left" }}>
              {CHECKLIST.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", color: "#34d399", fontWeight: 900, flexShrink: 0,
                  }}>✓</span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>{item}</span>
                </div>
              ))}
            </div>

            <a href={CTA_URL} style={{ textDecoration: "none", display: "block" }}>
              <button className="btn-primary" style={{ padding: "15px 36px", fontSize: "1rem", width: "100%", maxWidth: 360 }}>
                Garantir minha vaga agora →
              </button>
            </a>
            <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.4)", marginTop: 10 }}>
              ✔ CPF ou CNPJ · ✔ Pix, boleto ou cartão · ✔ Cancele quando quiser
            </p>
          </div>
        </section>

        <DIVIDER />

        {/* ── COMO FUNCIONA ── */}
        <section className="pl-section" style={{ padding: "56px 24px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.15)" }}>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <p style={secLabel}>Simples assim</p>
            <h2 style={secTitle}>Como funciona</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 36 }}>
              {PASSOS.map((p) => (
                <div key={p.num} style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, #0072FF, #00AEEF)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: "0.95rem", color: "#fff",
                  }}>
                    {p.num}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.91rem", color: "#fff", marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DIVIDER />

        {/* ── FORMULÁRIO DE CADASTRO ── */}
        <section id="cadastro" className="pl-section" style={{ padding: "56px 24px", position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <p style={secLabel}>Entre na lista</p>
            <h2 style={{ ...secTitle, marginBottom: 8 }}>Reserve sua vaga agora</h2>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", marginBottom: 32 }}>
              Preencha abaixo e entraremos em contato pelo WhatsApp.
            </p>

            {submitted ? (
              <div style={{
                textAlign: "center", padding: "40px 24px",
                background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.4)",
                borderRadius: 20,
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#34d399", marginBottom: 8 }}>
                  Vaga reservada!
                </h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Recebemos seu cadastro. Nossa equipe vai entrar em contato pelo WhatsApp em breve para finalizar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  className="pl-input"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="pl-input"
                  type="tel"
                  placeholder="WhatsApp (73) 99999-9999"
                  value={form.whatsapp}
                  onChange={handlePhone}
                />
                <select
                  className="pl-select"
                  value={form.servico}
                  onChange={(e) => setForm((f) => ({ ...f, servico: e.target.value }))}
                >
                  <option value="">Selecione seu serviço principal</option>
                  {SERVICOS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {error && (
                  <p style={{ color: "#f87171", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ padding: "16px", fontSize: "1rem", width: "100%", marginTop: 4 }}
                >
                  {loading ? "Enviando..." : "Reservar minha vaga →"}
                </button>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                  Seus dados são seguros e não serão compartilhados.
                </p>
              </form>
            )}
          </div>
        </section>

        <DIVIDER />

        {/* ── CTA FINAL ── */}
        <section className="pl-section" style={{ padding: "64px 24px", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2.3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 12, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              Não perca sua vaga de fundador.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", marginBottom: 6, lineHeight: 1.6 }}>
              Restam <strong style={{ color: "#fbbf24" }}>{vagas}</strong> vagas com 60 dias grátis.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.84rem", marginBottom: 32 }}>
              Quando esgotarem, a oferta acaba.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a href={CTA_URL} style={{ textDecoration: "none", width: "100%", maxWidth: 360 }}>
                <button className="btn-primary pl-final-cta" style={{
                  padding: "16px 44px", fontSize: "1.05rem",
                  width: "100%", maxWidth: 360,
                }}>
                  Garantir minha vaga →
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", padding: "32px 20px",
          background: "rgba(3, 40, 30, 0.8)", backdropFilter: "blur(8px)", textAlign: "center",
          position: "relative", zIndex: 10,
        }}>
          <img
            src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 28, marginBottom: 12 }}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
            <a href="https://www.instagram.com/trancosoresolve/" target="_blank" rel="noopener noreferrer"
              aria-label="Instagram Trancoso Resolve"
              style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "#fff"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1B7w8mmbMN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              aria-label="Facebook Trancoso Resolve"
              style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "#fff"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://wa.me/5573998283579" target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp Trancoso Resolve"
              style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "#fff"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
            Trancoso Resolve · trancosoresolve.com.br
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", marginTop: 4 }}>
            © 2026 · Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  );
}

const secLabel = {
  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px",
  textTransform: "uppercase", color: "#34d399", textAlign: "center", marginBottom: 8,
};

const secTitle = {
  fontSize: "clamp(1.35rem, 4vw, 1.85rem)", fontWeight: 800,
  color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 0,
};