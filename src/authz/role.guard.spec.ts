import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesGuard,
                Reflector,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        rolesGuard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(rolesGuard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should throw HttpException if linkUID is not present in params', async () => {
            const mockContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({
                    user: { _id: 'userId' },
                    params: {}, // No linkUID
                }),
                getHandler: jest.fn().mockReturnValue('handler'),
                getClass: jest.fn().mockReturnValue('class'),
            } as unknown as ExecutionContext;

            jest.spyOn(reflector, 'get').mockReturnValue(['role']); 

            await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(
                new HttpException('User is not associated with any business', HttpStatus.FORBIDDEN)
            );
        });

        it('should throw HttpException if user is not found in request', async () => {
            const mockContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({
                    user: null, // No user
                    params: { linkUID: 'someLinkUID' },
                }),
                getHandler: jest.fn().mockReturnValue('handler'),
                getClass: jest.fn().mockReturnValue('class'), 
            } as unknown as ExecutionContext;

            jest.spyOn(reflector, 'get').mockReturnValue(['role']);

            await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(
                new HttpException('User not found in request', HttpStatus.UNAUTHORIZED)
            );
        });

        it('should throw HttpException if user role is not found from external service', async () => {
            const mockContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({
                    user: { _id: 'userId' },
                    params: { linkUID: 'someLinkUID' },
                }),
                getHandler: jest.fn().mockReturnValue('handler'), 
                getClass: jest.fn().mockReturnValue('class'),
            } as unknown as ExecutionContext;

            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() =>
                new HttpException('User role not found', HttpStatus.UNAUTHORIZED)
            ));

            jest.spyOn(reflector, 'get').mockReturnValue(['role']);

            await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(
                new HttpException('User role not found', HttpStatus.UNAUTHORIZED)
            );
        });
        it('should throw HttpException if user role does not match the required roles', async () => {
            const mockContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({
                    user: { _id: 'userId' },
                    params: { linkUID: 'someLinkUID' },
                }),
                getHandler: jest.fn().mockReturnValue('handler'),
                getClass: jest.fn().mockReturnValue('class'),
            } as unknown as ExecutionContext;

            jest.spyOn(httpService, 'get').mockReturnValue(of({
                data: {
                    data: {
                        role: 'employee',
                    }
                }
            }) as any);
    
            jest.spyOn(reflector, 'get').mockReturnValue(['requiredRole']);
    
            await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(
                new HttpException('Forbidden', HttpStatus.FORBIDDEN)
            );
        });

        it('should return true if user role is found and matches the required roles', async () => {
            const mockContext = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({
                    user: { _id: 'userId' },
                    params: { linkUID: 'someLinkUID' },
                }),
                getHandler: jest.fn().mockReturnValue('handler'),
                getClass: jest.fn().mockReturnValue('class'),
            } as unknown as ExecutionContext;
    
            jest.spyOn(httpService, 'get').mockReturnValue(of({
                data: {
                    data: {
                        role: 'role'
                    }
                }
            }) as any);
    
            jest.spyOn(reflector, 'get').mockReturnValue(['role']);
    
            const result = await rolesGuard.canActivate(mockContext);
    
            expect(result).toBe(true);
        });    
    });
});
