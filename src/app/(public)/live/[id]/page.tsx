import { liveEvents } from "@/lib/mock-api/data/live";
import { LiveViewerClient } from "./live-client";

export function generateStaticParams() {
  return liveEvents.map((e) => ({ id: e.id }));
}

export default function LiveViewerPage() {
  return <LiveViewerClient />;
}
