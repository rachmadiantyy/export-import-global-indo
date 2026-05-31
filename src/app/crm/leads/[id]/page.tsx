'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Globe2, Plus, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACTIVITY_TYPES, STAGES, fmtMoney } from '@/lib/crm'
import { toast } from 'sonner'

type Lead = {
  id: string
  name: string
  company: string
  email: string | null
  phone: string | null
  country: string | null
  city: string | null
  type: string
  source: string | null
  notes: string | null
  opportunities: {
    id: string
    title: string
    stage: string
    expectedValue: number
    currency: string
    product: string | null
  }[]
  activities: {
    id: string
    type: string
    subject: string
    notes: string | null
    dueDate: string | null
    done: boolean
    createdAt: string
  }[]
}

export default function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: 'call', subject: '', notes: '', dueDate: '' })

  async function load() {
    const res = await fetch(`/api/crm/leads/${id}`).then((r) => r.json())
    setLead(res.lead)
  }

  useEffect(() => {
    load()
  }, [id])

  async function addActivity() {
    if (!form.subject) {
      toast.error('Subject required')
      return
    }
    const res = await fetch('/api/crm/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, leadId: id }),
    })
    if (!res.ok) {
      toast.error('Failed')
      return
    }
    toast.success('Activity logged')
    setOpen(false)
    setForm({ type: 'call', subject: '', notes: '', dueDate: '' })
    load()
  }

  async function toggleDone(actId: string, done: boolean) {
    await fetch(`/api/crm/activities/${actId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    })
    load()
  }

  if (!lead) return <p className="text-sm text-muted-foreground">Loading…</p>

  return (
    <div className="space-y-4">
      <Link
        href="/crm/leads"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to contacts
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{lead.company}</CardTitle>
                <p className="text-sm text-muted-foreground">{lead.name}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {lead.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {lead.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${lead.email}`} className="hover:underline">
                  {lead.email}
                </a>
              </p>
            )}
            {lead.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {lead.phone}
              </p>
            )}
            {(lead.city || lead.country) && (
              <p className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                {[lead.city, lead.country].filter(Boolean).join(', ')}
              </p>
            )}
            {lead.source && (
              <p className="text-xs text-muted-foreground">Source: {lead.source}</p>
            )}
            {lead.notes && (
              <div className="mt-3 rounded-md bg-muted/40 p-2 text-xs">{lead.notes}</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opportunities ({lead.opportunities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.opportunities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada opportunities. Buat di halaman{' '}
                  <Link href="/crm/pipeline" className="text-primary hover:underline">
                    Pipeline
                  </Link>
                  .
                </p>
              ) : (
                <ul className="divide-y">
                  {lead.opportunities.map((o) => {
                    const stage = STAGES.find((s) => s.id === o.stage)
                    return (
                      <li
                        key={o.id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium">{o.title}</p>
                          <p className="text-xs text-muted-foreground">{o.product || '—'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${stage?.color} text-white`}>{stage?.label}</Badge>
                          <span className="font-medium">
                            {fmtMoney(o.expectedValue, o.currency)}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Activities ({lead.activities.length})</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Log
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={form.type}
                        onValueChange={(v) => setForm({ ...form, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTIVITY_TYPES.map((t) => (
                            <SelectItem key={t} value={t} className="capitalize">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subject *</Label>
                      <Input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Follow up sample shipment"
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="datetime-local"
                        value={form.dueDate}
                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addActivity}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {lead.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
              ) : (
                <ul className="space-y-2">
                  {lead.activities.map((a) => (
                    <li key={a.id} className="flex items-start gap-2 rounded border p-2 text-sm">
                      <button onClick={() => toggleDone(a.id, a.done)} className="mt-0.5">
                        {a.done ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={a.done ? 'line-through text-muted-foreground' : 'font-medium'}>
                            {a.subject}
                          </span>
                          <Badge variant="outline" className="capitalize text-[10px]">
                            {a.type}
                          </Badge>
                        </div>
                        {a.notes && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{a.notes}</p>
                        )}
                        {a.dueDate && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Due {new Date(a.dueDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
