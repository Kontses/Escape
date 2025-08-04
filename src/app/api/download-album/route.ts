import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const { tracks, images, title } = await req.json();

  if (!tracks || !images || !title) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  const zip = new JSZip();

  // Add images to zip
  for (const imagePath of images) {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      const fileContent = fs.readFileSync(fullPath);
      zip.file(path.basename(imagePath), fileContent);
    }
  }

  // Add tracks to zip
  for (const track of tracks) {
    if (track.src) {
      const fullPath = path.join(process.cwd(), 'public', track.src);
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath);
        zip.file(path.basename(track.src), fileContent);
      }
    }
  }

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

  return new NextResponse(zipContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${title}.zip"`,
    },
  });
}
