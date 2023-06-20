import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

import { Speech } from "./Speech.entity.js";

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column({
    length: 255,
  })
  name: string;

  @Column({nullable: true})
  birthDate: Date;

  @Column({
    length: 255,
    nullable: true
  })
  gender: string;

  @Column({
    length: 255,
    nullable: true
  })
  job: string;

  @Column({
    length: 255,
    nullable: true
  })
  professionalCategory: string;

  @OneToMany(() => Speech, (speech) => speech.actor)
  speeches: Speech[];
}
