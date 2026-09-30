import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useAuth } from "../context/AuthContext";
import { auth, db } from "../services/firebase";

import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [profile, setProfile] = useState(null)
    useEffect(() => {
    async function loadProfile() {
      if (!user) {
        return;
      }

      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    }

    loadProfile();
  }, [user]);

  const appointments = 
  JSON.parse(localStorage.getItem("appointments")) || [];

  async function handleLogout() {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }
  function formatDate(date) {
    const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
  }
  function handleCancelAppointment(id) {
    const appointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return {
          ...appointment,
          status: "cancelado",
        };
      }

      return appointment;
    });

    localStorage.setItem(
      "appointments",
      JSON.stringify(updatedAppointments)
    );

    window.location.reload();
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
                  {profile?.name || "Não informado"}
                </strong>
              </div>

              <div className="profile-data-item">
                <span>E-mail</span>

                <strong>
                  {profile?.email || "Não informado"}
                </strong>
              </div>

              <div className="profile-data-item">
                <span>Telefone</span>

                <strong>
                  {profile?.phone || "Não informado"}
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
                      {appointment.service.name}
                    </h3>

                    <p>
                      {appointment.professional.name}
                    </p>

                    <span>
                      {formatDate(appointment.date)}
                      {" às "}
                      {appointment.time}
                    </span>
                    {appointment.status === "marcado" && (
                      <button className="cancel-button"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancelar
                      </button>
                    )}
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
              <strong>{profile?.points || 0}</strong>

              <span>/ 8 pontos</span>
            </div>

            <div className="loyalty-progress">
              <div
                className="loyalty-progress-fill"
                style={{
                  width: `${Math.min(
                    ((profile?.points || 0 ) / 8) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            {(profile?.points || 0) >= 8 ? (
              <p className="loyalty-message">
                Você possui um corte grátis disponível.
              </p>
            ) : (
              <p className="loyalty-message">
                Faltam {8 - (profile?.points || 0)} pontos para
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