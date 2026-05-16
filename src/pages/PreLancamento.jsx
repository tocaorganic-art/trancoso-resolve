import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import CommunityBackgroundGallery from "@/components/prelancamento/CommunityBackgroundGallery";

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
  "Badge exclusivo \"Fundador Trancoso Resolve\"",
  "Acesso ao Toca Vision — análise de demanda local",
  "Suporte VIP nos primeiros 3 meses",
  "Preço de fundador fixo por 12 meses",
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

  const vagas = vagasRestantes ?? "...";
  const CTA_URL = "/SejaPrestador";

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8faf9", color: "#1a2e1a", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <CommunityBackgroundGallery />
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
        .btn-primary {
          background: linear-gradient(135deg, #0072FF, #00AEEF);
          color: #fff; border: none; border-radius: 999px;
          font-weight: 800; cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.2px;
        }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
        .prelancamento-wrapper {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <div className="prelancamento-wrapper">
      {/* ── HEADER LIQUID GLASS ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(15, 51, 102, 0.65)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139, 184, 255, 0.2)",
        padding: "12px 24px", paddingTop: "max(12px, env(safe-area-inset-top))",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
              alt="Trancoso Resolve" style={{ height: 28, width: 28 }}
            />
            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff" }}>Trancoso Resolve</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "#b8d4ff" }}>
              <span>⏱️</span> Leva 2 minutos
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "#b8d4ff" }}>
              <span>💳</span> Sem cartão
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "#b8d4ff" }}>
              <span>📷</span> Toca Vision
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "#b8d4ff" }}>
              <span>🤖</span> Toca TrIA
            </div>
          </div>

          <button className="btn-primary" onClick={scrollToForm}
            style={{ padding: "7px 16px", fontSize: "0.75rem", fontWeight: 700 }}>
            Garantir vaga →
          </button>
        </div>
      </header>

      {/* Espaço para o header fixo */}
      <div style={{ height: 52 }} />

      {/* ── HERO ── */}
      <section style={{ padding: "72px 24px 64px", textAlign: "center", maxWidth: 620, margin: "0 auto" }}>

        {/* Emblema com bolinha pulsando */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(0, 114, 255, 0.12)", border: "1px solid rgba(0, 174, 239, 0.4)",
          borderRadius: 999, padding: "6px 16px 6px 12px",
          fontSize: "0.78rem", fontWeight: 700, color: "#0072FF",
          marginBottom: 32, letterSpacing: "0.3px",
        }}>
          <span className="pulse-dot" style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00AEEF", display: "inline-block", flexShrink: 0,
          }} />
          Pré-lançamento · Vagas de Fundador
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 7vw, 3.4rem)", fontWeight: 900,
          lineHeight: 1.08, marginBottom: 20,
          color: "#0f2918", letterSpacing: "-1.5px",
        }}>
          Seja um dos{" "}
          <em style={{ fontStyle: "italic", color: "#0072FF" }}>50 fundadores</em>{" "}
          de Trancoso.
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2.8vw, 1.15rem)",
          color: "#4a6450", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px",
        }}>
          Garanta agora e receba <strong style={{ color: "#0072FF" }}>60 dias grátis</strong> ao pagar a primeira mensalidade. Sua vitrine digital oficial está esperando por você.
        </p>

        <a href={CTA_URL} style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ padding: "16px 40px", fontSize: "1.05rem", marginBottom: 12 }}>
            Garantir minha vaga →
          </button>
        </a>
        <p style={{ fontSize: "0.78rem", color: "#8aab90" }}>
          Leva 2 minutos · Sem cartão · Cancele quando quiser
        </p>

        {/* Contador de vagas */}
        <div style={{
          marginTop: 40,
          background: "#fff", border: "1px solid rgba(0, 174, 239, 0.3)",
          borderRadius: 16, padding: "20px 28px",
          display: "inline-block", textAlign: "center",
          boxShadow: "0 2px 12px rgba(0, 114, 255, 0.08)",
        }}>
          <span style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 900, color: "#0072FF", lineHeight: 1 }}>
            {vagas}
          </span>
          <p style={{ fontSize: "0.85rem", color: "#4a6450", marginTop: 4, fontWeight: 500 }}>
            <strong>vagas restantes</strong> de {TOTAL_VAGAS} disponíveis
          </p>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid #e8f0ea", borderBottom: "1px solid #e8f0ea" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={secLabel}>Por que entrar agora</p>
          <h2 style={secTitle}>Tudo que você precisa para crescer em Trancoso</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
            {BENEFICIOS.map((b) => (
              <div key={b.title} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                background: "#f8faf9", border: "1px solid #e2ede6",
                borderRadius: 14, padding: "18px 20px",
              }}>
                <div style={{
                   width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                   background: "rgba(0, 114, 255, 0.12)", border: "1px solid rgba(0, 174, 239, 0.4)",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   fontSize: "1.3rem",
                 }}>
                   {b.emoji}
                 </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f2918", marginBottom: 3 }}>{b.title}</p>
                  <p style={{ fontSize: "0.83rem", color: "#5a7a60", lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARTÃO DE OFERTA ── */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{
          maxWidth: 600, margin: "0 auto",
          background: "#fff", border: "1.5px solid rgba(0, 174, 239, 0.3)",
          borderRadius: 24, padding: "40px 32px", textAlign: "center",
          boxShadow: "0 4px 24px rgba(0, 114, 255, 0.08)",
        }}>
          <span style={{ fontSize: "2rem" }}>🎁</span>
          <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 900, color: "#0f2918", marginTop: 12, marginBottom: 8, lineHeight: 1.2 }}>
            Pague a 1ª mensalidade<br />
            e ganhe{" "}
            <em style={{ fontStyle: "italic", color: "#0072FF" }}>60 dias grátis</em>
          </h2>
          <p style={{ color: "#5a7a60", fontSize: "0.88rem", marginBottom: 28, lineHeight: 1.6 }}>
            Somente para os 50 primeiros fundadores. Sem pegadinhas, sem renovação automática.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, textAlign: "left" }}>
            {CHECKLIST.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                   width: 20, height: 20, borderRadius: "50%",
                   background: "rgba(0, 114, 255, 0.12)", border: "1px solid rgba(0, 174, 239, 0.4)",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   fontSize: "0.65rem", color: "#0072FF", fontWeight: 900, flexShrink: 0,
                 }}>✓</span>
                <span style={{ fontSize: "0.86rem", color: "#2d4a30" }}>{item}</span>
              </div>
            ))}
          </div>

          <a href={CTA_URL} style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "15px 36px", fontSize: "1rem", width: "100%", maxWidth: 360 }}>
              Garantir minha vaga agora →
            </button>
          </a>
          <p style={{ fontSize: "0.75rem", color: "#8aab90", marginTop: 10 }}>
            ✔ CPF ou CNPJ · ✔ Pix, boleto ou cartão · ✔ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid #e8f0ea", borderBottom: "1px solid #e8f0ea" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={secLabel}>Simples assim</p>
          <h2 style={secTitle}>Como funciona</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
            {PASSOS.map((p) => (
              <div key={p.num} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                padding: "18px 0", borderBottom: "1px solid #e8f0ea",
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
                  <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f2918", marginBottom: 2 }}>{p.title}</p>
                  <p style={{ fontSize: "0.83rem", color: "#5a7a60", lineHeight: 1.55 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)", fontWeight: 900, color: "#0f2918", lineHeight: 1.15, marginBottom: 12 }}>
            Não perca sua vaga de fundador.
          </h2>
          <p style={{ color: "#4a6450", fontSize: "0.95rem", marginBottom: 8, lineHeight: 1.6 }}>
            Restam <strong style={{ color: "#0072FF" }}>{vagas}</strong> vagas com 60 dias grátis.
          </p>
          <p style={{ color: "#8aab90", fontSize: "0.85rem", marginBottom: 36 }}>
            Quando esgotarem, a oferta acaba.
          </p>
          <a href={CTA_URL} style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "16px 44px", fontSize: "1.05rem" }}>
              Garantir minha vaga →
            </button>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #e2ede6", padding: "32px 24px",
        background: "#fff", textAlign: "center",
      }}>
        <img
          src="https://media.base44.com/images/public/68eb21726a9614db4a82ba99/866729f3e_trancoso_resolve_logo_principal.png"
          alt="Trancoso Resolve" style={{ height: 28, marginBottom: 12 }}
        />
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          {/* Instagram */}
          <a href="https://www.instagram.com/trancosoresolve/" target="_blank" rel="noopener noreferrer"
            aria-label="Instagram Trancoso Resolve"
            style={{ color: "#5a7a60", transition: "color 0.2s" }}
            onMouseOver={e => e.currentTarget.style.color = "#064e3b"}
            onMouseOut={e => e.currentTarget.style.color = "#5a7a60"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="https://www.facebook.com/share/1B7w8mmbMN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
            aria-label="Facebook Trancoso Resolve"
            style={{ color: "#5a7a60", transition: "color 0.2s" }}
            onMouseOver={e => e.currentTarget.style.color = "#064e3b"}
            onMouseOut={e => e.currentTarget.style.color = "#5a7a60"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* WhatsApp */}
          <a href="https://wa.me/5573998283579" target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp Trancoso Resolve"
            style={{ color: "#5a7a60", transition: "color 0.2s" }}
            onMouseOver={e => e.currentTarget.style.color = "#064e3b"}
            onMouseOut={e => e.currentTarget.style.color = "#5a7a60"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
        <p style={{ color: "#9ab89e", fontSize: "0.78rem" }}>
          Trancoso Resolve · trancosoresolve.com.br
        </p>
        <p style={{ color: "#b8ccbc", fontSize: "0.72rem", marginTop: 4 }}>
          © 2026 · Todos os direitos reservados
        </p>
      </footer>
      </div>
    </div>
  );
}

const secLabel = {
  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px",
  textTransform: "uppercase", color: "#0072FF", textAlign: "center", marginBottom: 8,
};

const secTitle = {
  fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 800,
  color: "#0f2918", textAlign: "center", lineHeight: 1.2, marginBottom: 0,
};