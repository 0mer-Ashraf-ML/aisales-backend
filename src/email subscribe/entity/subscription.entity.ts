import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('Emailsubscriptions')
@Unique(['email'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}