import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, tone, email } = body;
    // return NextResponse.json({
    //   // enrichedPrompt,
    //   post: `${idea} is so good.`
    // });
    if (!idea || !tone)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // --- Optional: Identify User (email) ---
    let user;
    if (email) {
      user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
      });

      // Basic rate-limit: 5 free prompts/day
      if (!user.isSubscribed && user.promptCount >= 5) {
        return NextResponse.json(
          { error: "Daily limit reached. Subscribe for unlimited." },
          { status: 403 }
        );
      }
    }

    // --- Step 1: Enrichment ---
    const enrichmentPrompt = `
The user wrote: "${idea}"
Tone: ${tone}

You are an expert social media strategist who helps users turn short ideas into highly engaging X (Twitter) posts.
Enrich this idea into a detailed context prompt describing:
1. Why it’s interesting or valuable
2. Who might care
3. What emotion or tone to use
4. A short insight or call-to-action

Output only the enriched context prompt (no post yet).
`;

    const enrichResult = await geminiModel.generateContent(enrichmentPrompt);
    const enrichedPrompt = enrichResult.response.text().trim();

    // --- Step 2: Generate X Post ---
    const postPrompt = `
Based on the following enriched context, generate a single concise, catchy X (Twitter) post under 280 characters.
The post should look like it was made by human and use at max 2 emoji.
Context:
${enrichedPrompt}
`;

    const postResult = await geminiModel.generateContent(postPrompt);
    const post = postResult.response.text().trim();

    // --- Step 3: Update usage count ---
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { promptCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      // enrichedPrompt,
      post
    });
  } catch (err: any) {
    console.error("Error in /api/generate:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
