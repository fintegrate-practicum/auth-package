import { RolesMiddleware } from './role-guard.middleware';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('RolesMiddleware', () => {
    let rolesMiddleware: RolesMiddleware;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        rolesMiddleware = new RolesMiddleware(reflector);
    });

    it('should throw UnauthorizedException if no user is present', async () => {
        const req: Partial<Request> = {};
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        try {
            await rolesMiddleware.use(req as Request, res as Response, next);
        } catch (err:any) {
            expect(err).toBeInstanceOf(UnauthorizedException);
            expect(err.message).toBe('No user information available');
        }
    });

    it('should call next if no roles are required', async () => {
        const req: any = { user: { role: { type: 'user' } }, route: {} };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        jest.spyOn(reflector, 'get').mockReturnValue(undefined);

        await rolesMiddleware.use(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user role is not allowed', async () => {
        const req: any = { user: { role: { type: 'user' } }, route: {} };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        try {
            await rolesMiddleware.use(req as Request, res as Response, next);
        } catch (err:any) {
            expect(err).toBeInstanceOf(ForbiddenException);
            expect(err.message).toBe('Forbidden');
        }
    });

    it('should call next if user role is allowed', async () => {
        const req: any = { user: { role: { type: 'admin' } }, route: {} };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        await rolesMiddleware.use(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
