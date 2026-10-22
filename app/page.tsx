import { HeroStage } from "./components/hero-stage/hero-stage.component";
import { ProjectIndex } from "./components/project-index/project-index.component";
import { PROJECTS } from "./components/project-index/project-index.config";
import { SEO_CONFIG } from "./lib/seo/seo.config";
import { absoluteUrl } from "./lib/seo/seo.utils";

const PROJECTS_JSON_LD = {
  "@context": SEO_CONFIG.jsonLdContext,
  "@type": "ItemList",
  itemListElement: PROJECTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "SoftwareApplication",
      name: p.name,
      description: p.blurb,
      url: p.external ? p.href : absoluteUrl(p.href),
      applicationCategory: SEO_CONFIG.applicationCategory,
    },
  })),
};

export default function Home() {
  return (
    <div className="relative selection:bg-[var(--accent)] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROJECTS_JSON_LD) }} />
      <HeroStage />
      <div className="px-6 pb-[18vh] pt-[2vh] md:px-10">
        <ProjectIndex />
      </div>
    </div>
  );
}
