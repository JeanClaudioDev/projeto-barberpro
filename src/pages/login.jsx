import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase.js";

import "./login.css";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  // Controla se estamos no Login ou Cadastro
  const [mode, setMode] = useState("login");

  // Controla se a senha aparece ou fica escondida
  const [showPassword, setShowPassword] = useState(false);

  // Dados digitados pelo usuário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Guarda as mensagens de erro
  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};

    // Nome e telefone só existem no cadastro
    if (mode === "register") {
      if (name.trim() === "") {
        newErrors.name = "Digite seu nome.";
      }

      if (phone.trim() === "") {
        newErrors.phone = "Digite seu telefone.";
      }
    }

    if (email.trim() === "") {
      newErrors.email = "Digite seu e-mail.";
    } else if (!email.includes("@")) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (password.trim() === "") {
      newErrors.password = "Digite sua senha.";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formIsValid = validateForm();

    if (!formIsValid) {
      return;
    }

    if (mode === "register") {
      try {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        navigate("/home");
      } catch (error) {
        console.log(error);
      }

      return;
    }
  }

  return (
    <main className="login-page">

      {/* LADO ESQUERDO */}
      <section className="login-image">
        <div className="login-overlay"></div>

        <div className="login-brand">
          <h2>BarberPro</h2>
        </div>
      </section>

      {/* LADO DIREITO */}
      <section className="login-form-area">
        <div className="login-content">

          <h1>
            {mode === "login"
              ? "Bem-vindo de volta"
              : "Criar conta"}
          </h1>

          <p className="login-description">
            {mode === "login"
              ? "Entre para acessar sua conta"
              : "Preencha seus dados para começar"}
          </p>

          {/* LOGIN / CADASTRO */}
          <div className="mode-buttons">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Entrar
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Cadastrar
            </button>
          </div>

          {/* GOOGLE */}
          <button type="button" className="google-button">
            <GoogleIcon />
            Continuar com Google
          </button>

          <div className="divider">
            <span></span>
            <p>ou</p>
            <span></span>
          </div>

          <form onSubmit={handleSubmit}>

            {/* SÓ APARECE NO CADASTRO */}
            {mode === "register" && (
              <>
                <div className="form-group">
                  <label>Nome completo</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ana Beatriz"
                  />

                  {errors.name && (
                    <p className="error-message">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Telefone</label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="(85) 99999-9999"
                  />

                  {errors.phone && (
                    <p className="error-message">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* E-MAIL */}
            <div className="form-group">
              <label>E-mail</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exemplo.com"
              />

              {errors.email && (
                <p className="error-message">
                  {errors.email}
                </p>
              )}
            </div>

            {/* SENHA */}
            <div className="form-group">
              <label>Senha</label>

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {errors.password && (
                <p className="error-message">
                  {errors.password}
                </p>
              )}
            </div>

            {mode === "login" && (
              <button
                type="button"
                className="forgot-password"
              >
                Esqueceu a senha?
              </button>
            )}

            <button type="submit" className="submit-button">
              {mode === "login"
                ? "Entrar"
                : "Criar minha conta"}
            </button>

          </form>

          <p className="change-mode">
            {mode === "login"
              ? "Não possui uma conta?"
              : "Já possui uma conta?"}

            <button
              type="button"
              onClick={() =>
                setMode(
                  mode === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {mode === "login"
                ? "Cadastre-se"
                : "Entrar"}
            </button>
          </p>

        </div>
      </section>

    </main>
  );
}