import { JwtGenerate } from "../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate"
import {JwtVerify} from '../../../utils/cryptography/interface/cryptography/jsonwebtoken/verify'
import PasswordEncryption from "../../../utils/cryptography/interface/cryptography/passwordEncryption"
import User from "../../../resources/api/users/interfaces/user.interface"
import { TokenExpiredError } from "jsonwebtoken"
import Pharmacy from "../../../resources/api/pharmacy/interfaces/pharmacy.interface"

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

export const Pharmacy = (): Pharmacy => {
    return {
        pharmacistLicense: 'string',
        pharmacistQualification: 'string',
        name: 'string',
        type: 'string',
        userId: '1',
        phone_number: 'string',
        motto: 'string',
        license_number: 'string',
        address: 'string',
        location: {
            type: "Point",
            coordinates: [34.94839, 45.9448839]
        },
        email: 'string',
        description: 'string',
        images: ['test'],
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
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
                refreshToken: ['one', 'two', 'refreshToken']
            }]
}


export const PasswordEncryptWrongPassword: PasswordEncryption = {
    hash: jest.fn(),
    verify: jest.fn().mockReturnValue(Promise.resolve(false)),
}

export const PasswordEncryptCorrectPassword: PasswordEncryption = {
    hash: jest.fn().mockReturnValue(Promise.resolve('hashedPassword')),
    verify: jest.fn().mockReturnValue(Promise.resolve(true)),
}

export const JwtGen: JwtGenerate = {
    sign: jest.fn().mockReturnValue(Promise.resolve('ok'))
}

export const JwtVer: JwtVerify = {
    verify: jest.fn().mockReturnValue(Promise.resolve({id: '1', expiresIn: 123456978}))
}

export const JwtVerExpiredToken: JwtVerify = {
    verify: jest.fn().mockReturnValue(Promise.resolve(new TokenExpiredError('expired token', new Date(1680515458983))))
}