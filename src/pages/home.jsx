import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import services from "../data/services.js";

import "./home.css";

function InfoItem({ title, text }) {
  return (
    <div className="info-item">
      <p className="info-title">{title}</p>
      <p className="info-text">{text}</p>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setProfileName(userData.name || "");
        }

        const appointmentsRef = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsRef,
          where("userId", "==", user.uid)
        );

        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const userAppointments = appointmentsSnapshot.docs.map(
          (appointment) => ({
            id: appointment.id,
            ...appointment.data(),
          })
        );

        setAppointments(userAppointments);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      }
    }

    loadHomeData();
  }, [user]);

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((appointment) => {
      if (appointment.status !== "marcado") return false;
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}`
      );
      return appointmentDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

  const nextAppointment = upcomingAppointments[0];

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  const displayName =
    profileName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "cliente";

  return (
    <div className="home-page">
      {/* =========================
          HEADER
      ========================= */}
      <header className="home-header">
        <div className="home-container home-header-inner">
          <div className="home-header-info">
            <span className="home-logo">BarberPro</span>
            <h1>Olá, {displayName} 👋</h1>
            <p className="home-subtitle">Agendamentos simples e rápidos</p>
          </div>

          <button
            className="home-profile-button"
            onClick={() => navigate("/profile")}
          >
            Meu Perfil
          </button>
        </div>
      </header>

      {/* =========================
          CONTEÚDO PRINCIPAL
      ========================= */}
      <main className="home-main-wrapper">
        <div className="home-container home-layout">
          {/* COLUNA ESQUERDA (MAIN) */}
          <div className="home-main">
            {/* HERO CARD */}
            <article className="hero-card">
              <div className="hero-content">
                <span className="hero-small-text">BARBERPRO</span>
                <h2>Hora de cuidar do visual?</h2>
                <p>
                  Escolha um serviço, profissional, data e horário disponível.
                </p>
                <button
                  className="light-button"
                  onClick={() => navigate("/services")}
                >
                  Agendar Atendimento
                </button>
              </div>
            </article>

            {/* SERVIÇOS */}
            <section className="home-section">
              <div className="section-header">
                <h2>Serviços em Destaque</h2>
                <button
                  className="text-button"
                  onClick={() => navigate("/services")}
                >
                  Ver todos
                </button>
              </div>

              <div className="home-services-list">
                {services.slice(0, 4).map((service) => (
                  <article key={service.id} className="home-service-card">
                    <div>
                      <span className="home-service-category">
                        {service.category}
                      </span>
                      <h3>{service.name}</h3>
                      <p>{service.duration} min</p>
                    </div>

                    <div>
                      <strong>
                        R${" "}
                        {service.price.toFixed(2).replace(".", ",")}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* MEU AGENDAMENTO */}
            <section className="home-section">
              <div className="section-header">
                <h2>Meu Agendamento</h2>
              </div>

              {!nextAppointment ? (
                <div className="empty-card">
                  <div>
                    <strong>Nenhum agendamento futuro</strong>
                    <p style={{ margin: "4px 0 0" }}>
                      Você ainda não possui um horário marcado.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="home-appointment-card">
                  <div>
                    <span className="home-service-category">
                      PRÓXIMO HORÁRIO
                    </span>
                    <strong>{nextAppointment.service?.name}</strong>
                    <p>{nextAppointment.professional?.name}</p>
                    <span>
                      {formatDate(nextAppointment.date)} às {nextAppointment.time}
                    </span>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigate("/profile")}
                  >
                    Ver detalhes →
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* COLUNA DIREITA (SIDEBAR) */}
          <aside className="home-sidebar">
            <section className="side-card">
              <h3>Próximo Agendamento</h3>
              {nextAppointment ? (
                <div className="next-appointment">
                  <strong>{nextAppointment.service?.name}</strong>
                  <p>Profissional: {nextAppointment.professional?.name}</p>
                  <span>
                    {formatDate(nextAppointment.date)} às {nextAppointment.time}
                  </span>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("/profile")}
                  >
                    Ver agendamento
                  </button>
                </div>
              ) : (
                <div>
                  <p className="secondary-text">
                    Nenhum horário marcado no momento.
                  </p>
                  <button
                    className="secondary-button"
                    onClick={() => navigate("/services")}
                  >
                    Agendar agora
                  </button>
                </div>
              )}
            </section>

            <section className="side-card">
              <h3>Informações</h3>
              <div className="info-list">
                <InfoItem
                  title="Localização"
                  text="Av. Santos Dumont, 1500 · Aldeota"
                />
                <InfoItem
                  title="Horários"
                  text="Segunda a sábado · 07:00 às 19:00"
                />
                <InfoItem
                  title="Pagamento"
                  text="Pix, crédito e débito"
                />
                <InfoItem
                  title="Contato"
                  text="(85) 99999-0000"
                />
              </div>
            </section>

            <section className="side-card">
              <h3>Programa de Fidelidade</h3>
              <p className="secondary-text">
                Acumule pontos a cada atendimento e conquiste cortes grátis.
              </p>
              <button
                className="secondary-button"
                onClick={() => navigate("/profile")}
              >
                Ver meus pontos
              </button>
            </section>
          </aside>
        </div>
      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <div>
            <p>BarberPro</p>
            <span>Agendamentos simples e rápidos.</span>
          </div>
          <span>© 2026 BarberPro</span>
        </div>
      </footer>
    </div>
  );
}