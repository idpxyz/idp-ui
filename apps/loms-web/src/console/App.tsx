import { ThemeProvider, ToastProvider } from "@idpxyz/ui-theme-runtime";
import { Layout } from "./Layout";

/**
 * LOMS Operations Console — traditional console UX (branded header + left nav
 * sidebar + single page area) on the IDP design system (@idpxyz/ui), reusing the
 * original rich LOMS pages via PageRouter (no IDE-workspace tabs/panels).
 */
export default function App() {
  return (
    <ThemeProvider product="loms">
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </ThemeProvider>
  );
}
