import { useTranslations } from "next-intl";
import { saveCategoryAction } from "./actions";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoryForm({ category }: { category?: Category | null }) {
  const t = useTranslations("dash.categoryForm");
  return (
    <form action={saveCategoryAction} className="flex flex-col gap-4">
      {category && <input type="hidden" name="id" defaultValue={category.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name_fr">{t("nameFr")}</Label>
          <Input id="name_fr" name="name_fr" type="text" required defaultValue={category?.name_fr ?? ""} placeholder="Plombier" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name_en">{t("nameEn")}</Label>
          <Input id="name_en" name="name_en" type="text" defaultValue={category?.name_en ?? ""} placeholder="Plumber" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input id="slug" name="slug" type="text" required defaultValue={category?.slug ?? ""} placeholder="plombier" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="icon">{t("icon")}</Label>
          <Input id="icon" name="icon" type="text" defaultValue={category?.icon ?? ""} placeholder={t("iconPlaceholder")} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("iconHintPre")}<code>wrench</code>{t("iconHintPost")}
      </p>

      <Button type="submit" size="lg" className="w-fit">
        {category ? t("saveEdit") : t("create")}
      </Button>
    </form>
  );
}
