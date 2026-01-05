import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const alt = "Restaurant Influences Bayonne - Bons Cadeaux";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Génération dynamique de l'image Open Graph
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(135deg, #F8F7F2 0%, #E8E7DC 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Logo/Titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#1A2B4B",
              textAlign: "center",
              fontFamily: "Georgia, serif",
            }}
          >
            Influences
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#1A2B4B",
              opacity: 0.8,
              textAlign: "center",
              letterSpacing: "2px",
            }}
          >
            RESTAURANT BAYONNE
          </div>
        </div>

        {/* Sous-titre */}
        <div
          style={{
            fontSize: 36,
            color: "#1A2B4B",
            marginTop: "40px",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          Offrez une Expérience Gastronomique Inoubliable
        </div>

        {/* Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            background: "#1A2B4B",
            color: "white",
            padding: "15px 30px",
            borderRadius: "50px",
            fontSize: 24,
            fontWeight: "600",
          }}
        >
          Bons Cadeaux
        </div>

        {/* Décoration */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #1A2B4B 0%, #3A5B8B 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #1A2B4B 0%, #3A5B8B 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}






