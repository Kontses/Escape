import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work, musicVideos, discography, djSets } from "@/resources";
import { WorkCarouselSection } from "@/components/work/WorkCarouselSection";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <WorkCarouselSection
        title={discography.label}
        postDirectory={["src", "app", "work", "discography"]}
        baseHref="/work/discography"
        projectCardAspectRatio="1 / 1"
      />

      <WorkCarouselSection
        title={musicVideos.label}
        postDirectory={["src", "app", "work", "music-videos"]}
        baseHref="/work/music-videos"
      />

      <WorkCarouselSection
        title={djSets.label}
        postDirectory={["src", "app", "work", "dj-sets"]}
        baseHref="/work/dj-sets"
      />
    </Column>
  );
}
