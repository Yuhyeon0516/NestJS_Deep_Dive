import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { envVariablesKeys } from 'src/common/const/env.const';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      next();
      return;
    }

    try {
      const token = this.validateBearerToken(authHeader);
      const tokenKey = `TOKEN_${token}`;
      const cachedPayload = await this.cacheManager.get(tokenKey);

      if (cachedPayload) {
        req.user = cachedPayload;

        return next();
      }

      const decodedPayload = this.jwtService.decode(token);

      if (
        decodedPayload.type !== 'refresh' &&
        decodedPayload.type !== 'access'
      ) {
        throw new UnauthorizedException('Token Type이 잘못되었습니다.');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(
          decodedPayload.type === 'refresh'
            ? envVariablesKeys.refreshTokenSecret
            : envVariablesKeys.accessTokenSecret,
        ),
      });

      const expireDate = +new Date(payload['exp'] * 1000);
      const now = +Date.now();

      const diffInSeconds = (expireDate - now) / 1000;

      await this.cacheManager.set(
        tokenKey,
        payload,
        Math.max((diffInSeconds - 30) * 1000, 1),
      );

      req.user = payload;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      next();
    }
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰의 포멧이 잘못되었습니다.');
    }

    const [type, token] = basicSplit;

    if (type.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰의 타입이 잘못되었습니다.');
    }

    return token;
  }
}
