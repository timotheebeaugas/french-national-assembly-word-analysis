import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Relation
} from "typeorm";

import { Actor } from "./Actor.js";
import { PoliticalBody } from './PoliticalBody.js';
import { Constituency } from "./Constituency.js";

@Entity()
export class Mandate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Actor, (actor) => actor.mandates)
  @JoinColumn()
  actor: Relation<Actor>;

  @Column({
    length: 255,
  })
  group: string;

  @Column({
    length: 255,
  })
  role: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @ManyToOne(() => PoliticalBody, (politicalBody) => politicalBody.mandates)
  politicalBody: Relation<PoliticalBody>;

  @OneToOne(() => Constituency, (constituency) => constituency.mandate)
  constituency: Relation<Constituency>
}
