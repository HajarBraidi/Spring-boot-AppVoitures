import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-pro">
      © {year} Shop · Tous droits réservés · Master
    </footer>
  );
}
