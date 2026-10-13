import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMART AI" },
      {
        name: "description",
        content:
          "منصة SMART AI لتحليلات وإشارات الألعاب المباشرة مع توقعات ذكية لمنصة BIZBET بدقة عالية.",
      },
      { property: "og:title", content: "SMART AI" },
      {
        property: "og:description",
        content:
          "منصة SMART AI لتحليلات وإشارات الألعاب المباشرة مع توقعات ذكية لمنصة BIZBET بدقة عالية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ClientOnly fallback={<div className="min-h-screen bg-black" />}>{<App />}</ClientOnly>;
}
