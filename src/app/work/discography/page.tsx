import { Column, Meta, Schema, Button, Grid } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { getPosts } from "@/utils/utils";
import { ProjectCard } from "@/components";

export async function generateMetadata() {
  return Meta.generate({
    title: "Discography",
    description: "Our official music discography.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Discography")}`,
    path: "/work/discography",
  });
}

export default function Discography() {
  let allDiscographyPosts = getPosts(["src", "app", "work", "discography"]);

  const sortedDiscography = allDiscographyPosts.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/discography"
        title="Discography"
        description="Our official music discography."
        image={`/api/og/generate?title=${encodeURIComponent("Discography")}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Button href="/work" variant="primary" size="m" style={{ marginBottom: '20px' }}>
        Πίσω στα Projects
      </Button>
      <Grid columns="3" mobileColumns="2" fillWidth marginBottom="40" gap="12">
        {sortedDiscography.map((post) => (
          <ProjectCard
            key={post.slug}
            href={`/work/discography/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
            link={post.metadata.link || ""}
            aspectRatio="1 / 1"
          />
        ))}
      </Grid>
    </Column>
  );
} 