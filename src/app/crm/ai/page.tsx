'use client'

import { useMemo, useState } from 'react'
import {
  TrendingUp,
  Factory,
  Users,
  KanbanSquare,
  FileText,
  DollarSign,
  Headphones,
  Ship,
  Sparkles,
  Copy,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AI_MODULES } from '@/lib/ai-modules'
import { toast } from 'sonner'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Factory,
  Users,
  KanbanSquare,
  FileText,
  DollarSign,
  Headphones,
  Ship,
}

export default function AIPage() {
  const [moduleId, setModuleId] = useState(AI_MODULES[0].id)
  const [taskId, setTaskId] = useState(AI_MODULES[0].tasks[0].id)
  const [values, setValues] = useState<Record<string, string>>({})
  const [freeText, setFreeText] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const mod = useMemo(() => AI_MODULES.find((m) => m.id === moduleId)!, [moduleId])
  const task = useMemo(() => mod.tasks.find((t) => t.id === taskId) || mod.tasks[0], [mod, taskId])

  function selectModule(id: string) {
    const m = AI_MODULES.find((x) => x.id === id)!
    setModuleId(id)
    setTaskId(m.tasks[0].id)
    setValues({})
    setOutput('')
  }

  function selectTask(id: string) {
    setTaskId(id)
    setValues({})
    setOutput('')
  }

  async function run() {
    const missing = task.fields.filter((f) => f.required && !values[f.name]?.trim())
    if (missing.length) {
      toast.error(`Lengkapi: ${missing.map((m) => m.label).join(', ')}`)
      return
    }
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, taskId, values, freeText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal')
      setOutput(data.content)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'AI gagal')
    } finally {
      setLoading(false)
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    toast.success('Disalin')
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-primary" /> AI Co-Pilot
        </h1>
        <p className="text-sm text-muted-foreground">
          8 modul AI untuk seluruh operasi export-import — riset pasar, sourcing, akuisisi buyer,
          dokumentasi, finance, customer service & operasi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AI_MODULES.map((m) => {
          const Icon = ICONS[m.icon] || Sparkles
          const active = m.id === moduleId
          return (
            <button
              key={m.id}
              onClick={() => selectModule(m.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                active
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'bg-background hover:border-primary/40'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{mod.label} — Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {mod.tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTask(t.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  t.id === taskId
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <p className="font-medium">{t.label}</p>
                <p
                  className={`mt-0.5 line-clamp-2 text-xs ${
                    t.id === taskId ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  {t.description}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{task.label}</CardTitle>
                <Badge variant="outline">{mod.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {task.fields.map((f) => (
                  <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <Label>
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </Label>
                    {f.type === 'textarea' ? (
                      <Textarea
                        rows={3}
                        placeholder={f.placeholder}
                        value={values[f.name] || ''}
                        onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                      />
                    ) : (
                      <Input
                        type={f.type === 'number' ? 'number' : 'text'}
                        placeholder={f.placeholder}
                        value={values[f.name] || ''}
                        onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <Label>Konteks tambahan (opsional)</Label>
                <Textarea
                  rows={2}
                  placeholder="Catatan khusus, gaya bahasa, panjang output…"
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={run} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Output</CardTitle>
              {output && (
                <Button size="sm" variant="outline" onClick={copyOutput}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> AI sedang menyiapkan jawaban…
                </div>
              )}
              {!loading && !output && (
                <p className="text-sm text-muted-foreground">
                  Isi form di atas lalu klik <strong>Generate</strong>. Hasil akan tampil di sini.
                </p>
              )}
              {output && (
                <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/40 p-4 text-sm leading-relaxed">
                  {output}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
