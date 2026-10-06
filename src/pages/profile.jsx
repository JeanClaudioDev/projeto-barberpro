import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useAuth } from "../context/AuthContext";
import { auth, db } from "../services/firebase";

import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // BUSCAR DADOS DO PERFIL
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        return;
      }

      try {
        const profileRef = doc(db, "users", user.uid);

        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        }
      } catch (error) {
        console.error(
          "Erro ao buscar perfil:",
          error
        );
      }
    }

    loadProfile();
  }, [user]);

  // BUSCAR AGENDAMENTOS
  useEffect(() => {
    async function loadAppointments() {
      if (!user) {
        return;
      }

      try {
        const appointmentsRef = collection(
          db,
          "appointments"
        );

        const appointmentsQuery = query(
          appointmentsRef,
          where("userId", "==", user.uid)
        );

        const appointmentsSnapshot = await getDocs(
          appointmentsQuery
        );

        const userAppointments =
          appointmentsSnapshot.docs.map(
            (appointment) => ({
              id: appointment.id,
              ...appointment.data(),
            })
          );

        setAppointments(userAppointments);
      } catch (error) {
        console.error(
          "Erro ao buscar agendamentos:",
          error
        );
      }
    }

    loadAppointments();
  }, [user]);

  async function handleLogout() {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error
      );
    }
  }

  function formatDate(date) {
    const [year, month, day] =
      date.split("-");

    return `${day}/${month}/${year}`;
  }

  async function handleCancelAppointment(id) {
    try {
      const appointmentRef = doc(
        db,
        "appointments",
        id
      );

      await updateDoc(appointmentRef, {
        status: "cancelado",
      });

      // Mantém o agendamento no histórico,
      // apenas altera o status.
      setAppointments(
        (currentAppointments) =>
          currentAppointments.map(
            (appointment) =>
              appointment.id === id
                ? {
                    ...appointment,
                    status: "cancelado",
                  }
                : appointment
          )
      );
    } catch (error) {
      console.error(
        "Erro ao cancelar agendamento:",
        error
      );
    }
  }

  function getStatusInfo(status) {
    if (status === "marcado") {
      return {
        label: "Agendado",
        className: "status-marked",
      };
    }

    if (status === "concluido") {
      return {
        label: "Concluído",
        className: "status-completed",
      };
    }

    if (status === "cancelado") {
      return {
        label: "Cancelado",
        className: "status-cancelled",
      };
    }

    return {
      label: "Status desconhecido",
      className: "",
    };
  }
    async function handleRedeemFreeCut() {
      if (!user || !profile) return;

      const currentPoints = profile.points || 0;
      const currentFreeCuts = profile.freeCuts || 0;

      if (currentPoints < 8) return;

      try {
        const userRef = doc(db, "users", user.uid);

        const newPoints = currentPoints - 8;
        const newFreeCuts = currentFreeCuts + 1;

        await updateDoc(userRef, {
          points: newPoints,
          freeCuts: newFreeCuts,
        });

        setProfile((currentProfile) => ({
          ...currentProfile,
          points: newPoints,
          freeCuts: newFreeCuts,
        }));
      } catch (error) {
        console.error(
          "Erro ao resgatar corte grátis:",
          error
        );
      }
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

                {appointments.map(
                  (appointment) => {

                    const statusInfo =
                      getStatusInfo(
                        appointment.status
                      );

                    return (
                      <article
                        key={appointment.id}
                        className="appointment-card"
                      >
                        <div className="appointment-card-top">

                          <div>
                            <h3>
                              {appointment.service.name}
                            </h3>

                            <p>
                              {appointment.professional.name}
                            </p>

                            <span>
                              {formatDate(
                                appointment.date
                              )}
                              {" às "}
                              {appointment.time}
                            </span>
                          </div>

                          <span
                            className={`appointment-status ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>

                        </div>

                        {appointment.status ===
                          "marcado" && (
                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleCancelAppointment(
                                appointment.id
                              )
                            }
                          >
                            Cancelar
                          </button>
                        )}

                      </article>
                    );
                  }
                )}

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

              <strong>
                {profile?.points || 0}
              </strong>

              <span>
                / 8 pontos
              </span>

            </div>

            <div className="loyalty-progress">

              <div
                className="loyalty-progress-fill"
                style={{
                  width: `${Math.min(
                    ((profile?.points || 0) / 8) * 100,
                    100
                  )}%`,
                }}
              />

            </div>

            {(profile?.points || 0) >= 8 ? (

            <div className="loyalty-redeem">

              <p className="loyalty-message">
                Você possui um corte grátis disponível.
              </p>

              <p className="free-cuts-count">
                Cortes grátis disponíveis:{" "}
                <strong>{profile?.freeCuts || 0}</strong>
              </p>

              <button
                className="redeem-button"
                onClick={handleRedeemFreeCut}
              >
                Resgatar corte grátis
              </button>

            </div>

            ) : (

              <p className="loyalty-message">
                Faltam{" "}
                {8 - (profile?.points || 0)}
                {" "}pontos para ganhar um corte grátis.
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