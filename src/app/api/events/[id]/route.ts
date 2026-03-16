import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { CalendarEvent } from '@/lib/entity/CalendarEvent';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(CalendarEvent);
    const event = await repo.findOne({ where: { id: params.id } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('GET /api/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, date, time, color } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(CalendarEvent);
    const event = await repo.findOne({ where: { id: params.id } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    event.title = title;
    event.description = description || null;
    event.date = date;
    event.time = time || null;
    event.color = color || event.color;

    const updated = await repo.save(event);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(CalendarEvent);
    const event = await repo.findOne({ where: { id: params.id } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await repo.remove(event);
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
