import "./LegalLinks.css";

export default function LegalLinks({ onOpen }) {
  return (
    <nav className="auth-legal-links" aria-label="Legal information">
      <button type="button" onClick={() => onOpen("privacy")}>Privacy Policy</button>
      <span aria-hidden="true">|</span>
      <button type="button" onClick={() => onOpen("terms")}>Terms &amp; Conditions</button>
    </nav>
  );
}
