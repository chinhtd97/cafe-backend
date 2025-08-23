import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import type { Request } from 'express';
//import { JwtPayload } from './types/jwt-payload.type';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      // 👇 custom lấy token từ cookie thay vì Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken || null;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true, // cần để lấy cookie
    } as StrategyOptionsWithRequest);
  }

  // 👇 validate() là abstract method phải implement
  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.refreshToken;
    return {
      ...payload, // { sub, email, role, iat, exp }
      refreshToken,
    };
  }
}
