import { Column, Meta, Schema, Button } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: "Music Videos",
    description: "Our official music videos.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Music Videos")}`,
    path: "/work/music-videos",
  });
}

export default function MusicVideos() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/music-videos"
        title="Music Videos"
        description="Our official music videos."
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
      <Projects postDirectory={["src", "app", "work", "music-videos"]} baseHref="work/music-videos" />
    </Column>
  );
} 