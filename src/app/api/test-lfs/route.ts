import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter required' }, { status: 400 });
  }
  
  const githubUrl = `https://github.com/Kontses/Escape/raw/main/public/Music/${path}`;
  const mediaUrl = `https://media.githubusercontent.com/media/Kontses/Escape/main/public/Music/${path}`;
  
  try {
    // Test both URLs
    const githubResponse = await fetch(githubUrl, { method: 'HEAD' });
    const mediaResponse = await fetch(mediaUrl, { method: 'HEAD' });
    
    return NextResponse.json({
      path,
      encodedPath: encodeURIComponent(path),
      githubUrl,
      mediaUrl,
      githubStatus: githubResponse.status,
      mediaStatus: mediaResponse.status,
      githubContentType: githubResponse.headers.get('content-type'),
      mediaContentType: mediaResponse.headers.get('content-type'),
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      path,
      githubUrl,
      mediaUrl,
    }, { status: 500 });
  }
}
