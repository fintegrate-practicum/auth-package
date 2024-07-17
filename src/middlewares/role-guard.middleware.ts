import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    async use(req: any, res: Response, next: NextFunction) {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('No user information available');
        }

        const roles = this.reflector.get<string[]>('roles', req.route);
        if (!roles || roles.length === 0) {
            return next();
        }

        if (!roles.some(role => user.role.type === role)) {
            throw new ForbiddenException('Forbidden');
        }

        next();
    }
}
