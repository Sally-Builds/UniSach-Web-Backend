import Exception from '@/utils/exception/Exception'
import User from '../interfaces/user.interface'
import UserRepositoryInterface, { createUser, getUserByEmail, findOne, findOneAndUpdate } from '../interfaces/userRepo.interface'
import UserModel from '../model/index'

export default class UserRepository implements UserRepositoryInterface {
    public async createUser(data: createUser.Request): Promise<createUser.Response> {
        try {
            const user = new UserModel(data)
            await user.save()
            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async getUserByEmail(email: string): Promise<getUserByEmail.Response> {
            try {
            const user = await UserModel.findOne({email});
            return user
        } catch (error: any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async findOne(userPayload: findOne.Request): Promise<findOne.Response> {
        try {
            const user = await UserModel.findOne(userPayload)

            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public async findOneAndUpdate(query: any, userData: any | User): Promise<findOneAndUpdate.Response> {
        try {
            const user = await UserModel.findOneAndUpdate(query, userData, {runValidators: true, new: true})
            if(!user) throw new Exception("not found", 400)

            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}