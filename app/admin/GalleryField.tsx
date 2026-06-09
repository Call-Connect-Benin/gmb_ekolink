"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Img = { url: string; title: string };

/** Éditeur de galerie : plusieurs images, chacune avec un titre (légende). */
export default function GalleryField({ initial }: { initial: Img[] }) {
  const t = useTranslations("dash.listingForm");
  const [rows, setRows] = useState<Img[]>(initial.length ? initial : [{ url: "/assets/listings/default.png", title: "" }]);

  const update = (i: number, patch: Partial<Img>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { url: "", title: "" }]);
  const remove = (i: number) => setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));

  // Valeur envoyée au server action (seules les lignes avec URL sont conservées).
  const serialized = JSON.stringify(rows.filter((r) => r.url.trim() !== ""));

  return (
    <div className="grid gap-2">
      <Label>{t("galleryLabel")}</Label>
      <input type="hidden" name="gallery" value={serialized} readOnly />

      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              value={row.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder={t("imageUrl")}
              className="flex-[1.4]"
              aria-label={t("imageUrl")}
            />
            <Input
              type="text"
              value={row.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder={t("imageTitle")}
              className="flex-1"
              aria-label={t("imageTitle")}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={rows.length <= 1}
              aria-label={t("removeImage")}
              title={t("removeImage")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-4" /> {t("addImage")}
        </Button>
        <span className="text-xs text-muted-foreground">{t("galleryHint")}</span>
      </div>
    </div>
  );
}
