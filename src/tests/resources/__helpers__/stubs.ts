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
                refreshToken: ['one', 'two']
            }]
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