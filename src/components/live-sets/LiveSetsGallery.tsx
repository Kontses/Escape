'use client';

import { useState, useEffect } from 'react';
import { Column, Flex, Text } from "@once-ui-system/core";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MusicEntryProps {
  post: {
    slug: string;
    content: MDXRemoteSerializeResult;
    metadata: {
      title: string;
      summary: string;
      publishedAt: string;
      images: string[];
      youtubeId?: string;
      albumUrl?: string;
    };
  };
}

function MusicEntry({ post }: MusicEntryProps) {
  const { title, summary, youtubeId, albumUrl } = post.metadata;

  return (
    <Column
      gap="m"
      padding="m"
      fillWidth
    >
      <Text as="h2" variant="heading-strong-xl">
        {title}
      </Text>
      {summary && <Text as="p">{summary}</Text>}

      {youtubeId && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {albumUrl && (
        <div style={{ position: 'relative', paddingBottom: '30%', height: 0, overflow: 'hidden' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={albumUrl}
            title={title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {post.content && (
        <Column gap="s">
          <MDXRemote {...post.content} />
        </Column>
      )}
    </Column>
  );
}

interface LiveSetsGalleryProps {
  initialPosts: any[]; 
}

export function LiveSetsGallery({ initialPosts }: LiveSetsGalleryProps) {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const youtubePosts = initialPosts.filter(post => post.metadata.youtubeId);
    setVideos(youtubePosts);
    if (youtubePosts.length > 0) {
      serialize(youtubePosts[0].content).then(serialized => {
        setCurrentVideo({ ...youtubePosts[0], content: serialized });
      });
    }
  }, [initialPosts]);

  const handleThumbnailClick = async (post: any) => {
    const serializedContent = await serialize(post.content);
    setCurrentVideo({ ...post, content: serializedContent });
  };

  if (videos.length === 0) {
    return <Text>Δεν βρέθηκαν μουσικά βίντεο.</Text>;
  }

  return (
    <Column gap="xl" marginBottom="40" paddingX="l" fillWidth>
      {currentVideo && (
        <Column gap="m" fillWidth>
          <MusicEntry post={currentVideo} />
        </Column>
      )}

      <Text as="h3" variant="heading-strong-s">Περισσότερα Βίντεο</Text>
      <Flex wrap gap="m" horizontal="center">
        {videos.map((video) => (
          <Column
            key={video.slug}
            onClick={() => handleThumbnailClick(video)}
            style={{ cursor: 'pointer', width: '200px', flexShrink: 0 }}
            gap="s"
          >
            {video.metadata.images && video.metadata.images.length > 0 && (
              <img
                src={video.metadata.images[0]}
                alt={video.metadata.title}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )} {(video.metadata.images.length === 0 && video.metadata.youtubeId) && (
                <img
                    src={`https://img.youtube.com/vi/${video.metadata.youtubeId}/mqdefault.jpg`}
                    alt={video.metadata.title}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                />
            )}
            <Text variant="body-default-s">{video.metadata.title}</Text>
          </Column>
        ))}
      </Flex>
    </Column>
  );
} 