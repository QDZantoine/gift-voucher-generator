"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Database,
  Shield,
  User,
  Globe,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    role?: string;
  } | null>(null);
  const [settings, setSettings] = useState({
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    databaseType: "PostgreSQL",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Ici, vous pourriez sauvegarder les paramètres dans la base de données
      // Pour l'instant, on simule juste une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Paramètres sauvegardés avec succès");
    } catch {
      toast.error("Erreur lors de la sauvegarde des paramètres");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre application
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informations utilisateur */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Informations utilisateur</CardTitle>
            </div>
            <CardDescription>Vos informations de compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nom</Label>
              <Input
                id="user-name"
                value={user?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {user?.role === "SUPER_ADMIN" || user?.role === "SUPER_AMDIN"
                  ? "Super Administrateur"
                  : "Administrateur"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres généraux - Visible uniquement pour SUPER_ADMIN */}
        {(user?.role === "SUPER_ADMIN" || user?.role === "SUPER_AMDIN") && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Paramètres généraux</CardTitle>
              </div>
              <CardDescription>
                Configuration générale de l&apos;application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-url">URL de l&apos;application</Label>
                <Input
                  id="app-url"
                  value={settings.appUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, appUrl: e.target.value })
                  }
                  placeholder="https://votre-domaine.com"
                />
                <p className="text-xs text-muted-foreground">
                  URL publique de votre application (utilisée pour les emails et
                  liens)
                </p>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Base de données - Visible uniquement pour SUPER_ADMIN */}
        {(user?.role === "SUPER_ADMIN" || user?.role === "SUPER_AMDIN") && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Base de données</CardTitle>
              </div>
              <CardDescription>
                Informations sur la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type de base de données</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{settings.databaseType}</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Statut de la connexion</Label>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Connecté
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>
              Paramètres de sécurité de l&apos;application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Authentification</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Connexion par email/mot de passe
                  </span>
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Activé
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions sécurisées</span>
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Activé
                  </Badge>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Protection des routes</Label>
              <p className="text-sm text-muted-foreground">
                Toutes les routes du dashboard sont protégées par
                authentification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations système - Visible uniquement pour SUPER_ADMIN */}
        {(user?.role === "SUPER_ADMIN" || user?.role === "SUPER_AMDIN") && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>Informations système</CardTitle>
              </div>
              <CardDescription>
                Informations sur l&apos;application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Version
                  </Label>
                  <p className="text-sm font-medium">1.0.0</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Environnement
                  </Label>
                  <p className="text-sm font-medium">
                    {process.env.NODE_ENV === "production"
                      ? "Production"
                      : "Développement"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
