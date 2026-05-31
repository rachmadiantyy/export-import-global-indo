import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = await db.opportunity.findUnique({
    where: { id },
    include: { lead: true, activities: { orderBy: { createdAt: 'desc' } } },
  })
  if (!opportunity) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ opportunity })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = { ...body }
  if (data.expectedValue !== undefined) data.expectedValue = Number(data.expectedValue)
  if (data.probability !== undefined) data.probability = Number(data.probability)
  if (data.expectedClose) data.expectedClose = new Date(data.expectedClose as string)
  const opportunity = await db.opportunity.update({ where: { id }, data, include: { lead: true } })
  return NextResponse.json({ opportunity })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.opportunity.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
