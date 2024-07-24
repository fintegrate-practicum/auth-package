// import { Request, Response, NextFunction } from 'express';

// export function RoleAuthorization(roles: string[]) {
//     return function(req: any, res: Response, next: NextFunction) {

//         // בדיקת הרשאות כאן
//         const userRole: string = (req.user as any)?.role; 

//                // בדיקה אם למשתמש יש אחד מהתפקידים המורשים        
//         if (!roles.includes(userRole)) {
//             return res.status(403).json({ error: 'Unauthorized access' });
//         }
//         next();
//     };
// }

import { Response, NextFunction } from 'express';
//import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesMiddleware } from './middlewares/role-guard.middleware';

export function RoleAuthorization(roles: string[]): MethodDecorator {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(req: any, res: Response, next: NextFunction) {
      const userRole: string = (req.user as any)?.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Initialize the middleware and execute it
      const middleware = new RolesMiddleware(null);
      await middleware.use(req, res, next);
    };

    return descriptor;
  };
}

