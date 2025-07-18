import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { LiveSetsGallery } from "@/components/live-sets/LiveSetsGallery";

export async function generateMetadata() {
  const title = "Electronic Live Sets";
  const description = "Παρακολουθήστε τα τελευταία ηλεκτρονικά live sets μας από το YouTube.";
  const path = "/live-sets";

  return Meta.generate({
    title: title,
    description: description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: path,
  });
}

export default async function LiveSets() {
  const allPosts = getPosts(["src", "app", "work", "music"]);
  // Filter for posts that have a youtubeId, assuming our MDX files will have this metadata
  const youtubePosts = allPosts.filter(post => post.metadata.youtubeId);

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/live-sets"
        title="Electronic Live Sets"
        description="Παρακολουθήστε τα τελευταία ηλεκτρονικά live sets μας από το YouTube."
        image={`/api/og/generate?title=${encodeURIComponent("Electronic Live Sets")}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <LiveSetsGallery initialPosts={youtubePosts} />
    </Column>
  );
} 