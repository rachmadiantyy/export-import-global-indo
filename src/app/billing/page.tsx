"use client";

import { useMemo, useState } from "react";
import { Printer, Server, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Halaman billing bulanan untuk VM (provider pay-as-you-go / tanpa invoice bulanan).
 * Dibuat agar pemakaian VM bisa direkap & dicetak sebagai tagihan resmi per bulan.
 */

const PROVIDER = {
  name: "Bitara",
  domain: "bitara.id",
  email: "noreply@bitara.id",
};

const CUSTOMER = {
  name: "Rachma Dianty",
  alias: "Dianty",
};

const VM = {
  name: "Fedx-Palm-Server",
  username: "root",
  network: "—",
  vcpu: 16,
  ramGb: 32,
  diskGb: 40,
};

// Tarif sesuai panel provider
const RATE_PER_HOUR = 3280; // Rp / jam
const HOURS_PER_MONTH = 720; // basis 720 jam/bln (30 hari)

const PPN_RATE = 0; // pay-as-you-go: harga sudah final, tanpa PPN tambahan

const rupiah = (n: number) =>
  "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

function monthLabel(d: Date) {
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export default function BillingPage() {
  const now = new Date();
  const [hours, setHours] = useState<number>(HOURS_PER_MONTH);

  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const invoiceNo = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `INV/${y}${m}/BITARA-${VM.name.toUpperCase().slice(0, 4)}`;
  }, [now]);

  const subtotal = Math.round(RATE_PER_HOUR * hours);
  const ppn = Math.round(subtotal * PPN_RATE);
  const total = subtotal + ppn;

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 print:bg-white print:py-0">
      {/* Toolbar (disembunyikan saat print) */}
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Jam pemakaian</label>
          <input
            type="number"
            min={0}
            max={744}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value) || 0)}
            className="w-24 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          />
        </div>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Cetak / Simpan PDF
        </Button>
      </div>

      {/* Invoice */}
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm print:border-0 print:shadow-none sm:p-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Server className="h-6 w-6 text-emerald-600" />
              {PROVIDER.name}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{PROVIDER.domain}</p>
            <p className="text-sm text-muted-foreground">{PROVIDER.email}</p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-semibold uppercase tracking-wide text-emerald-700">
              Tagihan Bulanan
            </h1>
            <p className="mt-1 text-sm font-medium">{invoiceNo}</p>
            <p className="text-sm text-muted-foreground">
              Periode: {monthLabel(periodStart)}
            </p>
          </div>
        </div>

        {/* Pihak */}
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ditagihkan kepada
            </p>
            <p className="mt-1 font-semibold">{CUSTOMER.name}</p>
            <p className="text-sm text-muted-foreground">{CUSTOMER.alias}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rentang Tagihan
            </p>
            <p className="mt-1 text-sm">
              {periodStart.toLocaleDateString("id-ID")} —{" "}
              {periodEnd.toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {/* Spesifikasi VM */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{VM.name}</p>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              Aktif
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Spec icon={<Cpu className="h-4 w-4" />} label="vCPU" value={`${VM.vcpu}`} />
            <Spec icon={<MemoryStick className="h-4 w-4" />} label="RAM" value={`${VM.ramGb} GB`} />
            <Spec icon={<HardDrive className="h-4 w-4" />} label="Disk" value={`${VM.diskGb} GB`} />
            <Spec icon={<Server className="h-4 w-4" />} label="User" value={VM.username} />
          </div>
        </div>

        {/* Rincian biaya */}
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 font-semibold">Deskripsi</th>
              <th className="pb-2 text-right font-semibold">Jam</th>
              <th className="pb-2 text-right font-semibold">Tarif/Jam</th>
              <th className="pb-2 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">
                Sewa VM {VM.name}
                <br />
                <span className="text-xs text-muted-foreground">
                  {VM.vcpu} vCPU · {VM.ramGb} GB · {VM.diskGb} GB
                </span>
              </td>
              <td className="py-3 text-right">{hours}</td>
              <td className="py-3 text-right">{rupiah(RATE_PER_HOUR)}</td>
              <td className="py-3 text-right">{rupiah(subtotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Total */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            {PPN_RATE > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  PPN ({PPN_RATE * 100}%)
                </span>
                <span>{rupiah(ppn)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-emerald-700">{rupiah(total)}</span>
            </div>
            <p className="text-right text-xs text-muted-foreground">
              Est. {rupiah(RATE_PER_HOUR * HOURS_PER_MONTH)} / bulan (720 jam)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-emerald-600">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
