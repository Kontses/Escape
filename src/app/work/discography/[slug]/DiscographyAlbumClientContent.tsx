"use client";

import React, { useState } from 'react';
import { Column, Flex, Heading, Text, Button } from '@once-ui-system/core';
import Image from 'next/image';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import styles from './DiscographyAlbumClientContent.module.scss';
import GalleryModal from '@/components/gallery/GalleryModal';
import { formatDate } from '@/utils/formatDate';

interface Track {
  title: string;
  duration?: string;
  src?: string;
}

interface DiscographyAlbumClientContentProps {
  title: string;
  artist?: string;
  summary?: string;
  images?: string[];
  tracks?: Track[];
  publishedAt?: string;
}

export function DiscographyAlbumClientContent({
  title,
  artist,
  summary,
  images,
  tracks,
  publishedAt,
}: Readonly<DiscographyAlbumClientContentProps>) {
  const { playTrack } = useMusicPlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');

  const handlePlayAlbum = () => {
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress('Starting download...');

      const response = await fetch('/api/download-album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracks, images, title }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6);
            if (jsonStr) {
              try {
                const { progress } = JSON.parse(jsonStr);
                setDownloadProgress(`Zipping files... ${progress}%`);
              } catch (e) {
                // Not a progress update, must be zip data
                chunks.push(value);
              }
            }
          } else if (value.length > 0) {
            chunks.push(value);
          }
        }
      }

      const blob = new Blob(chunks, { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setDownloadProgress('Download complete!');
      setTimeout(() => {
        setDownloadProgress('');
        setIsDownloading(false);
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading album. Please try again.');
      setIsDownloading(false);
      setDownloadProgress('');
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
          {artist && <Text variant="body-default-s">{artist}</Text>}
          {summary && <Text>{summary}</Text>}

          {tracks && tracks.length > 0 && (
            <Column gap="s" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Flex gap="s">
                <Button onClick={handlePlayAlbum}>Play Album</Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Κατεβαίνει...' : 'Download'}
                </Button>
              </Flex>
              {downloadProgress && (
                <Text variant="body-default-s" style={{
                  color: 'var(--brand-accent)',
                  fontStyle: 'italic',
                  marginTop: '8px'
                }}>
                  {downloadProgress}
                </Text>
              )}
            </Column>
          )}

          {tracks && tracks.length > 0 && (
            <Column gap="xs">
              <Heading as="h2" variant="heading-strong-xl">Τραγούδια</Heading>
              {tracks.map((track: any, index: number) => (
                <Flex
                  key={`${track.title}-${index}`}
                  vertical="center"
                  horizontal="space-between"
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
                  <Flex vertical="center" gap="s">
                    <Text>{index + 1}.</Text>
                    <Text>{track.title}</Text>
                  </Flex>
                  {track.duration && <Text style={{ marginLeft: 'auto' }}>{track.duration}</Text>}
                </Flex>
              ))}
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