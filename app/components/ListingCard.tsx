/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Listing } from "@/lib/types";
import { LISTING_STATE_LABELS, LISTING_STATUS_LABELS } from "@/lib/types";
import { eur } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_VARIANT = {
  available: "success",
  reserved: "warning",
  sold: "destructive",
} as const;

export default function ListingCard({ listing }: { listing: Listing }) {
  const t = useTranslations("common");
  const img = listing.images?.[0] || "/assets/images/cover-pack-local.webp";
  const href = `/fiches-google/${listing.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={href} className="block aspect-[16/10] overflow-hidden bg-muted" aria-label={listing.title}>
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant={STATUS_VARIANT[listing.status]}>
            {LISTING_STATUS_LABELS[listing.status]}
          </Badge>
          <Badge variant="info">{LISTING_STATE_LABELS[listing.state]}</Badge>
        </div>
        <h3 className="text-base font-bold leading-snug">
          <Link href={href} className="hover:text-primary">{listing.title}</Link>
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {listing.city}
          {listing.postal_code ? ` · ${listing.postal_code}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{t("photos", { count: listing.photos_count })}</span>
          {listing.reviews_count > 0 && <span>{t("reviews", { count: listing.reviews_count })}</span>}
          {listing.rating != null && <span>★ {listing.rating}/5</span>}
          {listing.seo_score != null && <span>SEO {listing.seo_score}/100</span>}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-extrabold">{eur(listing.price)}</span>
          <Button asChild size="sm">
            <Link href={href}>{t("viewListing")}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
