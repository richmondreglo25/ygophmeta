import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { promises as fssync } from "fs";
import sharp from "sharp";

// POST handler for shop image upload.
export async function POST(req: NextRequest) {
  // Parse multipart/form-data.
  const formData = await req.formData();

  // Extract fields from form data.
  const shopName = formData.get("shopName") as string;
  const image = formData.get("image") as File;

  // Validate required fields.
  if (!shopName || !image) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  // Load shops data to find the shop.
  const shopsPath = path.join(process.cwd(), "public", "data", "shops.json");
  const shopsData = await fs.readFile(shopsPath, "utf-8");
  const shops: { name: string; logo: string }[] = JSON.parse(shopsData);

  // Find the shop by name.
  const shop = shops.find((s) => s.name === shopName);
  if (!shop) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }

  // Get the image path (should be like "/shops/xxxlogo.webp").
  const imagePath = shop.logo.startsWith("/") ? shop.logo.slice(1) : shop.logo;

  const filename = path.basename(imagePath);
  const filepath = path.resolve(process.cwd(), "public", "images", imagePath);

  // Ensure upload directory exists.
  await fssync.mkdir(path.dirname(filepath), { recursive: true });

  // Convert and save file as .webp using sharp.
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const webpBuffer = await sharp(buffer).webp().toBuffer();
  await fs.writeFile(filepath, webpBuffer);

  // Respond with success and file info.
  return NextResponse.json({ success: true, filename, url: imagePath });
}
