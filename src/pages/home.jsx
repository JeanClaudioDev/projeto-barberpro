import { useNavigate } from "react-router-dom";
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

            <div className="empty-card">
              <p>
                Os serviços da barbearia aparecerão aqui.
              </p>
            </div>
          </section>


          {/* AGENDAMENTOS */}
          <section className="home-section">
            <div className="section-header">
              <h2>Meus agendamentos</h2>
            </div>

            <div className="empty-card">
              <p>
                Você ainda não possui agendamentos.
              </p>
            </div>
          </section>

        </section>


        {/* COLUNA LATERAL */}
        <aside className="home-sidebar">

          {/* PRÓXIMO AGENDAMENTO */}
          <section className="side-card">
            <h3>Próximo agendamento</h3>

            <p className="secondary-text">
              Quando houver um agendamento,
              as informações aparecerão aqui.
            </p>
          </section>


          {/* INFORMAÇÕES */}
          <section className="side-card">
            <h3>Informações</h3>

            <div className="info-list">

              <InfoItem
                title="Localização"
                text="A definir"
              />

              <InfoItem
                title="Horários de atendimento"
                text="07:00 às 19:00"
              />

              <InfoItem
                title="Formas de pagamento"
                text="A definir"
              />

              <InfoItem
                title="Redes sociais"
                text="A definir"
              />

              <InfoItem
                title="Contato"
                text="A definir"
              />

            </div>
          </section>


          {/* FIDELIDADE */}
          <section className="side-card">
            <h3>Fidelidade</h3>

            <p className="secondary-text">
              Acompanhe seus pontos e resgate recompensas.
            </p>

            <button className="secondary-button">
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