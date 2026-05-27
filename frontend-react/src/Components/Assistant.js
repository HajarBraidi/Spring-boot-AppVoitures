import React, { useState, useEffect } from 'react';
import API from '../Api';

export default function AssistantCar() {
  const [question,       setQuestion]       = useState('');
  const [reponse,        setReponse]        = useState('');
  const [loadingConseil, setLoadingConseil] = useState(false);
  const [voitures,       setVoitures]       = useState([]);
  const [selectedId,     setSelectedId]     = useState('');
  const [marketing,      setMarketing]      = useState('');
  const [loadingMkt,     setLoadingMkt]     = useState(false);
  const [erreur,         setErreur]         = useState('');

  useEffect(() => {
    API.get('/voitures', { auth: { username: 'admin', password: '1234' } })
      .then(res => setVoitures(res.data))
      .catch(() => setErreur('Impossible de charger la liste des voitures.'));
  }, []);

  const poserQuestion = () => {
    if (!question.trim()) return;
    setLoadingConseil(true); setReponse(''); setErreur('');
    API.post('/voitures/assistant', question, {
      headers: { 'Content-Type': 'text/plain' },
      auth: { username: 'admin', password: '1234' }
    })
      .then(res => { setReponse(res.data); setLoadingConseil(false); })
      .catch(err => { setErreur("L'assistant n'a pas pu répondre. Vérifiez qu'Ollama tourne."); setLoadingConseil(false); });
  };

  const genererMarketing = () => {
    if (!selectedId) return;
    setLoadingMkt(true); setMarketing(''); setErreur('');
    API.get(`/voitures/${selectedId}/marketing`, { auth: { username: 'admin', password: '1234' } })
      .then(res => { setMarketing(res.data); setLoadingMkt(false); })
      .catch(() => { setErreur('Impossible de générer la description marketing.'); setLoadingMkt(false); });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {erreur && (
        <div style={{ padding: '14px 18px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: 14 }}>
          ⚠ {erreur}
        </div>
      )}

      {/* ── Conseiller IA ── */}
      <div className="card-pro">
        <div className="card-pro-header">
          <div className="card-pro-header-icon">🤖</div>
          <div>
            <div className="card-pro-header-title">Conseiller Automobile IA</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Décrivez vos critères, l'IA vous recommande depuis notre stock
            </div>
          </div>
        </div>

        <div className="card-pro-body">
          <div className="ai-input-wrapper">
            <input
              type="text"
              className="form-control-pro"
              placeholder="Ex : Je cherche une voiture rouge, budget 100 000 DH..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && poserQuestion()}
            />
            <button
              className="btn-pro btn-pro-primary"
              onClick={poserQuestion}
              disabled={loadingConseil || !question.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loadingConseil
                ? <><span className="spinner-accent" style={{ width: 14, height: 14 }} /> Analyse...</>
                : '💬 Demander'
              }
            </button>
          </div>

          {reponse && (
            <div className="ai-response">
              <div className="ai-response-label">✦ Recommandation de l'IA</div>
              {reponse}
            </div>
          )}
        </div>
      </div>

      {/* ── Générateur Marketing ── */}
      <div className="card-pro">
        <div className="card-pro-header">
          <div className="card-pro-header-icon">📣</div>
          <div>
            <div className="card-pro-header-title">Générateur d'Annonce Marketing</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Sélectionnez un véhicule, l'IA rédige une annonce professionnelle
            </div>
          </div>
        </div>

        <div className="card-pro-body">
          <div className="ai-input-wrapper">
            <select
              className="select-pro"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">— Sélectionner un véhicule —</option>
              {voitures.map(v => (
                <option key={v.id} value={v.id}>
                  {v.marque} {v.modele} · {v.couleur} · {v.annee} · {Number(v.prix).toLocaleString()} DH
                </option>
              ))}
            </select>
            <button
              className="btn-pro btn-pro-accent"
              onClick={genererMarketing}
              disabled={loadingMkt || !selectedId}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loadingMkt
                ? <><span className="spinner-accent" style={{ width: 14, height: 14 }} /> Génération...</>
                : '✨ Générer'
              }
            </button>
          </div>

          {marketing && (
            <div className="ai-response">
              <div className="ai-response-label">✦ Annonce publicitaire</div>
              {marketing}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
