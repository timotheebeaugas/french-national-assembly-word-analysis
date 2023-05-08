import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  
  import { Report } from "./Report.entity.js";

@Entity()
export class AgendaItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @ManyToOne(() => Report, (report) => report.agendaItems)
  report: number;

  @Column({
    length: 255,
  })
  title: string;
}
