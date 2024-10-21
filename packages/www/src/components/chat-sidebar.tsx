import { Sidebar, SidebarHeader } from "./ui/sidebar";
import { Chat } from "./chat";

export const ChatSidebar = () => {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-text">AI</h1>
      </SidebarHeader>
      <Chat />
    </Sidebar>
  );
};
