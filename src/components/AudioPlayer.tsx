"use client";

import React, { useRef, useEffect } from 'react';
import { Flex, Text, Button, Icon, Column } from '@once-ui-system/core';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import Image from 'next/image';

interface Track {
  title: string;
  duration?: string;
  src?: string;
  albumArt?: string;
}

interface AudioPlayerProps {
  tracks: Track[];
}

export function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, playNext, playPrevious, currentTime, duration, setVolume, volume, seekTo, isMuted, toggleMute } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Add audioRef to the main audio tag in MusicPlayerContext.tsx
  // Also, set the volume on mount and when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set initial volume
    }
  }, [volume]);

  if (!currentTrack || !currentTrack.src) {
    return null; // Don't render if no track is selected
  }

  return (
    <Flex horizontal="space-between" vertical="center" gap="l" fillWidth>
      <Flex horizontal="start" vertical="center" gap="s" style={{ minWidth: '200px' }}>
        {currentTrack.albumArt && (
          <Image
            src={currentTrack.albumArt}
            alt={currentTrack.title || "Album Cover"}
            width={40}
            height={40}
            style={{ borderRadius: '4px', objectFit: 'cover' }}
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
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
              background: `linear-gradient(to right, #007acc 0%, #007acc ${(currentTime / duration) * 100}%, #555 ${(currentTime / duration) * 100}%, #555 100%)`,
              borderRadius: '5px',
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
            background: 'transparent', 
            border: 'none', 
            padding: '0', 
            minWidth: 'auto', 
            color: '#fff',
            opacity: isMuted ? '0.5' : '1'
          }}
        >
          <Icon name={isMuted ? "volumeOff" : volume > 0.5 ? "volumeHigh" : volume > 0 ? "volumeLow" : "volumeOff"} size="s" />
        </Button>
        <input
          type="range"
          value={volume * 100}
          onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
          max={100}
          min={0}
          style={{
            width: '80px',
            height: '5px',
            background: `linear-gradient(to right, #007acc 0%, #007acc ${volume * 100}%, #555 ${volume * 100}%, #555 100%)`,
            borderRadius: '5px',
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