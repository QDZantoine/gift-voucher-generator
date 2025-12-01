/**
 * JSON-LD Schema.org pour les Bons Cadeaux
 * @see https://schema.org/Product
 * @see https://schema.org/Offer
 */

interface GiftCardProductJsonLdProps {
  name?: string;
  price?: number;
  description?: string;
}

export function GiftCardProductJsonLd({
  name = "Bon Cadeau Restaurant Influences",
  price,
  description = "Offrez une expérience gastronomique inoubliable avec nos bons cadeaux personnalisés. Valable 1 an.",
}: GiftCardProductJsonLdProps = {}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://influences-bayonne.fr/#giftcard",
    name,
    description,
    image: [
      "https://influences-bayonne.fr/images/logo-bleu.svg",
      "https://influences-bayonne.fr/opengraph-image",
    ],
    brand: {
      "@type": "Brand",
      name: "Restaurant Influences",
      logo: "https://influences-bayonne.fr/images/logo-bleu.svg",
    },
    category: "Gift Card",
    offers: {
      "@type": "Offer",
      url: "https://influences-bayonne.fr",
      priceCurrency: "EUR",
      price: price?.toString() || "variable",
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Restaurant",
        name: "Restaurant Influences",
        url: "https://restaurant-influences.fr",
      },
      validFrom: new Date().toISOString(),
      itemCondition: "https://schema.org/NewCondition",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FR",
        },
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Validité",
        value: "1 an",
      },
      {
        "@type": "PropertyValue",
        name: "Type",
        value: "Bon Cadeau Numérique",
      },
      {
        "@type": "PropertyValue",
        name: "Livraison",
        value: "Email instantané",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "85",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}


