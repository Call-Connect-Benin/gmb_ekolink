import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingForm from "../../ListingForm";
import { getCategories, getListingById } from "@/lib/queries";
import { getTranslations } from "next-intl/server";
import { PageHead } from "../../../components/dashboard/list";
import { Panel } from "../../../components/dashboard/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Modifier une fiche", robots: { index: false, follow: false } };

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("dash.fichePages");
  const [listing, categories] = await Promise.all([getListingById(id), getCategories()]);
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <PageHead title={t("editTitle")} subtitle={listing.title} />
      <Panel className="max-w-3xl">
        <ListingForm categories={categories} listing={listing} />
      </Panel>
    </div>
  );
}
