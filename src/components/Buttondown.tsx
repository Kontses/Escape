"use client";

import { mailchimp } from "@/resources";
import { Button, Flex, Heading, Input, Text, Background, Column } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";

type NewsletterProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const Buttondown = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {newsletter.title}
      </Heading>
      <Text
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
        }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {newsletter.description}
      </Text>
      <form
        action="https://buttondown.com/api/emails/embed-subscribe/escape23"
        method="post"
        target="popupwindow"
        onSubmit={() => window.open('https://buttondown.com/escape23', 'popupwindow')}
        className="embeddable-buttondown-form"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Flex fillWidth maxWidth={24} mobileDirection="column" gap="8">
            <Input
                id="bd-email"
                name="email"
                type="email"
                placeholder="Email"
                required
                onChange={handleChange}
                value={email}
            />
            <input type="hidden" value="1" name="embed" />
            <Flex height="48" vertical="center">
                <Button type="submit" value="Subscribe" size="m" fillWidth>
                    Subscribe
                </Button>
            </Flex>
        </Flex>
      </form>
        <p style={{marginTop: '1rem'}}>
            <a href="https://buttondown.com/refer/escape23" target="_blank" style={{color: 'var(--token-color-text-on-background-neutral-weak)', fontSize: 'var(--token-font-size-s)'}}>Powered by Buttondown.</a>
        </p>
    </Column>
  );
};
