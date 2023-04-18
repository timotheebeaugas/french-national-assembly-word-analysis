import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Actor } from "./Actor.entity.js";
import { AgendaItem } from "./AgendaItem.entity.js";

@Entity()
export class Speech {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @Column()
  report: number;

  @ManyToOne(() => AgendaItem, (agendaItem) => agendaItem.speeches)
  agendaItem: number;

  @ManyToOne(() => Actor, (actor) => actor.speeches)
  actor: number;

  @Column("text")
  content: string;

}
