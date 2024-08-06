import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpService } from "@nestjs/axios";
import { ROLES_METADATA_KEY } from "../decorators/roles.decorator"
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly httpService: HttpService,
  ) { }

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>(ROLES_METADATA_KEY, context.getHandler());
    if (!roles) {
      return true;
    }

    const serverUrl = process.env.VITE_DOCKER_INFRA_SERVER_URL;
    const user = req.user;
    const businessId = req.params.linkUID;
    if (!businessId) {
      throw new HttpException('User is not associated with any business', HttpStatus.FORBIDDEN);
    }
    if (!user || !user._id) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${serverUrl}/user/${user._id}/business/${businessId}`)
    );
    const userRole: string = response.data.data.role;
    if (!userRole)
      throw new HttpException(response.data.data.message, HttpStatus.UNAUTHORIZED);
    if (!this.matchRoles(roles, userRole)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return true
  }
}