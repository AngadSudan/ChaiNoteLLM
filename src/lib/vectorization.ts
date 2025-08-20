import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { storeIntoDB } from "./uploadDataToVector";
import { Document } from "@langchain/core/documents";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

async function extractLinks(url: string, domain: string): Promise<string[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);

    const links: string[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      let absoluteUrl: string;
      if (href.startsWith("http")) {
        absoluteUrl = href;
      } else if (href.startsWith("/")) {
        absoluteUrl = `${domain}${href}`;
      } else {
        return; // skip other relative links like #anchor or mailto:
      }

      if (absoluteUrl.startsWith(domain)) {
        links.push(absoluteUrl.split("#")[0]); // drop anchors
      }
    });

    return [...new Set(links)]; // dedupe
  } catch (err) {
    console.error(`❌ Failed to extract links from ${url}:`, err);
    return [];
  }
}

export const vectorizeText = async (text: string, collection: string) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const chunks = await textSplitter.splitText(text);

  const docs: Document[] = chunks.map(
    (chunk, i) =>
      new Document({
        pageContent: chunk,
        metadata: { chunk: i },
      })
  );

  const vectorStore = await storeIntoDB(docs, embeddings, collection);

  return { chunks: docs, vectorStore };
};

export const vectorizePDF = async (path: string, collection: string) => {
  const loader = new PDFLoader(path);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  const vectorStore = await storeIntoDB(splitDocs, embeddings, collection);

  console.log("✅ Stored into Qdrant!");
  return vectorStore;
};

export async function vectorizeURL(
  seedUrl: string,
  collection: string,
  maxDepth = 2
) {
  const domain = new URL(seedUrl).origin;
  const visited = new Set<string>();

  async function crawl(url: string, depth: number): Promise<Document[]> {
    if (depth > maxDepth || visited.has(url)) return [];
    visited.add(url);

    console.log(`🌐 Crawling: ${url} (depth ${depth})`);

    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: { headless: true },
      gotoOptions: { waitUntil: "domcontentloaded" },
    });

    let docs: Document[] = [];
    try {
      docs = await loader.load();
    } catch (err) {
      console.error(`❌ Failed to load ${url}:`, err);
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    if (splitDocs.length > 0) {
      await storeIntoDB(splitDocs, embeddings, collection);
      console.log(`✅ Stored ${splitDocs.length} chunks from ${url}`);
    }

    const links = await extractLinks(url, domain);

    for (const link of links) {
      await crawl(link, depth + 1);
    }

    return splitDocs;
  }

  await crawl(seedUrl, 0);
  console.log("🎉 Crawl + embedding complete!");
}
