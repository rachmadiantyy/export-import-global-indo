'use client'

import { useEffect, useState } from 'react'
import { Plus, GripVertical, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STAGES, INCOTERMS, CURRENCIES, fmtMoney } from '@/lib/crm'
import { toast } from 'sonner'

type Lead = { id: string; name: string; company: string }
type Opportunity = {
  id: string
  title: string
  product: string | null
  expectedValue: number
  currency: string
  stage: string
  probability: number
  ownerName: string | null
  lead: Lead
}

export default function PipelinePage() {
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    leadId: '',
    product: '',
    quantity: '',
    incoterm: 'FOB',
    expectedValue: '',
    currency: 'USD',
    stage: 'new',
    probability: '20',
    ownerName: '',
  })

  async function load() {
    setLoading(true)
    const [oRes, lRes] = await Promise.all([
      fetch('/api/crm/opportunities').then((r) => r.json()),
      fetch('/api/crm/leads').then((r) => r.json()),
    ])
    setOpps(oRes.opportunities || [])
    setLeads(lRes.leads || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createOpp() {
    if (!form.title || !form.leadId) {
      toast.error('Title and contact are required')
      return
    }
    const res = await fetch('/api/crm/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      toast.error('Failed to create opportunity')
      return
    }
    toast.success('Opportunity created')
    setOpen(false)
    setForm({ ...form, title: '', product: '', quantity: '', expectedValue: '' })
    load()
  }

  async function moveStage(id: string, stage: string) {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)))
    await fetch(`/api/crm/opportunities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }

  const totalByStage = (stage: string) =>
    opps.filter((o) => o.stage === stage).reduce((s, o) => s + o.expectedValue, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Drag deals across stages. Total {opps.length} opportunities.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Opportunity</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 20 ton Robusta to Hamburg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact *</Label>
                  <Select value={form.leadId} onValueChange={(v) => setForm({ ...form, leadId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.length === 0 ? (
                        <SelectItem value="_none" disabled>
                          Create a contact first
                        </SelectItem>
                      ) : (
                        leads.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.company} — {l.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Product</Label>
                  <Input
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    placeholder="Crude Palm Oil"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="40 MT"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={form.expectedValue}
                    onChange={(e) => setForm({ ...form, expectedValue: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(v) => setForm({ ...form, currency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Incoterm</Label>
                  <Select
                    value={form.incoterm}
                    onValueChange={(v) => setForm({ ...form, incoterm: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOTERMS.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Probability (%)</Label>
                  <Input
                    type="number"
                    value={form.probability}
                    onChange={(e) => setForm({ ...form, probability: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Owner</Label>
                  <Input
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    placeholder="Sales rep"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createOpp}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = opps.filter((o) => o.stage === stage.id)
          return (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) moveStage(dragId, stage.id)
                setDragId(null)
              }}
              className="flex min-h-[60vh] flex-col rounded-lg bg-muted/40 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {fmtMoney(totalByStage(stage.id))}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
                {!loading && items.length === 0 && (
                  <p className="rounded border border-dashed py-6 text-center text-xs text-muted-foreground">
                    Drop deals here
                  </p>
                )}
                {items.map((o) => (
                  <Card
                    key={o.id}
                    draggable
                    onDragStart={() => setDragId(o.id)}
                    className="cursor-grab bg-background p-3 shadow-sm hover:shadow-md active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/crm/leads/${o.lead.id}`}
                          className="block truncate text-sm font-semibold hover:underline"
                        >
                          {o.title}
                        </Link>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          {o.lead.company}
                        </p>
                        {o.product && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {o.product}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            {fmtMoney(o.expectedValue, o.currency)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {o.probability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
