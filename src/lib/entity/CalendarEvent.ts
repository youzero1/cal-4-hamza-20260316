import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 20 })
  date!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  time!: string | null;

  @Column({ type: 'varchar', length: 50, default: '#a8d8ea' })
  color!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
