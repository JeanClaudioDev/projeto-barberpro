import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./scheduling.css";

function generateTimes(duration) {
  const openingTime = 7 * 60;
  const closingTime = 19 * 60;

  const times = [];

  for (
    let minutes = openingTime;
    minutes <= closingTime - duration;
    minutes += 15
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    times.push(`${formattedHour}:${formattedMinute}`);
  }

  return times;
}

export default function Scheduling() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service;
  const selectedProfessional = location.state?.professional;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!selectedService || !selectedProfessional) {
    return (
      <main className="scheduling-page">
        <div className="scheduling-warning">
          <h1>Informações incompletas</h1>

          <p>
            Escolha um serviço e um profissional antes
            de selecionar o horário.
          </p>

          <button onClick={() => navigate("/services")}>
            Voltar para serviços
          </button>
        </div>
      </main>
    );
  }
  const availableTimes = generateTimes(
    selectedService.duration
  );

  function handleContinue() {
    if (date === "" || time === "") {
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

      <header className="scheduling-header">

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

        <div>
          <h1>Agendamento</h1>

          <p>
            Escolha a data e o horário do atendimento.
          </p>
        </div>

      </header>
      <section className="scheduling-summary">

        <div className="summary-item">
          <span>Serviço</span>

          <strong>
            {selectedService.name}
          </strong>

          <p>
            {selectedService.duration} min · R${" "}
            {selectedService.price
              .toFixed(2)
              .replace(".", ",")}
          </p>
        </div>
        <div className="summary-item">
          <span>Profissional</span>
          <strong>
            {selectedProfessional.name}
          </strong>
          <p>
            {selectedProfessional.specialty}
          </p>
        </div>
      </section>
      <section className="scheduling-content">

        <div className="date-section">
          <h2>Escolha a data</h2>

          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setTime("");
            }}
          />
        </div>


        <div className="time-section">
          <h2>Escolha o horário</h2>

          {!date ? (
            <div className="time-message">
              <p>
                Primeiro escolha uma data.
              </p>
            </div>
          ) : (
            <div className="time-grid">

              {availableTimes.map((availableTime) => (
                <button
                  key={availableTime}
                  type="button"
                  className={
                    time === availableTime
                      ? "time-button selected"
                      : "time-button"
                  }
                  onClick={() =>
                    setTime(availableTime)
                  }
                >
                  {availableTime}
                </button>
              ))}

            </div>
          )}
        </div>

      </section>


      <div className="scheduling-footer">

        <button
          className="continue-button" disabled={!date || !time}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </main>
  );
}