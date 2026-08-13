import { IconCompass, IconHome, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { StatusLinks, StatusScreen } from "@/components/layout/status-screen";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <StatusScreen
      icon={<IconCompass />}
      title="We cannot find that page"
      description={
        <>
          The link may be out of date, or the title may have been unpublished
          while you were away. Everything else is still where you left it.
        </>
      }
      actions={
        <>
          <Button variant="primary" href="/">
            <IconHome />
            Go home
          </Button>
          <Button variant="secondary" href="/search">
            <IconSearch />
            Search the catalogue
          </Button>
        </>
      }
    >
      <StatusLinks
        links={[
          { label: "Films", href: "/films" },
          { label: "Live", href: "/live" },
          { label: "Education", href: "/education" },
          { label: "News", href: "/news" },
          { label: "All categories", href: "/explore" },
          { label: "Sitemap", href: "/sitemap" },
        ]}
      />
    </StatusScreen>
  );
}
