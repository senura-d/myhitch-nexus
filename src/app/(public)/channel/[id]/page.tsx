import { channels } from "@/lib/mock-api/data/channels";
import { ChannelClient } from "./channel-client";

export function generateStaticParams() {
  return channels.map((c) => ({ id: c.id }));
}

export default function ChannelPage() {
  return <ChannelClient />;
}
