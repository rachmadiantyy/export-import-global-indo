'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Mail, Phone, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import { LEAD_TYPES, LEAD_SOURCES } from '@/lib/crm'
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
  _count: { opportunities: number; activities: number }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    type: 'buyer',
    source: 'Website',
    notes: '',
  })

  async function load() {
    const res = await fetch('/api/crm/leads').then((r) => r.json())
    setLeads(res.leads || [])
  }
  useEffect(() => {
    load()
  }, [])

  async function createLead() {
    if (!form.name || !form.company) {
      toast.error('Name and company are required')
      return
    }
    const res = await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      toast.error('Failed to create contact')
      return
    }
    toast.success('Contact added')
    setOpen(false)
    setForm({ ...form, name: '', company: '', email: '', phone: '', notes: '' })
    load()
  }

  const filtered = leads.filter((l) =>
    `${l.name} ${l.company} ${l.country ?? ''} ${l.email ?? ''}`
      .toLowerCase()
      .includes(q.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Buyers, suppliers, agents & distributors — {leads.length} total.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Contact</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Country</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Germany"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Hamburg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Source</Label>
                  <Select
                    value={form.source}
                    onValueChange={(v) => setForm({ ...form, source: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createLead}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search company, name, country…"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <Link key={l.id} href={`/crm/leads/${l.id}`}>
            <Card className="h-full transition hover:shadow-md">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{l.company}</p>
                    <p className="text-xs text-muted-foreground">{l.name}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {l.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {l.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      {l.email}
                    </p>
                  )}
                  {l.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {l.phone}
                    </p>
                  )}
                  {(l.city || l.country) && (
                    <p className="flex items-center gap-1.5">
                      <Globe2 className="h-3 w-3" />
                      {[l.city, l.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 border-t pt-2 text-[11px] text-muted-foreground">
                  <span>{l._count.opportunities} opportunities</span>
                  <span>{l._count.activities} activities</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            Tidak ada kontak. Tambahkan kontak pertama Anda.
          </p>
        )}
      </div>
    </div>
  )
}
