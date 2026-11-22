import { getLiveCatalogue } from "@/lib/liveCatalogue";
import { staticPageMetadata, PAGE_SEO } from "@/lib/pageSeo";
import { SITE_URL, BRAND } from "@/lib/products";
import JsonLd from "@/components/JsonLd";
import CatalogueClient from "./CatalogueClient";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return staticPageMetadata("/products", params.locale);
}

export default async function ProductsIndex() {
  const { categories, families } = await getLiveCatalogue();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_SEO["/products"]?.title || `Industrial Machinery Catalogue | ${BRAND}`,
    description: PAGE_SEO["/products"]?.description,
    url: `${SITE_URL}/products`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: families.length,
      itemListElement: families.map((f, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/products/${f.category}/${f.slug}`,
        name: f.seo?.h1 || f.name,
        description: f.seo?.description || f.tagline,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: `${SITE_URL}/products` },
    ],
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <CatalogueClient categories={categories} families={families} />
    </>
  );
}

