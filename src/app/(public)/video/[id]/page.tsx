import { videos } from "@/lib/mock-api/data/videos";
import { VideoDetailClient } from "./video-client";

export function generateStaticParams() {
  return videos.map((v) => ({ id: v.id }));
}

export default function VideoDetailPage() {
  return <VideoDetailClient />;
}
