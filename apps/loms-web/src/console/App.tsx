import { ThemeProvider, ToastProvider } from "@idpxyz/ui-theme-runtime";
import { Layout } from "./Layout";

/**
 * LOMS Operations Console — the original loms prototype's traditional
 * console UX (sidebar + pages), rebuilt on the IDP design system (@idpxyz/ui).
 * Replaces the IDE-workspace shell. Talks to the live loms-api.
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
