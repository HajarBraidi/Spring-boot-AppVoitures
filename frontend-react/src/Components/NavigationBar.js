import React from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function NavigationBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <nav className="navbar-custom">
      <Link to="/" className="navbar-brand-custom">
        <span>Shop</span>
      </Link>

      <div className="navbar-links">
        <Link to="/add"       className={`nav-link-custom ${isActive('/add') ? 'active' : ''}`}>
          + Ajouter
        </Link>
        <Link to="/list"      className={`nav-link-custom ${isActive('/list') ? 'active' : ''}`}>
          Catalogue
        </Link>
        <Link to="/assistant" className={`nav-link-custom ${isActive('/assistant') ? 'active' : ''}`}>
          Assistant IA
        </Link>
      </div>
    </nav>
  );
}
