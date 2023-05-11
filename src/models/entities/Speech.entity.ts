import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from "typeorm";
import { Actor } from "./Actor.entity.js";
import { Report } from "./Report.entity.js";

@Entity()
export class Speech {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @ManyToOne(() => Report, (report) => report.speeches)
  report: number;

  @ManyToOne(() => Actor, (actor) => actor.speeches)
  actor: number;

  @Column("text") 
  content: string;
 
}
