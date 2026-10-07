import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../services/firebase";
import "./scheduling.css";

function generateTimes(duration) {
  const openingTime = 7 * 60;
  const closingTime = 19 * 60;
  const times = [];

  for (
    let minutes = openingTime;
    minutes <= closingTime - duration;
    minutes += 30
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    times.push(`${formattedHour}:${formattedMinute}`);
  }

  return times;
}

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function generateDates() {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
}

function formatDateButton(date) {
  const weekDay = date.toLocaleDateString("pt-BR", {
    weekday: "short",
  });
  const day = date.getDate();

  return {
    weekDay: weekDay.replace(".", "").toUpperCase(),
    day,
  };
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function Scheduling() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedProfessional = location.state?.professional;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);

  const availableDates = generateDates();

  useEffect(() => {
    async function loadAppointments() {
      if (!selectedProfessional || !date) {
        setAppointments([]);
        return;
      }

      try {
        const appointmentsRef = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsRef,
          where("professionalId", "==", selectedProfessional.id)
        );

        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const professionalAppointments = appointmentsSnapshot.docs
          .map((appointment) => ({
            id: appointment.id,
            ...appointment.data(),
          }))
          .filter(
            (appointment) =>
              appointment.date === date && appointment.status === "marcado"
          );

        setAppointments(professionalAppointments);
      } catch (error) {
        console.error("Erro ao buscar horários ocupados:", error);
      }
    }

    loadAppointments();
  }, [selectedProfessional, date]);

  if (!selectedService || !selectedProfessional) {
    return (
      <main className="scheduling-page">
        <div className="scheduling-warning">
          <h1>Informações incompletas</h1>
          <p>
            Escolha um serviço e um profissional antes de selecionar o horário.
          </p>
          <button onClick={() => navigate("/services")}>
            Voltar para serviços
          </button>
        </div>
      </main>
    );
  }

  const availableTimes = generateTimes(selectedService.duration);

  function isTimeOccupied(startTime) {
    const newStart = timeToMinutes(startTime);

    return appointments.some((appointment) => {
      const appointmentStart = timeToMinutes(appointment.time);
      const appointmentDuration = appointment.service.duration;

      const blockedDuration = Math.ceil(appointmentDuration / 30) * 30;
      const appointmentEnd = appointmentStart + blockedDuration;

      return newStart >= appointmentStart && newStart < appointmentEnd;
    });
  }

  function handleContinue() {
    if (!date || !time || isTimeOccupied(time)) {
      return;
    }

    navigate("/confirmation", {
      state: {
        service: selectedService,
        professional: selectedProfessional,
        date: date,
        time: time,
      },
    });
  }

  return (
    <main className="scheduling-page">
      {/* =========================
          CABEÇALHO
      ========================= */}
      <header className="scheduling-header">
        <div className="scheduling-title">
          <span className="scheduling-eyebrow">PASSO 3 DE 4</span>
          <h1>Agendamento</h1>
          <p>Escolha a data e o horário para o seu atendimento.</p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/professionals", {
              state: {
                service: selectedService,
              },
            })
          }
        >
          Voltar
        </button>
      </header>

      {/* =========================
          RESUMO
      ========================= */}
      <section className="scheduling-summary">
        <div className="summary-item">
          <span>Serviço</span>
          <strong>{selectedService.name}</strong>
          <p>
            {selectedService.duration} min · R${" "}
            {selectedService.price.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="summary-item">
          <span>Profissional</span>
          <strong>{selectedProfessional.name}</strong>
          <p>{selectedProfessional.specialty}</p>
        </div>
      </section>

      {/* =========================
          CONTEÚDO (DATA E HORÁRIO)
      ========================= */}
      <section className="scheduling-content">
        {/* SEÇÃO DE DATA */}
        <div className="date-section">
          <div className="scheduling-section-heading">
            <span>01</span>
            <div>
              <h2>Escolha a data</h2>
              <p>Selecione o dia do seu atendimento</p>
            </div>
          </div>

          <div className="date-grid">
            {availableDates.map((dateItem) => {
              const formattedDate = formatDateButton(dateItem);
              const dateValue = formatDateValue(dateItem);

              return (
                <button
                  key={dateValue}
                  type="button"
                  className={
                    date === dateValue ? "date-button selected" : "date-button"
                  }
                  onClick={() => {
                    setDate(dateValue);
                    setTime("");
                  }}
                >
                  <span>{formattedDate.weekDay}</span>
                  <strong>{formattedDate.day}</strong>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEÇÃO DE HORÁRIO */}
        <div className="time-section">
          <div className="scheduling-section-heading">
            <span>02</span>
            <div>
              <h2>Escolha o horário</h2>
              <p>Horários disponíveis para a data selecionada</p>
            </div>
          </div>

          {!date ? (
            <div className="time-message">
              <p>Primeiro escolha uma data no painel ao lado.</p>
            </div>
          ) : (
            <div className="time-grid">
              {availableTimes.map((availableTime) => {
                const occupied = isTimeOccupied(availableTime);

                return (
                  <button
                    key={availableTime}
                    type="button"
                    disabled={occupied}
                    className={
                      occupied
                        ? "time-button occupied"
                        : time === availableTime
                        ? "time-button selected"
                        : "time-button"
                    }
                    onClick={() => {
                      if (!occupied) {
                        setTime(availableTime);
                      }
                    }}
                  >
                    {availableTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          RODAPÉ FIXO DE CONFIRMAÇÃO
      ========================= */}
      <footer className="scheduling-footer">
        <div className="selected-time-summary">
          <span>Horário Selecionado</span>
          <strong>
            {date && time
              ? `${formatDateDisplay(date)} às ${time}`
              : "Nenhum horário selecionado"}
          </strong>
        </div>

        <button
          className="continue-button"
          disabled={!date || !time}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </footer>
    </main>
  );
}