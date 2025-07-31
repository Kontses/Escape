"use client";

import Masonry from "react-masonry-css";
import { Media, Column, Text } from "@once-ui-system/core";
import styles from "./Gallery.module.scss";
import { gallery } from "@/resources";
import { useState } from "react";
import GalleryModal from "./GalleryModal";

interface GalleryImage {
  src: string;
  alt: string;
  orientation: string; // Changed to string to be compatible with content.js
}

export default function MasonryGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage>({
    src: "",
    alt: "",
    orientation: "horizontal",
  });

  const openModal = (image: GalleryImage) => {
    console.log("Opening modal for image:", image);
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    720: 1,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.masonryGrid}
        columnClassName={styles.masonryGridColumn}
      >
        {gallery.images.map((image) => (
          <Column key={image.src} gap="4">
            <Media
              priority={gallery.images.indexOf(image) < 10}
              sizes="(max-width: 560px) 100vw, 50vw"
              radius="m"
              aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
              src={image.src}
              alt={image.alt}
              className={styles.gridItem}
              onClick={() => openModal(image)}
            />
            <Text size="s" align="center">
              {image.alt}
            </Text>
          </Column>
        ))}
      </Masonry>
      <GalleryModal
        isOpen={isModalOpen}
        imageSrc={selectedImage.src}
        imageAlt={selectedImage.alt}
        onClose={closeModal}
      />
    </>
  );
}
