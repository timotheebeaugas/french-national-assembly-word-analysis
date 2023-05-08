import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { AgendaItem } from "./AgendaItem.entity.js";
import { Speech } from "./Speech.entity.js";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  sourceURL: string;

  @Column()
  externalId: string;

  @Column()
  date: string;

  @Column({
    length: 255,
  })
  legislature: string;

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

  @OneToMany(() => Speech, (speech) => speech.report)
  speeches: Speech[];
}
