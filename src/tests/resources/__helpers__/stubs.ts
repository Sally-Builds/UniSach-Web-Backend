import UserRepositoryInterface from "../../../resources/api/users/interfaces/userRepo.interface"
import { JwtGenerate } from "../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate"
import {JwtVerify} from '../../../utils/cryptography/interface/cryptography/jsonwebtoken/verify'
import PasswordEncryption from "../../../utils/cryptography/interface/cryptography/passwordEncryption"
import User from "../../../resources/api/users/interfaces/user.interface"

export const user = ():User => {
    return {
            first_name: 'Jay',
            last_name: "Sally",
            name: "Jay Sally",
            email: "uzoagulujoshua@gmail.com",
            password: 'wgke3mf1234',
            googleID: '1234567890',
            phone: "+123456789",
            role: 'User'
    }
}

interface dbUserType extends User {
    id: string
} 

export const dbUser = (): User[] => {
    return [{
                first_name: 'Jay',
                last_name: "Sally",
                email: "uzoagulujoshua@gmail.com",
                name: `Jay Sally`,
                phone: "+234123456789",
                password: 'test1234',
                emailVerificationStatus: 'pending',
                role: 'User',
                id: '1',
            }]
}

export const UserRepository: UserRepositoryInterface = {
    // createUser: jest.fn().mockReturnValue(Promise.resolve(dbUser())),
    async createUser(data): Promise<User> {
        return dbUser()[0]
    },
    // getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(dbUser())),
    async getUserByEmail(email) {
        return (dbUser().find((el: User) => el.email == email) as User)
    },
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}

export const UserRepository2: UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}

export const UserRepositoryVerifyOTP: UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}


export const PasswordEncrypt: PasswordEncryption = {
    hash: jest.fn(),
    verify: jest.fn(),
}

export const JwtGen: JwtGenerate = {
    sign: jest.fn().mockReturnValue(Promise.resolve('ok'))
}

export const JwtVer: JwtVerify = {
    verify: jest.fn()
}