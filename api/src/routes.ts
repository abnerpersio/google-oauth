import type { FastifyInstance } from "fastify";

import { GoogleSignInController } from "./controllers/GoogleSignInController";
import { prisma } from "./lib/prisma";
import { authMiddleware } from "./middlewares/authMiddleware";

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/google", GoogleSignInController.handle);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get("/me", async (request, reply) => {
    const { sub } = request.user as { sub: string };

    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) return reply.code(404);

    return reply.code(200).send({
      success: true,
      profile: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  });
}
