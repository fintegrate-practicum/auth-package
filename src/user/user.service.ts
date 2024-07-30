
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { User } from "./user.type";
import { AxiosResponse } from "axios";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
    private readonly workersServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const url = this.configService.get<string>('WORKERS_SERVICE_URL');
        console.log('WORKERS_SERVICE_URL::::::::::::::::::::::::::::::',this.configService.get<string>('WORKERS_SERVICE_URL'))
        if (!url) {
            throw new Error('WORKERS_SERVICE_URL is not defined');
        }
        this.workersServiceUrl = url;
        console.log('workersServiceUrl',this.workersServiceUrl)
    }

    async getUserById(userId: string): Promise<User> {
        console.log("i get funcion getUserById")
        // try {
            const response: AxiosResponse<User> = await firstValueFrom(
               // this.httpService.get<User>(`${this.workersServiceUrl}/user/${userId}`)
               // this.httpService.get<User>(`${this.workersServiceUrl}/user/${encodeURI(userId)}`)
                this.httpService.get<User>(`http://host.docker.internal:4006/user/${userId}`)
            );
            console.log("i get funcion getUserById with response",response)
            if (response && response.data) {
                return response.data;
            } else {
                throw new HttpException(
                    "User not found",
                    HttpStatus.NOT_FOUND
                );
            }
        // } catch (error) {
        //     throw new HttpException(
        //         "Failed to fetch user",
        //         HttpStatus.INTERNAL_SERVER_ERROR
        //     );
        // }
    }

    async getUsersByBusinessId(businessId: string): Promise<User[]> {
        try {
            const response: AxiosResponse<User[]> = await firstValueFrom(
                this.httpService.get<User[]>(`${this.workersServiceUrl}/admin/business/${businessId}/users`)
            );

            if (response && response.data) {
                return response.data;
            } else {
                throw new HttpException(
                    "Users not found",
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            throw new HttpException(
                "Failed to fetch users",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
