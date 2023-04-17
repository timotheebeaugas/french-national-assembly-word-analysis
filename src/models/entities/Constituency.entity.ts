import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation
} from "typeorm";

import { Mandate } from "./Mandate.entity.js";

@Entity()
export class Constituency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  externalId: string;

  @Column()
  number: number;

  @Column({
    length: 255,
  })
  region: string;

  @Column({
    length: 255,
  })
  country: string;

  @OneToOne(() => Mandate, (mandate) => mandate.constituency)
  @JoinColumn()
  mandate: Relation<Mandate>
}
