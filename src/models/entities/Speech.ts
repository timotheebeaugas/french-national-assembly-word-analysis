import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
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

  @ManyToOne(() => AgendaItem, (agendaItem) => agendaItem.speeches)
  agendaItem: number;

  @ManyToOne(() => Actor, (actor) => actor.speeches)
  actor: number;

  @Column("text")
  content: string;

}
