import type { Metadata } from "next";
import ListingForm from "../../ListingForm";
import { getCategories } from "@/lib/queries";
import { getTranslations } from "next-intl/server";
import { PageHead } from "../../../components/dashboard/list";
import { Panel } from "../../../components/dashboard/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nouvelle fiche", robots: { index: false, follow: false } };

export default async function NewListing() {
  const t = await getTranslations("dash.fichePages");
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <PageHead title={t("newTitle")} subtitle={t("newSubtitle")} />
      <Panel className="max-w-3xl">
        <ListingForm categories={categories} />
      </Panel>
    </div>
  );
}
