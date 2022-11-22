import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  sender_id: number;

  @Column({ nullable: true })
  receiver_id: number;

  @Column({ nullable: true })
  status: string; // to be changed to enum

  @CreateDateColumn()
  created_at: Date;
}
