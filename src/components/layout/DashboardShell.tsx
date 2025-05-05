
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type DashboardShellProps = {
  children: ReactNode;
  userRole: 'patient' | 'doctor' | 'admin';
}

export function DashboardShell({ children, userRole }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex-1 md:ml-64">
        <main className="container py-6 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
