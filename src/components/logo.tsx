import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: number;
  link?: string | false;
  className?: string;
};

export default function Logo({ size = 40, link, className }: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="Site Logo"
      width={size}
      height={size}
      priority
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
  if (link) {
    return (
      <Link href={link} aria-label="Home">
        {img}
      </Link>
    );
  }
  return img;
}
