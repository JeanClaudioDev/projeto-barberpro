import { useNavigate } from 'react-router'

const quickServices = [
  { name: 'Corte Clássico', icon: '✂️', time: '45 min', price: 'R$ 45' },
  { name: 'Barba Completa', icon: '🪒', time: '30 min', price: 'R$ 35' },
  { name: 'Combo Premium', icon: '⭐', time: '1h 15min', price: 'R$ 75' },
  { name: 'Sobrancelha', icon: '👁️', time: '15 min', price: 'R$ 20' },
]

const recentAppointments = [
  { service: 'Corte Degradê', barber: 'Lucas Mendes', date: '07 Set', time: '11:00' },
  { service: 'Barba Completa', barber: 'Diego Alves', date: '28 Ago', time: '16:00' },
]

function InfoRow({ icon, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>{icon}</span>
      <span style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>{value}</span>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 32, minHeight: '100%', backgroundColor: '#575A5E' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#A7A2A9' }}>Segunda-feira, 15 de Setembro</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", color: '#F4F7F5', fontSize: '1.75rem', lineHeight: 1.2 }}>Olá, Carlos 👋</h1>
        </div>
        <button
          onClick={() => navigate('/scheduling')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Novo agendamento
        </button>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Hero CTA */}
          <div
            onClick={() => navigate('/services')}
            style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 32, cursor: 'pointer', background: 'linear-gradient(135deg, #222823 60%, #3a3d40)' }}
          >
            <img
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&h=440&fit=crop&auto=format"
              alt="Barbearia"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A7A2A9', marginBottom: 8 }}>Barbearia Nobre · Vila Madalena</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", color: '#F4F7F5', fontSize: '1.75rem', lineHeight: 1.2 }}>Reserve seu horário agora</h2>
              <p style={{ fontSize: '0.875rem', marginTop: 4, color: '#A7A2A9' }}>Cortes, barba, tratamentos e muito mais</p>
            </div>
            <div style={{ position: 'absolute', right: 32, bottom: 32, zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, backgroundColor: '#F4F7F5', color: '#222823', fontSize: '0.875rem', fontWeight: 600 }}>
              Ver serviços
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600, color: '#F4F7F5' }}>Serviços populares</h3>
              <button onClick={() => navigate('/services')} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#A7A2A9', background: 'none', cursor: 'pointer' }}>Ver todos →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {quickServices.map((s) => (
                <button key={s.name} onClick={() => navigate('/services')}
                  style={{ backgroundColor: '#222823', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', transition: 'transform 0.15s', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F4F7F5', lineHeight: 1.3 }}>{s.name}</span>
                  <span style={{ fontSize: 10, color: '#A7A2A9' }}>{s.time}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F4F7F5' }}>{s.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <h3 style={{ fontWeight: 600, color: '#F4F7F5', marginBottom: 16 }}>Histórico recente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentAppointments.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 16, padding: 16, backgroundColor: '#222823' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(244,247,245,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A7A2A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F4F7F5' }}>{a.service}</p>
                    <p style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>{a.barber} · {a.date} às {a.time}</p>
                  </div>
                  <span className="badge-done">Concluído</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Next appointment */}
          <div style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: '#222823' }}>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A7A2A9', marginBottom: 16 }}>Próximo agendamento</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(244,247,245,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#A7A2A9' }}>SET</span>
                  <span style={{ fontFamily: "'DM Serif Display', serif", color: '#F4F7F5', fontSize: '1.5rem', lineHeight: 1 }}>14</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#F4F7F5' }}>Corte + Barba</p>
                  <p style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>Rafael Costa · 14:30</p>
                  <p style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>Sábado, 14 de Setembro</p>
                </div>
              </div>
              <button onClick={() => navigate('/confirmation')} className="btn-primary"
                style={{ width: '100%', padding: '10px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 600 }}>
                Ver detalhes
              </button>
            </div>
          </div>

          {/* Barbershop info */}
          <div style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: '#222823' }}>
            <div style={{ position: 'relative', height: 144 }}>
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=288&fit=crop&auto=format" alt="Barbearia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(34,40,35,0.9) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                <p style={{ fontFamily: "'DM Serif Display', serif", color: '#F4F7F5' }}>Barbearia Nobre</p>
                <p style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>Vila Madalena, São Paulo</p>
              </div>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoRow icon="🕐" value="Seg–Sex 9h–20h · Sáb 9h–18h" />
              <InfoRow icon="📍" value="R. Harmonia, 312 · Vila Madalena" />
              <InfoRow icon="💳" value="Pix · Cartão · Dinheiro" />
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {['📸 Instagram', '💬 WhatsApp'].map((s) => (
                  <button key={s} className="btn-ghost" style={{ flex: 1, padding: '8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500 }}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Loyalty */}
          <div style={{ borderRadius: 24, padding: 20, backgroundColor: '#222823' }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A7A2A9', marginBottom: 12 }}>Fidelidade</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", color: '#F4F7F5', fontSize: '2rem', lineHeight: 1 }}>380</p>
              <p style={{ fontSize: '0.75rem', color: '#A7A2A9' }}>/ 500 pts</p>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '76%' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#A7A2A9', marginTop: 8 }}>Faltam 120 pts para barba grátis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
