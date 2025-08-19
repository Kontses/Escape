"use client";

import React, { useRef, useEffect } from 'react';
import { Flex, Text, Button, Icon, Column } from '@once-ui-system/core';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import Image from 'next/image';

interface Track {
  title: string;
  duration?: string;
  src?: string;
}

interface AudioPlayerProps {
  readonly src?: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
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
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause]);

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
      <Flex horizontal="start" vertical="center" gap="s" style={{ minWidth: '200px' }}>
        {currentTrack.src && (
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#1db954',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="music" size="s" style={{ color: '#fff', zIndex: 1 }} />
            <Image
              src={(() => {
                // Extract the album folder path and use cover.png
                const srcPath = currentTrack.src || '';
                const pathParts = srcPath.split('/');
                const albumFolder = pathParts.slice(0, -1).join('/'); // Remove filename
                return `${albumFolder}/cover.png`;
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
                zIndex: 2
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
          <Text style={{ color: '#fff', fontSize: '0.9em' }}>{currentTrack?.title}</Text>
          {currentTrack?.duration && <Text style={{ color: '#ccc', fontSize: '0.8em' }}>{currentTrack?.duration}</Text>}
        </Column>
      </Flex>

      <Flex direction="column" flex={1} horizontal="center" gap="xs">
        <Flex horizontal="center" gap="m">
          <Button onClick={playPrevious} size="s" style={{ background: 'transparent', border: 'none', padding: '0', minWidth: 'auto', color: '#fff' }}>
            <Icon name="backward" size="m" />
          </Button>
          <Button onClick={togglePlayPause} size="l" style={{ background: 'transparent', border: 'none', padding: '0', minWidth: 'auto', color: '#fff', transform: 'scale(1.2)' }}>
            <Icon name={isPlaying ? "pause" : "play"} size="xl" />
          </Button>
          <Button onClick={playNext} size="s" style={{ background: 'transparent', border: 'none', padding: '0', minWidth: 'auto', color: '#fff' }}>
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

      <Flex horizontal="end" vertical="center" gap="s" style={{ minWidth: '120px' }}>
        <Button
          onClick={toggleMute}
          size="s"
          style={{
            background: isMuted ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${isMuted ? '#ff6b6b' : 'rgba(255, 255, 255, 0.3)'}`,
            padding: '6px',
            minWidth: 'auto',
            color: isMuted ? '#ff6b6b' : '#fff',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
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
    </Flex>
  );
}