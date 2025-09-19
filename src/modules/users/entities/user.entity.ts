import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Item } from 'src/modules/items/entities/item.entity';

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
  // SECURITY: @Exclude previene que sea serializado accidentalmente
  // select: false evita que se incluya en consultas automáticas de TypeORM
  @Exclude()
  @Column({ select: false })
  password: string;

  @Field(() => [UserRole], { description: 'Roles del usuario' })
  @Column('text', { array: true, default: ['user'] })
  roles: UserRole[];

  @Field(() => Boolean, { description: 'Estado de actividad del usuario' })
  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => Date, { description: 'Fecha de creación del usuario' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date, { description: 'Fecha de actualización del usuario' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  // Se deja sin @Field para no exponer en el schema GraphQL
  // Ya que se accederá a través del resolver de Users
  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  /**
   * Método de utilidad para limpiar manualmente el password de la instancia.
   * Útil como medida de seguridad adicional antes de devolver datos.
   */
  excludePassword(): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
