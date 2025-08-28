import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SingInDto {
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
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
