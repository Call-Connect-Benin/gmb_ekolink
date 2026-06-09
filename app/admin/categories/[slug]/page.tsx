import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/queries";
import { getTranslations } from "next-intl/server";
import { PageHead } from "../../../components/dashboard/list";
import { Panel } from "../../../components/dashboard/ui";
import CategoryForm from "../../CategoryForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Modifier une catégorie", robots: { index: false, follow: false } };

export default async function EditCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("dash.categoriesAdmin");
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <PageHead title={t("editCategory")} subtitle={category.name_fr} />
      <Panel className="max-w-2xl">
        <CategoryForm category={category} />
      </Panel>
    </div>
  );
}
