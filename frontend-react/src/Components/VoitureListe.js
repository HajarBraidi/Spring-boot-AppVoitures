import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faBullhorn, faCar } from '@fortawesome/free-solid-svg-icons';
import API from '../Api';
import MyToast from './myToast';

const COLOR_MAP = {
  rouge: '#ef4444', red: '#ef4444',
  bleu: '#3b82f6', blue: '#3b82f6',
  blanc: '#e5e7eb', white: '#e5e7eb',
  noir: '#1f2937', black: '#1f2937',
  gris: '#9ca3af', grey: '#9ca3af', gray: '#9ca3af',
  vert: '#22c55e', green: '#22c55e',
  jaune: '#eab308', yellow: '#eab308',
  orange: '#f97316',
  violet: '#a855f7', purple: '#a855f7',
  marron: '#92400e', brown: '#92400e',
};

function ColorDot({ couleur }) {
  const key = couleur?.toLowerCase().trim();
  const bg = COLOR_MAP[key] || '#d1d5db';
  return (
    <span className="badge-couleur">
      <span className="color-dot" style={{ background: bg }} />
      {couleur}
    </span>
  );
}

export default class VoitureListe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voitures: [], show: false, toastType: 'success', toastMsg: '',
      showModal: false, marketing: '', loadingMkt: false, voitureSelectee: null
    };
  }

  componentDidMount() { this.findAllVoitures(); }

  findAllVoitures() {
    API.get('/voitures', { auth: { username: 'admin', password: '1234' } })
      .then(res => this.setState({ voitures: res.data }))
      .catch(err => console.error('Erreur chargement voitures :', err));
  }

  deleteVoiture = (voitureId) => {
    API.delete('/voitures/' + voitureId, { auth: { username: 'admin', password: '1234' } })
      .then(() => {
        this.setState({
          show: true, toastType: 'danger', toastMsg: 'Voiture supprimée avec succès.',
          voitures: this.state.voitures.filter(v => v.id !== voitureId)
        });
        setTimeout(() => this.setState({ show: false }), 3000);
      })
      .catch(err => console.error('Erreur suppression :', err));
  };

  voirMarketing = (voiture) => {
    this.setState({ showModal: true, loadingMkt: true, marketing: '', voitureSelectee: voiture });
    API.get(`/voitures/${voiture.id}/marketing`, { auth: { username: 'admin', password: '1234' } })
      .then(res => this.setState({ marketing: res.data, loadingMkt: false }))
      .catch(() => this.setState({ marketing: 'Erreur lors de la génération.', loadingMkt: false }));
  };

  render() {
    const { voitures, show, toastType, toastMsg, showModal, marketing, loadingMkt, voitureSelectee } = this.state;

    return (
      <div>
        {show && <MyToast children={{ show, message: toastMsg, type: toastType }} />}

        <div className="card-pro">
          <div className="card-pro-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="card-pro-header-icon">
                <FontAwesomeIcon icon={faCar} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <div className="card-pro-header-title">Catalogue des véhicules</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {voitures.length} véhicule{voitures.length !== 1 ? 's' : ''} disponible{voitures.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <Link to="/add" className="btn-pro btn-pro-accent" style={{ fontSize: 13, padding: '8px 16px' }}>
              + Ajouter
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table-pro">
              <thead>
                <tr>
                  <th>Marque / Modèle</th>
                  <th>Couleur</th>
                  <th>Immatricule</th>
                  <th>Année</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {voitures.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-state-icon">🚗</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Aucun véhicule</div>
                        <div style={{ fontSize: 13 }}>Ajoutez votre premier véhicule au catalogue</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  voitures.map(v => (
                    <tr key={v.id}>
                      <td>
                        <span className="badge-marque">{v.marque}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 13 }}>{v.modele}</span>
                      </td>
                      <td><ColorDot couleur={v.couleur} /></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{v.immatricule}</td>
                      <td>{v.annee}</td>
                      <td><span className="badge-prix">{Number(v.prix).toLocaleString()} DH</span></td>
                      <td>
                        <div className="actions-group">
                          <Link to={'/edit/' + v.id} className="btn-pro btn-pro-edit" title="Modifier">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button className="btn-pro btn-pro-danger" onClick={() => this.deleteVoiture(v.id)} title="Supprimer">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button className="btn-pro btn-pro-mkt" onClick={() => this.voirMarketing(v)} title="Annonce IA">
                            <FontAwesomeIcon icon={faBullhorn} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={showModal} onHide={() => this.setState({ showModal: false })} size="lg" className="modal-pro">
          <Modal.Header closeButton style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
            <Modal.Title style={{ fontSize: 16, fontFamily: 'Playfair Display, serif' }}>
              📣 Annonce — {voitureSelectee?.marque} {voitureSelectee?.modele}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'var(--bg)', padding: 24 }}>
            {loadingMkt ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div className="spinner-accent" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>L'IA rédige l'annonce...</p>
              </div>
            ) : (
              <div className="ai-response" style={{ margin: 0 }}>{marketing}</div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--border)', padding: '16px 24px' }}>
            <button className="btn-pro btn-pro-ghost" onClick={() => this.setState({ showModal: false })}>
              Fermer
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
