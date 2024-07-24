import { JwtStrategy } from './jwt.strategy';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const originalAudience = process.env.AUTH0_AUDIENCE;
  const originalIssuer = process.env.AUTH0_ISSUER_BASE_URL;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  afterAll(() => {
    process.env.AUTH0_AUDIENCE = originalAudience; 
    process.env.AUTH0_ISSUER_BASE_URL = originalIssuer; 
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should throw UnauthorizedException if audience in payload does not match the expected audience', async () => {
    const payload = {
      aud: 'invalid-audience',
      sub: '1234567890',
    };

    process.env.AUTH0_AUDIENCE = 'expected-audience';

    try {
      await jwtStrategy.validate(payload);
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(err.message).toBe('Invalid audience.');
    }
  });

  it('should return the id from the payload if the audience is valid', async () => {
    const payload = {
      aud: 'expected-audience',
      sub: '1234567890',
    };

    process.env.AUTH0_AUDIENCE = 'expected-audience';

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ id: '1234567890' });
  });


  it('should throw UnauthorizedException if audience in payload is not a string', async () => {
    const payload = {
      aud: 12345,
      sub: '1234567890',
    };

    process.env.AUTH0_AUDIENCE = 'expected-audience';

    try {
      await jwtStrategy.validate(payload);
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(err.message).toBe('Invalid audience.');
    }
  });
});