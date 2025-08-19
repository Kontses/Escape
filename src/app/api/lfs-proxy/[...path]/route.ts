import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    
    // Use the working URL from our test
    const githubUrl = `https://media.githubusercontent.com/media/Kontses/Escape/main/public/Music/${filePath}`;
    
    console.log('Proxying request to:', githubUrl);
    
    // Fetch the file from GitHub LFS
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'audio/*',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel)',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch from GitHub:', response.status, response.statusText);
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Get the content
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    
    // Return with CORS headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Range',
      },
    });
    
  } catch (error) {
    console.error('Error proxying LFS file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Range',
    },
  });
}
