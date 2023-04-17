import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Speech } from "./Speech.entity.js";
import { Mandate } from "./Mandate.entity.js";

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @Column()
  birthDate: Date;

  @Column({
    length: 255,
  })
  gender: string;

  @Column({
    length: 255,
  })
  job: string;

  @Column({
    length: 255,
  })
  professionalCategory: string;

  @OneToMany(() => Speech, (speech) => speech.actor)
  @JoinColumn()
  speeches: Speech[];

  @OneToMany(() => Mandate, (mandate) => mandate.actor)
  @JoinColumn()
  mandates: Mandate[];
}
