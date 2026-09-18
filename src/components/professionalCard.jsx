export default function ProfessionalCard ({
    professional,
    onSelect,
}) {
    return (
        <article className="professional-card">
            <div className="professional-info">
                <h3>{professional.name}</h3>
                <p>
                    {professional.specialty}
                </p>
            </div>
            <button className="professional-select-button"
            onClick={() => onSelect(professional)}>
                Escolher
            </button>
        </article>
    );
}