import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for email/password sign-in requests proxied through Nest.
 */
export class SignInEmailDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;

  @IsString({ message: 'name must be a string' })
  name: string;
}
