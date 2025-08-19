import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');

    // Try multiple URL formats for GitHub LFS
    const urls = [
      `https://media.githubusercontent.com/media/Kontses/Escape/main/public/Music/${filePath}`,
      `https://github.com/Kontses/Escape/raw/main/public/Music/${filePath}`,
    ];

    console.log('Fetching LFS file for path:', filePath);

    let response: Response | null = null;
    let workingUrl = '';

    for (const url of urls) {
      console.log('Trying URL:', url);

      try {
        const testResponse = await fetch(url, {
          headers: {
            'Accept': 'audio/*',
            'User-Agent': 'Mozilla/5.0 (compatible; Vercel)',
          },
        });

        console.log(`Response status for ${url}:`, testResponse.status);

        if (testResponse.ok) {
          response = testResponse;
          workingUrl = url;
          break;
        }
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        continue;
      }
    }

    if (!response || !response.ok) {
      console.error('All URLs failed');
      return new NextResponse(`File not found. Tried URLs: ${urls.join(', ')}`, { status: 404 });
    }

    console.log('Successfully fetched from:', workingUrl);
    
    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    
    // Stream the response
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
    
  } catch (error) {
    console.error('Error serving LFS audio file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
