import Image from "next/image";
import { GraduationCap } from "lucide-react";

/** University photo, or a neutral tile when the old site had no (or a broken) image. */
export default function UniImage({ src, alt, className = "", sizes }: { src: string | null | undefined; alt: string; className?: string; sizes: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark ${className}`}>
        <GraduationCap className="size-14 text-white/40 transition duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-white/70" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes={sizes} />
    </div>
  );
}
