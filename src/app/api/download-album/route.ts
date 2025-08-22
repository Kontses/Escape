import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import path from 'path';

// Helper function to fix corrupted Greek characters in paths
function fixGreekCharacters(path: string): string {
  // Map corrupted paths to correct ones
  const pathMappings: { [key: string]: string } = {
    '??????????-???????': 'Ανθυγιεινή-μουσική',
    // Add more mappings as needed
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
    // Remove leading slash if present and ensure proper path format
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

    // Fix corrupted Greek characters
    const fixedPath = fixGreekCharacters(cleanPath);

    // Properly encode the URL to handle Greek characters and special characters
    const encodedPath = fixedPath.split('/').map(segment => encodeURIComponent(segment)).join('/');

    // Try both LFS and raw GitHub URLs
    const urls = [
      `https://media.githubusercontent.com/media/Kontses/Escape/main/public/${encodedPath}`,
      `https://github.com/Kontses/Escape/raw/main/public/${encodedPath}`,
    ];

    let response: Response | null = null;
    let workingUrl = '';

    for (const url of urls) {
      console.log('Trying URL:', url);

      try {
        const testResponse = await fetch(url, {
          headers: {
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
      console.error('All URLs failed for:', filePath);
      return null;
    }

    console.log('Successfully fetched from:', workingUrl);
    return await response.arrayBuffer();
  } catch (error) {
    console.error(`Error fetching file ${filePath}:`, error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get the raw body text first to preserve encoding
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    // Parse the JSON manually to preserve UTF-8 encoding
    const { tracks, images, title } = JSON.parse(bodyText);

    console.log('Download request received:', {
      title,
      tracksCount: tracks?.length || 0,
      imagesCount: images?.length || 0,
      tracks: tracks?.map((t: any) => ({ title: t.title, src: t.src })) || [],
      images: images || []
    });

    if (!tracks || !images || !title) {
      console.error('Missing required parameters:', { tracks: !!tracks, images: !!images, title: !!title });
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const zip = new JSZip();

    // Add images to zip (these are typically small)
    for (const imagePath of images) {
      try {
        const fileContent = await fetchFromGitHub(imagePath);
        if (fileContent) {
          zip.file(path.basename(imagePath), fileContent);
          console.log(`Successfully added image: ${imagePath}`);
        } else {
          console.warn(`Could not fetch image: ${imagePath}`);
        }
      } catch (error) {
        console.error(`Error processing image ${imagePath}:`, error);
      }
    }

    // Add audio files to zip
    let trackList = '';
    let audioFilesAdded = 0;

    for (const track of tracks) {
      trackList += `${track.title}`;
      if (track.duration) trackList += ` (${track.duration})`;
      trackList += '\n';

      if (track.src) {
        console.log(`Processing audio file: ${track.src}`);

        try {
          const audioContent = await fetchFromGitHub(track.src);
          if (audioContent) {
            // Use track title for filename, fallback to original filename
            const originalFilename = path.basename(track.src);
            const extension = path.extname(originalFilename);
            const sanitizedTrackTitle = track.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const audioFilename = `${sanitizedTrackTitle}${extension}`;

            zip.file(audioFilename, audioContent);
            audioFilesAdded++;
            console.log(`Successfully added audio file: ${audioFilename} (${audioContent.byteLength} bytes)`);
            trackList += `  ✓ Audio file included: ${audioFilename}\n`;
          } else {
            console.warn(`Could not fetch audio file: ${track.src}`);
            trackList += `  ✗ Audio file not available: ${track.src}\n`;
          }
        } catch (error) {
          console.error(`Error processing audio file ${track.src}:`, error);
          trackList += `  ✗ Error loading audio file: ${track.src}\n`;
        }
      }
    }

    // Add track listing as a text file
    zip.file('tracklist.txt', trackList);

    // Add README with album info
    const note = `${title} - Complete Album Download

This package contains:
- Album artwork (${images.length} image${images.length !== 1 ? 's' : ''})
- Audio files (${audioFilesAdded} of ${tracks.length} track${tracks.length !== 1 ? 's' : ''})
- Track listing

Album: ${title}
Total tracks: ${tracks.length}
Audio files included: ${audioFilesAdded}

Track listing:
${trackList}

Enjoy your music!`;

    zip.file('README.txt', note);

    const zipContent = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    console.log('Zip created successfully, size:', zipContent.length);

    // Sanitize filename to avoid issues with special characters
    const sanitizedTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    return new NextResponse(zipContent as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}-info.zip"`,
        'Content-Length': zipContent.length.toString()
      },
    });

  } catch (error) {
    console.error('Error creating download:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
