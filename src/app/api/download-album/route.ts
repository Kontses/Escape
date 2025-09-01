import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import path from 'path';

// Helper function to fix corrupted Greek characters in paths
function fixGreekCharacters(path: string): string {
  const pathMappings: { [key: string]: string } = {
    '??????????-???????': 'Ανθυγιεινή-μουσική',
  };

  let fixedPath = path;
  for (const [corrupted, correct] of Object.entries(pathMappings)) {
    fixedPath = fixedPath.replace(corrupted, correct);
  }

  return fixedPath;
}

// Helper function to fetch file from GitHub LFS
async function fetchFromGitHub(filePath: string): Promise<ArrayBuffer | null> {
  try {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const fixedPath = fixGreekCharacters(cleanPath);
    const encodedPath = fixedPath.split('/').map(segment => encodeURIComponent(segment)).join('/');

    const urls = [
      `https://media.githubusercontent.com/media/Kontses/Escape/main/public/${encodedPath}`,
      `https://github.com/Kontses/Escape/raw/main/public/${encodedPath}`,
    ];

    let response: Response | null = null;

    for (const url of urls) {
      try {
        const testResponse = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Vercel)' },
        });
        if (testResponse.ok) {
          response = testResponse;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!response || !response.ok) {
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tracks, images, title } = await req.json();

    if (!tracks || !images || !title) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        const zip = new JSZip();
        const totalFiles = images.length + tracks.filter((t: any) => t.src).length;
        let filesProcessed = 0;

        const updateProgress = () => {
          filesProcessed++;
          const progress = Math.round((filesProcessed / totalFiles) * 100);
          controller.enqueue(`data: ${JSON.stringify({ progress })}\n\n`);
        };

        for (const imagePath of images) {
          const fileContent = await fetchFromGitHub(imagePath);
          if (fileContent) {
            zip.file(path.basename(imagePath), fileContent);
          }
          updateProgress();
        }

        for (const track of tracks) {
          if (track.src) {
            const audioContent = await fetchFromGitHub(track.src);
            if (audioContent) {
              const originalFilename = path.basename(track.src);
              const extension = path.extname(originalFilename);
              const sanitizedTrackTitle = track.title.replace(/[^\[\w\s-\]]/g, '').replace(/\s+/g, '-');
              const audioFilename = `${sanitizedTrackTitle}${extension}`;
              zip.file(audioFilename, audioContent);
            }
            updateProgress();
          }
        }

        const zipStream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });

        zipStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        zipStream.on('end', () => {
          controller.close();
        });

        zipStream.on('error', (err) => {
          controller.error(err);
        });
      },
    });

    const sanitizedTitle = title.replace(/[^\[\w\s-\]]/g, '').replace(/\s+/g, '-');

    return new NextResponse(readableStream as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}-info.zip"`,
      },
    });

  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}