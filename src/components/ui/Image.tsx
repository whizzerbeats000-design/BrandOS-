import NextImage from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import type { AspectRatio, ImageSource } from "@/types";

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
};

interface SusImageProps extends ImageSource {
  sizes?: ComponentProps<typeof NextImage>["sizes"];
  className?: string;
  width?: number;
  height?: number;
}

export function SusImage({
  src,
  alt,
  aspectRatio,
  position = "object-center",
  priority = false,
  quality = 75,
  sizes,
  width,
  height,
  className,
}: SusImageProps) {
  const image = (
    <NextImage
      src={src}
      alt={alt}
      preload={priority}
      quality={quality}
      sizes={sizes}
      fill={width === undefined && height === undefined}
      width={width}
      height={height}
      className={cn("object-cover", position)}
    />
  );

  if (width !== undefined && height !== undefined) {
    return (
      <span className={cn("inline-block overflow-hidden align-top", className)}>{image}</span>
    );
  }

  const aspect = aspectRatio ? ASPECT_CLASSES[aspectRatio] : "";
  return <div className={cn("relative w-full overflow-hidden", aspect, className)}>{image}</div>;
}
