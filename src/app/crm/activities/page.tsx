'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Activity = {
  id: string
  type: string
  subject: string
  notes: string | null
  dueDate: string | null
  done: boolean
  createdAt: string
  lead: { id: string; company: string } | null
  opportunity: { id: string; title: string } | null
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])

  async function load() {
    const res = await fetch('/api/crm/activities').then((r) => r.json())
    setActivities(res.activities || [])
  }
  useEffect(() => {
    load()
  }, [])

  async function toggle(id: string, done: boolean) {
    await fetch(`/api/crm/activities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    })
    load()
  }

  const open = activities.filter((a) => !a.done)
  const closed = activities.filter((a) => a.done)

  function Row({ a }: { a: Activity }) {
    return (
      <li className="flex items-start gap-3 rounded border bg-background p-3 text-sm">
        <button onClick={() => toggle(a.id, a.done)} className="mt-0.5">
          {a.done ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={a.done ? 'text-muted-foreground line-through' : 'font-medium'}>
              {a.subject}
            </span>
            <Badge variant="outline" className="capitalize text-[10px]">
              {a.type}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {a.lead && (
              <Link href={`/crm/leads/${a.lead.id}`} className="hover:underline">
                {a.lead.company}
              </Link>
            )}
            {a.opportunity && ` • ${a.opportunity.title}`}
          </p>
          {a.dueDate && (
            <p className="text-[11px] text-muted-foreground">
              Due {new Date(a.dueDate).toLocaleString()}
            </p>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Activities</h1>
        <p className="text-sm text-muted-foreground">
          Calls, emails, meetings, shipments & tasks.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open ({open.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {open.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada aktivitas terbuka.</p>
            ) : (
              <ul className="space-y-2">
                {open.map((a) => (
                  <Row key={a.id} a={a} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Done ({closed.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {closed.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada yang selesai.</p>
            ) : (
              <ul className="space-y-2">
                {closed.map((a) => (
                  <Row key={a.id} a={a} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
