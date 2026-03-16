import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CalendarEvent } from './entity/CalendarEvent';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/calendar.db';
  const absoluteDbPath = path.resolve(process.cwd(), dbPath);
  const dbDir = path.dirname(absoluteDbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Load existing data if file exists
  let database: Uint8Array | undefined = undefined;
  if (fs.existsSync(absoluteDbPath)) {
    database = new Uint8Array(fs.readFileSync(absoluteDbPath));
  }

  dataSource = new DataSource({
    type: 'sqljs',
    autoSave: true,
    location: absoluteDbPath,
    database,
    synchronize: true,
    logging: false,
    entities: [CalendarEvent],
    autoSaveCallback: (data: Uint8Array) => {
      fs.writeFileSync(absoluteDbPath, Buffer.from(data));
    },
  });

  await dataSource.initialize();
  return dataSource;
}
