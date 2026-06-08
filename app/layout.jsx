import "./globals.css";
import theme from "../theme.json";

export const metadata = {
  title: theme.name || "Base theme",
  description: theme.description || "A React theme for the Websites Portal",
};

// :root vars from theme.json so the components (which use var(--primary), var(--bg) …)
// resolve — the same set the portal injects into its visual-builder canvas and onto live sites.
function themeVarsCss() {
  const lines = [];
  for (const [k, v] of Object.entries(theme.colors || {})) lines.push(`--${k}:${v};--wp-${k}:${v};`);
  for (const [k, v] of Object.entries(theme.fonts || {})) lines.push(`--font-${k}:'${v}';--wp-font-${k}:'${v}';`);
  for (const [k, v] of Object.entries(theme.extra_tokens || {})) lines.push(`--${k}:${v};`);
  return `:root{${lines.join("")}}body{display:flex;flex-direction:column;min-height:100vh;}body>main{flex:1;}`;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: themeVarsCss() }} />
        {children}
      </body>
    </html>
  );
}
