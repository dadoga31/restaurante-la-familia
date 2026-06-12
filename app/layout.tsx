import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "La Familia Restaurante — Alta Cocina",
  description:
    "Restaurante de alta cocina. Reserva tu mesa y descubre nuestra carta de temporada en un ambiente elegante e íntimo.",
  keywords: ["restaurante", "alta cocina", "reservas", "menú degustación"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
