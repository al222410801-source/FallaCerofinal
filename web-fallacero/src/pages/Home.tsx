import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LaplacePanel from '../components/LaplacePanel';
import CapibaraSparkles from '../components/CapibaraSparkles';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <main className="full-panel">
      <div className="hero-panel container">
        <div className="hero-split">
          <div className="hero-left">
            <div className="hero-intro">
              <h1 className="hero-title">FallaCero — Misión, Visión y Objetivo</h1>
              <p className="hero-lead">Plataforma para reportar, gestionar y dar seguimiento a fallas e incidencias, optimizando tiempos de respuesta y la colaboración entre ciudadanos y autoridades.</p>
              <div className="hero-ctas">
                <Link to="/denuncia/new" className="btn primary">Reportar Denuncia</Link>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16,marginTop:18}}>
              <div className="info-card animate-card" style={{'--delay': '0.12s'} as React.CSSProperties}>
                <h3>Misión</h3>
                <p className="muted">Facilitar la detección y gestión temprana de fallas mediante herramientas colaborativas que optimizan la respuesta y el mantenimiento de infraestructuras públicas.</p>
              </div>

              <div className="info-card animate-card" style={{'--delay': '0.24s'} as React.CSSProperties}>
                <h3>Visión</h3>
                <p className="muted">Ser la plataforma de referencia para gestión predictiva de mantenimiento a nivel local, promoviendo seguridad, eficiencia y transparencia.</p>
              </div>

              <div className="info-card animate-card" style={{'--delay': '0.36s'} as React.CSSProperties}>
                <h3>Objetivo</h3>
                <p className="muted">Reducir tiempos de atención y resolución de incidencias integrando datos, notificaciones y flujos de trabajo claros para responsables y ciudadanos.</p>
              </div>
            </div>


            <div style={{marginTop:8}}>
              <LaplacePanel />
            </div>
          </div>

          <div className="hero-right">
            <div className="capibara-wrap">
              {/* sparkles behind the image */}
              <CapibaraSparkles count={14} />
              <img className="hero-art animate-art" src="/capibara.png" alt="Capibara" />
              <div className="capy-caption"> </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
