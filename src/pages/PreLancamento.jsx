import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

const AUDIENCE = [
  {
    emoji: "🏡",
    title: "Moradores",
    desc: "Encontre rapidamente prestadores de confiança para manutenção, reformas, eventos, bem-estar e serviços do cotidiano — sempre priorizando quem é daqui.",
  },
  {
    emoji: "🏨",
    title: "Empresários, pousadas e restaurantes",
    desc: "Organize serviços para seus hóspedes e clientes, encontre fornecedores locais e tenha uma vitrine para divulgar sua marca dentro da comunidade.",
  },
  {
    emoji: "🔧",
    title: "Prestadores e autônomos",
    desc: "Mostre seu trabalho, conquiste novos clientes e construa reputação em uma plataforma que entende a realidade de Trancoso.",
  },
];

const STRENGTHS = [
  {
    emoji: "📍",
    title: "Prioridade para quem é daqui",
    desc: "Prestadores e empresas de Trancoso têm destaque na busca, para que o dinheiro circule dentro do vilarejo.",
  },
  {
    emoji: "✅",
    title: "Curadoria e verificação",
    desc: "Cada profissional passa por checagem antes de aparecer na plataforma, protegendo a reputação dos bons prestadores.",
  },
  {
    emoji: "⭐",
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

  const scrollToForm = () => {
    document.getElementById("pre-cadastro")?.scrollIntoView({ behavior: "smooth" });
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
        type: form.type === "prestador" ? "prestador" : "cliente",
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F9FAFB", color: "#374151", lineHeight: "1.6" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 54,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
            alt="Trancoso Resolve" style={{ height: 28, width: 28 }}
          />
          <span style={{
            fontSize: "1rem", fontWeight: 800,
            background: "linear-gradient(135deg, #00AEEF, #0072FF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.3px",
          }}>
            Trancoso Resolve
          </span>
        </div>
        <span style={{
          fontSize: "0.7rem", fontWeight: 600,
          background: "linear-gradient(135deg, #00AEEF, #00C853)",
          color: "white", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          border: "1px solid #00AEEF", padding: "3px 10px", borderRadius: 999,
          letterSpacing: "0.5px",
        }}>
          PRÉ-LANÇAMENTO
        </span>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a1628 0%, #0f2a4a 50%, #0a1628 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: "100px 24px 60px", position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(0,174,239,0.15) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
        }} />

        <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: 2, color: "#00AEEF", textTransform: "uppercase", marginBottom: 16 }}>
          ✦ Em breve para Trancoso
        </p>

        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 8, letterSpacing: "-0.5px", maxWidth: 700 }}>
          Trancoso Resolve<br />
          <span style={{ background: "linear-gradient(135deg, #00AEEF, #00C853)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Conectando quem vive, trabalha e investe em Trancoso
          </span>
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255,255,255,0.75)", maxWidth: 580, margin: "16px auto 36px", lineHeight: 1.65 }}>
          Uma plataforma feita por e para a comunidade. Aqui, moradores, pousadas, restaurantes e prestadores se encontram para resolver o dia a dia, fortalecer negócios e valorizar o que é local.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
          <button onClick={scrollToForm} style={btnPrimary}>
            Quero ser cliente
          </button>
          <button onClick={scrollToForm} style={btnSecondary}>
            Sou prestador ou empresário
          </button>
        </div>

        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 36 }}>
          {[
            { num: "100%", label: "Profissionais verificados" },
            { num: "Local", label: "Foco na comunidade" },
            { num: "IA", label: "Ferramentas inteligentes" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{s.num}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={sectionLabel}>Para quem é</p>
        <h2 style={sectionTitle}>O Trancoso Resolve é para toda a comunidade</h2>
        <p style={sectionSub}>Desenvolvido para atender moradores, empresários e prestadores em um só lugar.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 48 }}>
          {AUDIENCE.map((item) => (
            <div key={item.title} style={card}>
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>{item.emoji}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FORTALECEMOS ── */}
      <section style={{ background: "linear-gradient(135deg, #0a1628, #0f2a4a)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ ...sectionLabel, color: "#00AEEF" }}>Nosso compromisso</p>
          <h2 style={{ ...sectionTitle, color: "#fff" }}>Como fortalecemos a comunidade</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>
            {STRENGTHS.map((item) => (
              <div key={item.title} style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: 24,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "rgba(0,174,239,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem",
                }}>
                  {item.emoji}
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="pre-cadastro" style={{ padding: "80px 24px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginBottom: 8 }}>Você está na lista!</h2>
              <p style={{ color: "#6B7280", lineHeight: 1.65 }}>
                Avisaremos você assim que o Trancoso Resolve abrir.<br />Fique de olho no seu e-mail.
              </p>
            </div>
          ) : (
            <>
              <p style={sectionLabel}>Acesso antecipado</p>
              <h2 style={{ ...sectionTitle, textAlign: "left" }}>Quero participar do pré-lançamento</h2>
              <p style={{ color: "#6B7280", marginBottom: 32, lineHeight: 1.65 }}>
                Deixe seus dados para receber acesso antecipado, novidades e oportunidades exclusivas.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nome *</label>
                  <input
                    style={inputStyle}
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>E-mail *</label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>WhatsApp</label>
                  <input
                    style={inputStyle}
                    type="tel"
                    placeholder="(__) _____-____"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 6 }}>
                    Usaremos este número apenas para conectar você com prestadores e clientes verificados. Seu contato não será exibido publicamente.
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Quem é você? *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                    {TYPES.map((t) => {
                      const selected = form.type === t.value;
                      return (
                        <label key={t.value} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                          border: `2px solid ${selected ? "#00AEEF" : "#E5E7EB"}`,
                          background: selected ? "rgba(0,174,239,0.06)" : "#fff",
                          transition: "all 0.15s",
                        }}>
                          <input
                            type="radio"
                            name="type"
                            value={t.value}
                            checked={selected}
                            onChange={() => setForm((f) => ({ ...f, type: t.value }))}
                            style={{ accentColor: "#00AEEF" }}
                          />
                          <span style={{ fontSize: "0.9rem", fontWeight: 500, color: selected ? "#0072FF" : "#374151" }}>
                            {t.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {error && <p style={{ color: "#EF4444", fontSize: "0.8rem" }}>{error}</p>}

                <button type="submit" disabled={loading} style={{
                  ...btnPrimary,
                  width: "100%", marginTop: 8, fontSize: "1rem",
                  padding: "16px 24px", borderRadius: 14,
                  opacity: loading ? 0.75 : 1,
                }}>
                  {loading ? "Cadastrando..." : "Quero participar do pré-lançamento →"}
                </button>

                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center", lineHeight: 1.6 }}>
                  Seus dados serão usados apenas para comunicação sobre a Trancoso Resolve e oportunidades em Trancoso. Sem spam.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a1628", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
          © 2025 Trancoso Resolve · Trancoso, Bahia · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}

// ── Shared styles ──
const btnPrimary = {
  background: "linear-gradient(135deg, #00AEEF, #0072FF)",
  color: "white", border: "none",
  padding: "14px 28px", borderRadius: 999,
  fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,114,255,0.35)",
  transition: "opacity 0.2s",
};

const btnSecondary = {
  background: "rgba(255,255,255,0.1)", color: "white",
  border: "1.5px solid rgba(255,255,255,0.3)",
  padding: "14px 28px", borderRadius: 999,
  fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
};

const card = {
  background: "#fff", borderRadius: 20,
  border: "1px solid #F3F4F6", padding: 28,
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const sectionLabel = {
  fontSize: "0.75rem", fontWeight: 700, letterSpacing: 2,
  textTransform: "uppercase", color: "#00AEEF", textAlign: "center",
  marginBottom: 12,
};

const sectionTitle = {
  fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800,
  color: "#111827", lineHeight: 1.2, textAlign: "center", marginBottom: 12,
};

const sectionSub = {
  textAlign: "center", color: "#6B7280", maxWidth: 520,
  margin: "0 auto", lineHeight: 1.65,
};

const labelStyle = {
  display: "block", fontSize: "0.8rem", fontWeight: 600,
  color: "#374151", marginBottom: 6,
};

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #E5E7EB", fontSize: "0.9rem",
  color: "#111827", outline: "none",
  background: "#fff", fontFamily: "'Inter', sans-serif",
};