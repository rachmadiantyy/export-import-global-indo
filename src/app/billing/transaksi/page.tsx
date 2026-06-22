"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Bukti transaksi QR Pay (Permata ME) untuk pembayaran ke merchant Bitara.
 * Tampil seperti struk informasi transaksi yang bisa dicetak / disimpan PDF.
 */

const TRX: { label: string; value: string; highlight?: boolean }[] = [
  { label: "Tanggal", value: "26/05/2026" },
  { label: "Jam", value: "07:36:45" },
  { label: "Rekening Asal", value: "99XXXXXX07" },
  { label: "Customer PAN", value: "9360001310009116212" },
  { label: "Kategori", value: "QR Pay" },
  { label: "Nama Merchant", value: "Bitara", highlight: true },
  { label: "Merchant PAN", value: "9360091800228688646" },
  { label: "Alamat Merchant", value: "KAB. BEKASI" },
  { label: "Nama Acquirer", value: "SHOPEEPAY" },
  { label: "Tips", value: "0.00" },
  { label: "Biaya Service / Diskon", value: "-" },
  { label: "Total Nominal", value: "100,700" },
  { label: "ID Terminal", value: "22868864" },
  { label: "No. Referensi Transaksi", value: "260526002240" },
  { label: "Status Transaksi", value: "Sukses" },
  { label: "Dibuat oleh", value: "RACHMA DIANTY" },
];

export default function TransaksiPage() {
  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 print:bg-white print:py-0">
      {/* Toolbar (disembunyikan saat print) */}
      <div className="mx-auto mb-6 flex max-w-2xl justify-end print:hidden">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Cetak / Simpan PDF
        </Button>
      </div>

      {/* Struk */}
      <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm print:border-0 print:shadow-none sm:p-10">
        <p className="mb-6 text-sm font-medium text-foreground">
          Berikut ini adalah informasi transaksi yang telah Anda lakukan di
          Permata ME :
        </p>

        <dl className="text-sm">
          {TRX.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-2 py-1.5 leading-relaxed"
            >
              <dt className="w-44 shrink-0 text-muted-foreground">
                {row.label}
              </dt>
              <dd className="shrink-0 text-muted-foreground">:</dd>
              <dd
                className={
                  row.highlight
                    ? "bg-yellow-200 px-1 font-medium text-foreground"
                    : "font-medium text-foreground"
                }
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
