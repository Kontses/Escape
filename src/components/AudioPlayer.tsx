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
  tracks: Track[];
}

export function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, playNext, playPrevious, currentTime, duration, setVolume, volume } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
    }
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
        {currentTrack.src && (
          <Image
            src={currentTrack.src.replace(".wav", ".jpg")}
            alt={currentTrack.title || "Track Cover"}
            width={40}
            height={40}
            style={{ borderRadius: '4px' }}
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
              height: '5px',
              background: '#555',
              borderRadius: '5px',
              outline: 'none',
              opacity: '0.7',
              transition: 'opacity .2s',
              WebkitAppearance: 'none',
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
          <Text style={{ color: '#ccc', fontSize: '0.8em' }}>{formatTime(duration)}</Text>
        </Flex>
      </Flex>

      <Flex horizontal="end" vertical="center" gap="s" style={{ minWidth: '100px' }}>
        <Text style={{ color: '#ccc', fontSize: '0.8em' }}>Volume</Text>
        <input
          type="range"
          value={volume * 100}
          onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
          max={100}
          min={0}
          style={{
            width: '80px',
            height: '5px',
            background: '#555',
            borderRadius: '5px',
            outline: 'none',
            opacity: '0.7',
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