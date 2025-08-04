import { Column, Meta, Schema, Button } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { MusicVideosGallery } from "@/components/work/MusicVideosGallery";

export async function generateMetadata() {
  return Meta.generate({
    title: "Music Videos",
    description: "Παρακολουθήστε τα τελευταία μουσικά μας βίντεο από το YouTube.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Music Videos")}`,
    path: "/work/music-videos",
  });
}

export default function MusicVideos() {
  // Get all music video posts
  const allPosts = getPosts(["src", "app", "work", "music-videos"]);
  
  return (
    <Column maxWidth="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/music-videos"
        title="Music Videos"
        description="Παρακολουθήστε τα τελευταία μουσικά μας βίντεο από το YouTube."
        image={`/api/og/generate?title=${encodeURIComponent("Music Videos")}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Button href="/work" variant="primary" size="m" style={{ marginBottom: '20px' }}>
        Πίσω στα Projects
      </Button>
      <MusicVideosGallery initialPosts={allPosts} />
    </Column>
  );
} 