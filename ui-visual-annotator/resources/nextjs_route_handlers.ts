/**
 * Next.js Route Handlers for Visual Annotator Persistence
 * 
 * ============================================================================
 * 1. Next.js App Router (app/api/feedback/annotations/route.ts)
 * ============================================================================
 * Copy the code below into: `src/app/api/feedback/annotations/route.ts`
 * (or `app/api/feedback/annotations/route.ts`)
 */

/*
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve(process.cwd(), "docs");
const ANNOTATIONS_FILE = path.join(DOCS_DIR, "visual_annotations.json");
const USER_INPUT_FILE = path.join(DOCS_DIR, "UserInput.md");

function readAnnotations() {
  if (!fs.existsSync(ANNOTATIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveAnnotations(items: any[]) {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.writeFileSync(ANNOTATIONS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readAnnotations());
}

export async function POST(req: NextRequest) {
  try {
    const items = await req.json();
    saveAnnotations(items);

    const { searchParams } = new URL(req.url);
    const appendToUserInput = searchParams.get("append_to_user_input") === "true";

    if (appendToUserInput && Array.isArray(items) && items.length > 0) {
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
      let appendText = `\n\n## Visual UI Annotations (${nowStr})\n\n`;
      items.forEach((item: any, idx: number) => {
        const comp = item.target_component || item.target_tag || "Element";
        appendText += `### Annotation #${idx + 1}: [${item.category}] ${comp}\n`;
        appendText += `- **Selector**: \`${item.target_selector}\`\n`;
        if (item.dom_hierarchy) {
          appendText += `- **DOM Hierarchy**: \`${item.dom_hierarchy}\`\n`;
        }
        if (item.context_title) {
          appendText += `- **Context Container**: "${item.context_title}"\n`;
        }
        if (item.target_text) {
          appendText += `- **Target Text**: ${item.target_text}\n`;
        }
        appendText += `- **Coordinates**: x=${item.x}, y=${item.y} (Screen: ${item.screen_width}x${item.screen_height})\n`;
        appendText += `- **Page**: \`${item.page_url || "/"}\`\n`;
        appendText += `- **Requested Change**: ${item.comment}\n\n`;
      });

      fs.appendFileSync(USER_INPUT_FILE, appendText, "utf-8");
    }

    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  saveAnnotations([]);
  return NextResponse.json({ message: "All annotations cleared" });
}
*/

/**
 * ============================================================================
 * 2. Next.js App Router Single Item Delete (app/api/feedback/annotations/[id]/route.ts)
 * ============================================================================
 * Copy the code below into: `src/app/api/feedback/annotations/[id]/route.ts`
 */

/*
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve(process.cwd(), "docs");
const ANNOTATIONS_FILE = path.join(DOCS_DIR, "visual_annotations.json");

function readAnnotations() {
  if (!fs.existsSync(ANNOTATIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveAnnotations(items: any[]) {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.writeFileSync(ANNOTATIONS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const items = readAnnotations();
  const filtered = items.filter((item: any) => item.id !== id);
  saveAnnotations(filtered);
  return NextResponse.json({ message: `Deleted annotation ${id}` });
}
*/

/**
 * ============================================================================
 * 3. Next.js Pages Router (pages/api/feedback/annotations.ts)
 * ============================================================================
 * For legacy Pages Router projects:
 */

/*
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.resolve(process.cwd(), 'docs');
const ANNOTATIONS_FILE = path.join(DOCS_DIR, 'visual_annotations.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!fs.existsSync(ANNOTATIONS_FILE)) return res.status(200).json([]);
    return res.status(200).json(JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, 'utf-8')));
  } else if (req.method === 'POST') {
    if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
    fs.writeFileSync(ANNOTATIONS_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    return res.status(200).json(req.body);
  } else if (req.method === 'DELETE') {
    if (fs.existsSync(ANNOTATIONS_FILE)) fs.writeFileSync(ANNOTATIONS_FILE, '[]', 'utf-8');
    return res.status(200).json({ message: 'Cleared' });
  }
  res.status(405).end();
}
*/

