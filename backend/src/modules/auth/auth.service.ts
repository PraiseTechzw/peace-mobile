import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RequestUser } from '../../common/types/request-user.type';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(email: string, password: string): Promise<{ token: string }> {
    const existing = await this.authRepository.findUserByEmail(email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser({ email, passwordHash });
    const role = await this.authRepository.ensureRole('user');
    await this.authRepository.addUserRole(user.id, role.id);

    const payload: RequestUser = { sub: user.id, email: user.email, roles: ['user'] };
    return { token: await this.jwtService.signAsync(payload) };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.authRepository.updateLastLogin(user.id);
    const roles = await this.authRepository.getUserRoles(user.id);
    const payload: RequestUser = { sub: user.id, email: user.email, roles };
    return { token: await this.jwtService.signAsync(payload) };
  }
}
