import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { GoogleAPI } from "../services/GoogleAPI";

const schema = z.object({
  code: z.string().min(1),
  redirectURI: z.string().min(1),
});

export class GoogleSignInController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { data: input, error } = schema.safeParse(request.query);

    if (error) {
      return reply.code(400).send({ error: error.issues });
    }

    const { code, redirectURI } = input;

    const googleAccessToken = await GoogleAPI.getAccessToken({
      code,
      redirectURI,
    });
    const user = await GoogleAPI.getUserInfo(googleAccessToken);
    await GoogleAPI.revokeAccessToken(googleAccessToken);

    if (!user.verifiedEmail) {
      return reply.code(401).send({ error: "Google account is not verified" });
    }

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { googleId: user.googleId },
      create: {
        googleId: user.googleId,
        avatar: user.picture,
        email: user.email,
        firstName: user.givenName,
        lastName: user.familyName,
      },
    });

    const accessToken = await reply.jwtSign({ sub: createdUser.id });

    return reply.code(200).send({ google: true, accessToken });
  };
}
