import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');

    // Construct the GitHub LFS URL
    const githubLfsUrl = `https://github.com/Kontses/Escape/raw/main/public/Music/${filePath}`;

    console.log('Fetching LFS file:', githubLfsUrl);
    console.log('Original path:', filePath);

    // Fetch the file from GitHub LFS
    const response = await fetch(githubLfsUrl, {
      headers: {
        'Accept': 'audio/*',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel)',
      },
    });

    console.log('GitHub response status:', response.status);
    console.log('GitHub response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('Failed to fetch LFS file:', response.status, response.statusText);

      // Try alternative URL format
      const alternativeUrl = `https://media.githubusercontent.com/media/Kontses/Escape/main/public/Music/${filePath}`;
      console.log('Trying alternative URL:', alternativeUrl);

      const altResponse = await fetch(alternativeUrl, {
        headers: {
          'Accept': 'audio/*',
          'User-Agent': 'Mozilla/5.0 (compatible; Vercel)',
        },
      });

      if (!altResponse.ok) {
        console.error('Alternative URL also failed:', altResponse.status, altResponse.statusText);
        return new NextResponse(`File not found. Tried: ${githubLfsUrl} and ${alternativeUrl}`, { status: 404 });
      }

      // Use alternative response
      const arrayBuffer = await altResponse.arrayBuffer();
      const contentType = altResponse.headers.get('content-type') || 'audio/mpeg';

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Accept-Ranges': 'bytes',
        },
      });
    }
    
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
