import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const TOTAL_VAGAS = 50;

const BENEFICIOS = [
  { emoji: "🤖", title: "Toca TrIA — IA exclusiva", desc: "Nossa inteligência artificial prioriza seu perfil para clientes da sua região e categoria." },
  { emoji: "📊", title: "Dashboard financeiro", desc: "Controle orçamentos, pagamentos e acompanhe seus ganhos em tempo real." },
  { emoji: "🛡️", title: "Verificação de antecedentes", desc: "Badge de prestador verificado que aumenta a confiança e sua taxa de contratação." },
  { emoji: "👁️", title: "Visibilidade prioritária", desc: "Os 50 primeiros cadastrados aparecem no topo das buscas na plataforma." },
  { emoji: "📈", title: "Relatórios semanais", desc: "Veja quantas pessoas viram seu perfil, clicaram e entraram em contato." },
  { emoji: "💬", title: "Suporte humanizado", desc: "Equipe local para tirar dúvidas via WhatsApp. Somos de Trancoso, como você." },
];

const PASSOS = [
  { num: "1", title: "Clique em 'Quero ser um dos 50'", desc: "Leva 2 minutos. Sem cartão de crédito agora." },
  { num: "2", title: "Complete seu perfil de prestador", desc: "Foto, especialidades, área de atuação e disponibilidade." },
  { num: "3", title: "Pague a 1ª mensalidade", desc: "R$ 29,90 apenas — e ganhe 60 dias grátis automaticamente." },
  { num: "4", title: "Receba seus primeiros clientes", desc: "Seu perfil entra ao vivo e começa a gerar leads imediatamente." },
];

