import { useEffect, useState } from "react";
import { CheckCircle2, ImageOff, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const isVideo = (v: string) => /\.(mp4|webm|mov)(\?|$)/i.test(v);

/** Upload or paste a link, with a live preview and an automatic link check. */
export function MediaUpload({ value, onChange, accept = "image/*" }: { value: string; onChange: (url: string) => void; accept?: string }) {
  const [busy, setBusy] = useState(false);
  const [initial] = useState(value);
  const [state, setState] = useState<"idle" | "checking" | "ok" | "broken">("idle");
  useEffect(() => {
    if (!value || isVideo(value)) { setState("idle"); return; }
    setState("checking");
    const img = new Image();
    img.onload = () => setState("ok");
    img.onerror = () => setState("broken");
    img.src = value;
  }, [value]);
  const upload = async (f: File) => {
    setBusy(true);
    const path = `${Date.now()}-${f.name.replace(/[^\w.-]/g, "_")}`;
    const up = await supabase.storage.from("site-media").upload(path, f, { contentType: f.type });
    if (up.error) { setBusy(false); toast.error(up.error.message); return; }
    const { data, error } = await supabase.storage.from("site-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setBusy(false);
    if (error || !data) { toast.error(error?.message ?? "Upload failed"); return; }
    onChange(data.signedUrl); toast.success("Uploaded");
  };
  const changed = initial !== value && initial;
  return <div className="space-y-2">
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => onChange(e.target.value.trim())} placeholder="Paste an image link or upload" className={state === "broken" ? "border-destructive" : ""} />
      <Button type="button" variant="outline" disabled={busy} asChild><label className="cursor-pointer"><Upload />{busy ? "…" : "Upload"}<input type="file" accept={accept} hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></label></Button>
    </div>
    {value && <div className="flex items-end gap-3">
      {changed && !isVideo(initial) && <figure className="text-center"><img src={initial} alt="" className="h-20 w-28 rounded-md object-cover opacity-60" /><figcaption className="mt-1 text-[10px] text-muted-foreground">Before</figcaption></figure>}
      <figure className="text-center">
        {isVideo(value) ? <video src={value} muted className="h-20 w-28 rounded-md object-cover" /> : state === "broken" ? <div className="grid h-20 w-28 place-items-center rounded-md bg-destructive/10 text-destructive"><ImageOff className="h-6 w-6" /></div> : <img src={value} alt="" className="h-20 w-28 rounded-md object-cover ring-2 ring-leaf/50" />}
        <figcaption className="mt-1 text-[10px] text-muted-foreground">{changed ? "After" : "Preview"}</figcaption>
      </figure>
      <span className={`flex items-center gap-1 text-xs font-semibold ${state === "broken" ? "text-destructive" : "text-leaf"}`}>
        {state === "checking" && <><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking link…</>}
        {state === "ok" && <><CheckCircle2 className="h-3.5 w-3.5" />Link works</>}
        {state === "broken" && <><ImageOff className="h-3.5 w-3.5" />Broken link — the website will show the company logo instead</>}
      </span>
    </div>}
  </div>;
}
