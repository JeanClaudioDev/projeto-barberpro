import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  collection,
  deleteDoc,
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

// ==========================================
// UTILITÁRIOS DE FORMATAÇÃO
// ==========================================
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPrice(price) {
  return currencyFormatter.format(Number(price) || 0);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function parseAppointmentTimestamp(appointment) {
  if (!appointment?.date || !appointment?.time) return 0;
  return new Date(`${appointment.date}T${appointment.time}:00`).getTime();
}

function getStatusInfo(status) {
  switch (status) {
    case "marcado":
      return { label: "Agendado", className: "status-marked" };
    case "concluido":
      return { label: "Concluído", className: "status-completed" };
    case "cancelado":
      return { label: "Cancelado", className: "status-cancelled" };
    default:
      return { label: "Status desconhecido", className: "" };
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Fechar modais ao pressionar a tecla "Esc"
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setAppointmentToCancel(null);
        setAppointmentToDelete(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ==========================================
  // CARREGAR DADOS (PERFIL + AGENDAMENTOS)
  // ==========================================
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);

      try {
        const profileRef = doc(db, "users", user.uid);
        const appointmentsRef = collection(db, "appointments");
        const appointmentsQuery = query(appointmentsRef, where("userId", "==", user.uid));

        const [profileSnapshot, appointmentsSnapshot] = await Promise.all([
          getDoc(profileRef),
          getDocs(appointmentsQuery),
        ]);

        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        }

        const userAppointments = appointmentsSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setAppointments(userAppointments);
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // ==========================================
  // AÇÕES
  // ==========================================
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }, [navigate]);

  async function handleCancelAppointment() {
    if (!appointmentToCancel || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const appointmentRef = doc(db, "appointments", appointmentToCancel.id);
      await updateDoc(appointmentRef, { status: "cancelado" });

      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentToCancel.id ? { ...item, status: "cancelado" } : item
        )
      );
      setAppointmentToCancel(null);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAppointment() {
    if (!appointmentToDelete || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const appointmentRef = doc(db, "appointments", appointmentToDelete.id);
      await deleteDoc(appointmentRef);

      setAppointments((current) =>
        current.filter((item) => item.id !== appointmentToDelete.id)
      );
      setAppointmentToDelete(null);
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRedeemFreeCut() {
    if (!user || !profile || isSubmitting) return;

    const currentPoints = profile.points || 0;
    const currentFreeCuts = profile.freeCuts || 0;

    if (currentPoints < 8) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const newPoints = currentPoints - 8;
      const newFreeCuts = currentFreeCuts + 1;

      await updateDoc(userRef, {
        points: newPoints,
        freeCuts: newFreeCuts,
      });

      setProfile((prev) => ({
        ...prev,
        points: newPoints,
        freeCuts: newFreeCuts,
      }));
    } catch (error) {
      console.error("Erro ao resgatar corte grátis:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==========================================
  // MEMOIZAÇÃO DE LISTAS E CÁLCULOS
  // ==========================================
  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((app) => app.status === "marcado")
      .sort((a, b) => parseAppointmentTimestamp(a) - parseAppointmentTimestamp(b));
  }, [appointments]);

  const historyAppointments = useMemo(() => {
    return appointments
      .filter((app) => app.status === "concluido" || app.status === "cancelado")
      .sort((a, b) => parseAppointmentTimestamp(b) - parseAppointmentTimestamp(a));
  }, [appointments]);

  const points = profile?.points || 0;
  const freeCuts = profile?.freeCuts || 0;
  const progressPercentage = Math.min((points / 8) * 100, 100);

  if (loading) {
    return (
      <main className="profile-page profile-loading">
        <div className="spinner" />
        <p>Carregando perfil...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {/* HEADER */}
      <header className="profile-header">
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>

        <div>
          <h1>Meu perfil</h1>
          <p>Acompanhe seus dados, agendamentos e pontos.</p>
        </div>
      </header>

      <div className="profile-layout">
        {/* COLUNA PRINCIPAL */}
        <section className="profile-main">
          {/* DADOS DA CONTA */}
          <section className="profile-card">
            <div className="profile-card-header">
              <h2>Dados da conta</h2>
            </div>

            <div className="profile-data">
              <div className="profile-data-item">
                <span>Nome</span>
                <strong>{profile?.name || "Não informado"}</strong>
              </div>

              <div className="profile-data-item">
                <span>E-mail</span>
                <strong>{profile?.email || "Não informado"}</strong>
              </div>

              <div className="profile-data-item">
                <span>Telefone</span>
                <strong>{profile?.phone || "Não informado"}</strong>
              </div>
            </div>
          </section>

          {/* PRÓXIMOS AGENDAMENTOS */}
          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>Próximos agendamentos</h2>
                <p className="section-description">Seus próximos atendimentos.</p>
              </div>

              <button
                type="button"
                className="new-appointment-button"
                onClick={() => navigate("/services")}
              >
                Novo agendamento
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="appointments-empty">
                <p>Você não possui próximos agendamentos.</p>
                <button type="button" onClick={() => navigate("/services")}>
                  Agendar agora
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCardItem
                    key={appointment.id}
                    appointment={appointment}
                    onAction={() => setAppointmentToCancel(appointment)}
                    actionLabel="Cancelar"
                    actionClass="cancel-button"
                  />
                ))}
              </div>
            )}
          </section>

          {/* HISTÓRICO */}
          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>Histórico</h2>
                <p className="section-description">Atendimentos concluídos e cancelados.</p>
              </div>
            </div>

            {historyAppointments.length === 0 ? (
              <div className="appointments-empty history-empty">
                <p>Seu histórico aparecerá aqui.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {historyAppointments.map((appointment) => (
                  <AppointmentCardItem
                    key={appointment.id}
                    appointment={appointment}
                    isHistory
                    onAction={() => setAppointmentToDelete(appointment)}
                    actionLabel="Remover do histórico"
                    actionClass="delete-history-button"
                  />
                ))}
              </div>
            )}
          </section>
        </section>

        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          {/* FIDELIDADE */}
          <section className="profile-card loyalty-card">
            <p className="profile-card-label">Fidelidade</p>

            <div className="loyalty-points">
              <strong>{points}</strong>
              <span>/ 8 pontos</span>
            </div>

            <div className="loyalty-progress" role="progressbar" aria-valuenow={points} aria-valuemin={0} aria-valuemax={8}>
              <div
                className="loyalty-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {points >= 8 ? (
              <div className="loyalty-redeem">
                <p className="loyalty-message">
                  Você possui pontos suficientes para resgatar um corte grátis.
                </p>

                <p className="free-cuts-count">
                  Cortes grátis disponíveis: <strong>{freeCuts}</strong>
                </p>

                <button
                  type="button"
                  className="redeem-button"
                  onClick={handleRedeemFreeCut}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resgatando..." : "Resgatar corte grátis"}
                </button>
              </div>
            ) : (
              <p className="loyalty-message">
                Faltam {8 - points} pontos para ganhar um corte grátis.
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
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </section>
        </aside>
      </div>

      {/* MODAL CANCELAR */}
      {appointmentToCancel && (
        <ModalConfirmation
          title="Cancelar agendamento?"
          message={
            <>
              Tem certeza que deseja cancelar seu atendimento de{" "}
              <strong>{appointmentToCancel.service?.name}</strong>?
            </>
          }
          details={
            <>
              <span>{formatDate(appointmentToCancel.date)}</span>
              <span>às {appointmentToCancel.time}</span>
            </>
          }
          confirmLabel={isSubmitting ? "Cancelando..." : "Sim, cancelar"}
          onConfirm={handleCancelAppointment}
          onClose={() => setAppointmentToCancel(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* MODAL DELETAR */}
      {appointmentToDelete && (
        <ModalConfirmation
          title="Remover do histórico?"
          message="Esse atendimento será removido permanentemente do seu histórico."
          details={
            <>
              <strong>{appointmentToDelete.service?.name}</strong>
              <span>{formatDate(appointmentToDelete.date)}</span>
            </>
          }
          confirmLabel={isSubmitting ? "Removendo..." : "Sim, remover"}
          onConfirm={handleDeleteAppointment}
          onClose={() => setAppointmentToDelete(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
}

// ==========================================
// SUB-COMPONENTES AUXILIARES
// ==========================================
function AppointmentCardItem({ appointment, isHistory = false, onAction, actionLabel, actionClass }) {
  const statusInfo = getStatusInfo(appointment.status);
  const isFreeCut = appointment.paymentType === "corte_gratis";

  return (
    <article className={`appointment-card ${isHistory ? "history-card" : ""}`}>
      <div className="appointment-card-top">
        <div className="appointment-info">
          <h3>{appointment.service?.name || "Serviço"}</h3>
          <p>{appointment.professional?.name || "Profissional"}</p>
          <span>
            {formatDate(appointment.date)} às {appointment.time}
          </span>

          {isFreeCut ? (
            <strong className={isHistory ? "free-cut-history" : "appointment-price"}>
              {isHistory ? "Corte grátis utilizado" : "Corte grátis"}
            </strong>
          ) : (
            <strong className="appointment-price">
              {formatPrice(appointment.service?.price)}
            </strong>
          )}
        </div>

        <span className={`appointment-status ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <button type="button" className={actionClass} onClick={onAction}>
        {actionLabel}
      </button>
    </article>
  );
}

function ModalConfirmation({ title, message, details, confirmLabel, onConfirm, onClose, isSubmitting }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">!</div>
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-details">{details}</div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-secondary-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Voltar
          </button>
          <button
            type="button"
            className="modal-danger-button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}