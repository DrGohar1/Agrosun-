import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const roleSchema = z.enum(["admin", "editor", "viewer"]);
export type StaffRole = z.infer<typeof roleSchema>;

async function assertSuperAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Only a Super Admin can manage users.");
}
async function audit(admin: any, actorId: string, action: string, target: string) {
  const { data } = await admin.auth.admin.getUserById(actorId);
  await admin.from("audit_logs").insert({ actor_id: actorId, actor_email: data?.user?.email ?? "", action, target });
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: users, error }, { data: roles }, { data: logs }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 200 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (error) throw error;
    const staff = users.users.map((u) => {
      const r = (roles ?? []).filter((x) => x.user_id === u.id).map((x) => x.role as string);
      const role: StaffRole | "none" = r.includes("admin") ? "admin" : r.includes("editor") ? "editor" : r.includes("viewer") ? "viewer" : "none";
      const banned = Boolean((u as { banned_until?: string }).banned_until && new Date((u as { banned_until?: string }).banned_until!) > new Date());
      return { id: u.id, email: u.email ?? "", role, status: banned ? "suspended" : "active", lastSignIn: u.last_sign_in_at ?? null, self: u.id === context.userId };
    });
    return { staff, logs: (logs ?? []) as { id: string; actor_email: string; action: string; target: string; created_at: string }[] };
  });

export const createStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ login: z.string().trim().min(2).max(255), password: z.string().min(8).max(72), role: roleSchema }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.login.includes("@") ? data.login.toLowerCase() : `${data.login.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@agrosun.admin`;
    const { data: u, error } = await supabaseAdmin.auth.admin.createUser({ email, password: data.password, email_confirm: true });
    if (error) throw error;
    await supabaseAdmin.from("user_roles").insert({ user_id: u.user.id, role: data.role });
    await audit(supabaseAdmin, context.userId, `Created user as ${data.role}`, email);
    return { ok: true };
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), role: roleSchema }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context);
    if (data.userId === context.userId) throw new Error("You cannot change your own role.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
    if (error) throw error;
    await audit(supabaseAdmin, context.userId, `Changed role to ${data.role}`, data.userId);
    return { ok: true };
  });

export const setStaffStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), suspended: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context);
    if (data.userId === context.userId) throw new Error("You cannot suspend yourself.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { ban_duration: data.suspended ? "876000h" : "none" });
    if (error) throw error;
    await supabaseAdmin.from("profiles").upsert({ user_id: data.userId, status: data.suspended ? "suspended" : "active" } as never);
    await audit(supabaseAdmin, context.userId, data.suspended ? "Suspended account" : "Re-activated account", data.userId);
    return { ok: true };
  });
