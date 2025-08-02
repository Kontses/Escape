import { getPostBySlug, getPosts } from "@/utils/utils";
import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscographyAlbumClientContent } from './DiscographyAlbumClientContent';

interface DiscographyAlbumPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getPosts(["src", "app", "work", "discography"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Readonly<DiscographyAlbumPageProps>) {
  const post = getPostBySlug(params.slug, ["src", "app", "work", "discography"]);

  if (!post) {
    return {};
  }

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.images && post.metadata.images.length > 0 ? `${baseURL}${post.metadata.images[0]}` : `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `/work/discography/${post.slug}`,
  });
}

export default async function DiscographyAlbumPage({ params }: Readonly<DiscographyAlbumPageProps>) {
  const post = getPostBySlug(params.slug, ["src", "app", "work", "discography"]);

  if (!post) {
    notFound();
  }

  const { title, summary, images, tracks } = post.metadata;

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/work/discography/${post.slug}`}
        title={title}
        description={summary}
        image={images && images.length > 0 ? `${baseURL}${images[0]}` : `/api/og/generate?title=${encodeURIComponent(title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Link href="/work/discography" style={{ marginBottom: '20px' }}>
        &larr; Πίσω στη Δισκογραφία
      </Link>
      <DiscographyAlbumClientContent
        title={title}
        summary={summary}
        images={images}
        tracks={tracks}
      />
    </Column>
  );
}