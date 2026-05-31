import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { findTask, renderTemplate } from '@/lib/ai-modules'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { moduleId, taskId, values, freeText } = body as {
      moduleId?: string
      taskId?: string
      values?: Record<string, string>
      freeText?: string
    }

    let systemPrompt =
      'You are an expert assistant for an Indonesian export-import trading company. Reply in the user language (ID or EN). Be concise, structured, and practical.'
    let userPrompt = freeText || ''

    if (moduleId && taskId) {
      const { task } = findTask(moduleId, taskId)
      if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      systemPrompt = task.systemPrompt
      userPrompt = renderTemplate(task.userTemplate, values || {})
      if (freeText) userPrompt += `\n\nKonteks tambahan:\n${freeText}`
    }

    if (!userPrompt.trim()) {
      return NextResponse.json({ error: 'Prompt kosong' }, { status: 400 })
    }

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    return NextResponse.json({ content, prompt: userPrompt })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    console.error('AI error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
