import "../styles.css";

import { ReactNode, Suspense } from "react";

import { AI } from "../ai/provider";
import { TooltipProvider } from "../components/ui/tooltip";
import { Bell, CircleUser, Home, Menu, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "waku/router/client";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LlamaIndexLogo } from "../components/llamaindex";
import { NewNoteButton } from "../components/new-note-button";
import { NoteListPreview } from "../components/note-list-preview";

type RootLayoutProps = { children: ReactNode; path: string };

export default async function RootLayout({ children, path }: RootLayoutProps) {
  return (
    <html>
      <head>
        <title>LlamaIndex.TS Example</title>
      </head>
      <body>
        <TooltipProvider>
          <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-screen max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <LlamaIndexLogo />
                    <span className="">LlamaIndex.TS</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto h-8 w-8"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                  </Button>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <div className="p-4 border-b border-border">
                    <NewNoteButton />
                  </div>
                  <NoteListPreview
                    currentNoteId={
                      path.startsWith("/note/") ? path.split("/")[2] : null
                    }
                  />
                </nav>
                <div className="mt-auto p-4">
                  <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle>Star llamaindex</CardTitle>
                      <CardDescription>
                        Show your support by starring the project on GitHub.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="w-full">
                        Star
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <AI>
              <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                      >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                      <nav className="grid gap-2 text-lg font-medium">
                        <Link
                          to="/"
                          className="flex items-center gap-2 text-lg font-semibold"
                        >
                          <LlamaIndexLogo />
                          <span className="">LlamaIndex.TS</span>
                        </Link>
                        <Link
                          to="/"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                          <Home className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </nav>
                      <div className="mt-auto">
                        <Card>
                          <CardHeader className="p-2 pt-0 md:p-4">
                            <CardTitle>Star llamaindex</CardTitle>
                            <CardDescription>
                              Show your support by starring the project on
                              GitHub.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full">
                              Star
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <div className="w-full flex-1">
                    <form>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search note..."
                          className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                      </div>
                    </form>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                      >
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Support</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </header>
                <Suspense>{children}</Suspense>
              </div>
            </AI>
          </div>
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
