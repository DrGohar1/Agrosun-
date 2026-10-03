import type { Database } from "@/integrations/supabase/types";
import { brand } from "@/data/site";

type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

async function asBase64(url: string) {
  const blob = await fetch(url).then((r) => r.blob());
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function exportEnquiries(rows: Message[]) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Agrosun Group";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Enquiries", { views: [{ state: "frozen", ySplit: 5 }] });
  sheet.properties.defaultRowHeight = 22;
  sheet.mergeCells("A1:K1");
  sheet.getCell("A1").value = "AGROSUN GROUP — EXPORT ENQUIRY TRACKER";
  sheet.getCell("A1").font = { name: "Arial", bold: true, size: 18, color: { argb: "FFFFFFFF" } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF174C3C" } };
  sheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 42;
  sheet.mergeCells("A2:K2");
  sheet.getCell("A2").value = `Customer service handover • Exported ${new Date().toLocaleString()}`;
  sheet.getCell("A2").font = { name: "Arial", italic: true, color: { argb: "FF667085" } };
  sheet.getCell("A2").alignment = { horizontal: "center" };
  try {
    const logo = workbook.addImage({ base64: await asBase64(brand.logo), extension: "png" });
    sheet.addImage(logo, { tl: { col: 0.1, row: 0.1 }, ext: { width: 92, height: 34 } });
  } catch { /* Workbook remains branded when a browser blocks the local logo fetch. */ }
  const headers = ["Received", "Status", "Buyer", "Company", "Country", "Product", "Email", "Phone / WhatsApp", "Assigned to", "Contacted", "Message / Notes"];
  const header = sheet.getRow(5);
  header.values = headers;
  header.height = 30;
  header.eachCell((cell) => {
    cell.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC13C4B" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  rows.forEach((m) => sheet.addRow([
    new Date(m.created_at), m.status, m.name, m.company ?? "", m.country ?? "", m.product ?? "", m.email,
    m.phone ?? "", m.assigned_to, m.contacted_at ? new Date(m.contacted_at) : "",
    [m.message, m.internal_notes].filter(Boolean).join("\nNotes: "),
  ]));
  sheet.columns = [{ width: 21 }, { width: 14 }, { width: 22 }, { width: 24 }, { width: 16 }, { width: 19 }, { width: 30 }, { width: 21 }, { width: 20 }, { width: 21 }, { width: 46 }];
  sheet.getColumn(1).numFmt = "dd mmm yyyy hh:mm";
  sheet.getColumn(10).numFmt = "dd mmm yyyy hh:mm";
  for (let i = 6; i <= sheet.rowCount; i += 1) {
    const row = sheet.getRow(i);
    row.alignment = { vertical: "top", wrapText: true };
    row.font = { name: "Arial", size: 10 };
    row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 ? "FFF5FAF6" : "FFFFFFFF" } };
    row.eachCell((cell) => { cell.border = { bottom: { style: "hair", color: { argb: "FFD5DDD8" } } }; });
  }
  sheet.autoFilter = { from: "A5", to: "K5" };
  const data = await workbook.xlsx.writeBuffer();
  download(new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Agrosun-Enquiries-${new Date().toISOString().slice(0, 10)}.xlsx`);
}