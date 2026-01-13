import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { promises as fssync } from "fs";
import sharp from "sharp";
import { Player } from "@/types/player";

const DATA_PATH = path.resolve(process.cwd(), "public/data/players.json");

// POST handler for profile image upload.
export async function POST(req: NextRequest) {
  // Parse multipart/form-data.
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const file = formData.get("image") as File;

  // Validate required fields.
  if (!name || !file) {
    return NextResponse.json(
      { error: "Missing name or file" },
      { status: 400 }
    );
  }

  // Read players.json.
  const playersRaw = await fs.readFile(DATA_PATH, "utf8");
  const players = JSON.parse(playersRaw);

  // Find player by name (case-insensitive).
  const player = players.find(
    (p: Player) => p.name && p.name.toLowerCase() === name.toLowerCase()
  );

  // Validate player and imagePath.
  if (!player || !player.imagePath) {
    return NextResponse.json(
      { error: "Player or imagePath not found" },
      { status: 404 }
    );
  }

  // Get the image path (should be like "/people/xxx.webp").
  const imagePath = player.imagePath.startsWith("/")
    ? player.imagePath.slice(1)
    : player.imagePath;

  const filename = path.basename(imagePath);
  const filepath = path.resolve(process.cwd(), "public", "images", imagePath);

  // Ensure upload directory exists.
  await fssync.mkdir(path.dirname(filepath), { recursive: true });

  // Convert and save file as .webp using sharp.
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const webpBuffer = await sharp(buffer).toBuffer();
  await fs.writeFile(filepath, webpBuffer);

  // Respond with success and file info.
  return NextResponse.json({ success: true, filename, url: imagePath });
}
