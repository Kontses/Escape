"use client";

import React from 'react';
import { Column, Flex, Heading, Text, Button } from '@once-ui-system/core';
import Image from 'next/image';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import styles from './DiscographyAlbumClientContent.module.scss';

interface Track {
  title: string;
  duration?: string;
  src?: string;
}

interface DiscographyAlbumClientContentProps {
  title: string;
  summary?: string;
  images?: string[];
  tracks?: Track[];
}

export function DiscographyAlbumClientContent({ title, summary, images, tracks }: Readonly<DiscographyAlbumClientContentProps>) {
  const { playTrack } = useMusicPlayer();

  const handlePlayAlbum = () => {
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <Column gap="l">
      <Flex horizontal="space-between" gap="l" vertical="start">
        <Column flex="1" gap="l">
          <Heading as="h1" variant="heading-strong-xl">{title}</Heading>
          {summary && <Text>{summary}</Text>}

          {tracks && tracks.length > 0 && (
            <Button onClick={handlePlayAlbum} style={{ marginTop: '20px', marginBottom: '20px' }}>
              Play Album
            </Button>
          )}

          {tracks && tracks.length > 0 && (
            <Column gap="xs">
              <Heading as="h2" variant="heading-strong-xl">Τραγούδια</Heading>
              {tracks.map((track: any, index: number) => (
                <Flex
                  key={`${track.title}-${index}`}
                  vertical="center"
                  gap="s"
                  onClick={() => playTrack(track, tracks)}
                  className={styles.trackItem}
                  style={{
                    cursor: 'pointer',
                    padding: 'var(--spacing-s)',
                    borderRadius: '8px',
                    border: '1px solid transparent',
                    transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                  }}
                >
                  <Text>{index + 1}.</Text>
                  <Text>{track.title}</Text>
                  {track.duration && <Text>{track.duration}</Text>}
                </Flex>
              ))}
            </Column>
          )}
        </Column>

        {images && images.length > 0 && (
          <Column>
            <Image
              src={images[0]}
              alt={`Cover for ${title}`}
              width={300}
              height={300}
              style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
              priority
            />
          </Column>
        )}
      </Flex>
    </Column>
  );
}