import React from "react";
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ali Issa Yacouba",
  description: "Portfolio of Ali Issa Yacouba",
  icons: {
    icon: [{ url: "/assets/images/logo.png", type: "image/x-icon" }],
  },
};

import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <script
              type="module"
              async
              src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Famplify171980back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18"
            />
            <script
              type="module"
              defer
              src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
