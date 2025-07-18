import { getPosts } from "@/utils/utils";
import { Column, Flex, SmartLink, Heading } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import styles from "./WorkCarousels.module.scss";

interface WorkCarouselSectionProps {
  title: string;
  postDirectory: string[];
  baseHref: string;
  projectCardAspectRatio?: string;
}

export function WorkCarouselSection({ title, postDirectory, baseHref, projectCardAspectRatio }: WorkCarouselSectionProps) {
  let allProjects = getPosts(postDirectory);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // Display all projects for now in the carousel
  const displayedProjects = sortedProjects;

  return (
    <Column fillWidth gap="l" marginBottom="40" horizontal="center">
      <Flex fillWidth horizontal="space-between" vertical="center" paddingX="l">
        <Heading as="h2" variant="heading-strong-xl">{title}</Heading>
        <SmartLink href={baseHref} suffixIcon="arrowRight">
          Δείτε όλα
        </SmartLink>
      </Flex>
      <Flex className={styles.carouselContainer} fillWidth>
        {displayedProjects.map((post, index) => (
          <Column className={styles.carouselItem} key={post.slug}>
            <ProjectCard
              priority={index < 2}
              key={post.slug}
              href={`${baseHref}/${post.slug}`}
              images={post.metadata.images}
              title={post.metadata.title}
              description={post.metadata.summary}
              content={post.content}
              avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
              link={post.metadata.link || ""}
              aspectRatio={projectCardAspectRatio}
            />
          </Column>
        ))}
      </Flex>
    </Column>
  );
} 