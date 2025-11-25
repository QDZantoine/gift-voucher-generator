"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard - cette page n'est plus accessible publiquement
    toast.info("Veuillez vous connecter pour accéder à l'application");
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <p>Redirection...</p>
    </div>
  );
}

