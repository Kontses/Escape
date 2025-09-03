import { NextRequest, NextResponse } from 'next/server';
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
    const { audio, title } = await req.json();

    if (!audio || !title) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const audioContent = await fetchFromGitHub(audio);

    if (!audioContent) {
      return new NextResponse('File not found', { status: 404 });
    }

    const originalFilename = path.basename(audio);
    const extension = path.extname(originalFilename);
    const sanitizedTrackTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const audioFilename = `${sanitizedTrackTitle}${extension}`;

    return new NextResponse(audioContent, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${audioFilename}"`,
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