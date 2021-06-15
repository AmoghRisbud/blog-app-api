import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm'
import File from "./File";

@Entity()
export default class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true})
  username!: string

  @Column()
  password!: string

  @Column({ nullable: true })
  sessionToken: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => File, (file) => file.user)
  files: File[]

}
