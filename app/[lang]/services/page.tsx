import { notFound } from "next/navigation";
import { isLanguage, translations } from "../translations";
import PageSignature from "../page-signature";
import ServicesScroller from "./services-scroller";

type ServiceKind =
  | "design"
  | "development"
  | "desktop"
  | "mobile"
  | "api"
  | "business";

function ServiceIllustration({ kind }: { kind: ServiceKind }) {
  const drawings = {
    design: (
      <>
        <path d="M9 13 99 36l13 47-31 28-53-22L9 13Z" />
        <path d="m9 13 68 60 22-37M77 73 28 89" />
        <circle cx="61" cy="61" r="10" />
      </>
    ),
    development: (
      <>
        <circle cx="60" cy="60" r="49" />
        <path d="M11 60h98M60 11c-14 13-21 30-21 49s7 36 21 49M60 11c14 13 21 30 21 49s-7 36-21 49" />
      </>
    ),
    desktop: (
      <>
        <rect x="12" y="19" width="96" height="68" rx="5" />
        <path d="M12 75h96M60 87v17M35 104h50" />
      </>
    ),
    mobile: (
      <>
        <rect x="32" y="9" width="56" height="102" rx="9" />
        <path d="M49 21h22M50 99h20" />
      </>
    ),
    api: (
      <>
        <circle cx="60" cy="60" r="17" />
        <circle cx="20" cy="25" r="8" />
        <circle cx="100" cy="25" r="8" />
        <circle cx="20" cy="95" r="8" />
        <circle cx="100" cy="95" r="8" />
        <path d="M26 30 47 47m26 0 21-17M26 90l21-17m26 0 21 17" />
      </>
    ),
    business: (
      <>
        <rect x="16" y="40" width="88" height="65" rx="5" />
        <path d="M39 40V23h42v17M16 60h88M34 86h14l12-13 11 10 16-16" />
      </>
    ),
  };

  return (
    <svg
      className="service-illustration"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {drawings[kind]}
    </svg>
  );
}

export default async function ServicesPage({
  params,
}: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const text = translations[lang];
  const services = [
    {
      kind: "design" as const,
      title: text.services.designTitle,
      description: text.services.designDescription,
    },
    {
      kind: "development" as const,
      title: text.services.developmentTitle,
      description: text.services.developmentDescription,
    },
    {
      kind: "desktop" as const,
      title: text.services.desktopTitle,
      description: text.services.desktopDescription,
    },
    {
      kind: "mobile" as const,
      title: text.services.mobileTitle,
      description: text.services.mobileDescription,
    },
    {
      kind: "api" as const,
      title: text.services.apiTitle,
      description: text.services.apiDescription,
    },
    {
      kind: "business" as const,
      title: text.services.businessTitle,
      description: text.services.businessDescription,
    },
  ];

  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="page-title-group">
        <PageSignature />
        <h1 id="services-heading" className="services-heading">
          {text.nav.services}
        </h1>
      </div>
      <p className="services-intro">{text.services.intro}</p>

      <ServicesScroller
        label={text.services.scrollLabel}
        previousLabel={text.services.previousLabel}
        nextLabel={text.services.nextLabel}
      >
        {services.map((service) => (
          <article className="service-item" key={service.kind}>
            <ServiceIllustration kind={service.kind} />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </ServicesScroller>
    </section>
  );
}
