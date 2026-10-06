import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  collection,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";

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
  const [useFreeCut, setUseFreeCut] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setProfile(userSnapshot.data());
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
    if (!user || loading) {
      return;
    }

    setLoading(true);

    try {
      const appointmentRef = doc(
        collection(db, "appointments")
      );

      const userRef = doc(db, "users", user.uid);

      await runTransaction(db, async (transaction) => {
        const userSnapshot =
          await transaction.get(userRef);

        if (!userSnapshot.exists()) {
          throw new Error("Perfil do cliente não encontrado.");
        }

        const userData = userSnapshot.data();

        const currentFreeCuts =
          userData.freeCuts || 0;

        if (useFreeCut && currentFreeCuts <= 0) {
          throw new Error(
            "Você não possui um corte grátis disponível."
          );
        }

        const newAppointment = {
          userId: user.uid,
          clientName: userData.name || user.email,
          service: selectedService,
          professional: selectedProfessional,
          professionalId: selectedProfessional.id,
          date: selectedDate,
          time: selectedTime,
          status: "marcado",
          paymentType: useFreeCut
            ? "corte_gratis"
            : "normal",
        };

        transaction.set(
          appointmentRef,
          newAppointment
        );

        if (useFreeCut) {
          transaction.update(userRef, {
            freeCuts: currentFreeCuts - 1,
          });
        }
      });

      console.log("Agendamento salvo com sucesso.");

      setConfirmed(true);
    } catch (error) {
      console.error(
        "Erro ao salvar agendamento:",
        error
      );
    } finally {
      setLoading(false);
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

  const freeCuts = profile?.freeCuts || 0;

  const finalPrice = useFreeCut
    ? 0
    : selectedService.price;

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

            {useFreeCut && (
              <span>
                Corte grátis utilizado
              </span>
            )}
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
            R$ {finalPrice
              .toFixed(2)
              .replace(".", ",")}
          </strong>

        </div>

      </section>

      {freeCuts > 0 && (
        <section className="free-cut-option">

          <label className="free-cut-checkbox">

            <input
              type="checkbox"
              checked={useFreeCut}
              onChange={(event) =>
                setUseFreeCut(
                  event.target.checked
                )
              }
            />

            <span>
              Usar corte grátis
            </span>

          </label>

          <p>
            Você possui{" "}
            <strong>{freeCuts}</strong>{" "}
            corte(s) grátis disponível(is).
          </p>

        </section>
      )}

      <section className="confirmation-actions">

        <button
          className="edit-button"
          onClick={handleEdit}
          disabled={loading}
        >
          Editar
        </button>

        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading
            ? "Confirmando..."
            : "Confirmar agendamento"}
        </button>

      </section>

    </main>
  );
}