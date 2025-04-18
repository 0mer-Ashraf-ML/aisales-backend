import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Prospect } from './prospect.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('companies')
export class Companies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_name: string;

  @Column({ nullable: true })
  dba: string;

  @Column('text', { array: true, nullable: true })
  products_services: string[];

  @Column('text', { array: true, nullable: true })
  buyer_industries: string[];

  @Column({ nullable: true })
  web_url: string;

  @Column('text', { array: true, nullable: true })
  target_region: string[];

  @Column('text', { array: true, nullable: true })
  target_industries: string[];

  @Column({ nullable: true })
  preferred_company_size: string;

  @Column('text', { array: true, nullable: true })
  preferred_contact_department: string[];

  @Column('text', { array: true, nullable: true })
  preferred_industry_keywords: string[];

  @Column('text', { array: true, nullable: true })
  tech_stack: string[];

  // Relationship with User
  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  // Relationship with Prospects
  @OneToMany(() => Prospect, (prospect) => prospect.company, {
    cascade: true,
  })
  prospects: Prospect[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  session_id: string;
}
