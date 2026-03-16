import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { CalendarEvent } from '@/lib/entity/CalendarEvent';

const PASTEL_COLORS = [
  '#ffb3ba',
  '#ffdfba',
  '#ffffba',
  '#baffc9',
  '#bae1ff',
  '#e8baff',
  '#ffd1dc',
  '#c9f2c7',
  '#aed9e0',
  '#f8c8d4',
];

function randomColor(): string {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const ds = await getDataSource();
    const repo = ds.getRepository(CalendarEvent);

    let events: CalendarEvent[];

    if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
      const endMonth = monthNum === 12 ? 1 : monthNum + 1;
      const endYear = monthNum === 12 ? yearNum + 1 : yearNum;
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

      events = await repo
        .createQueryBuilder('event')
        .where('event.date >= :startDate AND event.date < :endDate', {
          startDate,
          endDate,
        })
        .orderBy('event.time', 'ASC')
        .getMany();
    } else {
      events = await repo.find({ order: { date: 'ASC', time: 'ASC' } });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const event = repo.create({
      title,
      description: description || null,
      date,
      time: time || null,
      color: color || randomColor(),
    });

    const saved = await repo.save(event);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
