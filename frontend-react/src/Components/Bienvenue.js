import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../Api';

export default function Bienvenue() {
  const [count, setCount] = useState('—');

  useEffect(() => {
    API.get('/voitures', { auth: { username: 'admin', password: '1234' } })
      .then(res => setCount(res.data.length))
      .catch(() => setCount('—'));
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-badge">✦ Concession Premium</div>

      <h1 className="hero-title">
        Trouvez la voiture<br />de vos rêves
      </h1>

      <p className="hero-subtitle">
        Notre catalogue vous offre une sélection soigneusement choisie de véhicules.
        L'intelligence artificielle vous aide à trouver le véhicule parfait selon vos critères.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
        <Link to="/list" className="btn-pro btn-pro-primary">
          Voir le catalogue →
        </Link>
      </div>

      <div className="hero-stats">
        <div>
          <div className="hero-stat-number">{count}</div>
          <div className="hero-stat-label">Véhicules en stock</div>
        </div>
        <div>
          <div className="hero-stat-number">IA</div>
          <div className="hero-stat-label">Assistant intégré</div>
        </div>
        <div>
          <div className="hero-stat-number">100%</div>
          <div className="hero-stat-label">Satisfait ou remboursé</div>
        </div>
      </div>
    </div>
  );
}