export default function PreLancamento() {
  const [vagasRestantes, setVagasRestantes] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", type: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 47, s: 12 });

  // Carregar vagas restantes
  useEffect(() => {
    base44.entities.LeadPreLancamento.list("-created_date", 200)
      .then((leads) => {
        const prestadores = leads.filter(l => l.type === "prestador").length;
        setVagasRestantes(Math.max(0, TOTAL_VAGAS - prestadores));
      })
      .catch(() => setVagasRestantes(TOTAL_VAGAS));
  }, [submitted]);

  // Popup de urgência aos 45s
  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 45000);
    return () => clearTimeout(t);
  }, []);

  // Contador regressivo (simula urgência — reinicia a cada 24h)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        email: form.email,
        whatsapp: form.whatsapp,
        phone: form.whatsapp,
        type: form.type === "prestador" ? "prestador" : "cliente",
        source: "prelancamento-50vagas",
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0a1628", color: "#fff", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 56,
        background: "rgba(10,22,40,0.95)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 32, width: 32 }} />
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>Trancoso Resolve</span>
        </div>
        <button onClick={scrollToForm} style={{
          background: "linear-gradient(135deg, #00AEEF, #0072FF)", color: "#fff",
          border: "none", borderRadius: 999, padding: "8px 18px",
          fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
        }}>
          Garantir vaga →
        </button>
      </nav>

      {/* ── BANNER URGÊNCIA ── */}
      <div style={{
        background: "linear-gradient(90deg, #f59e0b, #ef4444)",
        padding: "10px 16px", textAlign: "center",
        fontSize: "0.82rem", fontWeight: 600, color: "#fff",
        marginTop: 56, letterSpacing: "0.3px",
      }}>
        ⚡ OFERTA EXCLUSIVA — Apenas {vagasRestantes ?? "..."} vagas restam • 60 dias grátis para os primeiros 50
      </div>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "90vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "60px 20px 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(0,174,239,0.12) 0%, transparent 70%)",
          top: "40%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0,174,239,0.15)", border: "1px solid rgba(0,174,239,0.4)",
          borderRadius: 999, padding: "6px 16px", marginBottom: 24,
          fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1.5,
          color: "#00AEEF", textTransform: "uppercase",
        }}>
          🚀 Pré-Lançamento — Fundadores
        </div>

        <h1 style={{
          fontSize: "clamp(1.9rem, 6vw, 3.8rem)", fontWeight: 900,
          lineHeight: 1.1, marginBottom: 16, maxWidth: 750, letterSpacing: "-1px",
        }}>
          Cadastre-se AGORA e<br />
          <span style={{
            background: "linear-gradient(135deg, #00AEEF, #00e676)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ganhe 60 dias grátis
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255,255,255,0.7)",
          maxWidth: 580, margin: "0 auto 12px", lineHeight: 1.7,
        }}>
          Faça parte dos <strong style={{ color: "#fff" }}>50 primeiros prestadores</strong> da plataforma que conecta moradores, empresários e profissionais em Trancoso.
        </p>

        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>
          Sua vitrine digital oficial em Trancoso • Profissionais verificados • Tecnologia com IA
        </p>

        {/* Contador de vagas */}
        {vagasRestantes !== null && (
          <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16, padding: "16px 28px", marginBottom: 32, display: "inline-block",
          }}>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              Vagas de fundador restantes
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: TOTAL_VAGAS }).map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 20, borderRadius: 3,
                    background: i < (TOTAL_VAGAS - vagasRestantes) ? "rgba(255,255,255,0.15)" : "#00AEEF",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: vagasRestantes < 10 ? "#ef4444" : "#00e676" }}>
                {vagasRestantes}/{TOTAL_VAGAS}
              </span>
            </div>
          </div>
        )}

        <button onClick={scrollToForm} style={{
          background: "linear-gradient(135deg, #00AEEF, #0072FF)",
          color: "#fff", border: "none", borderRadius: 999,
          padding: "18px 40px", fontSize: "1.1rem", fontWeight: 800,
          cursor: "pointer", boxShadow: "0 8px 30px rgba(0,114,255,0.4)",
          letterSpacing: "0.3px", marginBottom: 12,
        }}>
          QUERO SER UM DOS 50! 🚀
        </button>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
          Leva 2 minutos • Sem cartão agora • 60 dias grátis garantidos
        </p>
      </section>

      {/* ── OFERTA DESTAQUE ── */}
      <section style={{
        background: "linear-gradient(135deg, #1a2a1a, #0d2d1a)",
        border: "1px solid rgba(0,230,118,0.2)",
        borderRadius: 24, margin: "0 16px 60px", padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(0,230,118,0.15)",
          border: "1px solid rgba(0,230,118,0.4)", borderRadius: 999,
          padding: "6px 20px", fontSize: "0.75rem", fontWeight: 700,
          color: "#00e676", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20,
        }}>
          🎁 Oferta Exclusiva de Fundador
        </div>
        <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", fontWeight: 900, marginBottom: 12 }}>
          Pague a 1ª mensalidade.<br />
          <span style={{ color: "#00e676" }}>Ganhe 60 dias grátis.</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Apenas R$ 29,90 na primeira parcela — e você fica 60 dias usando a plataforma completa sem pagar nada. Só para os 50 fundadores.
        </p>

        {/* Contador regressivo */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            Oferta expira em
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {[{ v: pad(timeLeft.h), l: "horas" }, { v: pad(timeLeft.m), l: "min" }, { v: pad(timeLeft.s), l: "seg" }].map(({ v, l }) => (
              <div key={l} style={{
                background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "12px 16px", minWidth: 64, textAlign: "center",
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={scrollToForm} style={{
          background: "linear-gradient(135deg, #00e676, #00b34a)",
          color: "#0a1628", border: "none", borderRadius: 999,
          padding: "16px 36px", fontSize: "1rem", fontWeight: 800,
          cursor: "pointer", boxShadow: "0 6px 24px rgba(0,230,118,0.3)",
        }}>
          GARANTIR MINHA VAGA DE FUNDADOR →
        </button>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section style={{ padding: "60px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 2, color: "#00AEEF", textTransform: "uppercase", marginBottom: 12 }}>
          O que você ganha
        </p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, marginBottom: 48 }}>
          Tudo que os 50 fundadores recebem
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
          {BENEFICIOS.map((b) => (
            <div key={b.title} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{b.emoji}</div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8, color: "#fff" }}>{b.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: "60px 20px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 2, color: "#00AEEF", textTransform: "uppercase", marginBottom: 12 }}>
            4 passos simples
          </p>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 40 }}>
            Como funciona
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PASSOS.map((p) => (
              <div key={p.num} style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                background: "rgba(0,174,239,0.06)", border: "1px solid rgba(0,174,239,0.15)",
                borderRadius: 16, padding: 20,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, #00AEEF, #0072FF)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "1.1rem",
                }}>
                  {p.num}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{p.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="cadastro" style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 12 }}>Vaga garantida!</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 32 }}>
                Você está na lista dos fundadores! Fique de olho no WhatsApp —<br />
                entraremos em contato para ativar seus 60 dias grátis.
              </p>
              <a href="/SejaPrestador" style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #00AEEF, #0072FF)",
                color: "#fff", textDecoration: "none", borderRadius: 999,
                padding: "14px 32px", fontWeight: 700, fontSize: "0.95rem",
              }}>
                Completar meu cadastro →
              </a>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: 2, color: "#00AEEF", textTransform: "uppercase", marginBottom: 12 }}>
                  Acesso de fundador
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, marginBottom: 8 }}>
                  Quero ser um dos 50!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                  Preencha abaixo. Em seguida, complete seu perfil em <strong style={{ color: "#00AEEF" }}>trancosoresolve.com.br/SejaPrestador</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nome completo *</label>
                  <input style={inputStyle} placeholder="Seu nome completo"
                    value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp *</label>
                  <input style={inputStyle} type="tel" placeholder="(73) 99999-9999"
                    value={form.whatsapp} onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))} required />
                </div>
                <div>
                  <label style={labelStyle}>E-mail (opcional)</label>
                  <input style={inputStyle} type="email" placeholder="seuemail@exemplo.com"
                    value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Você é *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                    {[
                      { value: "prestador", label: "Prestador / autônomo" },
                      { value: "empresario", label: "Empresário / pousada / restaurante" },
                      { value: "morador", label: "Morador de Trancoso" },
                    ].map((t) => {
                      const sel = form.type === t.value;
                      return (
                        <label key={t.value} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                          border: `2px solid ${sel ? "#00AEEF" : "rgba(255,255,255,0.1)"}`,
                          background: sel ? "rgba(0,174,239,0.1)" : "rgba(255,255,255,0.03)",
                        }}>
                          <input type="radio" name="type" value={t.value} checked={sel}
                            onChange={() => setForm(f => ({ ...f, type: t.value }))}
                            style={{ accentColor: "#00AEEF" }} />
                          <span style={{ fontSize: "0.9rem", fontWeight: 500, color: sel ? "#00AEEF" : "rgba(255,255,255,0.7)" }}>
                            {t.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center" }}>{error}</p>}

                <button type="submit" disabled={loading} style={{
                  background: "linear-gradient(135deg, #00AEEF, #0072FF)",
                  color: "#fff", border: "none", borderRadius: 999,
                  padding: "16px 24px", fontSize: "1rem", fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 24px rgba(0,114,255,0.35)",
                  opacity: loading ? 0.75 : 1, marginTop: 4,
                }}>
                  {loading ? "Cadastrando..." : "GARANTIR MINHA VAGA AGORA →"}
                </button>

                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.6 }}>
                  Sem spam. Seus dados são usados apenas para ativar sua conta.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 20px", textAlign: "center",
      }}>
        <img src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
          alt="Trancoso Resolve" style={{ height: 28, marginBottom: 12 }} />
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>
          © 2026 Trancoso Resolve · Trancoso, Bahia · Todos os direitos reservados
        </p>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.72rem", marginTop: 4 }}>
          *Depoimentos são exemplos ilustrativos. Resultados podem variar.
        </p>
      </footer>

      {/* ── POPUP URGÊNCIA ── */}
      {showPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 500, padding: 20,
        }} onClick={() => setShowPopup(false)}>
          <div style={{
            background: "#0f2a4a", border: "1px solid rgba(0,174,239,0.4)",
            borderRadius: 24, padding: "36px 28px", maxWidth: 400, width: "100%",
            textAlign: "center",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⏰</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
              Restam {vagasRestantes ?? "poucas"} vagas de fundador!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 24, fontSize: "0.9rem" }}>
              Garante agora e recebe <strong style={{ color: "#00e676" }}>60 dias grátis</strong> ao pagar a 1ª mensalidade.
            </p>
            <button onClick={() => { setShowPopup(false); scrollToForm(); }} style={{
              background: "linear-gradient(135deg, #00AEEF, #0072FF)",
              color: "#fff", border: "none", borderRadius: 999,
              padding: "14px 28px", fontWeight: 800, cursor: "pointer",
              fontSize: "0.95rem", width: "100%",
            }}>
              QUERO MINHA VAGA →
            </button>
            <button onClick={() => setShowPopup(false)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              fontSize: "0.78rem", cursor: "pointer", marginTop: 12, display: "block", width: "100%",
            }}>
              Não, prefiro perder a oferta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.8rem", fontWeight: 600,
  color: "rgba(255,255,255,0.7)", marginBottom: 6,
};

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem",
  color: "#fff", outline: "none", background: "rgba(255,255,255,0.07)",
  fontFamily: "inherit", boxSizing: "border-box",
};