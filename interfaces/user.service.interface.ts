import { UserP } from './user.type'; 

export interface IUserService {
    getUserById(userId: string): Promise<UserP>;
   
}
