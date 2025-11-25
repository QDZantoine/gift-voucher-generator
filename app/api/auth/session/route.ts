import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Récupérer le rôle de l'utilisateur depuis la base de données
    let userRole = "ADMIN"; // Valeur par défaut
    try {
      // Essayer d'abord avec prismaBase
      const { prismaBase } = await import("@/lib/prisma");
      
      // Essayer de trouver par email d'abord (plus fiable)
      let user = await prismaBase.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, email: true, role: true },
      });
      
      // Si pas trouvé par email, essayer par ID
      if (!user) {
        user = await prismaBase.user.findUnique({
          where: { id: session.user.id },
          select: { id: true, name: true, email: true, role: true },
        });
      }
      
      if (user) {
        userRole = user.role || "ADMIN";
      }
    } catch (roleError) {
      // Si l'erreur vient de la récupération du rôle, on continue avec ADMIN par défaut
      console.error("Erreur lors de la récupération du rôle:", roleError);
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

