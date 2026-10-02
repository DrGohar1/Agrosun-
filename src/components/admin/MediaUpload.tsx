import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Uploads to the private site-media bucket and returns a 10-year signed link. */
export function MediaUpload({ value, onChange, accept = "image/*" }: { value: string; onChange: (url: string) => void; accept?: string }) {
  const [busy, setBusy] = useState(false);
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
  return <div className="flex gap-2">
    {value && !value.match(/\.(mp4|webm)(\?|$)/) && <img src={value} alt="" className="h-10 w-10 rounded object-cover" />}
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste a link or upload" />
    <Button type="button" variant="outline" disabled={busy} asChild><label className="cursor-pointer"><Upload />{busy ? "…" : "Upload"}<input type="file" accept={accept} hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></label></Button>
  </div>;
}
