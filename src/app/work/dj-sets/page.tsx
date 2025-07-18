import { Column, Meta, Schema, Button } from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: "Electronic Live Sets",
    description: "Our electronic live sets recordings.",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Electronic Live Sets")}`,
    path: "/work/dj-sets",
  });
}

export default function DjSets() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/work/dj-sets"
        title="Electronic Live Sets"
        description="Our electronic live sets recordings."
        image={`/api/og/generate?title=${encodeURIComponent("Electronic Live Sets")}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Button href="/work" variant="primary" size="m" style={{ marginBottom: '20px' }}>
        Πίσω στα Projects
      </Button>
      <Projects postDirectory={["src", "app", "work", "dj-sets"]} baseHref="work/dj-sets" />
    </Column>
  );
} 