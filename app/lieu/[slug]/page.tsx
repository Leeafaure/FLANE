import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { places } from "@/data/places";
import { PlaceDetail } from "@/components/PlaceDetail";
export function generateStaticParams() {
  return places.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: places.find((p) => p.id === slug)?.name ?? "Une adresse" };
}
export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = places.find((p) => p.id === slug);
  if (!place) notFound();
  return <PlaceDetail place={place} />;
}
