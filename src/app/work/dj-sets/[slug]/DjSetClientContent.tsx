"use client";

import React, { useState } from 'react';
import { Column, Flex, Heading, Text, Button } from '@once-ui-system/core';
import Image from 'next/image';
import { useMusicPlayer } from '@/components/MusicPlayerContext';
import styles from '../../discography/[slug]/DiscographyAlbumClientContent.module.scss';
import GalleryModal from '@/components/gallery/GalleryModal';
import { formatDate } from '@/utils/formatDate';
import { AudioPlayer } from '@/components';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <AudioPlayer src={audio} />
            </div>
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