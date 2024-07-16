import { User } from './user.type'; 

export interface IUserService {
    getUserById(userId: string): Promise<User>;
   
}
