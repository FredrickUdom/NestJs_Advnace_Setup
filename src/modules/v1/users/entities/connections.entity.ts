import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  sender_id: number;

  @Column()
  receiver_uniqueId: string;

  @Column({ default: false })
  accepted: boolean;

  @Column({ default: false })
  rejected: boolean;

  @CreateDateColumn()
  created_at: Date;
}
