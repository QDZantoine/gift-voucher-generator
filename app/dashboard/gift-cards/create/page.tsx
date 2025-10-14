"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GiftCardCreateForm } from "@/components/gift-cards/gift-card-create-form";

export default function CreateGiftCardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Créer un bon cadeau
        </h1>
        <p className="text-muted-foreground">
          Générez un nouveau bon cadeau pour un client
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du bon cadeau</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer un nouveau bon
            cadeau
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GiftCardCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}

