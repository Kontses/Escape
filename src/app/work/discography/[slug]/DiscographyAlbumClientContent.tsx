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
    if (isDownloading) return; // Prevent multiple downloads

    try {
      setIsDownloading(true);
      setDownloadProgress('Προετοιμασία κατεβάσματος...');
      console.log('Starting download for:', { title, tracks: tracks?.length, images: images?.length });

      setDownloadProgress('Κατέβασμα αρχείων από τον διακομιστή...');
      const response = await fetch('/api/download-album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ tracks, images, title }),
      });

      if (response.ok) {
        setDownloadProgress('Δημιουργία αρχείου zip...');
        const blob = await response.blob();

        setDownloadProgress('Ξεκινάει το κατέβασμα...');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setDownloadProgress('Κατέβασμα ολοκληρώθηκε!');
        console.log('Download completed successfully');

        // Clear success message after 2 seconds
        setTimeout(() => {
          setDownloadProgress('');
          setIsDownloading(false);
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Download failed:', response.status, errorText);

        let errorMessage = 'Αποτυχία κατεβάσματος άλμπουμ';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        } catch {
          // If not JSON, use the raw error text
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        }

        alert(errorMessage);
        setIsDownloading(false);
        setDownloadProgress('');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Σφάλμα κατά το κατέβασμα του άλμπουμ. Παρακαλώ δοκιμάστε ξανά.');
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