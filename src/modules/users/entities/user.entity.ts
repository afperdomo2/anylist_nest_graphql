import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID, { description: 'ID del item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Nombre completo del usuario' })
  @Column({ name: 'full_name' })
  fullName: string;

  @Field(() => String, { description: 'Correo electrónico del usuario' })
  @Column({ unique: true })
  email: string;

  // NOTE: NO se pone el Field, porque no se van a hacer consultas sobre el password
  @Column()
  password: string;

  @Field(() => [String], { description: 'Roles del usuario' })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean, { description: 'Estado de actividad del usuario' })
  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  // TODO: Relaciones...
}
