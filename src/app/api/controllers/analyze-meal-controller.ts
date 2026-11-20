import { NextResponse } from "next/server";
import { ValidationError } from "yup";
import { MealAnalysisDTO } from "../dtos/meals/analyze-meal-dto";
import { analyzeMealSchema } from "../schemas/meal-schema";
import { getVisitorId, registerVisitor } from "@/lib/guest";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY não configurada no servidor." },
      { status: 503 },
    );
  }
  const visitId = await getVisitorId();

  const verifyVisitor = await registerVisitor(visitId);
  console.log("verifyVisitor", verifyVisitor);

  if(verifyVisitor && verifyVisitor instanceof NextResponse) {
    return verifyVisitor;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "O corpo da requisição precisa ser um JSON válido." },
      { status: 400 },
    );
  }

  let description: string;
  try {
    const validatedBody = await analyzeMealSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    description = validatedBody.description;
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.errors, details: error.errors },
        { status: 400 },
      );
    }
    throw error;
  }

  const prompt = `Analise esta refeição descrita por um usuário em português brasileiro:
"${description}"

Calcule uma estimativa realista para todos os alimentos juntos e também para cada alimento individualmente, considerando a quantidade informada.
Considere medidas caseiras e porções informadas.
Retorne apenas JSON válido, sem Markdown.

Campos:
- name: nome curto e claro da refeição
- calories: número inteiro de calorias
- protein: número inteiro de proteínas em gramas
- carbs: número inteiro de carboidratos em gramas
- fat: número inteiro de gorduras em gramas
- foods: lista de todos os alimentos identificados, cada um com:
  - name: nome do alimento, incluindo a quantidade informada
  - calories: número inteiro de calorias estimadas daquele alimento
Inclua um item separado para cada alimento, nunca agrupe alimentos diferentes.

Se houver incerteza, use uma estimativa conservadora.`;

  let response: Response;
  try {
    response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        method: "POST",
        signal: AbortSignal.timeout(25_000),
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "A análise demorou demais. Tente novamente em alguns segundos."
          : "Não foi possível conectar ao Gemini.",
      },
      { status: timedOut ? 504 : 502 },
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      { error: "Não foi possível analisar a refeição.", detail },
      { status: 502 },
    );
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return NextResponse.json(
      { error: "A IA não retornou uma análise." },
      { status: 502 },
    );
  }

  try {
    const analysis = JSON.parse(text) as Partial<MealAnalysisDTO>;
    const foods = Array.isArray(analysis.foods)
      ? analysis.foods
          .map((food) => ({
            name: String(food?.name ?? "").trim(),
            calories: Math.max(0, Math.round(Number(food?.calories) || 0)),
          }))
          .filter((food) => food.name)
      : [];
    const result: MealAnalysisDTO = {
      name: String(analysis.name ?? "Refeição"),
      calories: Math.max(0, Math.round(Number(analysis.calories) || 0)),
      protein: Math.max(0, Math.round(Number(analysis.protein) || 0)),
      carbs: Math.max(0, Math.round(Number(analysis.carbs) || 0)),
      fat: Math.max(0, Math.round(Number(analysis.fat) || 0)),
      foods,
    };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "A resposta da IA não pôde ser interpretada." },
      { status: 502 },
    );
  }
}
