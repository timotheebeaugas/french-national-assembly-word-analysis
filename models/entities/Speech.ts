import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Actor } from "./Actor.js";
import { AgendaItem } from "./AgendaItem.js";

@Entity()
export class Speech {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @Column()
  report: string;

  @Column()
  @ManyToOne(() => AgendaItem, (agendaItem) => agendaItem.speeches, {
    cascade: true,
  })
  agendaItem: number;

  @Column()
  @ManyToOne(() => Actor, (actor) => actor.speeches, {
    cascade: true,
  })
  actor: number;

  @Column("text")
  content: string;

}
