import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // to be changed to enum


    @Column()
    value: string;

    @Column()
    sender_name: string;

    @Column()
    sender_id: number;

    @ManyToOne(() => User , (user) => user.notifications)
    user: User;

    @Column()
    status: string // to be changed to enum

    @CreateDateColumn()
    created_at: Date;
}
