import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
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
