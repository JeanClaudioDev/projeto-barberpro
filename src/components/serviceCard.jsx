export default function ServiceCard({service, onSchedule}) {
    return (
        <article className="service-card">
            <div className="service-card-content">
                <h3>{service.name}</h3>
                <p className="service-duration">
                    Duração: {service.duration} min
                </p>

                <p className="service-price">
                    R$ {service.price}
                </p>
            </div>
            <button className="service-schedule-button"
            onClick={() =>onSchedule(service)}>
                Agendar
            </button>
        </article>
    );
}