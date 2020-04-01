import {Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import { Project } from './project';
import { User } from './user';
import { Assignment } from './assignment';

let connection:Connection;

export declare type ObjectType<T> = {
  new (): T;
} | Function;

export async function getRepository<Entity>(target: ObjectType<Entity>): Promise<Repository<Entity>> {
  if (connection===undefined) {
    connection = await createConnection({
      type: 'sqlite',
      database: 'AutoTag.sqlite',
      synchronize: true,
      entities: [
        Project,
        User,
        Assignment,
      ],
    });
  }
  return connection.getRepository(target);
}