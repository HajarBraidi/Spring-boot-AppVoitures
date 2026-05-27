import React, { Component } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faCar } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';

function VoitureWrapper(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  return <VoitureClass {...props} voitureId={id} navigate={navigate} />;
}

class VoitureClass extends Component {
  initialState = {
    id: '', marque: '', modele: '', couleur: '',
    immatricule: '', prix: '', annee: '', show: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.voitureChange = this.voitureChange.bind(this);
    this.submitVoiture = this.submitVoiture.bind(this);
  }

  componentDidMount() {
    const { voitureId } = this.props;
    if (voitureId) {
      axios.get("http://localhost:8085/api/voitures/" + voitureId, {
        auth: { username: 'admin', password: '1234' }
      }).then(response => {
        this.setState({
          id: response.data.id,
          marque: response.data.marque,
          modele: response.data.modele,
          couleur: response.data.couleur,
          immatricule: response.data.immatricule,
          annee: response.data.annee,
          prix: response.data.prix
        });
      }).catch(error => console.error("Erreur chargement voiture :", error));
    }
  }

  voitureChange = event => this.setState({ [event.target.name]: event.target.value });
  resetVoiture  = () => this.setState(this.initialState);

  submitVoiture = event => {
    event.preventDefault();
    const voiture = {
      id: this.state.id, marque: this.state.marque, modele: this.state.modele,
      couleur: this.state.couleur, immatricule: this.state.immatricule,
      annee: this.state.annee, prix: this.state.prix
    };

    const auth = { auth: { username: 'admin', password: '1234' } };
    const req = voiture.id
      ? axios.put("http://localhost:8085/api/voitures/" + voiture.id, voiture, auth)
      : axios.post("http://localhost:8085/api/voitures", voiture, auth);

    req.then(response => {
      if (response.data != null) {
        this.setState({ show: true });
        setTimeout(() => { this.setState({ show: false }); this.props.navigate('/list'); }, 1500);
      }
    });
  };

  render() {
    const { marque, modele, couleur, immatricule, prix, annee } = this.state;
    const isEdit = !!this.state.id;

    const Field = ({ label, name, value, type = 'text', placeholder }) => (
      <div style={{ marginBottom: 20 }}>
        <label className="form-label-pro">{label}</label>
        <input
          required name={name} type={type} value={value}
          autoComplete="off" onChange={this.voitureChange}
          className="form-control-pro" placeholder={placeholder}
        />
      </div>
    );

    return (
      <div>
        {this.state.show && (
          <MyToast children={{ show: true, message: 'Voiture enregistrée avec succès.', type: 'success' }} />
        )}

        <div className="card-pro" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="card-pro-header">
            <div className="card-pro-header-icon">
              <FontAwesomeIcon icon={faCar} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div className="card-pro-header-title">
                {isEdit ? 'Modifier la voiture' : 'Ajouter une voiture'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {isEdit ? 'Modifiez les informations du véhicule' : 'Renseignez les informations du nouveau véhicule'}
              </div>
            </div>
          </div>

          <form onReset={this.resetVoiture} onSubmit={this.submitVoiture}>
            <div className="card-pro-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="Marque"       name="marque"      value={marque}      placeholder="ex: Toyota" />
                <Field label="Modèle"       name="modele"      value={modele}      placeholder="ex: Camry" />
                <Field label="Couleur"      name="couleur"     value={couleur}     placeholder="ex: Blanc" />
                <Field label="Immatricule"  name="immatricule" value={immatricule} placeholder="ex: A-12345-B" />
                <Field label="Prix (DH)"    name="prix"        value={prix}        type="number" placeholder="ex: 150000" />
                <Field label="Année"        name="annee"       value={annee}       type="number" placeholder="ex: 2022" />
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--bg-soft)' }}>
              <button type="reset" className="btn-pro btn-pro-ghost">
                <FontAwesomeIcon icon={faUndo} /> Réinitialiser
              </button>
              <button type="submit" className="btn-pro btn-pro-accent">
                <FontAwesomeIcon icon={faSave} /> {isEdit ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default VoitureWrapper;
