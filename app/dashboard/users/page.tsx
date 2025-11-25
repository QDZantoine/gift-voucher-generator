"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, UserPlus, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  }, []);

  const checkAccess = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          // Vérifier si l'utilisateur est SUPER_ADMIN
          if (data.user.role !== "SUPER_ADMIN" && data.user.role !== "SUPER_AMDIN") {
            toast.error("Accès refusé : réservé aux Super Administrateurs");
            router.push("/dashboard");
            return;
          }
          
          // Charger la liste des utilisateurs
          await fetchUsers();
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'accès:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, fetchUsers]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsCreating(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Erreur lors de la création du compte"
        );
      } else {
        toast.success("Utilisateur créé avec succès!");
        setIsDialogOpen(false);
        resetForm();
        await fetchUsers();
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("ADMIN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les comptes administrateurs de l&apos;application
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau compte administrateur pour accéder au
                  dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@influences.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={role}
                    onValueChange={(value: "ADMIN" | "SUPER_ADMIN") =>
                      setRole(value)
                    }
                    disabled={isCreating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="SUPER_ADMIN">
                        Super Administrateur
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Les Super Administrateurs ont accès à toutes les
                    fonctionnalités
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isCreating}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Création..." : "Créer l'utilisateur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Liste des utilisateurs</CardTitle>
          </div>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré
            {users.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date de création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "-"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "SUPER_ADMIN" ||
                          user.role === "SUPER_AMDIN"
                            ? "default"
                            : "secondary"
                        }
                        className="gap-1"
                      >
                        {user.role === "SUPER_ADMIN" ||
                        user.role === "SUPER_AMDIN" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <Shield className="h-3 w-3" />
                        )}
                        {user.role === "SUPER_ADMIN" ||
                        user.role === "SUPER_AMDIN"
                          ? "Super Admin"
                          : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

