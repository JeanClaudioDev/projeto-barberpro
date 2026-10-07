import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";

import "./barberPanel.css";

export default function BarberPanel() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [appointments, setAppointments] =
    useState([]);

  const [completedAppointments, setCompletedAppointments] =
    useState([]);

  useEffect(() => {
    async function loadAppointments() {
      if (!user) {
        return;
      }

      try {
        const appointmentsRef =
          collection(db, "appointments");

        const markedQuery = query(
          appointmentsRef,
          where(
            "professionalId",
            "==",
            user.uid
          ),
          where(
            "status",
            "==",
            "marcado"
          )
        );

        const completedQuery = query(
          appointmentsRef,
          where(
            "professionalId",
            "==",
            user.uid
          ),
          where(
            "status",
            "==",
            "concluido"
          )
        );

        const [
          markedSnapshot,
          completedSnapshot,
        ] = await Promise.all([
          getDocs(markedQuery),
          getDocs(completedQuery),
        ]);

        const markedAppointments =
          markedSnapshot.docs.map(
            (appointment) => ({
              id: appointment.id,
              ...appointment.data(),
            })
          );

        const completed =
          completedSnapshot.docs.map(
            (appointment) => ({
              id: appointment.id,
              ...appointment.data(),
            })
          );

        setAppointments(
          markedAppointments
        );

        setCompletedAppointments(
          completed
        );

      } catch (error) {
        console.error(
          "Erro ao buscar agendamentos:",
          error
        );
      }
    }

    loadAppointments();
  }, [user]);


  async function handleCompleteAppointment(
    appointment
  ) {
    try {
      await runTransaction(
        db,
        async (transaction) => {

          const appointmentRef =
            doc(
              db,
              "appointments",
              appointment.id
            );

          const userRef =
            doc(
              db,
              "users",
              appointment.userId
            );

          const appointmentSnapshot =
            await transaction.get(
              appointmentRef
            );

          const userSnapshot =
            await transaction.get(
              userRef
            );

          if (
            !appointmentSnapshot.exists()
          ) {
            throw new Error(
              "Agendamento não encontrado."
            );
          }

          if (
            !userSnapshot.exists()
          ) {
            throw new Error(
              "Cliente não encontrado."
            );
          }

          const appointmentData =
            appointmentSnapshot.data();

          const userData =
            userSnapshot.data();

          if (
            appointmentData.status !==
            "marcado"
          ) {
            throw new Error(
              "Esse atendimento já foi processado."
            );
          }

          const currentPoints =
            Number(
              userData.points || 0
            );

          transaction.update(
            appointmentRef,
            {
              status: "concluido",
            }
          );

          transaction.update(
            userRef,
            {
              points:
                currentPoints + 1,

              lastCompletedAppointmentId:
                appointment.id,
            }
          );
        }
      );

      setAppointments(
        (currentAppointments) =>
          currentAppointments.filter(
            (item) =>
              item.id !== appointment.id
          )
      );

      setCompletedAppointments(
        (currentCompleted) => [
          {
            ...appointment,
            status: "concluido",
          },
          ...currentCompleted,
        ]
      );

    } catch (error) {
      console.error(
        "Erro ao concluir atendimento:",
        error
      );
    }
  }


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


  return (
    <main className="barber-panel-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="barber-panel-header">

        <div className="barber-brand">

          <div>
            <p className="barber-logo">
              BarberPro
            </p>

            <span>
              Painel do barbeiro
            </span>
          </div>

        </div>

        <div className="barber-header-actions">

          <span className="barber-user-name">
            {user?.displayName ||
              user?.email?.split("@")[0] ||
              "Barbeiro"}
          </span>

          <button
            className="barber-logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>

        </div>

      </header>


      {/* =========================
          CONTEÚDO
      ========================= */}

      <div className="barber-panel-container">

        <section className="barber-welcome">

          <span className="barber-eyebrow">
            ÁREA PROFISSIONAL
          </span>

          <h1>
            Seus atendimentos
          </h1>

          <p>
            Gerencie os horários marcados
            e registre os atendimentos concluídos.
          </p>

        </section>


        {/* =========================
            PRÓXIMOS
        ========================= */}

        <section className="barber-section">

          <div className="barber-section-header">

            <div>
              <span>
                AGENDA
              </span>

              <h2>
                Próximos atendimentos
              </h2>
            </div>

            <strong>
              {appointments.length}
            </strong>

          </div>


          {appointments.length === 0 ? (

            <div className="barber-empty">

              <div className="barber-empty-icon">
                ✓
              </div>

              <div>
                <strong>
                  Agenda livre
                </strong>

                <p>
                  Você não possui
                  atendimentos marcados.
                </p>
              </div>

            </div>

          ) : (

            <div className="barber-appointments">

              {appointments.map(
                (appointment) => (

                  <article
                    key={appointment.id}
                    className="barber-appointment-card"
                  >

                    <div className="barber-card-top">

                      <div>
                        <span className="barber-card-label">
                          SERVIÇO
                        </span>

                        <h3>
                          {appointment.service.name}
                        </h3>
                      </div>

                      <span className="appointment-status-badge">
                        Marcado
                      </span>

                    </div>


                    <div className="barber-appointment-info">

                      <div>
                        <span>
                          Cliente
                        </span>

                        <strong>
                          {appointment.clientName}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Data
                        </span>

                        <strong>
                          {formatDate(
                            appointment.date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Horário
                        </span>

                        <strong>
                          {appointment.time}
                        </strong>
                      </div>

                    </div>


                    <button
                      className="complete-button"
                      onClick={() =>
                        handleCompleteAppointment(
                          appointment
                        )
                      }
                    >
                      Concluir atendimento
                    </button>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* =========================
            CONCLUÍDOS
        ========================= */}

        <section className="barber-section">

          <div className="barber-section-header">

            <div>
              <span>
                HISTÓRICO
              </span>

              <h2>
                Atendimentos concluídos
              </h2>
            </div>

            <strong>
              {completedAppointments.length}
            </strong>

          </div>


          {completedAppointments.length === 0 ? (

            <div className="barber-empty">

              <div className="barber-empty-icon">
                —
              </div>

              <div>
                <strong>
                  Nenhum atendimento concluído
                </strong>

                <p>
                  Os atendimentos finalizados
                  aparecerão aqui.
                </p>
              </div>

            </div>

          ) : (

            <div className="barber-appointments">

              {completedAppointments.map(
                (appointment) => (

                  <article
                    key={appointment.id}
                    className="barber-appointment-card completed"
                  >

                    <div className="barber-card-top">

                      <div>
                        <span className="barber-card-label">
                          SERVIÇO
                        </span>

                        <h3>
                          {appointment.service.name}
                        </h3>
                      </div>

                      <span className="completed-badge">
                        Concluído
                      </span>

                    </div>


                    <div className="barber-appointment-info">

                      <div>
                        <span>
                          Cliente
                        </span>

                        <strong>
                          {appointment.clientName}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Data
                        </span>

                        <strong>
                          {formatDate(
                            appointment.date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Horário
                        </span>

                        <strong>
                          {appointment.time}
                        </strong>
                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </div>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="barber-panel-footer">

        <div>
          <strong>
            BarberPro
          </strong>

          <span>
            Painel profissional
          </span>
        </div>

        <span>
          © 2026 BarberPro
        </span>

      </footer>

    </main>
  );
}