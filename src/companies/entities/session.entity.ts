import { User } from '@src/auth/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Companies } from './companies.entity';
  
  @Entity('session')
  export class Session {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    session_id: string;
  
    @Column()
    user_id: number;
  
    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Companies, (company) => company.session, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Companies;
  }
  