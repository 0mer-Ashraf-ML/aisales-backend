import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  country: string;

  @Column()
  company_name: string;

  @Column()
  company_website: string;

  @Column()
  industry: string;

  @Column()
  num_employees: number;

  @Column()
  annual_revenue: number;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  recommended_email: string;

  @Column('text', { array: true })
  emails: string[];

  @Column('text', { array: true })
  phones: string[];

  @Column('text', { array: true })
  company_keyword: string[];

  @Column()
  linkedin_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
