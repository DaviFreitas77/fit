
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  user: {
    additionalFields: {
      dateOfBirth: {
        type: "date",
        required: true,
        input: true,
      },
    },
  },

  emailAndPassword: {
      enabled: true,
      requireEmailVerification:false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // 1 dia
  },
});
