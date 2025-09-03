"use client";

import React, { useState } from 'react';
import { Flex } from '@once-ui-system/core';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useMusicPlayer } from '@/components/MusicPlayerContext';

export function GlobalAudioPlayerWrapper() {
  const { currentTrack } = useMusicPlayer();
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <Flex
      position="fixed"
      bottom="0"
      fillWidth
      style={{
        backdropFilter: 'blur(10px)',
        background: 'rgba(0,0,0,0.5)',
        padding: 'var(--spacing-s) var(--spacing-l)',
        zIndex: 100,
        transform: isMinimized ? 'translateY(calc(100% - 40px))' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <AudioPlayer isMinimized={isMinimized} toggleMinimize={toggleMinimize} />
    </Flex>
  );
}