export const meta = {
  name: "Password generator",
  slug: "base-password-generator",
  category: "Base • Tools",
  sequence: 224,
  description: "Strong random password generator with strength meter and pronounceable / passphrase modes.",
};

export default function PasswordGenerator({
  heading = "Strong Password Generator",
  subheading = "Generate strong, random passwords or passphrases with a configurable character set and a real-time strength meter. Cryptographically random — never stored or sent.",
} = {}) {
  return (
    <section className="section tool-section password-tool" id="password">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>

        <div className="pw-output-wrap">
          <input type="text" className="pw-output" readOnly />
          <button type="button" className="btn btn-primary pw-roll" aria-label="Generate new password">🔄</button>
          <button type="button" className="btn pw-copy" aria-label="Copy password">📋</button>
        </div>
        <div className="pw-strength">
          <div className="pw-bar"><div className="pw-bar-fill"></div></div>
          <span className="pw-strength-label">—</span>
          <span className="pw-entropy"></span>
        </div>

        <div className="pw-controls">
          <div className="pw-row">
            <label className="tool-label">Length: <span className="pw-len-val">20</span></label>
            <input type="range" className="pw-len tool-input" min="6" max="80" defaultValue="20" />
          </div>
          <div className="pw-row pw-cb-row">
            <label className="tool-label"><input type="checkbox" className="pw-up" defaultChecked /> Uppercase (A-Z)</label>
            <label className="tool-label"><input type="checkbox" className="pw-low" defaultChecked /> Lowercase (a-z)</label>
            <label className="tool-label"><input type="checkbox" className="pw-num" defaultChecked /> Numbers (0-9)</label>
            <label className="tool-label"><input type="checkbox" className="pw-sym" defaultChecked /> Symbols (!@#$…)</label>
            <label className="tool-label"><input type="checkbox" className="pw-no-ambig" /> Exclude ambiguous (0OIl1)</label>
          </div>
          <div className="pw-row">
            <label className="tool-label">Mode</label>
            <select className="pw-mode tool-input">
              <option value="random">Random (strongest)</option>
              <option value="passphrase">Passphrase (memorable)</option>
            </select>
          </div>
        </div>

        <div className="tool-foot pw-info">
          <h3 className="pt-h4">What makes a password strong?</h3>
          <ul>
            <li><strong>Length</strong> matters more than complexity — 16+ chars beats 8 chars with symbols every time.</li>
            <li><strong>Entropy</strong> ≥ 80 bits is recommended for general accounts; ≥ 100 bits for sensitive accounts (banking, crypto, password manager master password).</li>
            <li><strong>Passphrases</strong> like <code>correct-horse-battery-staple</code> are both memorable AND strong.</li>
            <li><strong>Never reuse</strong> — use a password manager (Bitwarden, 1Password, KeePass) to store one unique strong password per site.</li>
          </ul>
          <p style={{color:"var(--muted)",fontSize:"0.88rem",marginTop:"10px"}}>This tool uses <code>crypto.getRandomValues</code> — cryptographically secure randomness from your browser. Passwords are generated entirely on your device and are never transmitted.</p>
        </div>
      </div>
    </section>
  );
}
