import { notFound } from "next/navigation";
import ProjectsCarousel from "./projects-carousel";
import { isLanguage, translations } from "../translations";
import PageSignature from "../page-signature";

export default async function ProjectsPage({
  params,
}: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const text = translations[lang];
  const projects = [
    {
      id: "evelyn",
      title: text.projects.evelynTitle,
      image: "/projects/evelyn-screenshot.jpg",
      imageAlt: text.projects.evelynAlt,
      href: "https://www.evelynpatsioura.gr/",
      preview: "evelyn" as const,
    },
    {
      id: "transport",
      title: text.projects.transportTitle,
      image: "/projects/transport.jpg",
      imageAlt: text.projects.transportAlt,
      href: "https://dionysispatsiouras.github.io/Transportation-Services-website/",
      preview: "transport" as const,
    },
    {
      id: "apoechos",
      title: text.projects.apoechosTitle,
      image: "/projects/apoechos.jpg",
      imageAlt: text.projects.apoechosAlt,
      href: "https://www.apoechos.gr/",
      preview: "apoechos" as const,
    },
    {
      id: "myhome",
      title: text.projects.myhomeTitle,
      image: "/projects/myhome.jpg",
      imageAlt: text.projects.myhomeAlt,
      href: "https://github.com/DionysisPatsiouras/MyHome",
      preview: "myhome" as const,
    },
    {
      id: "tsakmaki",
      title: text.projects.tsakmakiTitle,
      image: "/projects/tsakmaki-screenshot.jpg",
      imageAlt: text.projects.tsakmakiAlt,
      href: "https://github.com/DionysisPatsiouras/tsakmaki.gr",
      preview: "tsakmaki" as const,
    },
  ];

  return (
    <section className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-header">
        <div className="page-title-group">
          <PageSignature />
          <h1 id="projects-heading" className="projects-heading">
            {text.nav.projects}
          </h1>
        </div>
        <p className="projects-intro">{text.projects.intro}</p>
      </div>

      <ProjectsCarousel
        projects={projects}
        label={text.projects.carouselLabel}
        openLabel={text.projects.openLabel}
        selectLabel={text.projects.selectLabel}
        previousLabel={text.projects.previousLabel}
        nextLabel={text.projects.nextLabel}
      />
    </section>
  );
}
