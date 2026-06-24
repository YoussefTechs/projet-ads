import Image from "next/image";

/** Galerie d'images responsive (la première en grand). */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {images.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl bg-muted ${
            i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
          }`}
        >
          <Image
            src={src}
            alt={`${alt} — photo ${i + 1}`}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
