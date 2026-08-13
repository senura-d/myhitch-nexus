import type { Playlist, Series } from "../types";
import { daysAgo } from "./videos";

export const series: Series[] = [
  {
    id: "ser_stats",
    channelId: "ch_meridian",
    title: "Statistics for decisions",
    description:
      "An accredited six-part short course on reading, questioning and presenting statistical evidence.",
    posterGradient: ["#123A2E", "#05120E"],
    seasons: [
      {
        number: 1,
        title: "Foundations",
        episodeIds: ["vid_meridian_stats", "vid_meridian_stats2"],
      },
    ],
  },
  {
    id: "ser_orbit",
    channelId: "ch_orbit",
    title: "Orbit Sessions",
    description: "Live, one take, no overdubs. Now in its third season.",
    posterGradient: ["#3E1638", "#120610"],
    seasons: [
      {
        number: 3,
        title: "Season three",
        episodeIds: ["vid_orbit_session_14", "vid_orbit_session_13"],
      },
    ],
  },
];

export const playlists: Playlist[] = [
  {
    id: "pl_mara_camera",
    channelId: "ch_mara",
    title: "Camera craft essentials",
    description:
      "Start here if you are moving from stills to motion. Ordered, not chronological.",
    visibility: "public",
    videoIds: [
      "vid_mara_anamorphic",
      "vid_mara_lighting",
      "vid_mara_gimbal",
      "vid_mara_colour",
    ],
    updatedAt: daysAgo(6),
    posterGradient: ["#5C2A14", "#170A05"],
  },
  {
    id: "pl_mara_members",
    channelId: "ch_mara",
    title: "Members' project files",
    description: "Unlisted companion playlist for the membership tier.",
    visibility: "unlisted",
    videoIds: ["vid_mara_lighting", "vid_mara_colour"],
    updatedAt: daysAgo(27),
    posterGradient: ["#2C1F52", "#0A0716"],
  },
  {
    id: "pl_ledger_water",
    channelId: "ch_ledger",
    title: "Who owns the water — full investigation",
    description:
      "The documentary, the unedited regulator interview and the follow-up bulletins in one place.",
    visibility: "public",
    videoIds: ["vid_ledger_water", "vid_ledger_interview", "vid_ledger_bulletin"],
    updatedAt: daysAgo(21),
    posterGradient: ["#123049", "#050E16"],
  },
  {
    id: "pl_council_meetings",
    channelId: "ch_council",
    title: "Council meetings 2026",
    description: "Archive of full council and committee meetings for the current year.",
    visibility: "public",
    videoIds: ["vid_council_budget", "vid_council_consultation"],
    updatedAt: daysAgo(11),
    posterGradient: ["#1E3350", "#080E16"],
  },
  {
    id: "pl_northlight_catalogue",
    channelId: "ch_northlight",
    title: "The Northlight catalogue",
    description: "Every feature and short currently licensed on Nexus.",
    visibility: "public",
    videoIds: [
      "vid_saltmarsh",
      "vid_paperkingdom",
      "vid_riverkeeper",
      "vid_lowtide",
    ],
    updatedAt: daysAgo(9),
    posterGradient: ["#3B2F6B", "#0B1020"],
  },
  {
    id: "pl_helio_owners",
    channelId: "ch_helio",
    title: "Owner's guides",
    description: "Practical guidance for Helio owners.",
    visibility: "public",
    videoIds: ["vid_helio_owners", "vid_helio_battery"],
    updatedAt: daysAgo(52),
    posterGradient: ["#0E4C5E", "#04141B"],
  },
];

export const seriesById = (id: string) => series.find((item) => item.id === id);
export const playlistById = (id: string) =>
  playlists.find((item) => item.id === id);
