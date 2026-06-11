"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, GripVertical, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadListingImageAction } from "./actions";

type Img = { url: string; title: string };

/** Éditeur de galerie : upload d'images (depuis l'appareil) + titre par image. */
export default function GalleryField({ initial }: { initial: Img[] }) {
  const t = useTranslations("dash.listingForm");
  const [rows, setRows] = useState<Img[]>(initial.length ? initial : []);
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (i: number, patch: Partial<Img>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { url: "", title: "" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const onPick = async (i: number, file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(i);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadListingImageAction(fd);
      if (res.url) update(i, { url: res.url });
      else setError(res.error || t("uploadError"));
    } catch {
      setError(t("uploadError"));
    } finally {
      setUploading(null);
    }
  };

  // Valeur envoyée au server action (seules les lignes avec image sont conservées).
  const serialized = JSON.stringify(rows.filter((r) => r.url.trim() !== ""));

  return (
    <div className="grid gap-2">
      <Label>{t("galleryLabel")}</Label>
      <input type="hidden" name="gallery" value={serialized} readOnly />

      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />

            {/* Aperçu + bouton d'upload */}
            <input
              ref={(el) => { fileRefs.current[i] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPick(i, e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRefs.current[i]?.click()}
              disabled={uploading === i}
              title={row.url ? t("changeImage") : t("chooseImage")}
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary/40 text-muted-foreground transition hover:border-primary"
            >
              {uploading === i ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : row.url ? (
                <img src={row.url} alt="" className="size-full object-cover" />
              ) : (
                <ImagePlus className="size-5" />
              )}
            </button>

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
              aria-label={t("removeImage")}
              title={t("removeImage")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-4" /> {t("addImage")}
        </Button>
        <span className="text-xs text-muted-foreground">{t("galleryHint")}</span>
      </div>
    </div>
  );
}
