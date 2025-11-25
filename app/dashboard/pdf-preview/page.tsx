"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { MenuType } from "@/lib/types/menu-type";

export default function PDFPreviewPage() {
  const [loading, setLoading] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loadingMenuTypes, setLoadingMenuTypes] = useState(true);
  const [previewData, setPreviewData] = useState({
    code: "INF-PREVIEW-1234",
    productType: "",
    numberOfPeople: 2,
    recipientName: "Jean Dupont",
    amount: 0,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseDate: new Date().toISOString(),
  });

  // Charger les types de menus actifs
  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const response = await fetch("/api/menu-types/active");
        if (response.ok) {
          const data = await response.json();
          setMenuTypes(data);
          // Définir le premier menu comme valeur par défaut
          if (data.length > 0) {
            const firstMenu = data[0];
            setPreviewData((prev) => ({
              ...prev,
              productType: firstMenu.name,
              amount: firstMenu.amount * 2, // 2 personnes par défaut
            }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des menus:", error);
        toast.error("Erreur lors du chargement des types de menus");
      } finally {
        setLoadingMenuTypes(false);
      }
    };

    fetchMenuTypes();
  }, []);

  // Mettre à jour le montant automatiquement quand le type de menu ou le nombre de personnes change
  useEffect(() => {
    const menuType = menuTypes.find((m) => m.name === previewData.productType);
    if (menuType && previewData.numberOfPeople > 0) {
      const calculatedAmount = menuType.amount * previewData.numberOfPeople;
      setPreviewData((prev) => ({ ...prev, amount: calculatedAmount }));
    }
  }, [previewData.productType, previewData.numberOfPeople, menuTypes]);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pdf/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(previewData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        toast.success("PDF généré avec succès !");
      } else {
        toast.error("Erreur lors de la génération du PDF");
      }
    } catch (_error) {
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pdf/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(previewData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bon-cadeau-${previewData.code}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("PDF téléchargé avec succès !");
      } else {
        toast.error("Erreur lors du téléchargement du PDF");
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prévisualisation PDF</h1>
          <p className="text-muted-foreground">
            Testez et prévisualisez le rendu des PDFs de bons cadeaux
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulaire de test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Données de test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Code du bon cadeau</Label>
                <Input
                  id="code"
                  value={previewData.code}
                  onChange={(e) =>
                    setPreviewData({ ...previewData, code: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="productType">Type de menu</Label>
                <Select
                  value={previewData.productType}
                  onValueChange={(value) =>
                    setPreviewData({ ...previewData, productType: value })
                  }
                  disabled={loadingMenuTypes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMenuTypes ? "Chargement..." : "Sélectionnez un menu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {menuTypes.map((menuType) => (
                      <SelectItem key={menuType.id} value={menuType.name}>
                        {menuType.name} - {menuType.amount.toFixed(2)}€/pers.
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numberOfPeople">Nombre de personnes</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  max="20"
                  value={previewData.numberOfPeople}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      numberOfPeople: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Nom du destinataire</Label>
                <Input
                  id="recipientName"
                  value={previewData.recipientName}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      recipientName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="amount">Montant (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={previewData.amount || 0}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Calculé automatiquement (prix par personne × nombre de personnes)
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handlePreview}
                  disabled={loading}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Aperçu des données */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Code :</span>
                  <span className="font-mono">{previewData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Menu :</span>
                  <span>{previewData.productType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Personnes :</span>
                  <span>{previewData.numberOfPeople}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Destinataire :</span>
                  <span>{previewData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Montant :</span>
                  <span className="font-bold">
                    {previewData.amount.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date d&apos;achat :</span>
                  <span>
                    {new Date(previewData.purchaseDate).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date d&apos;expiration :</span>
                  <span>
                    {new Date(previewData.expiryDate).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
