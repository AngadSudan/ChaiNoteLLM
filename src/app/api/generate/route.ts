import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { vectorizePDF, vectorizeText, vectorizeURL } from "@/lib/vectorization";
import { getVectorStore } from "@/lib/uploadDataToVector";
import { OpenAI } from "openai";
import { HITESH_SIR_PERSONA_RAG } from "@/lib/prompt";
/**
 * will handle a form which contains the file the file will be saved locally and then
 * based on it being a pdf,text,url the vectors will be generated
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const userCollection = formData.get("db") as string;
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // ✅ Use /tmp for ephemeral writes
    const uploadDir = "/tmp";
    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    if (file.name.endsWith(".pdf")) {
      await vectorizePDF(filePath, userCollection);
    } else if (file.name.endsWith(".txt")) {
      const content = await fs.readFile(filePath, "utf8");
      await vectorizeText(content, userCollection);
    }

    return NextResponse.json({ success: true, type: "file", file: file.name });
  }

  const text = formData.get("text") as File | null;
  if (text) {
    await vectorizeText(text as any, userCollection);
    return NextResponse.json({ success: true, type: "text", file: text });
  }
  const url = formData.get("url") as string | null;
  if (url) {
    await vectorizeURL(url, userCollection);
    return NextResponse.json({ success: true, type: "url", url });
  }

  return NextResponse.json(
    { success: false, message: "No file or url provided" },
    { status: 400 }
  );
}

export async function GET(req: NextRequest) {
  const userQuery = req.nextUrl.searchParams.get("query");
  const userCollection = req.nextUrl.searchParams.get("db");
  if (!userQuery) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const vectorStore = await getVectorStore(userCollection as string);

  const vectorRetriever = vectorStore.asRetriever({ k: 3 });
  const relevantChunks = await vectorRetriever.invoke(userQuery);

  const SYSTEM_PROMPT = HITESH_SIR_PERSONA_RAG.replace(
    "{context_content}",
    JSON.stringify(relevantChunks)
  );

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
  });

  return NextResponse.json({
    answer: response.choices[0].message.content,
  });
}
