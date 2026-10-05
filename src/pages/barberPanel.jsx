import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
  runTransaction,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";

import "./barberPanel.css";

export default function BarberPanel() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);

  useEffect(() => {
    async function loadAppointments() {
      if (!user) {
        return;
      }

      try {
        const appointmentsRef = collection(db, "appointments");

        // ATENDIMENTOS MARCADOS
        const markedQuery = query(
          appointmentsRef,
          where("professionalId", "==", user.uid),
          where("status", "==", "marcado")
        );

        // ATENDIMENTOS CONCLUÍDOS
        const completedQuery = query(
          appointmentsRef,
          where("professionalId", "==", user.uid),
          where("status", "==", "concluido")
        );

        const [
          markedSnapshot,
          completedSnapshot,
        ] = await Promise.all([
          getDocs(markedQuery),
          getDocs(completedQuery),
        ]);

        const markedAppointments =
          markedSnapshot.docs.map((appointment) => ({
            id: appointment.id,
            ...appointment.data(),
          }));

        const completed =
          completedSnapshot.docs.map((appointment) => ({
            id: appointment.id,
            ...appointment.data(),
          }));

        setAppointments(markedAppointments);
        setCompletedAppointments(completed);

      } catch (error) {
        console.error(
          "Erro ao buscar agendamentos:",
          error
        );
      }
    }

    loadAppointments();
  }, [user]);

  async function handleCompleteAppointment(appointment) {
    try {
      await runTransaction(db, async (transaction) => {

        const appointmentRef = doc(
          db,
          "appointments",
          appointment.id
        );

        const userRef = doc(
          db,
          "users",
          appointment.userId
        );

        const appointmentSnapshot =
          await transaction.get(appointmentRef);

        const userSnapshot =
          await transaction.get(userRef);

        if (!appointmentSnapshot.exists()) {
          throw new Error(
            "Agendamento não encontrado."
          );
        }

        if (!userSnapshot.exists()) {
          throw new Error(
            "Cliente não encontrado."
          );
        }

        const appointmentData =
          appointmentSnapshot.data();

        const userData =
          userSnapshot.data();

        if (appointmentData.status !== "marcado") {
          throw new Error(
            "Esse atendimento já foi processado."
          );
        }

        const currentPoints =
          userData.points || 0;

        transaction.update(
          appointmentRef,
          {
            status: "concluido",
          }
        );

        transaction.update(
          userRef,
          {
            points: currentPoints + 1,
            lastCompletedAppointmentId:
              appointment.id,
          }
        );
      });

      // Remove dos próximos
      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (item) => item.id !== appointment.id
        )
      );

      // Adiciona aos concluídos
      setCompletedAppointments((currentCompleted) => [
        {
          ...appointment,
          status: "concluido",
        },
        ...currentCompleted,
      ]);

    } catch (error) {
      console.error(
        "Erro ao concluir atendimento:",
        error
      );
    }
  }

  function formatDate(date) {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  return (
    <main className="barber-panel-page">

      <header className="barber-panel-header">
        <h1>Painel do barbeiro</h1>

        <p>
          Gerencie seus atendimentos.
        </p>
      </header>

      {/* PRÓXIMOS ATENDIMENTOS */}

      <section className="barber-section">

        <div className="barber-section-header">
          <h2>Próximos atendimentos</h2>

          <span>
            {appointments.length}
          </span>
        </div>

        {appointments.length === 0 ? (

          <div className="barber-empty">
            <p>
              Você não possui atendimentos marcados.
            </p>
          </div>

        ) : (

          <div className="barber-appointments">

            {appointments.map((appointment) => (

              <article
                key={appointment.id}
                className="barber-appointment-card"
              >

                <h3>
                  {appointment.service.name}
                </h3>

                <p>
                  <strong>Cliente:</strong>{" "}
                  {appointment.clientName}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {formatDate(appointment.date)}
                </p>

                <p>
                  <strong>Horário:</strong>{" "}
                  {appointment.time}
                </p>

                <button
                  onClick={() =>
                    handleCompleteAppointment(
                      appointment
                    )
                  }
                >
                  Concluir atendimento
                </button>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* ATENDIMENTOS CONCLUÍDOS */}

      <section className="barber-section">

        <div className="barber-section-header">
          <h2>Atendimentos concluídos</h2>

          <span>
            {completedAppointments.length}
          </span>
        </div>

        {completedAppointments.length === 0 ? (

          <div className="barber-empty">
            <p>
              Nenhum atendimento concluído ainda.
            </p>
          </div>

        ) : (

          <div className="barber-appointments">

            {completedAppointments.map(
              (appointment) => (

                <article
                  key={appointment.id}
                  className="barber-appointment-card completed"
                >

                  <h3>
                    {appointment.service.name}
                  </h3>

                  <p>
                    <strong>Cliente:</strong>{" "}
                    {appointment.clientName}
                  </p>

                  <p>
                    <strong>Data:</strong>{" "}
                    {formatDate(appointment.date)}
                  </p>

                  <p>
                    <strong>Horário:</strong>{" "}
                    {appointment.time}
                  </p>

                  <span className="completed-label">
                    ✓ Atendimento concluído
                  </span>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}