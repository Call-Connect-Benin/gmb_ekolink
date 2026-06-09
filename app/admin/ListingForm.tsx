import { useTranslations } from "next-intl";
import { saveListingAction } from "./actions";
import type { Category, Listing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ListingForm({
  categories,
  listing,
}: {
  categories: Category[];
  listing?: Listing | null;
}) {
  const t = useTranslations("dash.listingForm");
  return (
    <Card>
      <CardContent>
        <form action={saveListingAction} className="flex flex-col gap-4">
          {listing && <input type="hidden" name="id" defaultValue={listing.id} />}

          <div className="grid gap-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" name="title" type="text" required defaultValue={listing?.title ?? ""} placeholder={t("titlePlaceholder")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="slug">{t("slug")}</Label>
              <Input id="slug" name="slug" type="text" required defaultValue={listing?.slug ?? ""} placeholder={t("slugPlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category_slug">{t("metier")}</Label>
              <Select id="category_slug" name="category_slug" required defaultValue={listing?.category_slug ?? ""}>
                <option value="">{t("choose")}</option>
                {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.name_fr}</option>))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input id="city" name="city" type="text" required defaultValue={listing?.city ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postal_code">{t("postalCode")}</Label>
              <Input id="postal_code" name="postal_code" type="text" defaultValue={listing?.postal_code ?? ""} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">{t("price")}</Label>
              <Input id="price" name="price" type="number" min={0} required defaultValue={listing?.price ?? 299} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("availability")}</Label>
              <Select id="status" name="status" required defaultValue={listing?.status ?? "available"}>
                <option value="available">{t("stAvailable")}</option>
                <option value="reserved">{t("stReserved")}</option>
                <option value="sold">{t("stSold")}</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="state">{t("state")}</Label>
              <Select id="state" name="state" required defaultValue={listing?.state ?? "vierge"}>
                <option value="vierge">{t("stateVierge")}</option>
                <option value="historique">{t("stateHistorique")}</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">{t("image")}</Label>
              <Input id="image" name="image" type="text" defaultValue={listing?.images?.[0] ?? "/assets/listings/default.png"} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="photos_count">{t("photos")}</Label>
              <Input id="photos_count" name="photos_count" type="number" min={0} defaultValue={listing?.photos_count ?? 0} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reviews_count">{t("reviews")}</Label>
              <Input id="reviews_count" name="reviews_count" type="number" min={0} defaultValue={listing?.reviews_count ?? 0} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">{t("rating")}</Label>
              <Input id="rating" name="rating" type="number" min={0} max={5} step="0.1" defaultValue={listing?.rating ?? ""} placeholder="4.8" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="seo_score">{t("seo")}</Label>
            <Input id="seo_score" name="seo_score" type="number" min={0} max={100} defaultValue={listing?.seo_score ?? 85} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={listing?.description ?? ""} />
          </div>

          <Button type="submit" size="lg" className="w-fit">
            {listing ? t("saveEdit") : t("create")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
