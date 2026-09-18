import {useLocation, useNavigate} from "react-router-dom";

import professionals from "../data/professionals.js";
import ProfessionalCard from "../components/professionalCard.jsx";

import "./professionals.css"

export default function Professionals() {
    const navigate = useNavigate();
    const location = useLocation();

    const selectedService = location.state?.service;

    function handleSelectProfessional(professional) {
        navigate("/scheduling", {
            state: {
                service: selectedService,
                professional: professional,
            },
        });
    }
    if (!selectedService){
        return (
            <main className="professionals-page">
                <div className="professional-warning">
                    <h1>Nenhum serviço selecionado</h1>
                    <p>
                        Escolha um serviço antes de selecionar um profissional
                    </p>
                    <button onClick={() => navigate("/services")}>
                        Ver serviços
                    </button>
                </div>
            </main>
        );
    }
    return (
        <main className="professionals-page">
            <header className="professionals-header">
                <button className="back-button"
                onClick={() => navigate("/services")}>
                    Voltar
                </button>
                <div>
                    <h1>Escolha o profissional</h1>
                    <p>Selecione quem realizará seu atendimento</p>
                </div>
            </header>

            <section className="selected-service">
                <div>
                    <p className="selected-service-label">
                        Serviço selecionado
                    </p>
                    <h2>{selectedService.name}</h2>
                </div>
                <div className="selected-service-details">
                    <span>
                        {selectedService.duration} min
                    </span>
                    <strong>
                        R$ {selectedService.price.toFixed(2).replace(".",",")}
                    </strong>
                </div>
            </section>

            <section className="professionals-list">
                {professionals.length === 0? (
                    <div className="professionals-empty">
                        <p>
                            Nenhum profissional cadastrado.
                        </p>
                    </div>
                ) : (
                    professionals.map((professional) =>
                    <ProfessionalCard
                    key={professional.id}
                    professional={professional}
                    onSelect={handleSelectProfessional}/>)
                )
                    }
            </section>
        </main>
    )
}