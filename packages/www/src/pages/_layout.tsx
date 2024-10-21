import "../styles.css";

import { ReactNode, Suspense } from "react";

import { AI } from "../ai/provider";
import { TooltipProvider } from "../components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";

type RootLayoutProps = { children: ReactNode; path: string };

export default async function RootLayout({ children, path }: RootLayoutProps) {
  return (
    <html>
      <head>
        <title>LlamaIndex.TS Example</title>
      </head>
      <body>
        <SidebarProvider>
          <TooltipProvider>
            <div className="h-screen w-full flex">
              <AppSidebar />
              <SidebarInset>
                <AI>
                  <div className="flex flex-col flex-1">
                    <SidebarTrigger />
                    <Suspense>{children}</Suspense>
                  </div>
                </AI>
              </SidebarInset>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
