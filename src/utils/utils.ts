import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Track = {
  title: string;
  duration?: string;
  src?: string; // Add audio file source
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team?: Team[];
  link?: string;
  youtubeId?: string; // Add youtubeId
  albumUrl?: string;  // Add albumUrl
  tracks?: Track[];   // Add tracks
  artist?: string;    // Add artist for discography albums
  audio?: string;     // Add audio for DJ sets
};

import { notFound } from 'next/navigation';

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        notFound();
    }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    youtubeId: data.youtubeId || undefined, // Read youtubeId
    albumUrl: data.albumUrl || undefined,  // Read albumUrl
    tracks: data.tracks || undefined,   // Read tracks
    artist: data.artist || undefined,   // Read artist for discography albums
    audio: data.audio || undefined,     // Read audio for DJ sets
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

export function getPostBySlug(slug: string, customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  try {
    const { metadata, content } = readMDXFile(fullPath);
    return { metadata, slug, content };
  } catch (error) {
    console.error(`Error reading post with slug ${slug}:`, error);
    return null;
  }
}
