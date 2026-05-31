import Link from 'next/link'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { STAGES, fmtMoney } from '@/lib/crm'
import { Users, KanbanSquare, Trophy, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CrmDashboard() {
  const [leadCount, opps, activities] = await Promise.all([
    db.lead.count(),
    db.opportunity.findMany({ include: { lead: true } }),
    db.activity.findMany({
      where: { done: false },
      orderBy: { dueDate: 'asc' },
      take: 8,
      include: { lead: true, opportunity: true },
    }),
  ])

  const open = opps.filter((o) => o.stage !== 'won' && o.stage !== 'lost')
  const won = opps.filter((o) => o.stage === 'won')
  const pipelineValue = open.reduce((s, o) => s + o.expectedValue, 0)
  const wonValue = won.reduce((s, o) => s + o.expectedValue, 0)

  const byStage = STAGES.map((s) => ({
    ...s,
    count: opps.filter((o) => o.stage === s.id).length,
    value: opps.filter((o) => o.stage === s.id).reduce((sum, o) => sum + o.expectedValue, 0),
  }))

  const stats = [
    { label: 'Total Contacts', value: leadCount, icon: Users, accent: 'text-blue-600' },
    { label: 'Open Opportunities', value: open.length, icon: KanbanSquare, accent: 'text-amber-600' },
    { label: 'Pipeline Value', value: fmtMoney(pipelineValue), icon: DollarSign, accent: 'text-purple-600' },
    { label: 'Won (Revenue)', value: fmtMoney(wonValue), icon: Trophy, accent: 'text-emerald-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan pipeline export-import Anda hari ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold">{s.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${s.accent}`} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline per Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byStage.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="w-28 text-sm font-medium">{s.label}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${s.color}`}
                      style={{
                        width: `${Math.min(100, (s.value / Math.max(1, pipelineValue + wonValue)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{s.count}</span>
                <span className="w-24 text-right text-xs font-medium">{fmtMoney(s.value)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada aktivitas terjadwal.</p>
            ) : (
              <ul className="divide-y">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.lead?.company || a.opportunity?.title || '—'}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2 shrink-0 capitalize">
                      {a.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Opportunities</CardTitle>
          <Link href="/crm/pipeline" className="text-xs text-primary hover:underline">
            View pipeline →
          </Link>
        </CardHeader>
        <CardContent>
          {opps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada deals.{' '}
              <Link href="/crm/pipeline" className="text-primary hover:underline">
                Buat opportunity pertama
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y">
              {opps.slice(0, 6).map((o) => {
                const stage = STAGES.find((s) => s.id === o.stage)
                return (
                  <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <p className="font-medium">{o.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.lead.company} • {o.product || 'No product'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${stage?.color} text-white`}>{stage?.label}</Badge>
                      <span className="w-24 text-right font-medium">
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
    </div>
  )
}
