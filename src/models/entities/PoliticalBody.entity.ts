import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn
} from "typeorm";

import { Mandate } from "./Mandate.entity.js";

@Entity()
export class PoliticalBody {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @Column({
    length: 255, 
  })
  type: string;

  @Column({
    length: 255, 
  })
  name: string;

  @Column({
    length: 255,
  })
  parent: string;

  @Column({
    length: 255,
  })
  position: string;

  @Column({
    length: 255,
  })
  color: string;

  @Column({
    length: 255,
  })
  wing: string;

  @OneToMany(() => Mandate, (mandate) => mandate.politicalBody)
  @JoinColumn()
  mandates: Mandate[];
  
}
