import { Exclude } from 'class-transformer';
import { GenderEnum } from 'src/enums/gender.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Notification } from '../../notifications/entity/notificatios.entity';
import { Button } from './buttons.entity';
import { Message } from './messages.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  unique_id: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'enum', name: 'GenderEnum', enum: GenderEnum, nullable: true})
  gender: GenderEnum;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ default: true })
  is_verified: boolean;

  @Column({ default: false })
  is_connected: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  connected_to: User;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification;

  @Column({ default: true })
  nofification_is_on: boolean;

  @OneToMany(() => Button, (button) => button.user)
  buttons: Button;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
