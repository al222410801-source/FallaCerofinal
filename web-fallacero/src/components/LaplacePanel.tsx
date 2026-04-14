import React, {useState, useEffect} from 'react';
import { getDenunciasPrediction } from '../graphql/denuncia';

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function LaplacePanel() {
  const [factor] = useState(0.5);
  const [serie, setSerie] = useState<number[] | null>(null);
  const [labels, setLabels] = useState<string[] | null>(null);
  const [predResult, setPredResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const meses = 8;
        const resp = await getDenunciasPrediction(meses);
        if (!mounted) return;
        setPredResult(resp);
        // backend returns series (oldest->newest) and labels
        setSerie(resp.series || []);
        setLabels(resp.labels || []);
      } catch (err: any) {
        console.error('laplace fetch', err);
        if (mounted) setError(String(err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [factor]);

  const data = serie && serie.length ? serie : [120, 98, 110, 130, 125, 140, 150, 160];
  const result = predResult || { prediccion: 0, alpha: 0, confianza_pct: 0, mes_predicho: '' };
  const renderData = [...(data || []), result.prediccion];

  // SVG layout
  const w = 260; const h = 90; const padX = 20; const padY = 20;
  const max = Math.max(...renderData, 1);
  const min = Math.min(...renderData, 0);
  const stepX = w / Math.max(1, renderData.length - 1);
  const pointsArr = renderData.map((v: number, i: number) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (v - min) / (max - min || 1)) * h;
    return {x, y, v, i};
  });
  const points = pointsArr.map(p => `${p.x},${p.y}`).join(' ');
  const pathD = pointsArr.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="card">
      <h3>Laplace — Predicción</h3>
      {loading ? <p className="muted">Cargando datos...</p> : null}
      {error ? <p style={{color:'var(--destructive)'}}>Error: {error}</p> : null}

      <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
            <strong>Predicción:</strong>
            <span style={{fontSize:20}}>{result.prediccion}</span>
          </div>
          <div style={{marginTop:8}}>
            <small className="muted">Predicción basada en registros</small>
          </div>
        </div>

        <div style={{flex:'0 0 320px'}}>
          <div className="muted">Predicción mensual</div>
          <div style={{marginTop:8}}>
            <svg width="100%" height={140} viewBox="0 0 300 140" preserveAspectRatio="xMinYMin">
              <rect x="0" y="0" width="300" height="140" fill="var(--chart-bg)" />
              <g>
                {Array.from({length: 4}).map((_, gi) => {
                  const gy = padY + (gi / 4) * h;
                  return <line key={`g-${gi}`} x1={padX} x2={padX + w} y1={gy} y2={gy} stroke="var(--chart-grid)" strokeWidth={0.6} />;
                })}

                <line x1={padX} x2={padX} y1={padY} y2={padY + h} stroke="var(--chart-grid)" strokeWidth={1} />
                <line x1={padX} x2={padX + w} y1={padY + h} y2={padY + h} stroke="var(--chart-grid)" strokeWidth={1} />

                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--accent-2)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                />

                <path d={pathD} fill="none" stroke="var(--accent-2)" strokeWidth={8} strokeLinejoin="round" strokeOpacity={0.12} opacity={0.6} />

                {pointsArr.map((p: any, idx: number) => (
                  <circle key={idx} cx={p.x} cy={p.y} r={idx === pointsArr.length -1 ? 5 : 4} fill={'var(--accent-2)'} />
                ))}
              </g>
            </svg>
            <div style={{display:'flex',justifyContent:'space-between',padding:'6px 8px'}}>
              {(labels || []).map((lab: string, i: number) => (
                <div key={i} style={{fontSize:11,color:'var(--muted)'}}>{lab.slice(5)}</div>
              ))}
              <div style={{fontSize:11,color:'var(--muted)'}}>P</div>
            </div>
          </div>
          <div style={{marginTop:6,fontSize:12,color:'var(--muted)'}}>Mes predicho: { result.mes_predicho || ((labels && labels[labels.length-1]) || '') } — Valor: {result.prediccion}</div>
        </div>
      </div>
    </div>
  );
}
