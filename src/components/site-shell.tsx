import { MotionProvider } from "@/components/motion/provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
    <div className="flex min-h-dvh flex-col">
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
      </noscript>
      <a href="#main" className="fixed top-2 left-2 z-50 -translate-y-20 rounded-[3px] bg-white px-4 py-2 text-ink focus:translate-y-0">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
    </MotionProvider>
  );
}
