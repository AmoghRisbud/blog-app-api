import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm'
import User from "./User";

@Entity()
export default class Post {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!:number
  
  @Column()
  title!: string

  @Column()
  summary!: string

  @Column()
  post!: string

  @Column()
  uuid!:string

  @Column()
  accesstoken!: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.posts)
  user: User
}