"use client";

import { Flex } from "@once-ui-system/core";
import styles from "./Gallery.module.scss";

interface GalleryModalProps {
  readonly isOpen: boolean;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly onClose: () => void;
}

export default function GalleryModal({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}: GalleryModalProps) {
  const modalClass = `${styles.modalOverlay} ${isOpen ? styles.isOpen : ''}`;

  if (!isOpen && !imageSrc) { // Προσθήκη ελέγχου imageSrc για να μην κλείνει πριν το transition
    return null;
  }

  return (
    <div
      className={modalClass}
      onClick={onClose}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          onClose();
        }
      }}
    >
      <Flex className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageSrc} alt={imageAlt} className={styles.modalImage} />
      </Flex>
    </div>
  );
}