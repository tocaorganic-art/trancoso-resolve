import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TOTAL_VAGAS = 50;

const BENEFICIOS = [
  { emoji: "🤖", title: "IA que gera clientes", desc: "Toca TrIA prioriza seu perfil para quem busca seu serviço em Trancoso." },
  { emoji: "👁️", title: "Visibilidade prioritária", desc: "Os 50 fundadores aparecem no topo das buscas da plataforma." },
  { emoji: "🛡️", title: "Badge de prestador verificado", desc: "Aumente sua credibilidade e taxa de contratação." },
];

export default function PreLancamento() {
  const [vagasRestantes, setVagasRestantes] = useState(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", type: "prestador" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.entities.LeadPreLancamento.list("-created_date", 200)
      .then((leads) => {
        const prestadores = leads.filter(l => l.type === "prestador").length;
        setVagasRestantes(Math.max(0, TOTAL_VAGAS - prestadores));
      })
      .catch(() => setVagasRestantes(TOTAL_VAGAS));
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

  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setForm(f => ({ ...f, whatsapp: v }));
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0a1628", color: "#fff", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,22,40,0.97)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 30, width: 30 }}
          />
          <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Trancoso Resolve</span>
        </div>
        <button onClick={scrollToForm} style={{
          background: "linear-gradient(135deg, #00AEEF, #0072FF)",
          color: "#fff", border: "none", borderRadius: 999,
          padding: "8px 18px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
        }}>
          Garantir vaga
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "64px 24px 56px", textAlign: "center",
        maxWidth: 600, margin: "0 auto",
      }}>
        {/* Badge vagas */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
          borderRadius: 999, padding: "5px 16px", marginBottom: 28,
          fontSize: "0.78rem", fontWeight: 700, color: "#fca5a5",
          letterSpacing: "0.5px",
        }}>
          🔴 {vagasRestantes !== null ? `${vagasRestantes} vagas restantes` : "Vagas limitadas"}
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 7vw, 3.2rem)", fontWeight: 900,
          lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px",
        }}>
          Seja um dos 50<br />
          <span style={{
            background: "linear-gradient(135deg, #00AEEF, #00e676)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            fundadores
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 3vw, 1.15rem)",
          color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: 36,
        }}>
          Ganhe <strong style={{ color: "#00e676" }}>60 dias grátis</strong> ao pagar a 1ª mensalidade de R$ 29,90. Sua vitrine digital oficial em Trancoso.
        </p>

        <button onClick={scrollToForm} style={{
          background: "linear-gradient(135deg, #00AEEF, #0072FF)",
          color: "#fff", border: "none", borderRadius: 999,
          padding: "16px 40px", fontSize: "1.05rem", fontWeight: 800,
          cursor: "pointer", boxShadow: "0 8px 30px rgba(0,114,255,0.35)",
          display: "inline-block",
        }}>
          QUERO SER UM DOS 50 →
        </button>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 12 }}>
          2 minutos • Sem cartão agora • 60 dias grátis garantidos
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section style={{
        padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16, maxWidth: 800, margin: "0 auto",
        }}>
          {BENEFICIOS.map((b) => (
            <div key={b.title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "20px 20px",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{b.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{b.title}</p>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="cadastro" style={{ padding: "56px 24px 72px", maxWidth: 480, margin: "0 auto" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 10 }}>Vaga garantida!</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 28 }}>
              Entraremos em contato pelo WhatsApp para ativar seus 60 dias grátis.
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
                Garanta sua vaga agora
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                Preencha abaixo. Entraremos em contato pelo WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Nome completo *</label>
                <input
                  style={inputStyle}
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>WhatsApp *</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="(73) 99999-9999"
                  value={form.whatsapp}
                  onChange={handlePhone}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Você é</label>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {[
                    { value: "prestador", label: "Prestador" },
                    { value: "empresario", label: "Empresário" },
                    { value: "morador", label: "Morador" },
                  ].map((t) => {
                    const sel = form.type === t.value;
                    return (
                      <label key={t.value} style={{
                        flex: 1, textAlign: "center",
                        padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                        border: `1.5px solid ${sel ? "#00AEEF" : "rgba(255,255,255,0.1)"}`,
                        background: sel ? "rgba(0,174,239,0.12)" : "rgba(255,255,255,0.03)",
                        fontSize: "0.82rem", fontWeight: sel ? 700 : 400,
                        color: sel ? "#00AEEF" : "rgba(255,255,255,0.6)",
                        transition: "all 0.15s",
                      }}>
                        <input type="radio" name="type" value={t.value} checked={sel}
                          onChange={() => setForm(f => ({ ...f, type: t.value }))}
                          style={{ display: "none" }} />
                        {t.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>}

              <button type="submit" disabled={loading} style={{
                background: "linear-gradient(135deg, #00AEEF, #0072FF)",
                color: "#fff", border: "none", borderRadius: 999,
                padding: "16px 24px", fontSize: "1rem", fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 24px rgba(0,114,255,0.3)",
                opacity: loading ? 0.75 : 1, marginTop: 4,
              }}>
                {loading ? "Cadastrando..." : "GARANTIR MINHA VAGA →"}
              </button>

              <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                Sem spam. Usamos seu contato apenas para ativar sua conta.
              </p>
            </form>
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 20px", textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.76rem" }}>
          © 2026 Trancoso Resolve · Trancoso, Bahia
        </p>
      </footer>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.8rem", fontWeight: 600,
  color: "rgba(255,255,255,0.6)", marginBottom: 6,
};

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem",
  color: "#fff", outline: "none", background: "rgba(255,255,255,0.06)",
  fontFamily: "inherit", boxSizing: "border-box",
};