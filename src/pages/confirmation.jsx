import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { addDoc, collection } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";

import "./confirmation.css";

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const selectedService = location.state?.service;
  const selectedProfessional = location.state?.professional;
  const selectedDate = location.state?.date;
  const selectedTime = location.state?.time;

  const [confirmed, setConfirmed] = useState(false);

  if (
    !selectedService ||
    !selectedProfessional ||
    !selectedDate ||
    !selectedTime
  ) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-warning">
          <h1>Agendamento incompleto</h1>

          <p>
            Algumas informações estão faltando.
            Inicie o agendamento novamente.
          </p>

          <button onClick={() => navigate("/services")}>
            Ver serviços
          </button>
        </div>
      </main>
    );
  }

    function formatDate(date) {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
    }

  async function handleConfirm() {
    if (!user) {
      return;
    }

    try {
      const newAppointment = {
        userId: user.uid,
        service: selectedService,
        professional: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
        status: "marcado",
      };

      await addDoc(
        collection(db, "appointments"),
        newAppointment
      );

      console.log("Agendamento salvo", newAppointment);

      setConfirmed(true);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  }
  function handleEdit() {
    navigate("/scheduling", {
      state: {
        service: selectedService,
        professional: selectedProfessional,
      },
    });
  }

  if (confirmed) {
    return (
      <main className="confirmation-page">

        <section className="confirmation-success">
          <div className="success-icon">
            ✓
          </div>

          <h1>Agendamento confirmado!</h1>

          <p>
            Seu horário foi confirmado com sucesso.
          </p>

          <div className="success-summary">
            <strong>{selectedService.name}</strong>

            <span>
              {selectedProfessional.name}
            </span>

            <span>
              {formatDate(selectedDate)} às {selectedTime}
            </span>
          </div>

          <button
            className="home-button"
            onClick={() => navigate("/home")}
          >
            Voltar para Home
          </button>
        </section>

      </main>
    );
  }

  return (
    <main className="confirmation-page">

      <header className="confirmation-header">

        <button
          className="back-button"
          onClick={handleEdit}
        >
          Voltar
        </button>

        <div>
          <h1>Confirmar agendamento</h1>

          <p>
            Confira as informações antes de confirmar.
          </p>
        </div>

      </header>


      <section className="confirmation-card">

        <div className="confirmation-item">

          <span>Serviço</span>

          <strong>
            {selectedService.name}
          </strong>

          <p>
            {selectedService.duration} min
          </p>

        </div>


        <div className="confirmation-item">

          <span>Profissional</span>

          <strong>
            {selectedProfessional.name}
          </strong>

          <p>
            {selectedProfessional.specialty}
          </p>

        </div>


        <div className="confirmation-item">

          <span>Data</span>

          <strong>
            {formatDate(selectedDate)}
          </strong>

        </div>


        <div className="confirmation-item">

          <span>Horário</span>

          <strong>
            {selectedTime}
          </strong>

        </div>


        <div className="confirmation-price">

          <span>Valor</span>

          <strong>
            R$ {selectedService.price
              .toFixed(2)
              .replace(".", ",")}
          </strong>

        </div>

      </section>


      <section className="confirmation-actions">

        <button
          className="edit-button"
          onClick={handleEdit}
        >
          Editar
        </button>

        <button
          className="confirm-button"
          onClick={handleConfirm}
        >
          Confirmar agendamento
        </button>

      </section>

    </main>
  );
}