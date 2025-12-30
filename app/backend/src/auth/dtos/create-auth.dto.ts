import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

/**
 * DTO for Better Auth email/password signup.
 * This handles the authentication layer only.
 * Profile creation happens in a separate step via dedicated registration endpoints.
 */
export class CreateAuthDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString({ message: 'name must be a string' })
  @MinLength(2, { message: 'name must be at least 2 characters' })
  @MaxLength(100, { message: 'name must not exceed 100 characters' })
  name: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'password must be at least 8 characters and contain uppercase, lowercase, number, and symbol',
    },
  )
  password: string;
}
