import "../styles.css";

import type { ReactNode } from "react";

import { AI } from "../ai/provider";
import { TooltipProvider } from "../components/ui/tooltip";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <head></head>
      <body>
        <TooltipProvider>
          <AI>{children}</AI>
        </TooltipProvider>
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
