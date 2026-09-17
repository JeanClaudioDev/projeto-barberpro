import { useState } from "react";
import { useNavigate } from "react-router-dom";

import services from "../data/services.js";
import ServiceCard from "../components/serviceCard.jsx";

import "./services.css";

export default function Services(){
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [priceFilter, setPriceFilter] = useState("all");
    const filteredServices = services.filter((service) => {
        const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory =
        categoryFilter === "all" ||
        service.category === categoryFilter;

        let matchesPrice = "true"

        if (priceFilter === "low"){
            matchesPrice = service.price <=50;
        }
        if (priceFilter === "high") {
            matchesPrice = service.price >50;
        }
        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice
        );
    });
    function handleSchedule(service) {
        console.log ("Serviço escolhi:", service);
        navigate("/professionals", {
            state: {
                service: service,
            },
        })
    }
    return (
        <main className="services-page">
            <header className="services-header">
                <button className="back-button"
                onClick={() => navigate("/home")}>
                    Voltar
                </button>
                <div>
                    <h1>Serviços</h1>

                    <p>Escolha o serviço que deseja agendar.</p>
                </div>
            </header>
            <section className="services-filters">
                <input type="text" placeholder="Pesquisar Serviço" value={search}
                onChange={(event) => setSearch(event.target.value)}/>
                <select
                value={categoryFilter}
                onChange={(event) =>
                    setCategoryFilter(event.target.value)
                }
                >
                    <option value="all">
                        Todas as categorias
                    </option>

                    <option value="Cabelo">
                        Cabelo
                    </option>

                    <option value="Barba">
                        Barba
                    </option>

                    <option value="Química capilar ou coloração">
                        Química capilar ou coloração
                    </option>

                    <option value="Sobrancelha">
                        Sobrancelha
                    </option>
                </select>
                <select
                    value={priceFilter}
                    onChange={(event)=>
                    setPriceFilter(event.target.value)}>
                    <option value="all">
                        Todos os preços
                    </option>
                    <option value="low">
                        Até R$ 50,00
                    </option>
                    <option value="high">
                        Acima de R$ 50,00
                    </option>
                </select>
            </section>

            <section className="services-list">
                {filteredServices.length === 0 ? (
                    <div className="services-empty">
                        <p>Nenhum serviço cadastrado</p>
                    </div>
                ): (
                    filteredServices.map((service) => (
                        <ServiceCard
                        key={service.id}
                        service={service}
                        onSchedule={handleSchedule}/>
                    ))
                )}
            </section>
        </main>
    )
}