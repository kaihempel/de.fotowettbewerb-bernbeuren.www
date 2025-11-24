import { PublicHeader } from "@/components/public-header";
import { PropsWithChildren } from "react";

export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Fotowettbewerb Bernbeuren. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
