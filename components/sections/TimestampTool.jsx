export const meta = {
  name: "Timestamp converter",
  slug: "base-timestamp",
  category: "Base • Tools",
  sequence: 250,
  description: "Convert between Unix timestamp (seconds or ms), ISO 8601 and human-readable date/time. Type in any field and the others update automatically.",
};

export default function TimestampTool({
  heading = "Timestamp Converter",
  subheading = "Type a Unix timestamp (seconds OR milliseconds — auto-detected) or an ISO 8601 date. The other formats update live.",
} = {}) {
  return (
    <section className="section tool-section timestamp-tool" id="timestamp">
      <div className="container">
        <header className="tool-head">
          <h2 className="h2 tool-title">{heading}</h2>
          <p className="tool-sub">{subheading}</p>
        </header>
        <div className="tool-grid">
          <div className="tool-pane">
            <label className="tool-label" htmlFor="ts-unix">Unix timestamp (s or ms)</label>
            <input id="ts-unix" type="text" className="tool-textarea ts-unix" placeholder="1719360000  OR  1719360000000" spellCheck="false" autoCapitalize="off" style={{ minHeight: "40px" }} />
            <label className="tool-label" htmlFor="ts-iso" style={{ marginTop: 12 }}>ISO 8601</label>
            <input id="ts-iso" type="text" className="tool-textarea ts-iso" placeholder="2026-06-08T10:00:00Z" spellCheck="false" autoCapitalize="off" style={{ minHeight: "40px" }} />
            <div className="tool-actions">
              <button type="button" className="btn btn-primary ts-now">Now</button>
              <button type="button" className="btn ts-clear">Clear</button>
            </div>
          </div>
          <div className="tool-pane">
            <label className="tool-label">UTC</label>
            <input className="tool-textarea tool-output ts-utc" readOnly style={{ minHeight: "40px" }} />
            <label className="tool-label" style={{ marginTop: 12 }}>Local</label>
            <input className="tool-textarea tool-output ts-local" readOnly style={{ minHeight: "40px" }} />
            <label className="tool-label" style={{ marginTop: 12 }}>Relative</label>
            <input className="tool-textarea tool-output ts-relative" readOnly style={{ minHeight: "40px" }} />
          </div>
        </div>
        <p className="tool-foot ts-error" hidden />
      </div>
    </section>
  );
}
