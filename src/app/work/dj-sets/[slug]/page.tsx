import { getPostBySlug, getPosts } from "@/utils/utils";
import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DjSetClientContent } from './DjSetClientContent';

interface DjSetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPosts(["src", "app", "work", "dj-sets"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: DjSetPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, ["src", "app", "work", "dj-sets"]);

  if (!post) {
    return {};
  }

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.images && post.metadata.images.length > 0 ? `${baseURL}${post.metadata.images[0]}` : `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `/work/dj-sets/${post.slug}`,
  });
}

export default async function DjSetPage({ params }: DjSetPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, ["src", "app", "work", "dj-sets"]);

  if (!post) {
    notFound();
  }

  const { title, summary, images, audio, publishedAt, artist } = post.metadata;

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/work/dj-sets/${post.slug}`}
        title={title}
        description={summary}
        image={images && images.length > 0 ? `${baseURL}${images[0]}` : `/api/og/generate?title=${encodeURIComponent(title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Link href="/work/dj-sets" style={{ marginBottom: '20px' }}>
        &larr; Πίσω στα DJ Sets
      </Link>
      <DjSetClientContent
        title={title}
        summary={summary}
        images={images}
        audio={audio}
        publishedAt={publishedAt}
        artist={artist}
      />
    </Column>
  );
}