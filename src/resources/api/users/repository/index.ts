import Exception from '@/utils/exception/Exception'
import UserRepositoryInterface, { createUser, getUserByEmail } from '../interfaces/userRepo.interface'
import UserModel from '../model/index'

export default class UserRepository implements UserRepositoryInterface {
    public async createUser(data: createUser.Request): Promise<createUser.Response> {
        try {
            const user = new UserModel(data)
            await user.save()
            return user
        } catch (error:any) {
            throw new Exception(error, 500)
        }
    }

    public async getUserByEmail(email: string): Promise<getUserByEmail.Response> {
            try {
            const user = await UserModel.findOne({email});
            return user
        } catch (error: any) {
            throw new Exception(error, 500)
        }
    }
}