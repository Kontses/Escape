'use client';

import { useState, useEffect } from 'react';
import { Column, Flex, Text, Grid } from "@once-ui-system/core";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MusicVideoEntryProps {
  post: {
    slug: string;
    content: MDXRemoteSerializeResult;
    metadata: {
      title: string;
      summary: string;
      publishedAt: string;
      images: string[];
      youtubeId?: string;
    };
  };
  isFeatured?: boolean;
}

function MusicVideoEntry({ post, isFeatured = false }: MusicVideoEntryProps) {
  const { title, summary, youtubeId } = post.metadata;

  return (
    <Column
      gap="m"
      padding={isFeatured ? "xl" : "m"}
      fillWidth
    >
      <Text as="h2" variant={isFeatured ? "heading-strong-xl" : "heading-strong-l"}>
        {title}
      </Text>
      {summary && (
        <Text as="p" variant={isFeatured ? "body-default-l" : "body-default-m"} onBackground="neutral-weak">
          {summary}
        </Text>
      )}

      {youtubeId && (
        <div 
          style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: isFeatured ? '0 20px 40px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {post.content && isFeatured && (
        <Column gap="s" maxWidth="m">
          <MDXRemote {...post.content} />
        </Column>
      )}
    </Column>
  );
}

interface MusicVideosGalleryProps {
  initialPosts: any[]; 
}

export function MusicVideosGallery({ initialPosts }: MusicVideosGalleryProps) {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    // Filter and sort videos by date (newest first)
    const youtubePosts = initialPosts
      .filter(post => post.metadata.youtubeId)
      .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime());
    
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
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (videos.length === 0) {
    return (
      <Column gap="xl" fillWidth paddingY="xl">
        <Text variant="heading-strong-l">Δεν βρέθηκαν μουσικά βίντεο</Text>
        <Text onBackground="neutral-weak">Τα βίντεο θα εμφανιστούν εδώ όταν προστεθούν.</Text>
      </Column>
    );
  }

  // Get other videos (excluding the current featured one)
  const otherVideos = videos.filter(video => 
    currentVideo ? video.slug !== currentVideo.slug : true
  );

  return (
    <Column gap="xl" fillWidth>
      {/* Featured Video Section */}
      {currentVideo && (
        <Column 
          gap="xl" 
          fillWidth 
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.001) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <MusicVideoEntry post={currentVideo} isFeatured={true} />
        </Column>
      )}

      {/* Other Videos Grid */}
      {otherVideos.length > 0 && (
        <Column gap="xl" fillWidth>
          <Text as="h3" variant="heading-strong-l" paddingX="l">
            Παλιότερα Βίντεο
          </Text>
          
          <Grid
            columns="3"
            mobileColumns="1"
            gap="l"
            paddingX="l"
            fillWidth
          >
            {otherVideos.map((video) => (
              <Column
                key={video.slug}
                onClick={() => handleThumbnailClick(video)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                gap="s"
              >
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', overflow: 'hidden' }}>
                  {video.metadata.images && video.metadata.images.length > 0 ? (
                    <img
                      src={video.metadata.images[0]}
                      alt={video.metadata.title}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  ) : video.metadata.youtubeId && (
                    <img
                      src={`https://img.youtube.com/vi/${video.metadata.youtubeId}/maxresdefault.jpg`}
                      alt={video.metadata.title}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {/* Play button overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <div 
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '15px solid white',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        marginLeft: '3px'
                      }}
                    />
                  </div>
                </div>
                
                <Column gap="xs" padding="m">
                  <Text variant="heading-strong-s" wrap="balance">
                    {video.metadata.title}
                  </Text>
                  {video.metadata.summary && (
                    <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
                      {video.metadata.summary}
                    </Text>
                  )}
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {new Date(video.metadata.publishedAt).toLocaleDateString('el-GR')}
                  </Text>
                </Column>
              </Column>
            ))}
          </Grid>
        </Column>
      )}
    </Column>
  );
}