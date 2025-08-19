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
    
    // Fetch the file from GitHub LFS
    const response = await fetch(githubLfsUrl, {
      headers: {
        'Accept': 'audio/*',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch LFS file:', response.status, response.statusText);
      return new NextResponse('File not found', { status: 404 });
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
