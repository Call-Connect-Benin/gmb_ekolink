"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Current = {
  category?: string;
  city?: string;
  state?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  sort?: string;
};

export default function Filters({
  categories,
  current,
}: {
  categories: Category[];
  current: Current;
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q ?? "");
  const [category, setCategory] = useState(current.category ?? "");
  const [city, setCity] = useState(current.city ?? "");
  const [state, setState] = useState(current.state ?? "");
  const [minPrice, setMin] = useState(current.minPrice ?? "");
  const [maxPrice, setMax] = useState(current.maxPrice ?? "");
  const [sort, setSort] = useState(current.sort ?? "recent");

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (city) p.set("city", city);
    if (state) p.set("state", state);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sort && sort !== "recent") p.set("sort", sort);
    const qs = p.toString();
    router.push(`/fiches-google${qs ? `?${qs}` : ""}`);
  };

  const reset = () => {
    setQ("");
    setCategory("");
    setCity("");
    setState("");
    setMin("");
    setMax("");
    setSort("recent");
    router.push("/fiches-google");
  };

  return (
    <form
      onSubmit={apply}
      className="sticky top-[88px] flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 className="text-base font-bold">Rechercher</h2>
      <div className="grid gap-2">
        <Label htmlFor="f-q">Mot-clé</Label>
        <Input id="f-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="plombier, restaurant…" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-category">Métier</Label>
        <Select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tous les métiers</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name_fr}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-city">Ville</Label>
        <Input id="f-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris, Lyon…" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-state">État</Label>
        <Select id="f-state" value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Tous</option>
          <option value="vierge">Vierge optimisée</option>
          <option value="historique">Avec historique d&apos;avis</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="f-min">Prix min</Label>
          <Input id="f-min" type="number" min={0} value={minPrice} onChange={(e) => setMin(e.target.value)} placeholder="0" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="f-max">Prix max</Label>
          <Input id="f-max" type="number" min={0} value={maxPrice} onChange={(e) => setMax(e.target.value)} placeholder="999" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="f-sort">Trier par</Label>
        <Select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Plus récentes</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </Select>
      </div>
      <Button type="submit" className="w-full">Appliquer</Button>
      <Button type="button" variant="outline" className="w-full" onClick={reset}>
        Réinitialiser
      </Button>
    </form>
  );
}
