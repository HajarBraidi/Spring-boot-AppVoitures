import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

import NavigationBar from './Components/NavigationBar';
import Bienvenue     from './Components/Bienvenue';
import Footer        from './Components/Footer';
import Voiture       from './Components/Voiture';
import VoitureListe  from './Components/VoitureListe';
import AssistantCar  from './Components/Assistant';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <NavigationBar />
        <div className="app-content">
          <Container>
            <Routes>
              <Route path="/"          element={<Bienvenue />}    />
              <Route path="/add"       element={<Voiture />}      />
              <Route path="/edit/:id"  element={<Voiture />}      />
              <Route path="/list"      element={<VoitureListe />} />
              <Route path="/assistant" element={<AssistantCar />} />
            </Routes>
          </Container>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
