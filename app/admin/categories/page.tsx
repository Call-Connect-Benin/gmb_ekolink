import Link from "next/link";
import { Tags, Pencil, Trash2 } from "lucide-react";
import { getCategories, getListings } from "@/lib/queries";
import { categoryIcon } from "@/lib/categoryIcons";
import { deleteCategoryAction } from "../actions";
import { StatCard, Panel, PanelHeader, Pill, Table, Th, Td, Row } from "../../components/dashboard/ui";
import { PageHead, EmptyRow } from "../../components/dashboard/list";
import CategoryForm from "../CategoryForm";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catégories — Admin" };

export default async function AdminCategories() {
  const t = await getTranslations("dash.categoriesAdmin");
  const [categories, listings] = await Promise.all([getCategories(), getListings()]);
  const countFor = (slug: string) => listings.filter((l) => l.category_slug === slug).length;

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard icon={Tags} tone="blue" label={t("statCategories")} value={String(categories.length)} />
        <StatCard icon={Tags} tone="green" label={t("statClassified")} value={String(listings.length)} />
        <StatCard icon={Tags} tone="purple" label={t("statEmpty")} value={String(categories.filter((c) => countFor(c.slug) === 0).length)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-0">
          <Table head={<><Th className="pl-5">{t("thCategory")}</Th><Th>{t("thSlug")}</Th><Th>{t("thListings")}</Th><Th></Th></>}>
            {categories.length === 0 ? <EmptyRow cols={4} /> : categories.map((c) => {
              const Icon = categoryIcon(c.icon);
              const n = countFor(c.slug);
              return (
                <Row key={c.id}>
                  <Td className="pl-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon className="size-5 text-primary" /></span>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{c.name_fr}</p>
                        <p className="text-xs text-muted-foreground">{c.name_en}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><Pill tone="blue">{c.slug}</Pill></Td>
                  <Td className="text-foreground/80">{n}</Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/categories/${c.slug}`} aria-label={t("edit", { name: c.name_fr })} className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <Pencil className="size-4" />
                      </Link>
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="slug" value={c.slug} />
                        <button type="submit" disabled={n > 0} title={n > 0 ? t("usedTitle") : t("deleteTitle")} aria-label={t("delete", { name: c.name_fr })} className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40">
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </div>
                  </Td>
                </Row>
              );
            })}
          </Table>
        </Panel>

        <aside>
          <Panel>
            <PanelHeader title={t("newCategory")} />
            <CategoryForm />
          </Panel>
        </aside>
      </div>
    </div>
  );
}
