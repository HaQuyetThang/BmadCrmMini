import { AppSidebar } from "@/components/layout/app-sidebar";
import { QuickCaptureSheet } from "@/components/layout/quick-capture-sheet";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "240px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center border-b border-border px-page md:hidden">
          <SidebarTrigger />
        </header>
        <main className="mx-auto w-full max-w-5xl px-page py-page">{children}</main>
        <QuickCaptureSheet />
      </SidebarInset>
    </SidebarProvider>
  );
}
