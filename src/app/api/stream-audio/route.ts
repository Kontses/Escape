import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioPath = searchParams.get('path');
  
  if (!audioPath) {
    return new NextResponse('Missing audio path', { status: 400 });
  }

  try {
    const fullPath = path.join(process.cwd(), 'public', audioPath);
    
    // Security check - ensure the path is within public directory
    const resolvedPath = path.resolve(fullPath);
    const publicDir = path.resolve(process.cwd(), 'public');
    
    if (!resolvedPath.startsWith(publicDir)) {
      return new NextResponse('Invalid path', { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(fullPath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    if (range) {
      // Handle range requests for audio streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const fileStream = fs.createReadStream(fullPath, { start, end });
      
      return new NextResponse(fileStream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'audio/wav',
        },
      });
    } else {
      // Serve the entire file
      const fileStream = fs.createReadStream(fullPath);
      
      return new NextResponse(fileStream as any, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'audio/wav',
          'Accept-Ranges': 'bytes',
        },
      });
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}