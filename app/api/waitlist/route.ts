import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

interface Entry {
  name: string;
  company: string;
  createdAt: string;
}

async function readEntries(): Promise<Entry[]> {
  try {
    const raw: unknown = JSON.parse(await readFile(DATA_FILE, "utf8"));
    return Array.isArray(raw) ? (raw as Entry[]) : [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, company } = (body ?? {}) as Record<string, unknown>;
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanCompany = typeof company === "string" ? company.trim() : "";

  if (!cleanName || !cleanCompany || cleanName.length > 120 || cleanCompany.length > 120) {
    return NextResponse.json({ error: "Name and company are required." }, { status: 400 });
  }

  const entries = await readEntries();
  const alreadyListed = entries.some(
    (e) =>
      e.name.toLowerCase() === cleanName.toLowerCase() &&
      e.company.toLowerCase() === cleanCompany.toLowerCase(),
  );

  if (!alreadyListed) {
    entries.push({ name: cleanName, company: cleanCompany, createdAt: new Date().toISOString() });
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  }

  return NextResponse.json({ ok: true });
}
