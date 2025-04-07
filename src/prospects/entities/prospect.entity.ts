import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  company_website: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true, type: 'int' })
  num_employees: number;

  @Column({ nullable: true, type: 'int' })
  annual_revenue: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  recommended_email: string;

  @Column('text', { array: true, nullable: true })
  emails: string[];

  @Column('text', { array: true, nullable: true })
  phones: string[];

  @Column('text', { array: true, nullable: true })
  company_keyword: string[];

  @Column({ nullable: true })
  linkedin_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
