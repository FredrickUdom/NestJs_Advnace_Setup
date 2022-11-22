import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Button {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @ManyToOne(() => User, (user) => user.buttons, {onDelete: 'CASCADE'})
    user: User;

    @Column()
    userId: number;
}
