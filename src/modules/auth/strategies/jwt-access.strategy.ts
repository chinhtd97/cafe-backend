import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? '', // fallback rỗng
      passReqToCallback: true, // cần để lấy cookie
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    return payload; // nhớ chỉ return payload, không return req
  }
}
