import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Building2, Globe, Shield, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales du site influences-bayonne.fr - Informations sur l'éditeur, l'hébergeur, les données personnelles et les conditions d'utilisation.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-[#1A2B4B]/10 p-4">
              <FileText className="h-8 w-8 text-[#1A2B4B]" />
            </div>
          </div>
          <h1 className="font-playfair-display text-4xl sm:text-5xl font-bold text-[#1A2B4B]">
            Mentions Légales
          </h1>
          <p className="font-lato text-lg text-[#1A2B4B]/70">
            Informations légales et conditions d&apos;utilisation du site
          </p>
          <p className="font-lato text-sm text-[#1A2B4B]/60">
            Dernière mise à jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Éditeur du site */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Building2 className="h-5 w-5" />
              1. Éditeur du site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold">Raison sociale :</p>
              <p>ANTHEA</p>
            </div>
            <div>
              <p className="font-semibold">Forme juridique :</p>
              <p>Auto-entreprise (Micro-entreprise)</p>
            </div>
            <div>
              <p className="font-semibold">Éditeur / Développeur :</p>
              <p>Antoine Quendez</p>
            </div>
            <div>
              <p className="font-semibold">Site web :</p>
              <a
                href="https://www.anthea-digitalbloom.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2B4B] hover:underline"
              >
                https://www.anthea-digitalbloom.fr
              </a>
            </div>
            <div>
              <p className="font-semibold">Email :</p>
              <a
                href="mailto:contact@anthea-digitalbloom.fr"
                className="text-[#1A2B4B] hover:underline"
              >
                contact@anthea-digitalbloom.fr
              </a>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="font-semibold">Restaurant (Client) :</p>
              <p>Restaurant Influences</p>
            </div>
            <div>
              <p className="font-semibold">Adresse du restaurant :</p>
              <p>19 Rue Vieille Boucherie</p>
              <p>64100 Bayonne, France</p>
            </div>
            <div>
              <p className="font-semibold">Téléphone :</p>
              <a
                href="tel:+33559017504"
                className="text-[#1A2B4B] hover:underline"
              >
                05 59 01 75 04
              </a>
            </div>
            <div>
              <p className="font-semibold">Site web du restaurant :</p>
              <a
                href="https://restaurant-influences.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2B4B] hover:underline"
              >
                https://restaurant-influences.fr
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Hébergeur */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Globe className="h-5 w-5" />
              2. Hébergeur du site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Le site <strong>influences-bayonne.fr</strong> est hébergé par :
            </p>
            <div>
              <p className="font-semibold">Hébergeur :</p>
              <p>Hostinger</p>
            </div>
            <div>
              <p className="font-semibold">Type d&apos;hébergement :</p>
              <p>VPS (Serveur Privé Virtuel)</p>
            </div>
            <div>
              <p className="font-semibold">Site web :</p>
              <a
                href="https://www.hostinger.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2B4B] hover:underline"
              >
                https://www.hostinger.fr
              </a>
            </div>
            <p className="text-sm text-[#1A2B4B]/70">
              Pour toute question concernant l&apos;hébergement, veuillez
              contacter l&apos;éditeur du site.
            </p>
          </CardContent>
        </Card>

        {/* Données personnelles */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Shield className="h-5 w-5" />
              3. Données personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-2">
                Responsable du traitement des données :
              </p>
              <p>Restaurant Influences</p>
              <p>19 Rue Vieille Boucherie, 64100 Bayonne, France</p>
              <p className="text-sm text-[#1A2B4B]/70 mt-2">
                Note : Le site est développé et maintenu par ANTHEA (Antoine
                Quendez), mais le Restaurant Influences reste le responsable du
                traitement des données personnelles collectées via ce site.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Données collectées :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Informations de paiement (traitées par Stripe)</li>
                <li>Données de navigation (cookies techniques)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Finalités du traitement :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Gestion des commandes de bons cadeaux</li>
                <li>Envoi des confirmations par email</li>
                <li>Gestion de la relation client</li>
                <li>Amélioration du service</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Base légale :</p>
              <p>
                Le traitement est nécessaire à l&apos;exécution du contrat de
                vente (RGPD art. 6.1.b) et au respect des obligations légales
                (RGPD art. 6.1.c).
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Conservation des données :</p>
              <p>
                Les données sont conservées pendant la durée nécessaire aux
                finalités pour lesquelles elles ont été collectées, et au
                minimum pendant la durée légale de conservation des documents
                comptables (10 ans).
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Vos droits :</p>
              <p className="mb-2">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Droit d&apos;accès à vos données personnelles</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d&apos;opposition</li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a
                  href="mailto:contact@influences-bayonne.fr"
                  className="text-[#1A2B4B] hover:underline font-semibold"
                >
                  contact@influences-bayonne.fr
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Réclamation :</p>
              <p>
                Vous avez également le droit d&apos;introduire une réclamation
                auprès de la CNIL (Commission Nationale de l&apos;Informatique
                et des Libertés) :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A2B4B] hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Shield className="h-5 w-5" />
              4. Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Le site utilise des cookies techniques nécessaires au
              fonctionnement du site et à la gestion de votre session
              d&apos;authentification.
            </p>
            <div>
              <p className="font-semibold mb-2">Types de cookies utilisés :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Cookies de session :</strong> Nécessaires au
                  fonctionnement du site et à la gestion de votre panier
                </li>
                <li>
                  <strong>Cookies d&apos;authentification :</strong> Pour la
                  gestion de votre session utilisateur (Better Auth)
                </li>
              </ul>
            </div>
            <p className="text-sm text-[#1A2B4B]/70">
              Ces cookies sont essentiels au fonctionnement du site et ne
              nécessitent pas de consentement préalable conformément à la
              directive ePrivacy.
            </p>
          </CardContent>
        </Card>

        {/* Propriété intellectuelle */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Scale className="h-5 w-5" />
              5. Propriété intellectuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos,
              graphismes, etc.) est la propriété exclusive du Restaurant
              Influences, sauf mention contraire.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication,
              adaptation de tout ou partie des éléments du site, quel que soit
              le moyen ou le procédé utilisé, est interdite sans autorisation
              écrite préalable.
            </p>
            <p>
              Toute exploitation non autorisée du site ou de son contenu engage
              la responsabilité civile et/ou pénale de l&apos;utilisateur.
            </p>
          </CardContent>
        </Card>

        {/* Responsabilité */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Scale className="h-5 w-5" />
              6. Limitation de responsabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Le Restaurant Influences s&apos;efforce d&apos;assurer
              l&apos;exactitude et la mise à jour des informations diffusées sur
              le site. Toutefois, il ne peut garantir l&apos;exactitude, la
              précision ou l&apos;exhaustivité des informations mises à
              disposition sur ce site.
            </p>
            <p>
              Le Restaurant Influences ne pourra être tenu responsable des
              dommages directs ou indirects causés au matériel de
              l&apos;utilisateur lors de l&apos;accès au site, et résultant soit
              de l&apos;utilisation d&apos;un matériel ne répondant pas aux
              spécifications, soit de l&apos;apparition d&apos;un bug ou
              d&apos;une incompatibilité.
            </p>
            <p>
              Le Restaurant Influences ne pourra également être tenu responsable
              des dommages indirects consécutifs à l&apos;utilisation du site.
            </p>
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Shield className="h-5 w-5" />
              7. Paiement et sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Les paiements sont traités de manière sécurisée par{" "}
              <strong>Stripe</strong>, un prestataire de services de paiement
              certifié PCI-DSS niveau 1.
            </p>
            <p>
              Aucune donnée bancaire n&apos;est stockée sur nos serveurs. Toutes
              les transactions sont cryptées et sécurisées.
            </p>
            <p>
              En cas de problème avec un paiement, contactez-nous à :{" "}
              <a
                href="mailto:contact@influences-bayonne.fr"
                className="text-[#1A2B4B] hover:underline font-semibold"
              >
                contact@influences-bayonne.fr
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Droit applicable */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Scale className="h-5 w-5" />
              8. Droit applicable et juridiction compétente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Les présentes mentions légales sont régies par le droit français.
            </p>
            <p>
              En cas de litige et à défaut d&apos;accord amiable, le litige sera
              porté devant les tribunaux français conformément aux règles de
              compétence en vigueur.
            </p>
            <p>
              Conformément à l&apos;article L. 612-1 du Code de la consommation,
              le Restaurant Influences adhère au service du médiateur de la
              consommation suivant : Médiateur de la consommation compétent pour
              les litiges de consommation.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-[#1A2B4B]/20 bg-gradient-to-br from-[#1A2B4B]/5 to-transparent">
          <CardHeader>
            <CardTitle className="font-playfair-display text-2xl text-[#1A2B4B]">
              9. Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-2">
                Pour toute question concernant le site web (développement,
                technique) :
              </p>
              <div className="space-y-2 ml-4">
                <p>
                  <strong>Éditeur / Développeur :</strong> Antoine Quendez
                  (ANTHEA)
                </p>
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@anthea-digitalbloom.fr"
                    className="text-[#1A2B4B] hover:underline font-semibold"
                  >
                    contact@anthea-digitalbloom.fr
                  </a>
                </p>
                <p>
                  <strong>Site web :</strong>{" "}
                  <a
                    href="https://www.anthea-digitalbloom.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A2B4B] hover:underline font-semibold"
                  >
                    https://www.anthea-digitalbloom.fr
                  </a>
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="font-semibold mb-2">
                Pour toute question concernant les bons cadeaux ou le restaurant
                :
              </p>
              <div className="space-y-2 ml-4">
                <p>
                  <strong>Restaurant Influences</strong>
                </p>
                <p>
                  <strong>Par email :</strong>{" "}
                  <a
                    href="mailto:contact@influences-bayonne.fr"
                    className="text-[#1A2B4B] hover:underline font-semibold"
                  >
                    contact@influences-bayonne.fr
                  </a>
                </p>
                <p>
                  <strong>Par téléphone :</strong>{" "}
                  <a
                    href="tel:+33559017504"
                    className="text-[#1A2B4B] hover:underline font-semibold"
                  >
                    05 59 01 75 04
                  </a>
                </p>
                <p>
                  <strong>Par courrier :</strong>
                </p>
                <p className="ml-4">
                  Restaurant Influences
                  <br />
                  19 Rue Vieille Boucherie
                  <br />
                  64100 Bayonne, France
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
