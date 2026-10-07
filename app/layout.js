import "./globals.css";
import Nav from "./components/Nav";

export const metadata = { title: "Seguros de Accidentes Personales" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="top">
          <span className="marca">Seguros AP</span>
          <Nav />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
