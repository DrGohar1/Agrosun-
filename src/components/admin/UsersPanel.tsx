import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { History, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { listStaff, createStaff, setStaffRole, setStaffStatus, type StaffRole } from "@/lib/users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const roleLabel: Record<StaffRole, string> = { admin: "Super Admin", editor: "Export Manager", viewer: "Viewer / Staff" };
type Data = Awaited<ReturnType<typeof listStaff>>;

export function UsersPanel() {
  const list = useServerFn(listStaff), create = useServerFn(createStaff), setRole = useServerFn(setStaffRole), setStatus = useServerFn(setStaffStatus);
  const [d, setD] = useState<Data | null>(null);
  const [form, setForm] = useState({ login: "", password: "", role: "viewer" as StaffRole });
  const load = async () => { try { setD(await list()); } catch (e) { toast.error((e as Error).message); } };
  useEffect(() => { void load(); }, []);
  const run = async (p: Promise<unknown>, ok: string) => { try { await p; toast.success(ok); await load(); } catch (e) { toast.error((e as Error).message); } };

  return <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); void run(create({ data: form }), "User created").then(() => setForm({ login: "", password: "", role: "viewer" })); }} className="rounded-xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-bold text-primary"><UserPlus className="h-5 w-5 text-accent" />Add team member</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto]">
          <Input required placeholder="Username or email" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} />
          <Input required minLength={8} type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select value={form.role} onValueChange={(role) => setForm({ ...form, role: role as StaffRole })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(Object.keys(roleLabel) as StaffRole[]).map((r) => <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>)}</SelectContent></Select>
          <Button>Add</Button>
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-start text-xs uppercase text-muted-foreground"><tr><th className="p-3 text-start">Account</th><th className="p-3 text-start">Role</th><th className="p-3 text-start">Status</th><th className="p-3 text-start">Last sign-in</th></tr></thead>
          <tbody>{d?.staff.map((u) => <tr key={u.id} className="border-t border-border">
            <td className="p-3 font-semibold text-primary">{u.email.replace("@agrosun.admin", "")}{u.self && <span className="ms-2 text-xs text-muted-foreground">(you)</span>}</td>
            <td className="p-3">{u.self ? <span className="inline-flex items-center gap-1 font-semibold"><ShieldCheck className="h-4 w-4 text-leaf" />{u.role === "none" ? "No access" : roleLabel[u.role]}</span> :
              <Select value={u.role === "none" ? "" : u.role} onValueChange={(role) => run(setRole({ data: { userId: u.id, role: role as StaffRole } }), "Role updated")}><SelectTrigger className="w-44"><SelectValue placeholder="No access" /></SelectTrigger><SelectContent>{(Object.keys(roleLabel) as StaffRole[]).map((r) => <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>)}</SelectContent></Select>}</td>
            <td className="p-3"><div className="flex items-center gap-2"><Switch disabled={u.self} checked={u.status === "active"} onCheckedChange={(on) => run(setStatus({ data: { userId: u.id, suspended: !on } }), on ? "Account activated" : "Account suspended")} /><span className={u.status === "active" ? "text-leaf" : "text-destructive"}>{u.status === "active" ? "Active" : "Suspended"}</span></div></td>
            <td className="p-3 text-xs text-muted-foreground">{u.lastSignIn ? new Date(u.lastSignIn).toLocaleString() : "Never"}</td>
          </tr>)}</tbody>
        </table>
        {!d && <p className="p-5 text-sm text-muted-foreground">Loading accounts…</p>}
      </div>
    </div>
    <aside className="rounded-xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-bold text-primary"><History className="h-5 w-5 text-accent" />Audit log</h2>
      <ul className="mt-4 max-h-[60svh] space-y-3 overflow-y-auto text-sm">{d?.logs.length === 0 && <li className="text-muted-foreground">No activity yet.</li>}{d?.logs.map((l) => <li key={l.id} className="border-s-2 border-leaf ps-3"><p className="font-semibold">{l.action}</p><p className="truncate text-xs text-muted-foreground">{l.actor_email.replace("@agrosun.admin", "")} → {l.target.replace("@agrosun.admin", "")}</p><p className="text-[11px] text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p></li>)}</ul>
    </aside>
  </div>;
}
