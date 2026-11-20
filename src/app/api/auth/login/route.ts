import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
  const { email, password } = await request.json();

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 },
    );
  }

  const passwordMatch =
    typeof user.password === "string" &&
    (await bcrypt.compare(password, user.password));
  if (!passwordMatch) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 },
    );
  }

  
}
