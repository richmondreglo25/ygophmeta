import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// POST handler for deck image upload.
export async function POST(req: NextRequest) {
  // Parse multipart/form-data.
  const formData = await req.formData();

  // Extract fields from form data.
  const eventId = formData.get("eventId") as string;
  const winnerPosition = formData.get("winnerPosition") as string;
  const deckImage = formData.get("deckImage") as File;

  // Validate required fields.
  if (!eventId || !winnerPosition || !deckImage) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // Build upload directory and file path.
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "images",
    "events",
    eventId
  );
  const filename = `${winnerPosition}.webp`;
  const filepath = path.join(uploadDir, filename);

  // Ensure upload directory exists.
  await fs.mkdir(uploadDir, { recursive: true });

  // Convert and save file as .webp using sharp.
  const arrayBuffer = await deckImage.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const webpBuffer = await sharp(buffer).webp().toBuffer();
  await fs.writeFile(filepath, webpBuffer);

  // Optionally, save metadata (eventId, winnerPosition, filename) to a JSON file or database here.

  // Respond with success and file info.
  return NextResponse.json({
    success: true,
    filename,
    url: `/images/events/${eventId}/${filename}`,
  });
}
