import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { AgendaItem } from "./AgendaItem.js";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  sourceURL: string;

  @Column()
  externalId: number;

  @Column()
  date: Date;

  @Column({
    length: 255,
  })
  daySessionNumber: string;

  @Column({
    length: 255,
  })
  presidency: string;

  @OneToMany(() => AgendaItem, (agendaItem) => agendaItem.report)
  @JoinColumn()
  agendaItems: AgendaItem[];
}
