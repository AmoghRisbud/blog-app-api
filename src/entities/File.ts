import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm'
import User from "./User";

@Entity()
export default class File {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!:number

  @Column({unique: true})
  filename!: string

  @Column()
  uuid!:string

  @Column()
  accesstoken!: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.files)
  user: User

}