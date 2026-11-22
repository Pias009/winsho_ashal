import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { staticPageMetadata, PAGE_SEO } from "@/lib/pageSeo";
import { SITE_URL, BRAND } from "@/lib/products";
import { ORG_ID } from "@/lib/siteConfig";
import JsonLd from "@/components/JsonLd";
import AboutClient from "./AboutClient";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }) {
  return staticPageMetadata("/about", params.locale);
}

export default async function AboutPage() {
  // the root layout's provider omits the "about" namespace (see layout.tsx)
  const messages = await getMessages();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: PAGE_SEO["/about"]?.title || `About ${BRAND}`,
    description: PAGE_SEO["/about"]?.description,
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": ORG_ID },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={aboutSchema} />
      <JsonLd data={breadcrumbSchema} />
      <AboutClient />
    </NextIntlClientProvider>
  );
}

