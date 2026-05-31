import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const opportunities = await db.opportunity.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { lead: true },
  })
  return NextResponse.json({ opportunities })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.title || !body.leadId) {
    return NextResponse.json({ error: 'Title and lead are required' }, { status: 400 })
  }
  const opp = await db.opportunity.create({
    data: {
      title: body.title,
      leadId: body.leadId,
      product: body.product || null,
      quantity: body.quantity || null,
      incoterm: body.incoterm || null,
      expectedValue: Number(body.expectedValue) || 0,
      currency: body.currency || 'USD',
      stage: body.stage || 'new',
      probability: Number(body.probability) || 10,
      expectedClose: body.expectedClose ? new Date(body.expectedClose) : null,
      ownerName: body.ownerName || null,
    },
    include: { lead: true },
  })
  return NextResponse.json({ opportunity: opp }, { status: 201 })
}
