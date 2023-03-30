import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  
  import { Speech } from "./Speech.js";
  import { Report } from "./Report.js";

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

  @OneToMany(() => Speech, (speech) => speech.agendaItem)
  speeches: Speech[];
}
