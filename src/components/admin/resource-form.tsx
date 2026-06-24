"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, Trash2, Eye, ExternalLink } from "lucide-react";
import type { Field, Resource } from "@/lib/admin/resources";
import { STATUS_OPTIONS } from "@/lib/admin/resources";
import type { ResourceOptions } from "@/server/admin-data";
import { saveResource, deleteResource } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

interface FaqRow {
  question: string;
  answer: string;
}

const inputCls =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:border-brand-600";

export function ResourceForm({
  resource,
  record,
  options,
  publicPath,
}: {
  resource: Resource;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any | null;
  options: ResourceOptions;
  publicPath: string | null;
}) {
  const id: string | null = record?.id ?? null;

  // État contrôlé pour permettre le pré-remplissage par l'IA.
  const initial: Record<string, string | boolean> = {};
  const initialFaq: FaqRow[] = (record?.faq as FaqRow[]) ?? [];
  const initialCats: string[] =
    record?.categories?.map((c: { id: string }) => c.id) ?? [];

  for (const f of resource.fields) {
    if (f.type === "categories" || f.type === "faq") continue;
    if (f.type === "boolean") initial[f.name] = Boolean(record?.[f.name]);
    else if (f.type === "gallery" || f.type === "stringlist")
      initial[f.name] = (record?.[f.name] ?? []).join("\n");
    else if (f.type === "tags")
      initial[f.name] =
        record?.tags?.map((t: { name: string }) => t.name).join(", ") ?? "";
    else initial[f.name] = record?.[f.name] ?? "";
  }

  const [values, setValues] = useState(initial);
  const [faq, setFaq] = useState<FaqRow[]>(initialFaq);
  const [cats, setCats] = useState<string[]>(initialCats);
  const [aiLoading, setAiLoading] = useState(false);

  const set = (name: string, value: string | boolean) =>
    setValues((v) => ({ ...v, [name]: value }));

  async function generateWithAI() {
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: resource.key,
          name: values[resource.titleField] ?? "",
          context: values["countryId"] || values["cityId"] || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setValues((v) => {
          const next = { ...v };
          for (const key of Object.keys(data)) {
            if (key === "faq") continue;
            if (resource.fields.some((f) => f.name === key)) next[key] = data[key];
          }
          return next;
        });
        if (Array.isArray(data.faq)) setFaq(data.faq);
      }
    } finally {
      setAiLoading(false);
    }
  }

  const byGroup = (g: Field["group"]) =>
    resource.fields.filter((f) => (f.group ?? "main") === g);

  function renderField(field: Field) {
    if (field.type === "categories") {
      return (
        <fieldset key={field.name} className="md:col-span-2">
          <Label>{field.label}</Label>
          <div className="flex flex-wrap gap-2">
            {options.categories.map((opt) => {
              const checked = cats.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                    checked ? "border-brand-600 bg-brand-50 text-brand-700" : "border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={field.name}
                    value={opt.value}
                    checked={checked}
                    onChange={(e) =>
                      setCats((c) =>
                        e.target.checked
                          ? [...c, opt.value]
                          : c.filter((x) => x !== opt.value),
                      )
                    }
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              );
            })}
            {options.categories.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune catégorie.</p>
            )}
          </div>
        </fieldset>
      );
    }

    if (field.type === "faq") {
      return (
        <fieldset key={field.name} className="md:col-span-2">
          <Label>{field.label}</Label>
          <input type="hidden" name="faq" value={JSON.stringify(faq)} />
          <div className="space-y-3">
            {faq.map((row, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <input
                  className={inputCls}
                  placeholder="Question"
                  value={row.question}
                  onChange={(e) =>
                    setFaq((f) =>
                      f.map((r, j) => (j === i ? { ...r, question: e.target.value } : r)),
                    )
                  }
                />
                <textarea
                  className={`${inputCls} mt-2`}
                  placeholder="Réponse"
                  rows={2}
                  value={row.answer}
                  onChange={(e) =>
                    setFaq((f) =>
                      f.map((r, j) => (j === i ? { ...r, answer: e.target.value } : r)),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setFaq((f) => f.filter((_, j) => j !== i))}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-red-600"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFaq((f) => [...f, { question: "", answer: "" }])}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
            >
              <Plus size={15} /> Ajouter une question
            </button>
          </div>
        </fieldset>
      );
    }

    const colSpan = field.fullWidth ? "md:col-span-2" : "";
    const common = { id: field.name, name: field.name };

    return (
      <div key={field.name} className={colSpan}>
        <Label htmlFor={field.name}>
          {field.label} {field.required && <span className="text-red-600">*</span>}
        </Label>

        {field.type === "textarea" && (
          <textarea
            {...common}
            rows={3}
            required={field.required}
            className={inputCls}
            value={values[field.name] as string}
            onChange={(e) => set(field.name, e.target.value)}
          />
        )}
        {field.type === "richtext" && (
          <textarea
            {...common}
            rows={10}
            required={field.required}
            className={`${inputCls} font-mono`}
            value={values[field.name] as string}
            onChange={(e) => set(field.name, e.target.value)}
          />
        )}
        {(field.type === "gallery" || field.type === "stringlist") && (
          <textarea
            {...common}
            rows={3}
            className={inputCls}
            value={values[field.name] as string}
            onChange={(e) => set(field.name, e.target.value)}
          />
        )}
        {(field.type === "select" || field.type === "belongsTo") && (
          <select
            {...common}
            required={field.required}
            className={inputCls}
            value={values[field.name] as string}
            onChange={(e) => set(field.name, e.target.value)}
          >
            <option value="">— Choisir —</option>
            {(field.type === "select"
              ? field.options ?? []
              : options.belongsTo[field.name] ?? []
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {field.type === "boolean" && (
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={field.name}
              checked={Boolean(values[field.name])}
              onChange={(e) => set(field.name, e.target.checked)}
              className="h-4 w-4"
            />
            Oui
          </label>
        )}
        {["text", "slug", "image", "number", "tags"].includes(field.type) && (
          <Input
            {...common}
            type={field.type === "number" ? "number" : "text"}
            required={field.required}
            value={values[field.name] as string}
            onChange={(e) => set(field.name, e.target.value)}
          />
        )}
        {field.help && (
          <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
        )}
        {field.type === "image" && values[field.name] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values[field.name] as string}
            alt=""
            className="mt-2 h-24 w-40 rounded-md object-cover"
          />
        )}
      </div>
    );
  }

  const groups: { key: Field["group"]; title: string }[] = [
    { key: "main", title: "Contenu principal" },
    { key: "details", title: "Détails" },
    { key: "media", title: "Médias" },
    { key: "seo", title: "Référencement (SEO)" },
  ];

  return (
    <form action={saveResource.bind(null, resource.key, id)}>
      {groups.map((group) => {
        const fields = byGroup(group.key);
        if (fields.length === 0) return null;
        return (
          <section key={group.key} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">{group.title}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map(renderField)}
            </div>
          </section>
        );
      })}

      {/* Barre d'actions */}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 py-4 backdrop-blur">
        <Button type="submit" name="intent" value="publish">
          Publier
        </Button>
        <Button type="submit" name="intent" value="draft" variant="outline">
          Enregistrer le brouillon
        </Button>
        {id && (
          <Button type="submit" name="intent" value="unpublish" variant="ghost">
            Dépublier
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={generateWithAI}
          loading={aiLoading}
        >
          <Sparkles size={16} /> Générer avec l'IA
        </Button>
        {id && publicPath && (
          <Link
            href={`/api/preview?path=${encodeURIComponent(publicPath)}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
          >
            <Eye size={15} /> Prévisualiser
          </Link>
        )}
        {publicPath && (
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink size={15} /> Voir
          </a>
        )}
      </div>

      {record?.status && (
        <p className="mt-2 text-sm text-muted-foreground">
          Statut actuel :{" "}
          <strong>
            {STATUS_OPTIONS.find((s) => s.value === record.status)?.label ??
              record.status}
          </strong>
        </p>
      )}

      {id && (
        <DeleteButton resourceKey={resource.key} id={id} />
      )}
    </form>
  );
}

function DeleteButton({ resourceKey, id }: { resourceKey: string; id: string }) {
  return (
    <span className="mt-6 block border-t border-border pt-6">
      <button
        formAction={deleteResource.bind(null, resourceKey, id)}
        onClick={(e) => {
          if (!confirm("Supprimer définitivement cet élément ?")) e.preventDefault();
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
      >
        <Trash2 size={15} /> Supprimer
      </button>
    </span>
  );
}
