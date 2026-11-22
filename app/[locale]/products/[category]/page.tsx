import { notFound } from "next/navigation";
import FlexoPrintingPage from "@/components/FlexoPrintingPage";
import { categories, type CategorySlug, SITE_URL, BRAND } from "@/lib/products";
import { getLiveCatalogue } from "@/lib/liveCatalogue";
import { pageMetadata } from "@/lib/seo";
import { PAGE_SEO, staticPageMetadata } from "@/lib/pageSeo";
import { getMachineCategoryBySlug } from "@/lib/machinesData";
import JsonLd from "@/components/JsonLd";
import CategoryPageClient from "./CategoryPageClient";

export const revalidate = 3600;

export function generateStaticParams() {
  // machines.json categories 301 to their catalogue category (next.config.mjs)
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: { locale: string; category: string } }) {
  const { locale, category } = params;
  if (PAGE_SEO[`/products/${category}`]) return staticPageMetadata(`/products/${category}`, locale);
  const { categories: liveCategories } = await getLiveCatalogue();
  const c = liveCategories.find((x) => x.slug === category);
  const mCat = getMachineCategoryBySlug(category);

  if (!c && !mCat) return { title: "Catalogue — Ashal Innomech" };

  const title = mCat?.metaTitle || `${c?.name || mCat?.name} — Ashal Innomech`;
  const description = mCat?.metaDescription || c?.blurb || "";

  return pageMetadata({
    locale,
    path: `/products/${category}`,
    title,
    description,
  });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { categories: liveCategories, families: liveFamilies } = await getLiveCatalogue();

  const cat = liveCategories.find((c) => c.slug === params.category);
  const mCat = getMachineCategoryBySlug(params.category);

  if (!cat && !mCat) notFound();

  const fams = liveFamilies.filter((f) =>
    params.category === "flexo-printing-machines" ? f.category === "printing" : f.category === (params.category as CategorySlug)
  );

  // Construct fallback Category object if only found in machines.json
  const currentCategory = cat || {
    slug: (params.category === "flexo-printing-machines" ? "printing" : mCat!.slug) as CategorySlug,
    name: mCat!.name,
    tagline: mCat!.metaTitle,
    blurb: mCat!.metaDescription,
  };

  const categoryPath = `/products/${params.category}`;
  const categoryUrl = `${SITE_URL}${categoryPath}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_SEO[categoryPath]?.title || `${currentCategory.name} | ${BRAND}`,
    description: PAGE_SEO[categoryPath]?.description || currentCategory.blurb,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: fams.length,
      itemListElement: fams.map((f, idx) => ({
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
      { "@type": "ListItem", position: 3, name: currentCategory.name, item: categoryUrl },
    ],
  };

  if (params.category === "printing" || params.category === "flexo-printing-machines") {
    return (
      <>
        <JsonLd data={collectionSchema} />
        <JsonLd data={breadcrumbSchema} />
        <FlexoPrintingPage families={liveFamilies.filter((f) => f.category === "printing")} h1={PAGE_SEO["/products/printing"].h1} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <CategoryPageClient
        category={currentCategory}
        h1={PAGE_SEO[`/products/${params.category}`]?.h1 ?? currentCategory.name}
        families={fams}
        allCategories={liveCategories}
      />
    </>
  );
}

