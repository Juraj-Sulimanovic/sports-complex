import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

type SafeUser = Omit<User, 'password'> & {
  setPassword: User['setPassword'];
  validatePassword: User['validatePassword'];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result as SafeUser;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
    };
  }

  async register(
    email: string,
    pass: string,
    firstName?: string,
    lastName?: string,
    role?: UserRole,
  ): Promise<SafeUser> {
    const user = await this.usersService.create(
      email,
      pass,
      firstName,
      lastName,
      role,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    return result as SafeUser;
  }
}
