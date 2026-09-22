import Storefront from "@/components/storefront";
import type { Metadata } from "next";

function productName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = productName(slug);
  const description = `Explore ${name}, compare available access options, and get instant digital delivery from Remorse.`;

  return {
    title: name,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: `${name} | Remorse`,
      description,
      url: `/product/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Remorse`,
      description,
    },
  };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  return <Storefront productSlug={slug}/>;
}
