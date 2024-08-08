import { HttpService } from '@nestjs/axios';
import { JwtStrategy } from './jwt.strategy';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

process.env.AUTH0_AUDIENCE = 'expected-audience';
process.env.AUTH0_ISSUER_BASE_URL = 'https://issuer.example.com/';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = {
      get: jest.fn(),
    } as unknown as HttpService;
    jwtStrategy = new JwtStrategy(httpService);
    process.env.DOCKER_WORKERS_SERVER_URL = 'http://host.docker.internal:4006'; 
    process.env.AUTH0_AUDIENCE = 'test-audience';
    process.env.AUTH0_ISSUER_BASE_URL = 'http://issuer.base.url/';
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should throw UnauthorizedException if audience in payload does not match the expected audience', async () => {
    const payload = {
      aud: 'invalid-audience',
      sub: '1234567890',
    };

    try {
      await jwtStrategy.validate(payload);
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(err.message).toBe('Invalid audience.');
    }
  });

  it('should return the user if the audience is valid and user exists', async () => {
    const payload = {
      aud: process.env.AUTH0_AUDIENCE,
      sub: '1234567890',
    };

    const mockUser = { id: '1234567890', userEmail: 'test@example.com' };
    const response: Partial<AxiosResponse> = {
      data: mockUser ,
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(response as AxiosResponse));

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual(mockUser);
  });

  it('should return { id: sub } if the audience is valid but user does not exist', async () => {
    const payload = {
      aud: process.env.AUTH0_AUDIENCE,
      sub: '1234567890',
    };

    const result = await jwtStrategy.validate(payload);
    expect(result).not.toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
    });
    expect(result).toEqual({ id: payload.sub });
  });
  

  it('should throw UnauthorizedException if audience in payload is not a string', async () => {
    const payload = {
      aud: 12345,
      sub: '1234567890',
    };

    try {
      await jwtStrategy.validate(payload);
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(err.message).toBe('Invalid audience.');
    }
  });
});
