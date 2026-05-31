import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const leadId = searchParams.get('leadId')
  const opportunityId = searchParams.get('opportunityId')
  const where: Record<string, string> = {}
  if (leadId) where.leadId = leadId
  if (opportunityId) where.opportunityId = opportunityId
  const activities = await db.activity.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { lead: true, opportunity: true },
  })
  return NextResponse.json({ activities })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.type || !body.subject) {
    return NextResponse.json({ error: 'Type and subject are required' }, { status: 400 })
  }
  const activity = await db.activity.create({
    data: {
      type: body.type,
      subject: body.subject,
      notes: body.notes || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      done: Boolean(body.done),
      leadId: body.leadId || null,
      opportunityId: body.opportunityId || null,
    },
  })
  return NextResponse.json({ activity }, { status: 201 })
}
