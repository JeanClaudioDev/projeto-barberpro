import { useNavigate } from "react-router-dom";

import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  // Depois esses dados virão do Firebase.
  const user = {
    name: "",
    email: "",
    phone: "",
    points: 0,
  };

  // Depois os agendamentos virão do banco.
  const appointments = [];

  function handleLogout() {
    // Depois vamos usar:
    // await signOut(auth);

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <main className="profile-page">

      {/* CABEÇALHO */}
      <header className="profile-header">

        <button
          className="profile-back-button"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>

        <div>
          <h1>Meu perfil</h1>

          <p>
            Acompanhe seus dados, agendamentos e pontos.
          </p>
        </div>

      </header>


      <div className="profile-layout">

        {/* COLUNA ESQUERDA */}
        <section className="profile-main">

          {/* DADOS DO CLIENTE */}
          <section className="profile-card">

            <div className="profile-card-header">
              <h2>Dados da conta</h2>
            </div>

            <div className="profile-data">

              <div className="profile-data-item">
                <span>Nome</span>

                <strong>
                  {user.name || "Não informado"}
                </strong>
              </div>

              <div className="profile-data-item">
                <span>E-mail</span>

                <strong>
                  {user.email || "Não informado"}
                </strong>
              </div>

              <div className="profile-data-item">
                <span>Telefone</span>

                <strong>
                  {user.phone || "Não informado"}
                </strong>
              </div>

            </div>

          </section>


          {/* AGENDAMENTOS */}
          <section className="profile-card">

            <div className="profile-card-header">
              <h2>Meus agendamentos</h2>

              <button
                className="new-appointment-button"
                onClick={() => navigate("/services")}
              >
                Novo agendamento
              </button>
            </div>


            {appointments.length === 0 ? (

              <div className="appointments-empty">
                <p>
                  Você ainda não possui agendamentos.
                </p>

                <button
                  onClick={() => navigate("/services")}
                >
                  Agendar agora
                </button>
              </div>

            ) : (

              <div className="appointments-list">

                {appointments.map((appointment) => (

                  <article
                    key={appointment.id}
                    className="appointment-card"
                  >
                    <h3>
                      {appointment.service}
                    </h3>

                    <p>
                      {appointment.professional}
                    </p>

                    <span>
                      {appointment.date} às {appointment.time}
                    </span>
                  </article>

                ))}

              </div>

            )}

          </section>

        </section>


        {/* COLUNA DIREITA */}
        <aside className="profile-sidebar">

          {/* FIDELIDADE */}
          <section className="profile-card loyalty-card">

            <p className="profile-card-label">
              Fidelidade
            </p>

            <div className="loyalty-points">
              <strong>{user.points}</strong>

              <span>/ 8 pontos</span>
            </div>

            <div className="loyalty-progress">
              <div
                className="loyalty-progress-fill"
                style={{
                  width: `${Math.min(
                    (user.points / 8) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            {user.points >= 8 ? (
              <p className="loyalty-message">
                Você possui um corte grátis disponível.
              </p>
            ) : (
              <p className="loyalty-message">
                Faltam {8 - user.points} pontos para
                ganhar um corte grátis.
              </p>
            )}

          </section>


          {/* CONTA */}
          <section className="profile-card">

            <h2>Conta</h2>

            <p className="account-description">
              Você pode sair da sua conta neste dispositivo.
            </p>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Sair
            </button>

          </section>

        </aside>

      </div>

    </main>
  );
}