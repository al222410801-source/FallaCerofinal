import React, {useEffect, useState, useRef} from 'react';

type Props = {
  title?: string;
  fetchItems: (page?: number, limit?: number, q?: string) => Promise<any[]>;
  renderItem?: (item: any) => React.ReactNode;
  onClose: () => void;
  onSelect: (item: any) => void;
};

export default function ModalPicker({ title = 'Seleccionar', fetchItems, renderItem, onClose, onSelect }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const r = await fetchItems(1, 50, q && q.length > 0 ? q : undefined);
        if (!cancelled && mountedRef.current) setItems(r || []);
      } catch (e) { console.error(e); if (!cancelled && mountedRef.current) setItems([]); }
      finally { if (!cancelled && mountedRef.current) setLoading(false); }
    };

    const t = setTimeout(run, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [fetchItems, q]);

  const backdropRef = useRef<HTMLDivElement | null>(null);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div className="modal-backdrop" ref={backdropRef} onMouseDown={onBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <strong>{title}</strong>
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
        </div>
        <div className="modal-body">
          <div className="modal-search">
            <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {loading ? <div className="muted">Cargando...</div> : (
            <ul className="list">
              {items.map((it: any) => (
                <li key={it.id || it.id_denuncia || it.id_evidencia || it.id_ciudadano || it.id_rol || JSON.stringify(it)} className="list-item hoverable" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>{renderItem ? renderItem(it) : JSON.stringify(it)}</div>
                  <div><button className="btn" onClick={() => onSelect(it)}>Seleccionar</button></div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
