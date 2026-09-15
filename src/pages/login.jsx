import { useState } from "react";
import { useNavigate } from "react-router";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#A7A2A9" }}>{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:border-white"
        style={{ borderColor: "rgba(167,162,169,0.2)", backgroundColor: "rgba(34,40,35,0.6)", color: "#F4F7F5" }}
      />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  
  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  return (
    <div className="flex h-full min-h-screen" style={{ backgroundColor: "#575A5E" }}>
      {/* Painel Esquerdo — Branding / Foto */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden p-12">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=900&fit=crop&auto=format"
          alt="Barbearia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(34,40,35,0.85) 0%, rgba(87,90,94,0.5) 100%)" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F4F7F5" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#222823" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#222823" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", color: "#F4F7F5", fontSize: "1.2rem" }}>Barbearia Nobre</span>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#A7A2A9" }}>Desde 2012</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", color: "#F4F7F5", fontSize: "2.5rem", lineHeight: 1.15 }}>
            O melhor corte<br />começa aqui.
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "#A7A2A9", maxWidth: "360px" }}>
            Agende seu horário com os melhores barbeiros de Vila Madalena. Rápido, simples e sem complicação.
          </p>

          <div className="flex items-center gap-6 mt-8">
            {[["1.2k+", "Clientes"], ["4.9★", "Avaliação"], ["3", "Barbeiros"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "#F4F7F5" }}>{val}</p>
                <p className="text-xs" style={{ color: "#A7A2A9" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel Direito — Formulário */}
      <div
        className="flex flex-col justify-center w-full lg:w-auto lg:min-w-[480px] px-8 py-12"
        style={{ backgroundColor: "#222823" }}
      >
        <div className="w-full max-w-sm mx-auto">
          <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#F4F7F5", fontSize: "1.8rem", lineHeight: 1.2 }}>
            {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="text-sm mt-1 mb-8" style={{ color: "#A7A2A9" }}>
            {mode === "login" ? "Entre para acessar seu painel" : "Preencha seus dados para começar"}
          </p>

          {/* Alternador de Modo */}
          <div className="flex rounded-xl p-1 mb-7" style={{ backgroundColor: "rgba(244,247,245,0.06)" }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: mode === m ? "#F4F7F5" : "transparent", color: mode === m ? "#222823" : "#A7A2A9" }}>
                {m === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {/* Botão Google */}
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium mb-5 transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(244,247,245,0.08)", color: "#F4F7F5", border: "1px solid rgba(167,162,169,0.15)" }}>
            <GoogleIcon /> Continuar com Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(167,162,169,0.15)" }} />
            <span className="text-xs" style={{ color: "#A7A2A9" }}>ou</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(167,162,169,0.15)" }} />
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); navigate("/"); }}>
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome completo" type="text" value={form.name} onChange={update("name")} placeholder="Ana Beatriz" />
                <Field label="Telefone" type="tel" value={form.phone} onChange={update("phone")} placeholder="(11) 9 0000-0000" />
              </div>
            )}
            <Field label="E-mail" type="email" value={form.email} onChange={update("email")} placeholder="ana@email.com" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "#A7A2A9" }}>Senha</label>
              <div className="flex items-center rounded-xl border px-4" style={{ borderColor: "rgba(167,162,169,0.2)", backgroundColor: "rgba(34,40,35,0.6)" }}>
                <input 
                  type={showPw ? "text" : "password"} 
                  value={form.password} 
                  onChange={update("password")} 
                  placeholder="••••••••"
                  className="flex-1 py-3 bg-transparent text-sm outline-none" 
                  style={{ color: "#F4F7F5" }} 
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="ml-2 opacity-50 hover:opacity-80" style={{ color: "#A7A2A9" }}>
                  {showPw
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right -mt-1">
                <button type="button" className="text-xs hover:underline" style={{ color: "#A7A2A9" }}>Esqueceu a senha?</button>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold mt-1 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              style={{ backgroundColor: "#F4F7F5", color: "#222823" }}>
              {mode === "login" ? "Entrar" : "Criar minha conta"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: "#A7A2A9" }}>
            {mode === "login" ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold underline underline-offset-2 cursor-pointer" style={{ color: "#F4F7F5" }}>
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}