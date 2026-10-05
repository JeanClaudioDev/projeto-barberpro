import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
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

  const [appointments,setAppointments] = useState([])

  useEffect(() => {
  async function loadAppointments() {
    if (!user) {
      return;
    }

    try {
      const appointmentsRef = collection(db, "appointments");

      const appointmentsQuery = query(
        appointmentsRef,
        where("userId", "==", user.uid)
      );

      const appointmentsSnapshot = await getDocs(
        appointmentsQuery
      );

      const userAppointments = appointmentsSnapshot.docs.map(
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

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((appointment) => {
      if (appointment.status !== "marcado") {
        return false;
      }

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

  function formatDate(date){
    const[year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }


  return (
    <main className="home-page">

      {/* CABEÇALHO */}
      <header className="home-header">
        <div>
        <button
          className="primary-button"
          onClick={() => navigate("/profile")}
        >
          Meu perfil
        </button>
          <p className="home-logo">BarberPro</p>

          <h1>Olá 👋</h1>

          <p className="home-subtitle">
            Encontre um serviço e agende seu próximo horário.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/services")}
        >
          Novo agendamento
        </button>
      </header>


      <div className="home-layout">

        {/* CONTEÚDO PRINCIPAL */}
        <section className="home-main">

          {/* CHAMADA PRINCIPAL */}
          <article className="hero-card">
            <div className="hero-content">
              <p className="hero-small-text">
                Agendamento rápido e simples
              </p>

              <h2>
                Hora de cuidar do visual?
              </h2>

              <p>
                Escolha um serviço, profissional,
                data e horário disponível.
              </p>

              <button
                className="light-button"
                onClick={() => navigate("/services")}
              >
                Ver serviços
              </button>
            </div>
          </article>


          {/* SERVIÇOS */}
          <section className="home-section">
            <div className="section-header">
              <h2>Serviços</h2>

              <button
                className="text-button"
                onClick={() => navigate("/services")}
              >
                Ver todos
              </button>
            </div>

            <div className="home-services-list">
              {services.slice(0, 4).map((service) => (
                <article
                  key={service.id}
                  className="home-service-card"
                >
                  <div>
                    <span className="home-service-category">
                      {service.category}
                    </span>

                    <h3>{service.name}</h3>

                    <p>
                      {service.duration} min
                    </p>
                  </div>

                  <strong>
                    R$ {service.price.toFixed(2).replace(".", ",")}
                  </strong>
                </article>
              ))}
            </div>
          </section>


          {/* AGENDAMENTOS */}
          <section className="home-section">
            <div className="section-header">
              <h2>Meus agendamentos</h2>
            </div>

          {upcomingAppointments.length === 0 ? (
            <div className="empty-card">
              <p>
                Você ainda não possui agendamentos.
              </p>
            </div>
          ) : (
            <div className="home-appointment-card">

              <div>
                <strong>
                  {nextAppointment.service.name}
                </strong>

                <p>
                  {nextAppointment.professional.name}
                </p>

                <span>
                  {formatDate(nextAppointment.date)}
                  {" às "}
                  {nextAppointment.time}
                </span>
              </div>

              <button
                className="text-button"
                onClick={() => navigate("/profile")}
              >
                Ver agendamentos
              </button>

            </div>
          )}
          </section>

        </section>


        {/* COLUNA LATERAL */}
        <aside className="home-sidebar">

          <section className="side-card">
          <h3>Próximo agendamento</h3>

          {nextAppointment ? (
            <div className="next-appointment">

              <strong>
                {nextAppointment.service.name}
              </strong>

              <p>
                Profissional:{" "}
                {nextAppointment.professional.name}
              </p>

              <span>
                {formatDate(nextAppointment.date)}
                {" às "}
                {nextAppointment.time}
              </span>

            </div>
          ) : (
            <p className="secondary-text">
              Você ainda não possui agendamentos.
            </p>
          )}
        </section>

          {/* INFORMAÇÕES */}
          <section className="side-card">
            <h3>Informações</h3>

            <div className="info-list">

            <InfoItem
              title="Localização"
              text="Av. Santos Dumont, 1500 · Aldeota"
            />

            <InfoItem
              title="Horários de atendimento"
              text="Segunda a sábado · 07:00 às 19:00"
            />

            <InfoItem
              title="Formas de pagamento"
              text="Pix, cartão de crédito e débito"
            />

            <InfoItem
              title="Redes sociais"
              text="@barberpro"
            />

            <InfoItem
              title="Contato"
              text="(85) 99999-0000"
            />

            </div>
          </section>


          {/* FIDELIDADE */}
          <section className="side-card">
            <h3>Fidelidade</h3>

            <p className="secondary-text">
              Acompanhe seus pontos e resgate recompensas.
            </p>

            <button className="secondary-button"
            onClick={() => navigate("/profile")}>
              Ver meus pontos
            </button>
          </section>

        </aside>

      </div>
      <footer className="home-footer">
        <p>BarberPro</p>

        <span>
          Agendamentos simples e rápidos.
        </span>
      </footer>

    </main>
  );
}