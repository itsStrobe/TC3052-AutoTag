import {Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerUid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createDate: Date;

  @Column()
  editDate: Date;
}

let connection:Connection;

export async function getProjectRepository(): Promise<Repository<Project>> {
  if (connection===undefined) {
    connection = await createConnection({
      type: 'sqlite',
      database: 'AutoTag',
      synchronize: true,
      entities: [
        Project
      ],
    });
  }
  return connection.getRepository(Project);
}