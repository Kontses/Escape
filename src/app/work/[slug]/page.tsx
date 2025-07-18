import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import { Meta, Schema, AvatarGroup, Button, Column, Flex, Heading, Media, Text } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
// import { serialize } from 'next-mdx-remote/serialize'; // Αφαιρέθηκε η εισαγωγή
// import { MusicEntry } from '@/components/work/MusicEntry'; // Αφαιρέθηκε η εισαγωγή

interface PostMetadata {
  title: string;
  summary: string;
  publishedAt: string;
  images: string[];
  image?: string; // Add optional image property
  team?: Array<{ avatar: string }>;
  tracks?: Track[];
}

interface Track {
  title: string;
  duration: string;
}

interface AlbumTracksProps {
  tracks: Track[];
}

const AlbumTracks: React.FC<AlbumTracksProps> = ({ tracks }) => {
  return (
    <Column gap="16" fillWidth>
      <Heading variant="heading-strong-s">Tracks</Heading>
      {
        tracks.map((track, index) => (
          <Flex key={index} horizontal="space-between" vertical="center">
            <Text>{track.title}</Text>
            <Text onBackground="neutral-weak">{track.duration}</Text>
          </Flex>
        ))
      }
    </Column>
  );
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const musicVideosPosts = getPosts(["src", "app", "work", "music-videos"]);
  const discographyPosts = getPosts(["src", "app", "work", "discography"]);
  const djSetsPosts = getPosts(["src", "app", "work", "dj-sets"]);

  const allPosts = [...musicVideosPosts, ...discographyPosts, ...djSetsPosts];

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const musicVideosPosts = getPosts(["src", "app", "work", "music-videos"]);
  const discographyPosts = getPosts(["src", "app", "work", "discography"]);
  const djSetsPosts = getPosts(["src", "app", "work", "dj-sets"]);

  const allPosts = [...musicVideosPosts, ...discographyPosts, ...djSetsPosts];
  let post = allPosts.find((post) => post.slug === slugPath) as {
    metadata: PostMetadata;
    content: string;
    slug: string;
  };

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || (post.metadata.images && post.metadata.images.length > 0 ? post.metadata.images[0] : undefined) || `/api/og/generate?title=${post.metadata.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const musicVideosPosts = getPosts(["src", "app", "work", "music-videos"]);
  const discographyPosts = getPosts(["src", "app", "work", "discography"]);
  const djSetsPosts = getPosts(["src", "app", "work", "dj-sets"]);

  const allPosts = [...musicVideosPosts, ...discographyPosts, ...djSetsPosts];
  let post = allPosts.find((post) => post.slug === slugPath) as {
    metadata: PostMetadata;
    content: string;
    slug: string;
  };

  if (!post) {
    notFound();
  }

  const imageUrl = post.metadata.image || (post.metadata.images && post.metadata.images.length > 0 ? post.metadata.images[0] : undefined);

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={imageUrl || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="xs" gap="16">
        <Button data-border="rounded" href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Πίσω στην εργασία
        </Button>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
      </Column>
      {post.metadata.images && post.metadata.images.length > 0 && (
        <Media
          priority
          aspectRatio="1 / 1"
          radius="m"
          alt="Album Cover"
          src={post.metadata.images[0]}
          style={{ objectFit: 'cover' }}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <CustomMDX source={post.content} />
        {post.metadata.tracks && post.metadata.tracks.length > 0 && (
          <AlbumTracks tracks={post.metadata.tracks} />
        )}
      </Column>
      <ScrollToHash />
    </Column>
  );
}
