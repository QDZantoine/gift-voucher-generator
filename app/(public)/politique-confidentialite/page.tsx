import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Database,
  Lock,
  Eye,
  Mail,
  Cookie,
  UserCheck,
  FileText,
  AlertCircle,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité du site influences-bayonne.fr - Protection des données personnelles, cookies, et droits des utilisateurs conformément au RGPD.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-[#1A2B4B]/10 p-4">
              <Shield className="h-8 w-8 text-[#1A2B4B]" />
            </div>
          </div>
          <h1 className="font-playfair-display text-4xl sm:text-5xl font-bold text-[#1A2B4B]">
            Politique de Confidentialité
          </h1>
          <p className="font-lato text-lg text-[#1A2B4B]/70">
            Protection de vos données personnelles et respect de votre vie
            privée
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

        {/* Introduction */}
        <Card className="border-[#1A2B4B]/20 bg-gradient-to-br from-[#1A2B4B]/5 to-transparent">
          <CardContent className="pt-6 font-lato text-[#1A2B4B]">
            <p className="mb-4">
              Le Restaurant Influences (ci-après &quot;nous&quot;,
              &quot;notre&quot; ou &quot;le Restaurant&quot;) accorde une grande
              importance à la protection de vos données personnelles. Cette
              politique de confidentialité vous informe sur la manière dont nous
              collectons, utilisons, stockons et protégeons vos données
              personnelles conformément au Règlement Général sur la Protection
              des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <p>
              En utilisant notre site <strong>influences-bayonne.fr</strong>,
              vous acceptez les pratiques décrites dans cette politique de
              confidentialité.
            </p>
          </CardContent>
        </Card>

        {/* Responsable du traitement */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <UserCheck className="h-5 w-5" />
              1. Responsable du traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-2">
                Le responsable du traitement des données personnelles est :
              </p>
              <p>Restaurant Influences</p>
              <p>19 Rue Vieille Boucherie</p>
              <p>64100 Bayonne, France</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Contact :</p>
              <p>
                Email :{" "}
                <a
                  href="mailto:contact@influences-bayonne.fr"
                  className="text-[#1A2B4B] hover:underline font-semibold"
                >
                  contact@influences-bayonne.fr
                </a>
              </p>
              <p>
                Téléphone :{" "}
                <a
                  href="tel:+33559017504"
                  className="text-[#1A2B4B] hover:underline font-semibold"
                >
                  05 59 01 75 04
                </a>
              </p>
            </div>
            <div className="bg-[#1A2B4B]/5 p-4 rounded-lg mt-4">
              <p className="text-sm text-[#1A2B4B]/80">
                <strong>Note technique :</strong> Le site est développé et
                maintenu par ANTHEA (Antoine Quendez), mais le Restaurant
                Influences reste le responsable du traitement des données
                personnelles collectées via ce site.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Données collectées */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Database className="h-5 w-5" />
              2. Données personnelles collectées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-3">
                Nous collectons les données suivantes :
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    a) Données d&apos;identification :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    b) Données de commande :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Type de menu choisi</li>
                    <li>Nombre de personnes</li>
                    <li>Montant de la commande</li>
                    <li>Message personnalisé (optionnel)</li>
                    <li>Date et heure de la commande</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    c) Données de paiement :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Les données de paiement sont traitées exclusivement par{" "}
                      <strong>Stripe</strong>
                    </li>
                    <li>
                      Aucune donnée bancaire n&apos;est stockée sur nos serveurs
                    </li>
                    <li>
                      Nous conservons uniquement l&apos;identifiant de
                      transaction Stripe
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    d) Données de navigation (cookies techniques) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cookies de session (authentification)</li>
                    <li>Cookies de panier (gestion de commande)</li>
                    <li>Adresse IP (pour la sécurité)</li>
                    <li>User-Agent (navigateur utilisé)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    e) Données d&apos;authentification (pour les
                    administrateurs) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email et mot de passe (hashé)</li>
                    <li>Rôle utilisateur (ADMIN, SUPER_ADMIN)</li>
                    <li>Date de création du compte</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finalités du traitement */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Eye className="h-5 w-5" />
              3. Finalités et base légale du traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-3">
                Nous utilisons vos données personnelles pour les finalités
                suivantes :
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    a) Exécution du contrat de vente (RGPD art. 6.1.b) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Gestion et traitement de votre commande de bon cadeau
                    </li>
                    <li>Génération et envoi du bon cadeau par email</li>
                    <li>Gestion de la relation client</li>
                    <li>Suivi de l&apos;utilisation des bons cadeaux</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    b) Obligations légales (RGPD art. 6.1.c) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Conservation des factures et documents comptables</li>
                    <li>Respect des obligations fiscales</li>
                    <li>Gestion des réclamations et litiges</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    c) Intérêt légitime (RGPD art. 6.1.f) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Amélioration de nos services</li>
                    <li>Prévention de la fraude et sécurité du site</li>
                    <li>Gestion technique du site (cookies techniques)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-[#1A2B4B]">
                <strong>Important :</strong> Nous ne vendons jamais vos données
                personnelles à des tiers. Nous ne les utilisons pas à des fins
                de marketing ou de publicité sans votre consentement explicite.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conservation des données */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Database className="h-5 w-5" />
              4. Durée de conservation des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-3">
                Nous conservons vos données personnelles pendant les durées
                suivantes :
              </p>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Données de commande :
                  </p>
                  <p>
                    <strong>10 ans</strong> à compter de la date de la commande
                    (obligation légale de conservation des documents comptables)
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Données d&apos;authentification :
                  </p>
                  <p>
                    <strong>3 ans</strong> après la dernière connexion, ou
                    jusqu&apos;à suppression du compte
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Cookies de session :
                  </p>
                  <p>
                    <strong>7 jours</strong> maximum (durée de validité de la
                    session)
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Logs et données de sécurité :
                  </p>
                  <p>
                    <strong>12 mois</strong> maximum
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2B4B]/5 p-4 rounded-lg mt-4">
              <p className="text-sm text-[#1A2B4B]/80">
                Au-delà de ces durées, vos données sont supprimées de manière
                sécurisée ou anonymisées à des fins statistiques.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Destinataires des données */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Mail className="h-5 w-5" />
              5. Destinataires des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-3">
                Vos données personnelles peuvent être transmises aux
                destinataires suivants :
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    a) Prestataires de services (sous-traitants) :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Stripe</strong> : Traitement des paiements
                      sécurisés (certifié PCI-DSS niveau 1)
                    </li>
                    <li>
                      <strong>Resend</strong> : Envoi des emails de confirmation
                      et des bons cadeaux
                    </li>
                    <li>
                      <strong>Hostinger</strong> : Hébergement du site (VPS)
                    </li>
                    <li>
                      <strong>ANTHEA</strong> : Développement et maintenance
                      technique du site
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    b) Autorités compétentes :
                  </p>
                  <p>
                    En cas d&apos;obligation légale ou de réquisition
                    judiciaire, nous pouvons être amenés à communiquer vos
                    données aux autorités compétentes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-[#1A2B4B]">
                <strong>Garanties :</strong> Tous nos prestataires sont
                contractuellement tenus de respecter le RGPD et de mettre en
                œuvre des mesures de sécurité appropriées pour protéger vos
                données.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transferts hors UE */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Globe className="h-5 w-5" />
              6. Transferts de données hors Union Européenne
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Certains de nos prestataires peuvent être situés hors de
              l&apos;Union Européenne :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Stripe</strong> : Données stockées aux États-Unis, avec
                garanties appropriées (Privacy Shield, clauses contractuelles
                types)
              </li>
              <li>
                <strong>Resend</strong> : Données stockées dans l&apos;UE
                (région Ireland - eu-west-1)
              </li>
            </ul>
            <p className="mt-3">
              Tous les transferts hors UE sont encadrés par des garanties
              appropriées conformément au RGPD (clauses contractuelles types,
              Privacy Shield, etc.).
            </p>
          </CardContent>
        </Card>

        {/* Sécurité des données */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Lock className="h-5 w-5" />
              7. Sécurité des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données personnelles :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Chiffrement :</strong> Connexions HTTPS (SSL/TLS) pour
                toutes les communications
              </li>
              <li>
                <strong>Authentification :</strong> Mots de passe hashés avec
                bcrypt (10 rounds)
              </li>
              <li>
                <strong>Paiements :</strong> Aucune donnée bancaire stockée,
                traitement exclusif par Stripe (certifié PCI-DSS)
              </li>
              <li>
                <strong>Base de données :</strong> Accès sécurisé, sauvegardes
                régulières
              </li>
              <li>
                <strong>Hébergement :</strong> Serveur sécurisé avec mises à
                jour régulières
              </li>
              <li>
                <strong>Accès :</strong> Accès restreint aux données
                personnelles, authentification requise
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-[#1A2B4B]">
                <strong>Important :</strong> Aucun système n&apos;est totalement
                sécurisé. En cas de violation de données, nous vous en
                informerons dans les meilleurs délais conformément au RGPD.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <Cookie className="h-5 w-5" />
              8. Cookies et technologies similaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <div>
              <p className="font-semibold mb-3">
                Notre site utilise uniquement des cookies techniques nécessaires
                :
              </p>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Cookies de session (Better Auth) :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Nom :</strong> better-auth.session_token
                    </li>
                    <li>
                      <strong>Durée :</strong> 7 jours (session utilisateur)
                    </li>
                    <li>
                      <strong>Finalité :</strong> Authentification et gestion de
                      session
                    </li>
                    <li>
                      <strong>Consentement :</strong> Non requis (cookie
                      technique essentiel)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#1A2B4B] mb-2">
                    Cookies de cache :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Durée :</strong> 5 minutes maximum
                    </li>
                    <li>
                      <strong>Finalité :</strong> Optimisation des performances
                      (cache de session)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-[#1A2B4B]">
                <strong>Conformité ePrivacy :</strong> Ces cookies sont
                strictement nécessaires au fonctionnement du site et ne
                nécessitent pas de consentement préalable conformément à la
                directive ePrivacy.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Gestion des cookies :</p>
              <p>
                Vous pouvez configurer votre navigateur pour refuser les
                cookies, mais cela peut affecter le fonctionnement du site. Les
                cookies de session sont essentiels pour l&apos;authentification
                et la gestion de votre panier.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Droits des utilisateurs */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <UserCheck className="h-5 w-5" />
              9. Vos droits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <p>
              Conformément au RGPD, vous disposez des droits suivants concernant
              vos données personnelles :
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  a) Droit d&apos;accès (art. 15 RGPD) :
                </p>
                <p>
                  Vous pouvez obtenir une copie de toutes les données
                  personnelles que nous détenons sur vous.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  b) Droit de rectification (art. 16 RGPD) :
                </p>
                <p>
                  Vous pouvez demander la correction de données inexactes ou
                  incomplètes.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  c) Droit à l&apos;effacement (art. 17 RGPD) :
                </p>
                <p>
                  Vous pouvez demander la suppression de vos données, sous
                  réserve des obligations légales de conservation.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  d) Droit à la limitation du traitement (art. 18 RGPD) :
                </p>
                <p>
                  Vous pouvez demander la limitation du traitement de vos
                  données dans certains cas.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  e) Droit à la portabilité (art. 20 RGPD) :
                </p>
                <p>
                  Vous pouvez recevoir vos données dans un format structuré et
                  les transmettre à un autre responsable de traitement.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  f) Droit d&apos;opposition (art. 21 RGPD) :
                </p>
                <p>
                  Vous pouvez vous opposer au traitement de vos données pour des
                  motifs légitimes.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2B4B] mb-2">
                  g) Droit de définir des directives post-mortem :
                </p>
                <p>
                  Vous pouvez définir des directives concernant le sort de vos
                  données après votre décès.
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="font-semibold mb-3">Comment exercer vos droits ?</p>
              <p className="mb-3">
                Pour exercer vos droits, contactez-nous par :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@influences-bayonne.fr"
                    className="text-[#1A2B4B] hover:underline font-semibold"
                  >
                    contact@influences-bayonne.fr
                  </a>
                </li>
                <li>
                  <strong>Courrier :</strong> Restaurant Influences, 19 Rue
                  Vieille Boucherie, 64100 Bayonne, France
                </li>
              </ul>
              <p className="mt-3 text-sm text-[#1A2B4B]/70">
                Nous répondrons à votre demande dans un délai d&apos;un mois
                maximum. Une pièce d&apos;identité pourra vous être demandée
                pour vérifier votre identité.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Réclamation CNIL */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <AlertCircle className="h-5 w-5" />
              10. Réclamation auprès de la CNIL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous avez la
              possibilité d&apos;introduire une réclamation auprès de la
              Commission Nationale de l&apos;Informatique et des Libertés (CNIL)
              :
            </p>
            <div className="bg-[#1A2B4B]/5 p-4 rounded-lg">
              <p className="font-semibold mb-2">CNIL</p>
              <p>3 Place de Fontenoy - TSA 80715</p>
              <p>75334 Paris Cedex 07</p>
              <p>
                Site web :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A2B4B] hover:underline font-semibold"
                >
                  www.cnil.fr
                </a>
              </p>
              <p>
                Téléphone :{" "}
                <a
                  href="tel:+33153732222"
                  className="text-[#1A2B4B] hover:underline font-semibold"
                >
                  01 53 73 22 22
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card className="border-[#1A2B4B]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair-display text-2xl text-[#1A2B4B]">
              <FileText className="h-5 w-5" />
              11. Modifications de la politique de confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-lato text-[#1A2B4B]">
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Toute modification sera publiée sur
              cette page avec la date de mise à jour.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour
              prendre connaissance de la dernière version de notre politique de
              confidentialité.
            </p>
            <p className="text-sm text-[#1A2B4B]/70">
              En cas de modification substantielle, nous vous en informerons par
              email ou par un avis sur le site.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-[#1A2B4B]/20 bg-gradient-to-br from-[#1A2B4B]/5 to-transparent">
          <CardHeader>
            <CardTitle className="font-playfair-display text-2xl text-[#1A2B4B]">
              12. Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-lato text-[#1A2B4B]">
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou vos données personnelles, vous pouvez nous contacter :
            </p>
            <div className="space-y-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
