import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { opportunities: true, activities: true } } },
  })
  return NextResponse.json({ leads })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name || !body.company) {
    return NextResponse.json({ error: 'Name and company are required' }, { status: 400 })
  }
  const lead = await db.lead.create({
    data: {
      name: body.name,
      company: body.company,
      email: body.email || null,
      phone: body.phone || null,
      country: body.country || null,
      city: body.city || null,
      type: body.type || 'buyer',
      source: body.source || null,
      notes: body.notes || null,
    },
  })
  return NextResponse.json({ lead }, { status: 201 })
}
