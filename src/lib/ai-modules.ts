export type FieldType = 'text' | 'textarea' | 'number'

export type AIField = {
  name: string
  label: string
  placeholder?: string
  type?: FieldType
  required?: boolean
}

export type AITask = {
  id: string
  label: string
  description: string
  systemPrompt: string
  userTemplate: string
  fields: AIField[]
}

export type AIModule = {
  id: string
  label: string
  icon: string
  description: string
  tasks: AITask[]
}

const baseSystem =
  'You are an expert assistant for an Indonesian export-import trading company (GlobalNusantara). Respond in the language of the user input (Bahasa Indonesia or English). Be concise, accurate, and structured (use headings, bullets, tables when useful). When you are unsure, state your assumptions explicitly. Use Incoterms 2020 and HS Code conventions.'

export const AI_MODULES: AIModule[] = [
  {
    id: 'market-research',
    label: 'Market Research',
    icon: 'TrendingUp',
    description: 'Analisis pasar global, demand, kompetitor, regulasi & HS code.',
    tasks: [
      {
        id: 'country-analysis',
        label: 'Country / Market Analysis',
        description: 'Analisa pasar negara tujuan untuk suatu produk.',
        systemPrompt: `${baseSystem}\nFocus on export-market intelligence: market size, growth, key importers, tariff/duty, non-tariff barriers, certifications required (e.g. FDA, CE, HALAL, ISPM-15), seasonality, top competing origin countries, distribution channels, and risk factors. Output: structured report with sections.`,
        userTemplate:
          'Analisa pasar untuk PRODUK: {{product}} (HS Code {{hsCode}}) di NEGARA TUJUAN: {{country}}. Volume target tahunan: {{volume}}. Beri rekomendasi go/no-go dengan alasan.',
        fields: [
          { name: 'product', label: 'Produk', placeholder: 'Crude Palm Oil', required: true },
          { name: 'hsCode', label: 'HS Code', placeholder: '1511.10' },
          { name: 'country', label: 'Negara Tujuan', placeholder: 'Germany', required: true },
          { name: 'volume', label: 'Volume target / tahun', placeholder: '500 MT' },
        ],
      },
      {
        id: 'demand-forecast',
        label: 'Demand Forecast & Trend',
        description: 'Perkirakan trend permintaan 12-24 bulan ke depan.',
        systemPrompt: `${baseSystem}\nProvide a demand outlook using qualitative drivers (macro, regulatory, sustainability, substitution). State key assumptions and confidence level. Include a simple monthly forecast table.`,
        userTemplate:
          'Buat forecast permintaan {{product}} di pasar {{market}} untuk 18 bulan ke depan. Tambahkan driver utama, risiko, dan rekomendasi strategi sourcing.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'market', label: 'Pasar / Region', placeholder: 'EU, US, Middle East', required: true },
        ],
      },
      {
        id: 'hs-tariff',
        label: 'HS Code & Tariff Lookup',
        description: 'Identifikasi HS Code dan estimasi tarif/dokumen import.',
        systemPrompt: `${baseSystem}\nReturn: most likely HS code (6-10 digit), commonly used alternative codes, applicable import duty range for destination, VAT, anti-dumping risk, required import permits/certificates. Mark estimates clearly.`,
        userTemplate:
          'Produk: {{product}} (deskripsi: {{description}}). Negara tujuan: {{country}}. Tampilkan HS code, tarif & dokumen yang dibutuhkan.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'description', label: 'Deskripsi singkat', type: 'textarea' },
          { name: 'country', label: 'Negara Tujuan', required: true },
        ],
      },
      {
        id: 'competitor-scan',
        label: 'Competitor Scan',
        description: 'Petakan kompetitor utama (origin & brand).',
        systemPrompt: `${baseSystem}\nList top 5-10 likely competitors with origin country, typical price range, key strengths/weaknesses, and how to differentiate.`,
        userTemplate:
          'Petakan kompetitor untuk ekspor {{product}} ke {{country}}. Saya menawarkan keunggulan: {{advantage}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'country', label: 'Pasar', required: true },
          { name: 'advantage', label: 'Keunggulan kami', placeholder: 'Harga, kualitas, sertifikasi…' },
        ],
      },
    ],
  },
  {
    id: 'supplier-sourcing',
    label: 'Supplier Sourcing',
    icon: 'Factory',
    description: 'Cari, verifikasi & negosiasi dengan supplier/produsen lokal.',
    tasks: [
      {
        id: 'find-suppliers',
        label: 'Find Suppliers (Indonesia)',
        description: 'Daftar tipe & wilayah supplier potensial di Indonesia.',
        systemPrompt: `${baseSystem}\nList supplier archetypes (cooperative, smallholder aggregator, processor, factory), main regions in Indonesia, typical MOQ, certifications commonly held, and how to vet them.`,
        userTemplate:
          'Saya butuh supplier {{product}} dengan kapasitas {{capacity}} dan sertifikasi {{cert}}. Beri panduan sourcing di Indonesia.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'capacity', label: 'Kapasitas dibutuhkan', placeholder: '20 ton/bulan' },
          { name: 'cert', label: 'Sertifikasi', placeholder: 'RSPO, HACCP, Organic' },
        ],
      },
      {
        id: 'rfq-generator',
        label: 'RFQ (Request for Quotation)',
        description: 'Email RFQ profesional ke supplier.',
        systemPrompt: `${baseSystem}\nWrite a clear, professional RFQ email in Bahasa Indonesia. Include: product spec, packaging, quantity, delivery point, incoterm, target payment terms, certifications, sample request, response deadline.`,
        userTemplate:
          'Buat RFQ untuk {{product}}, spesifikasi {{spec}}, jumlah {{qty}}, dikirim ke {{loadPort}}, Incoterm {{incoterm}}, payment {{payment}}. Deadline jawaban: {{deadline}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'spec', label: 'Spesifikasi', type: 'textarea' },
          { name: 'qty', label: 'Quantity', placeholder: '40 MT' },
          { name: 'loadPort', label: 'Port of Loading', placeholder: 'Tanjung Priok' },
          { name: 'incoterm', label: 'Incoterm', placeholder: 'FOB' },
          { name: 'payment', label: 'Payment Terms', placeholder: '30% TT advance, 70% LC' },
          { name: 'deadline', label: 'Deadline', placeholder: '5 hari kerja' },
        ],
      },
      {
        id: 'supplier-verify',
        label: 'Supplier Verification Checklist',
        description: 'Checklist due-diligence supplier.',
        systemPrompt: `${baseSystem}\nProduce a due-diligence checklist covering legal (NIB, NPWP, akta), operational (facility audit, capacity, QC), financial (bank ref), reputation (references, sanctions/PEP), and ESG.`,
        userTemplate:
          'Buat checklist verifikasi untuk supplier {{name}} (produk {{product}}, lokasi {{location}}).',
        fields: [
          { name: 'name', label: 'Nama Supplier', required: true },
          { name: 'product', label: 'Produk' },
          { name: 'location', label: 'Lokasi' },
        ],
      },
    ],
  },
  {
    id: 'buyer-acquisition',
    label: 'Buyer Acquisition',
    icon: 'Users',
    description: 'Cari buyer luar negeri & buka percakapan pertama.',
    tasks: [
      {
        id: 'buyer-persona',
        label: 'Ideal Buyer Persona',
        description: 'Definisikan ICP buyer luar negeri.',
        systemPrompt: `${baseSystem}\nDescribe the ideal buyer persona: company type, size, role of decision maker, typical pain points, buying triggers, where to find them (trade shows, B2B platforms, associations).`,
        userTemplate: 'Buat ICP buyer untuk {{product}} di pasar {{market}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'market', label: 'Pasar', required: true },
        ],
      },
      {
        id: 'cold-email',
        label: 'Cold Outreach Email',
        description: 'Email pertama ke calon buyer (EN).',
        systemPrompt: `${baseSystem}\nWrite a concise, personalized cold email in English (≤150 words) with strong subject line, value prop, social proof, and a soft CTA. Avoid spammy phrases.`,
        userTemplate:
          'Buyer: {{company}} di {{country}} (industri {{industry}}). Produk yang ditawarkan: {{product}}. Unique value: {{value}}. Nama pengirim: {{sender}}.',
        fields: [
          { name: 'company', label: 'Buyer Company', required: true },
          { name: 'country', label: 'Country' },
          { name: 'industry', label: 'Industry' },
          { name: 'product', label: 'Product', required: true },
          { name: 'value', label: 'Unique Value', placeholder: 'RSPO certified, direct from mill' },
          { name: 'sender', label: 'Sender Name' },
        ],
      },
      {
        id: 'linkedin-msg',
        label: 'LinkedIn Connection Message',
        description: 'Pesan koneksi LinkedIn singkat.',
        systemPrompt: `${baseSystem}\nWrite a 250-char LinkedIn note: warm, specific, not salesy. End with a low-friction question.`,
        userTemplate: 'Target: {{name}}, {{role}} di {{company}}. Sudut kontak: {{angle}}.',
        fields: [
          { name: 'name', label: 'Name', required: true },
          { name: 'role', label: 'Role' },
          { name: 'company', label: 'Company' },
          { name: 'angle', label: 'Hook/Angle', type: 'textarea' },
        ],
      },
      {
        id: 'trade-show-pitch',
        label: '60-Second Trade Show Pitch',
        description: 'Pitch booth pameran.',
        systemPrompt: `${baseSystem}\nWrite a 60-second spoken pitch (≈150 words): hook → product → proof → ask.`,
        userTemplate: 'Pameran: {{event}}. Produk: {{product}}. Highlight: {{highlight}}.',
        fields: [
          { name: 'event', label: 'Trade Show', placeholder: 'Gulfood, SIAL, ANUGA' },
          { name: 'product', label: 'Produk', required: true },
          { name: 'highlight', label: 'Highlight', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'sales-crm',
    label: 'Sales & CRM',
    icon: 'KanbanSquare',
    description: 'Follow up, negosiasi, dan closing.',
    tasks: [
      {
        id: 'follow-up',
        label: 'Follow-up Email',
        description: 'Email follow-up setelah quotation/sample.',
        systemPrompt: `${baseSystem}\nWrite a polite, value-adding follow-up email. Reference prior interaction, add new info or insight, and propose a clear next step.`,
        userTemplate:
          'Buyer: {{buyer}}. Konteks terakhir: {{context}}. Hari sejak kontak: {{days}}. Tujuan follow-up: {{goal}}.',
        fields: [
          { name: 'buyer', label: 'Buyer', required: true },
          { name: 'context', label: 'Konteks', type: 'textarea', required: true },
          { name: 'days', label: 'Hari sejak kontak terakhir', type: 'number' },
          { name: 'goal', label: 'Tujuan', placeholder: 'Jadwalkan call, dapatkan PO' },
        ],
      },
      {
        id: 'objection',
        label: 'Objection Handling',
        description: 'Jawaban untuk keberatan buyer (harga, MOQ, LC).',
        systemPrompt: `${baseSystem}\nFor each objection, provide: (1) empathetic acknowledgment, (2) reframe, (3) evidence, (4) counter-offer. Provide both EN and ID versions.`,
        userTemplate: 'Buyer mengatakan: "{{objection}}". Konteks deal: {{context}}.',
        fields: [
          { name: 'objection', label: 'Keberatan Buyer', type: 'textarea', required: true },
          { name: 'context', label: 'Konteks Deal', type: 'textarea' },
        ],
      },
      {
        id: 'negotiation-script',
        label: 'Negotiation Script',
        description: 'Skrip negosiasi harga & terms.',
        systemPrompt: `${baseSystem}\nProvide a negotiation playbook: opening anchor, BATNA, ZOPA, concession ladder, and 3 closing techniques.`,
        userTemplate:
          'Produk: {{product}}, target margin {{margin}}%. Tawaran awal buyer: {{offer}}. Posisi kita: {{position}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'margin', label: 'Target Margin %', type: 'number' },
          { name: 'offer', label: 'Tawaran Buyer' },
          { name: 'position', label: 'Posisi Kita', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'export-docs',
    label: 'Export Documentation',
    icon: 'FileText',
    description: 'Generate dokumen ekspor (PI, CI, PL, BL, COO).',
    tasks: [
      {
        id: 'proforma-invoice',
        label: 'Proforma Invoice',
        description: 'Draft PI siap dikirim ke buyer.',
        systemPrompt: `${baseSystem}\nProduce a complete Proforma Invoice in plain text (table-formatted): seller, buyer, PI number, date, validity, product description, HS code, quantity, unit price, total, Incoterm, port of loading/discharge, payment terms, bank details placeholder, signature block.`,
        userTemplate:
          'Buyer: {{buyer}} ({{country}}). Produk: {{product}} HS {{hs}}, qty {{qty}}, harga {{price}} {{currency}}/{{unit}}, Incoterm {{incoterm}} {{port}}. Payment: {{payment}}. PI No: {{pi}}.',
        fields: [
          { name: 'buyer', label: 'Buyer', required: true },
          { name: 'country', label: 'Country' },
          { name: 'product', label: 'Produk', required: true },
          { name: 'hs', label: 'HS Code' },
          { name: 'qty', label: 'Quantity', required: true },
          { name: 'price', label: 'Unit Price', required: true },
          { name: 'currency', label: 'Currency', placeholder: 'USD' },
          { name: 'unit', label: 'Unit', placeholder: 'MT, kg, pcs' },
          { name: 'incoterm', label: 'Incoterm', placeholder: 'FOB' },
          { name: 'port', label: 'Port', placeholder: 'Tanjung Priok' },
          { name: 'payment', label: 'Payment', placeholder: '30% TT + 70% LC at sight' },
          { name: 'pi', label: 'PI Number', placeholder: 'PI/2026/001' },
        ],
      },
      {
        id: 'packing-list',
        label: 'Packing List',
        description: 'Packing list per carton/pallet.',
        systemPrompt: `${baseSystem}\nGenerate a packing list table: marks & numbers, package type, qty packages, net/gross weight, dimensions, total.`,
        userTemplate:
          'Produk: {{product}}, total qty: {{qty}}, kemasan: {{packing}}, container: {{container}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'qty', label: 'Total Quantity', required: true },
          { name: 'packing', label: 'Packing', placeholder: '25kg PP bag, 40 bags / pallet' },
          { name: 'container', label: 'Container', placeholder: '1x20ft FCL' },
        ],
      },
      {
        id: 'coo',
        label: 'Certificate of Origin (draft data)',
        description: 'Data isian COO Form A/E/AK/D dll.',
        systemPrompt: `${baseSystem}\nPrepare the data fields required for a Certificate of Origin (Form A, Form E for ASEAN-China, Form AK Korea, Form D ATIGA, etc.). Indicate which form is most suitable and what supporting docs needed.`,
        userTemplate:
          'Eksportir: {{exporter}}. Consignee: {{consignee}} ({{country}}). Produk: {{product}} HS {{hs}}, asal Indonesia. Skema preferensi: {{scheme}}.',
        fields: [
          { name: 'exporter', label: 'Exporter', required: true },
          { name: 'consignee', label: 'Consignee', required: true },
          { name: 'country', label: 'Country' },
          { name: 'product', label: 'Produk', required: true },
          { name: 'hs', label: 'HS Code' },
          { name: 'scheme', label: 'Skema', placeholder: 'Form E, Form D, GSP' },
        ],
      },
      {
        id: 'bl-draft',
        label: 'Bill of Lading (draft)',
        description: 'Instruksi B/L ke forwarder.',
        systemPrompt: `${baseSystem}\nWrite B/L instructions to the freight forwarder: shipper, consignee, notify party, vessel/voyage, POL/POD, container/seal, description of goods, marks, freight terms.`,
        userTemplate:
          'Shipper: {{shipper}}. Consignee: {{consignee}}. Notify: {{notify}}. Vessel: {{vessel}}. POL {{pol}} → POD {{pod}}. Container: {{container}}.',
        fields: [
          { name: 'shipper', label: 'Shipper', required: true },
          { name: 'consignee', label: 'Consignee', required: true },
          { name: 'notify', label: 'Notify Party' },
          { name: 'vessel', label: 'Vessel / Voyage' },
          { name: 'pol', label: 'POL' },
          { name: 'pod', label: 'POD' },
          { name: 'container', label: 'Container & Seal' },
        ],
      },
    ],
  },
  {
    id: 'finance-pricing',
    label: 'Finance & Pricing',
    icon: 'DollarSign',
    description: 'Kalkulasi harga FOB/CIF, margin, LC, valas.',
    tasks: [
      {
        id: 'fob-cif-calc',
        label: 'FOB / CIF / DDP Pricing',
        description: 'Hitung harga ekspor per Incoterm dengan rincian biaya.',
        systemPrompt: `${baseSystem}\nBuild a transparent export pricing breakdown: EXW cost → local handling → FOB → freight → insurance → CIF → import duty → DDP. Show per-unit and total, plus margin % at each level. Highlight assumptions.`,
        userTemplate:
          'Produk: {{product}}, cost EXW {{cost}} {{currency}}/{{unit}}, qty {{qty}}. Tujuan {{country}}, port {{pod}}. Estimasi freight {{freight}}, insurance {{insurance}}, import duty {{duty}}%. Target margin {{margin}}%.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'cost', label: 'Cost EXW', required: true },
          { name: 'currency', label: 'Currency', placeholder: 'USD' },
          { name: 'unit', label: 'Unit', placeholder: 'MT' },
          { name: 'qty', label: 'Qty' },
          { name: 'country', label: 'Negara Tujuan' },
          { name: 'pod', label: 'Port of Discharge' },
          { name: 'freight', label: 'Freight estimate' },
          { name: 'insurance', label: 'Insurance estimate' },
          { name: 'duty', label: 'Import Duty %', type: 'number' },
          { name: 'margin', label: 'Target Margin %', type: 'number' },
        ],
      },
      {
        id: 'lc-review',
        label: 'Letter of Credit Review',
        description: 'Review draft L/C dari issuing bank.',
        systemPrompt: `${baseSystem}\nReview the LC draft against UCP 600. Flag discrepancies risk on: latest shipment date, expiry, presentation period, documents required, partial shipment/transshipment, vague clauses, soft clauses, INCOTERM consistency. Suggest amendments.`,
        userTemplate: 'Teks/ringkasan LC: {{lcText}}. Tanggal shipment realistis: {{shipDate}}.',
        fields: [
          { name: 'lcText', label: 'LC Text / Summary', type: 'textarea', required: true },
          { name: 'shipDate', label: 'Realistic Ship Date' },
        ],
      },
      {
        id: 'fx-hedge',
        label: 'FX & Payment Terms Advice',
        description: 'Saran payment term & hedging valas.',
        systemPrompt: `${baseSystem}\nRecommend payment terms (TT advance %, LC at sight/usance, D/P, D/A, open account) based on buyer risk, deal size, country risk. Suggest FX hedging options (forward, option) for IDR exporter.`,
        userTemplate:
          'Deal: {{value}} {{currency}}, buyer baru di {{country}}, tenor produksi {{lead}} hari. Risk appetite: {{risk}}.',
        fields: [
          { name: 'value', label: 'Deal Value', required: true },
          { name: 'currency', label: 'Currency', placeholder: 'USD' },
          { name: 'country', label: 'Country' },
          { name: 'lead', label: 'Lead Time (days)', type: 'number' },
          { name: 'risk', label: 'Risk Appetite', placeholder: 'Low / Medium / High' },
        ],
      },
    ],
  },
  {
    id: 'customer-service',
    label: 'Customer Service',
    icon: 'Headphones',
    description: 'Tangani komplain, delay, klaim & after-sales.',
    tasks: [
      {
        id: 'complaint-reply',
        label: 'Complaint Response',
        description: 'Balasan profesional untuk komplain buyer.',
        systemPrompt: `${baseSystem}\nWrite an empathetic, accountable reply in English: acknowledge → apologize where appropriate → root cause (initial) → corrective action → goodwill gesture if needed → next step.`,
        userTemplate: 'Komplain buyer: {{complaint}}. Konteks order: {{order}}.',
        fields: [
          { name: 'complaint', label: 'Komplain', type: 'textarea', required: true },
          { name: 'order', label: 'Konteks Order', type: 'textarea' },
        ],
      },
      {
        id: 'shipment-delay',
        label: 'Shipment Delay Notice',
        description: 'Notifikasi delay dengan mitigasi.',
        systemPrompt: `${baseSystem}\nNotify the buyer about a shipment delay: clear reason, new ETA, mitigation, options, and a sincere apology. Provide ID + EN.`,
        userTemplate:
          'Order: {{order}}. Alasan delay: {{reason}}. Delay: {{delay}} hari. ETA baru: {{eta}}.',
        fields: [
          { name: 'order', label: 'Order Ref', required: true },
          { name: 'reason', label: 'Reason', type: 'textarea' },
          { name: 'delay', label: 'Delay (days)', type: 'number' },
          { name: 'eta', label: 'New ETA' },
        ],
      },
      {
        id: 'claim-handling',
        label: 'Claim Handling Letter',
        description: 'Surat tanggapan klaim quality/quantity.',
        systemPrompt: `${baseSystem}\nDraft a claim-handling letter referencing the contract, surveyor report, Incoterm risk transfer, and proposed resolution (replacement, credit note, discount).`,
        userTemplate: 'Klaim: {{claim}}. Bukti: {{evidence}}. Posisi kita: {{stance}}.',
        fields: [
          { name: 'claim', label: 'Klaim', type: 'textarea', required: true },
          { name: 'evidence', label: 'Bukti / Survey' },
          { name: 'stance', label: 'Posisi Kami' },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations & Logistics',
    icon: 'Ship',
    description: 'Perencanaan shipment, loading, route & risk.',
    tasks: [
      {
        id: 'shipment-plan',
        label: 'Shipment Plan',
        description: 'Timeline shipment dari PO sampai delivery.',
        systemPrompt: `${baseSystem}\nProduce a Gantt-style timeline (text table) from PO confirmation → production → QC → stuffing → trucking → port handling → vessel ETD → vessel ETA → discharge → final delivery. Include responsible party each step.`,
        userTemplate:
          'PO date: {{po}}. Lead time produksi: {{lead}} hari. POL: {{pol}} → POD: {{pod}}, transit {{transit}} hari. Buyer butuh tiba: {{required}}.',
        fields: [
          { name: 'po', label: 'PO Date', required: true },
          { name: 'lead', label: 'Production Lead (days)', type: 'number' },
          { name: 'pol', label: 'POL', placeholder: 'Tanjung Priok' },
          { name: 'pod', label: 'POD' },
          { name: 'transit', label: 'Transit Days', type: 'number' },
          { name: 'required', label: 'Required Arrival' },
        ],
      },
      {
        id: 'container-loading',
        label: 'Container Loading Plan',
        description: 'Optimasi pemuatan 20ft/40ft.',
        systemPrompt: `${baseSystem}\nCalculate how many units fit in 20ft / 40ft / 40HC container based on package dimension & weight. Respect payload limit (~28t/26t). Recommend optimal container type.`,
        userTemplate:
          'Package: {{dim}} cm, berat {{weight}} kg/box. Qty: {{qty}}. Container yang tersedia: {{containers}}.',
        fields: [
          { name: 'dim', label: 'Dimension LxWxH (cm)', required: true },
          { name: 'weight', label: 'Weight per box (kg)', required: true, type: 'number' },
          { name: 'qty', label: 'Total Qty (boxes)', required: true, type: 'number' },
          { name: 'containers', label: 'Container Options', placeholder: '20ft, 40ft, 40HC' },
        ],
      },
      {
        id: 'risk-checklist',
        label: 'Shipment Risk Checklist',
        description: 'Identifikasi risiko & mitigasi.',
        systemPrompt: `${baseSystem}\nGenerate a risk register: risk → likelihood (L/M/H) → impact (L/M/H) → mitigation → owner. Cover commodity, port congestion, weather, currency, payment, regulatory, geopolitical.`,
        userTemplate:
          'Shipment: {{product}}, {{qty}} dari {{pol}} ke {{pod}}, value {{value}}, ETD {{etd}}.',
        fields: [
          { name: 'product', label: 'Produk', required: true },
          { name: 'qty', label: 'Quantity' },
          { name: 'pol', label: 'POL' },
          { name: 'pod', label: 'POD' },
          { name: 'value', label: 'Value' },
          { name: 'etd', label: 'ETD' },
        ],
      },
    ],
  },
]

export function findTask(moduleId: string, taskId: string) {
  const mod = AI_MODULES.find((m) => m.id === moduleId)
  const task = mod?.tasks.find((t) => t.id === taskId)
  return { mod, task }
}

export function renderTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => (values[k]?.trim() ? values[k] : `[${k} tidak diisi]`))
}
