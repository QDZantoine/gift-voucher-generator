"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Eye, Save, X, Play, Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PDFTemplate,
  DEFAULT_TEMPLATES,
  replaceTemplateVariables,
  GiftCardTemplateData,
} from "@/lib/pdf-templates";
import { MenuType } from "@/lib/types/menu-type";

// Dynamic import du VisualTemplateEditor (composant lourd avec Lexical)
const VisualTemplateEditor = dynamic(
  () =>
    import("@/components/pdf-template/VisualTemplateEditor").then(
      (mod) => mod.VisualTemplateEditor
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  }
);

export default function PDFTemplatesPage() {
  const [templates, setTemplates] = useState<PDFTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isVisualEditing, setIsVisualEditing] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loadingMenuTypes, setLoadingMenuTypes] = useState(true);
  const [previewData, setPreviewData] = useState<GiftCardTemplateData>({
    code: "INF-XXXX-XXXX",
    productType: "",
    numberOfPeople: 2,
    recipientName: "Jean Dupont",
    amount: 0,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    purchaseDate: new Date().toISOString(),
    customMessage: "Joyeux anniversaire !",
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

  useEffect(() => {
    // Charger les templates depuis la base de données
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/pdf-templates");
        if (response.ok) {
          const dbTemplates = await response.json();
          
          // Ajouter aussi les templates par défaut s'il n'y a pas encore de templates en BDD
          if (dbTemplates.length === 0) {
            const defaultTemplates = DEFAULT_TEMPLATES.map((template, index) => ({
              ...template,
              id: `template-${index}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            }));
            setTemplates(defaultTemplates);
          } else {
            setTemplates(dbTemplates);
          }
        } else {
          toast.error("Erreur lors du chargement des templates");
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Erreur lors du chargement des templates");
        
        // Fallback aux templates par défaut en cas d'erreur
        const defaultTemplates = DEFAULT_TEMPLATES.map((template, index) => ({
          ...template,
          id: `template-${index}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        setTemplates(defaultTemplates);
      }
    };

    fetchTemplates();
  }, []);

  const handleEditTemplate = (template: PDFTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleVisualEditTemplate = (template: PDFTemplate) => {
    setSelectedTemplate(template);
    setIsVisualEditing(true);
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // Vérifier si c'est un template par défaut (ID commence par "template-")
      const isDefaultTemplate = selectedTemplate.id.startsWith("template-");
      
      if (isDefaultTemplate) {
        // Créer un nouveau template en BDD basé sur le template par défaut
        const response = await fetch("/api/pdf-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedTemplate.name,
            description: selectedTemplate.description,
            productType: selectedTemplate.productType,
            html: selectedTemplate.html,
            css: selectedTemplate.css,
            isActive: selectedTemplate.isActive,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create template");
        }

        const newTemplate = await response.json();
        setTemplates((prev) => [...prev, newTemplate]);
        toast.success("Nouveau template créé avec succès");
      } else {
        // Mettre à jour le template existant
        const response = await fetch(`/api/pdf-templates/${selectedTemplate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedTemplate.name,
            description: selectedTemplate.description,
            productType: selectedTemplate.productType,
            html: selectedTemplate.html,
            css: selectedTemplate.css,
            isActive: selectedTemplate.isActive,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update template");
        }

        const updatedTemplate = await response.json();
        setTemplates((prev) =>
          prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
        );
        toast.success("Template mis à jour avec succès");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erreur lors de la sauvegarde du template");
    }
  };

  const handlePreviewTemplate = async (template: PDFTemplate) => {
    try {
      const html = replaceTemplateVariables(template.html, previewData);
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation PDF</title>
          <style>${template.css}</style>
        </head>
        <body>${html}</body>
        </html>
      `;

      // Ouvrir dans une nouvelle fenêtre pour prévisualisation
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(fullHtml);
        newWindow.document.close();
      }
    } catch {
      toast.error("Erreur lors de la prévisualisation");
    }
  };

  const handleTestPDF = async (template: PDFTemplate) => {
    try {
      const response = await fetch("/api/pdf/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...previewData,
          templateId: template.id,
          // Envoyer aussi le template complet avec toutes les modifications
          template: {
            html: template.html,
            css: template.css,
          },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `test-${template.name
          .replace(/\s+/g, "-")
          .toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF de test généré avec succès");
      } else {
        toast.error("Erreur lors de la génération du PDF");
      }
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Templates PDF</h1>
          <p className="text-muted-foreground">
            Gérez les templates de génération PDF pour vos bons cadeaux
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.isActive ? (
                          <Badge variant="default">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestPDF(template)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVisualEditTemplate(template)}
                        title="Éditeur Visuel"
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Palette className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        title="Éditeur HTML"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">
                        Type de menu:
                      </Label>
                      <Badge variant="outline">{template.productType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">
                        Dernière modification:
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {new Date(template.updatedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données de test</CardTitle>
              <CardDescription>
                Modifiez ces données pour tester vos templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code du bon cadeau</Label>
                  <Input
                    id="code"
                    value={previewData.code}
                    onChange={(e) =>
                      setPreviewData((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="recipientName">Nom du destinataire</Label>
                  <Input
                    id="recipientName"
                    value={previewData.recipientName}
                    onChange={(e) =>
                      setPreviewData((prev) => ({
                        ...prev,
                        recipientName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="productType">Type de menu</Label>
                  <Select
                    value={previewData.productType}
                    onValueChange={(value) =>
                      setPreviewData((prev) => ({
                        ...prev,
                        productType: value,
                      }))
                    }
                    disabled={loadingMenuTypes}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingMenuTypes
                            ? "Chargement..."
                            : "Sélectionnez un menu"
                        }
                      />
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
                    value={previewData.numberOfPeople}
                    onChange={(e) =>
                      setPreviewData((prev) => ({
                        ...prev,
                        numberOfPeople: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Montant (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={previewData.amount || 0}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculé automatiquement (prix par personne × nombre de
                    personnes)
                  </p>
                </div>
                <div>
                  <Label htmlFor="customMessage">Message personnalisé</Label>
                  <Input
                    id="customMessage"
                    value={previewData.customMessage || ""}
                    onChange={(e) =>
                      setPreviewData((prev) => ({
                        ...prev,
                        customMessage: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      {selectedTemplate && isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Éditer le template</h2>
              <div className="flex gap-2">
                <Button onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Nom du template</Label>
                    <Input
                      id="templateName"
                      value={selectedTemplate.name}
                      onChange={(e) =>
                        setSelectedTemplate((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="productType">Type de menu</Label>
                    <Select
                      value={selectedTemplate?.productType || ""}
                      onValueChange={(value) =>
                        setSelectedTemplate((prev) =>
                          prev ? { ...prev, productType: value } : null
                        )
                      }
                      disabled={loadingMenuTypes}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingMenuTypes
                              ? "Chargement..."
                              : "Sélectionnez un menu"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {menuTypes.map((menuType) => (
                          <SelectItem key={menuType.id} value={menuType.name}>
                            {menuType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={selectedTemplate.description}
                    onChange={(e) =>
                      setSelectedTemplate((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={selectedTemplate.isActive}
                    onCheckedChange={(checked) =>
                      setSelectedTemplate((prev) =>
                        prev ? { ...prev, isActive: checked } : null
                      )
                    }
                  />
                  <Label htmlFor="isActive">Template actif</Label>
                </div>
                <div>
                  <Label htmlFor="html">HTML Template</Label>
                  <Textarea
                    id="html"
                    value={selectedTemplate.html}
                    onChange={(e) =>
                      setSelectedTemplate((prev) =>
                        prev ? { ...prev, html: e.target.value } : null
                      )
                    }
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="css">CSS Styles</Label>
                  <Textarea
                    id="css"
                    value={selectedTemplate.css}
                    onChange={(e) =>
                      setSelectedTemplate((prev) =>
                        prev ? { ...prev, css: e.target.value } : null
                      )
                    }
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Éditeur Visuel */}
      {selectedTemplate && isVisualEditing && (
        <VisualTemplateEditor
          template={selectedTemplate}
          onSave={async (updatedTemplate) => {
            try {
              // Vérifier si c'est un template par défaut (ID commence par "template-")
              const isDefaultTemplate = updatedTemplate.id.startsWith("template-");
              
              if (isDefaultTemplate) {
                // Créer un nouveau template en BDD
                const response = await fetch("/api/pdf-templates", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: updatedTemplate.name,
                    description: updatedTemplate.description,
                    productType: updatedTemplate.productType,
                    html: updatedTemplate.html,
                    css: updatedTemplate.css,
                    isActive: updatedTemplate.isActive,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to create template");
                }

                const newTemplate = await response.json();
                setTemplates((prev) => [...prev, newTemplate]);
                toast.success("Nouveau template créé avec succès");
              } else {
                // Mettre à jour le template existant
                const response = await fetch(`/api/pdf-templates/${updatedTemplate.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: updatedTemplate.name,
                    description: updatedTemplate.description,
                    productType: updatedTemplate.productType,
                    html: updatedTemplate.html,
                    css: updatedTemplate.css,
                    isActive: updatedTemplate.isActive,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to update template");
                }

                const savedTemplate = await response.json();
                setTemplates((prev) =>
                  prev.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
                );
                toast.success("Template mis à jour avec succès");
              }

              setIsVisualEditing(false);
            } catch (error) {
              console.error("Error saving template:", error);
              toast.error("Erreur lors de la sauvegarde du template");
            }
          }}
          onCancel={() => setIsVisualEditing(false)}
          previewData={previewData}
          menuTypes={menuTypes}
        />
      )}
    </div>
  );
}
