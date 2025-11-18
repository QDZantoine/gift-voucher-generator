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
      // Essayer d'abord avec prismaBase, puis avec prisma si ça ne fonctionne pas
      const { prismaBase, prisma } = await import("@/lib/prisma");
      console.log(`[API Session] Recherche utilisateur avec ID: ${session.user.id}, Email: ${session.user.email}`);
      
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
        console.log(`[API Session] Utilisateur trouvé:`, {
          id: user.id,
          email: user.email,
          role: user.role,
          roleType: typeof user.role,
        });
        userRole = user.role || "ADMIN";
      } else {
        console.warn(`[API Session] Utilisateur non trouvé avec ID: ${session.user.id} ou Email: ${session.user.email}`);
      }
      
      console.log(`[API Session] Rôle final retourné pour ${session.user.email}:`, userRole);
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

