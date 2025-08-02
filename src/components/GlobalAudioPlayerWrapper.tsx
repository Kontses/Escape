"use client";

import React from 'react';
import { Flex } from '@once-ui-system/core';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useMusicPlayer } from '@/components/MusicPlayerContext';

export function GlobalAudioPlayerWrapper() {
  const { currentTrack } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <Flex
      position="fixed"
      bottom="0"
      fillWidth
      style={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.5)', padding: 'var(--spacing-s) var(--spacing-l)', zIndex: 100 }}
    >
      <AudioPlayer />
    </Flex>
  );
}