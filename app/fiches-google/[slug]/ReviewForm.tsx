import { submitReviewAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewForm({
  listingId,
  slug,
}: {
  listingId: string;
  slug: string;
}) {
  return (
    <form
      action={submitReviewAction}
      className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-card p-5"
    >
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="slug" value={slug} />
      <strong>Laisser un avis</strong>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="r-name">Votre nom (affiché)</Label>
          <Input id="r-name" name="author_name" type="text" placeholder="Ex. Marc R." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="r-rating">Note</Label>
          <Select id="r-rating" name="rating" defaultValue="5" required>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★ (4)</option>
            <option value="3">★★★ (3)</option>
            <option value="2">★★ (2)</option>
            <option value="1">★ (1)</option>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="r-comment">Commentaire</Label>
        <Textarea id="r-comment" name="comment" rows={3} placeholder="Votre expérience…" />
      </div>
      <Button type="submit" className="w-fit">Publier mon avis</Button>
    </form>
  );
}
