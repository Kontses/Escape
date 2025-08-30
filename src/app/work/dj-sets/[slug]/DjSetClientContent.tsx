"use client";

import React, { useState } from 'react';
import { Column, Flex, Heading, Text, Button } from '@once-ui-system/core';
import Image from 'next/image';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import styles from '../../discography/[slug]/DiscographyAlbumClientContent.module.scss';
import GalleryModal from '@/components/gallery/GalleryModal';
import { formatDate } from '@/utils/formatDate';

interface DjSetClientContentProps {
  title: string;
  summary?: string;
  images?: string[];
  publishedAt?: string;
  audio?: string;
}

export function DjSetClientContent({
  title,
  summary,
  images,
  publishedAt,
  audio,
}: Readonly<DjSetClientContentProps>) {
  const { playTrack } = useMusicPlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaySet = () => {
    if (audio) {
      // Convert local paths to GitHub raw URLs if needed
      let audioSrc = audio;
      if (audio.startsWith('/Music/')) {
        const pathWithoutSlash = audio.substring(1);
        audioSrc = `https://github.com/Kontses/Escape/raw/main/public/${pathWithoutSlash}`;
      }

      const track = {
        title: title,
        src: audioSrc
      };
      playTrack(track);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Column gap="l">
      <Flex horizontal="space-between" gap="l" vertical="start">
        <Column flex="1" gap="l">
          <Flex vertical="center" horizontal="space-between">
            <Heading as="h1" variant="heading-strong-xl">{title}</Heading>
            {publishedAt && <Text variant="body-default-s">{formatDate(publishedAt)}</Text>}
          </Flex>
          {summary && <Text>{summary}</Text>}

          {audio && (
            <Column gap="s" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Button onClick={handlePlaySet}>Play Set</Button>
            </Column>
          )}

          {audio && (
            <Column gap="xs">
              <Heading as="h2" variant="heading-strong-xl">Τραγούδι</Heading>
              <Flex
                vertical="center"
                horizontal="space-between"
                gap="s"
                onClick={handlePlaySet}
                className={styles.trackItem}
                style={{
                  cursor: 'pointer',
                  padding: 'var(--spacing-s)',
                  borderRadius: '8px',
                  border: '1px solid transparent',
                  transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                }}
              >
                <Flex vertical="center" gap="s">
                  <Text>1.</Text>
                  <Text>{title}</Text>
                </Flex>
              </Flex>
            </Column>
          )}
        </Column>

        {images && images.length > 0 && (
          <Column>
            <div onClick={openModal} style={{ cursor: 'pointer' }}>
              <Image
                src={images[0]}
                alt={`Cover for ${title}`}
                width={300}
                height={300}
                style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                priority
              />
            </div>
          </Column>
        )}
      </Flex>
      {images && images.length > 0 && (
        <GalleryModal
          isOpen={isModalOpen}
          imageSrc={images[0]}
          imageAlt={`Cover for ${title}`}
          onClose={closeModal}
        />
      )}
    </Column>
  );
}