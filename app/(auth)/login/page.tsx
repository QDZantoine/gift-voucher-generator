"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success("Connexion réussie!");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Erreur lors de la connexion");
          },
        }
      );
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7F2] via-[#F0EFE8] to-[#E8E7DC] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1A2B4B]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A2B4B]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-[#1A2B4B]/20 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-4 text-center pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-[#1A2B4B]/10 p-4">
                <Shield className="h-8 w-8 text-[#1A2B4B]" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-playfair-display font-bold text-[#1A2B4B]">
                Connexion Admin
              </CardTitle>
              <CardDescription className="font-lato text-[#1A2B4B]/70 text-base">
                Connectez-vous pour accéder au dashboard de gestion des bons
                cadeaux
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-lato font-medium text-[#1A2B4B]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1A2B4B]/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@influences.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-[#1A2B4B]/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-lato font-medium text-[#1A2B4B]"
                >
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1A2B4B]/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 font-lato border-[#1A2B4B]/20 focus:border-[#1A2B4B] focus:ring-[#1A2B4B]/20 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 font-lato font-semibold text-base bg-[#1A2B4B] hover:bg-[#1A2B4B]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-lato text-sm text-[#1A2B4B]/70 hover:text-[#1A2B4B] transition-colors duration-200"
          >
            <span>Retour au site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
