import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { tracks, images, title } = await req.json();

    if (!tracks || !images || !title) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const zip = new JSZip();

    // Add images to zip (these are typically small)
    for (const imagePath of images) {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      if (fs.existsSync(fullPath)) {
        try {
          const fileContent = fs.readFileSync(fullPath);
          zip.file(path.basename(imagePath), fileContent);
        } catch (error) {
          console.error(`Error reading image ${imagePath}:`, error);
        }
      }
    }

    // For tracks, we'll create a more efficient approach
    // Only add track info to zip, not the actual audio files to avoid size limits
    let trackList = '';
    let hasAudioFiles = false;

    for (const track of tracks) {
      trackList += `${track.title}`;
      if (track.duration) trackList += ` (${track.duration})`;
      trackList += '\n';
      
      if (track.src) {
        hasAudioFiles = true;
        // Instead of including the large audio files, add a note about where to find them
        const fullPath = path.join(process.cwd(), 'public', track.src);
        if (fs.existsSync(fullPath)) {
          trackList += `  Audio file: ${track.src}\n`;
        }
      }
    }

    // Add track listing as a text file
    zip.file('tracklist.txt', trackList);

    // Add a note about audio files if they exist
    if (hasAudioFiles) {
      const note = `Note: Audio files are available for streaming on the website.
This download package contains album artwork and track information.
For the full audio experience, please visit the album page on the website.

Album: ${title}
Tracks:
${trackList}`;
      zip.file('README.txt', note);
    }

    const zipContent = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    return new NextResponse(zipContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${title}-info.zip"`,
        'Content-Length': zipContent.length.toString()
      },
    });

  } catch (error) {
    console.error('Error creating download:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
