import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SingUpDto {
  @ApiProperty({
    description: 'El nombre completo del usuario',
    example: 'Juan Perez',
  })
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty({
    description: 'El email del usuario',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: '$Pass123',
  })
  @IsStrongPassword({ minLength: 6, minNumbers: 1 })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
