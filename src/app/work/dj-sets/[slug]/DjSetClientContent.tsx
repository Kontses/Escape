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
  artist?: string;
  summary?: string;
  images?: string[];
  publishedAt?: string;
  audio?: string;
}

export function DjSetClientContent({
  title,
  artist,
  summary,
  images,
  publishedAt,
  audio,
}: Readonly<DjSetClientContentProps>) {
  const { playTrack } = useMusicPlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');

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

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      const response = await fetch('/api/download-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio, title }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setIsDownloading(false);

    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading set. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <Column gap="l">
      <Flex horizontal="space-between" gap="l" vertical="start">
        <Column flex="1" gap="l">
          <Flex vertical="center" horizontal="space-between">
            <Heading as="h1" variant="heading-strong-xl">{title}</Heading>
            {publishedAt && <Text variant="body-default-s">{formatDate(publishedAt)}</Text>}
          </Flex>
          {artist && <Heading as="h2" variant="heading-strong-m">{artist}</Heading>}
          {summary && <Text>{summary}</Text>}

          {audio && (
            <Column gap="s" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Flex gap="s">
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Κατεβαίνει...' : 'Download'}
                </Button>
              </Flex>
            </Column>
          )}

          {audio && (
            <Column gap="xs">
              <Heading as="h2" variant="heading-strong-xl">Sets</Heading>
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