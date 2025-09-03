"use client";

import React, { useRef, useEffect } from 'react';
import { Flex, Text, Button, Icon, Column } from '@once-ui-system/core';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import Image from 'next/image';
import Link from 'next/link';

interface AudioPlayerProps {
  readonly src?: string;
  readonly isMinimized?: boolean;
  readonly toggleMinimize?: () => void;
}

export function AudioPlayer({ src, isMinimized, toggleMinimize }: AudioPlayerProps) {
  const { currentTrack, isPlaying, togglePlayPause, playNext, playPrevious, currentTime, duration, setVolume, volume, playTrack, isMuted, toggleMute, seek } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  // If src prop is provided, create a track and play it
  useEffect(() => {
    if (src && !currentTrack) {
      const filename = src.split('/').pop()?.replace(/\.(mp3|wav|m4a)$/, '') || 'Unknown Track';

      // Convert local paths to GitHub raw URLs
      let audioSrc = src;
      if (src.startsWith('/Music/')) {
        // Remove the leading slash and convert to GitHub raw URL
        const pathWithoutSlash = src.substring(1); // Remove leading /
        audioSrc = `https://github.com/Kontses/Escape/raw/main/public/${pathWithoutSlash}`;
      }

      const track = {
        title: filename.replace(/[-_]/g, ' '),
        src: audioSrc
      };
      playTrack(track);
    }
  }, [src, currentTrack, playTrack]);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to get album slug from track src
  const getAlbumSlug = (trackSrc: string): string | null => {
    // Extract album folder from path like "/Music/Discography/Ανθυγιεινή-μουσική/1 Intro.wav"
    // or from GitHub URL like "https://github.com/Kontses/Escape/raw/main/public/Music/Discography/Ανθυγιεινή-μουσική/1 Intro.wav"

    let albumFolder = '';

    if (trackSrc.includes('github.com')) {
      // Extract from GitHub URL
      const pathMatch = /\/public\/Music\/Discography\/([^/]+)\//.exec(trackSrc);
      if (pathMatch) {
        albumFolder = pathMatch[1];
      }
    } else {
      // Extract from local path
      const pathMatch = /\/Music\/Discography\/([^/]+)\//.exec(trackSrc);
      if (pathMatch) {
        albumFolder = pathMatch[1];
      }
    }

    // Map album folder to slug
    // For now, we'll use a simple mapping. In the future, this could be dynamic
    const albumMapping: Record<string, string> = {
      'Ανθυγιεινή-μουσική': 'demo-album'
    };

    return albumMapping[albumFolder] || null;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.ctrlKey && e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.ctrlKey && e.code === 'Comma') { // Ctrl + < (comma key)
        e.preventDefault();
        playPrevious();
      } else if (e.ctrlKey && e.code === 'Period') { // Ctrl + > (period key)
        e.preventDefault();
        playNext();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, toggleMute, playPrevious, playNext]);

  // Set volume on mount and when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentTrack?.src) {
    return null; // Don't render if no track is selected
  }

  // Determine volume icon
  const getVolumeIcon = () => {
    if (isMuted) return "volumeOff";
    if (volume > 0.5) return "volumeUp";
    if (volume > 0) return "volumeDown";
    return "volumeOff";
  };

  return (
    <Flex horizontal="space-between" vertical="center" gap="l" fillWidth>
      <Flex horizontal="start" vertical="center" gap="s" style={{ minWidth: '200px', opacity: isMinimized ? 0 : 1, transition: 'opacity 0.3s' }}>
        {currentTrack.src && (
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="music" size="s" style={{ color: '#666' }} />
            <Image
              src={(() => {
                // Get the cover image path
                const srcPath = currentTrack.src || '';
                if (srcPath.includes('github.com')) {
                  // If it's a GitHub URL, convert to local path for cover
                  const pathMatch = /\/public\/(.+)\/[^/]+\.(wav|mp3|m4a)$/.exec(srcPath);
                  if (pathMatch) {
                    return `/${pathMatch[1]}/cover.png`;
                  }
                } else {
                  // If it's a local path, replace filename with cover.png
                  return srcPath.replace(/\/[^/]+\.(wav|mp3|m4a)$/, '/cover.png');
                }
                return '';
              })()}
              alt={currentTrack.title || "Track Cover"}
              width={40}
              height={40}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '4px',
                objectFit: 'cover',
                zIndex: 1
              }}
              onError={(e) => {
                // Hide the image on error, showing the music icon behind
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        <Column>
          {(() => {
            const albumSlug = currentTrack?.src ? getAlbumSlug(currentTrack.src) : null;

            if (albumSlug) {
              return (
                <Link
                  href={`/work/discography/${albumSlug}`}
                  style={{
                    color: '#fff',
                    fontSize: '0.9em',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1db954';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                  title="Go to album page"
                >
                  {currentTrack?.title}
                </Link>
              );
            } else {
              return (
                <Text style={{ color: '#fff', fontSize: '0.9em' }}>
                  {currentTrack?.title}
                </Text>
              );
            }
          })()}
          {currentTrack?.duration && <Text style={{ color: '#ccc', fontSize: '0.8em' }}>{currentTrack?.duration}</Text>}
        </Column>
      </Flex>

      <Flex direction="column" flex={1} horizontal="center" gap="xs" style={{ opacity: isMinimized ? 0 : 1, transition: 'opacity 0.3s' }}>
        <Flex horizontal="center" vertical="center" gap="m">
          <Button
            onClick={playPrevious}
            size="s"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              minWidth: 'auto',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Previous (Ctrl + <)"
          >
            <Icon name="backward" size="m" />
          </Button>
          <Button
            onClick={togglePlayPause}
            size="l"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              minWidth: 'auto',
              color: '#fff',
              transform: 'scale(1.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Play/Pause (Space)"
          >
            <Icon name={isPlaying ? "pause" : "play"} size="xl" />
          </Button>
          <Button
            onClick={playNext}
            size="s"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              minWidth: 'auto',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Next (Ctrl + >)"
          >
            <Icon name="forward" size="m" />
          </Button>
        </Flex>
        <Flex horizontal="center" gap="s" fillWidth>
          <Text style={{ color: '#ccc', fontSize: '0.8em' }}>{formatTime(currentTime)}</Text>
          <input
            type="range"
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            style={{
              flex: 1,
              height: '6px',
              background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / duration) * 100}%, #555 ${(currentTime / duration) * 100}%, #555 100%)`,
              borderRadius: '3px',
              outline: 'none',
              opacity: '0.8',
              transition: 'opacity .2s',
              WebkitAppearance: 'none',
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
          <Text style={{ color: '#ccc', fontSize: '0.8em' }}>{formatTime(duration)}</Text>
        </Flex>
      </Flex>

      <Flex horizontal="end" vertical="center" gap="s" style={{ minWidth: '120px', opacity: isMinimized ? 0 : 1, transition: 'opacity 0.3s' }}>
        <Button
          onClick={toggleMute}
          size="s"
          style={{
            background: isMuted ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            border: `2px solid ${isMuted ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)'}`,
            padding: '8px',
            minWidth: 'auto',
            color: isMuted ? '#ff6b6b' : '#fff',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
          title={isMuted ? 'Unmute (Ctrl + M)' : 'Mute (Ctrl + M)'}
        >
          <Icon name={getVolumeIcon()} size="s" />
        </Button>
        <input
          type="range"
          value={isMuted ? 0 : volume * 100}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value) / 100;
            setVolume(newVolume);
          }}
          max={100}
          min={0}
          style={{
            width: '80px',
            height: '4px',
            background: `linear-gradient(to right, #1db954 0%, #1db954 ${isMuted ? 0 : volume * 100}%, #555 ${isMuted ? 0 : volume * 100}%, #555 100%)`,
            borderRadius: '2px',
            outline: 'none',
            opacity: '0.8',
            transition: 'opacity .2s',
            WebkitAppearance: 'none',
            appearance: 'none',
            cursor: 'pointer',
          }}
        />
      </Flex>
      <Button
        onClick={toggleMinimize}
        size="s"
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0',
          minWidth: 'auto',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: isMinimized ? '-25px' : '10px',
          right: '20px',
          transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'all 0.3s ease-in-out',
        }}
        title={isMinimized ? 'Show Player' : 'Minimize Player'}
      >
        <Icon name="chevron-down" size="m" />
      </Button>
    </Flex>
  );
}