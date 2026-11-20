import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import bcrypt from "bcrypt";
import { userSchema } from "../../schemas/user-schema";
import * as yup from "yup";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = await userSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return Response.json(
        {
          error: "Validation error",
          messages: error.errors,
        },
        { status: 400 },
      );
    }
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json({ error: "Email already exists." }, { status: 409 });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
