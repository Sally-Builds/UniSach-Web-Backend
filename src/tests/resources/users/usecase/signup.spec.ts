import SignupUsecase from '../../../../resources/api/users/usecase/auth/signup.usecase';
import UserRepositoryInterface from '../../../../resources/api/users/interfaces/userRepo.interface';
import {BcryptAdapter} from "../../../../utils/cryptography/passwordEncryption"
import PasswordEncryption from '../../../../utils/cryptography/interface/cryptography/passwordEncryption';
import User from '../../../../resources/api/users/interfaces/user.interface';
import EmailTest from '../../__helpers__/email.stub';


const user = ():User => {
    return {
            first_name: 'Jay',
            last_name: "Sally",
            name: "Jay Sally",
            email: "uzoagulujoshua@gmail.com",
            password: 'wgke3mf1234',
            phone: "+123456789",
            role: 'User'
    }
}

const UserRepository: UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}


const PasswordEncrypt: PasswordEncryption = {
    hash: jest.fn(),
    verify: jest.fn(),
}

describe('Signup usecase', () => {
    const sendMail = new EmailTest()
    const signup = new SignupUsecase(UserRepository, PasswordEncrypt, sendMail)

    it('should call the geUserByEmail function', async () => {
        const getEmailSpy = jest.spyOn(UserRepository, 'getUserByEmail')
        const {first_name, last_name, password, role,email, phone} = user()
        await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);
        expect(getEmailSpy).toHaveBeenCalled()
    })

    it('should call the password encryption hash function', async() => {
        const hashSpy = jest.spyOn(PasswordEncrypt, 'hash')
        const {first_name, last_name, password, role,phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);

        expect(hashSpy).toHaveBeenCalled()
    })

    it('should call the otp generator function', async () => {
        const OTPGeneratorSpy = jest.spyOn(signup, 'otpGenerator')
        const {first_name, last_name, password, role,phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);
        
        expect(OTPGeneratorSpy).toHaveBeenCalled()
    })

    it('should call the createUser function', async () => {
        const createUserRepoSpy = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);
        expect(createUserRepoSpy).toHaveBeenCalled()
    })

    it('should send otp to user', async () => {
        const EmailSpy = jest.spyOn(sendMail, 'EmailVerification')
        const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);
        expect(EmailSpy).toHaveBeenCalled()
    })

    it('createUser function should return appropriate result', async () => {
        const createUser = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role,phone, email} = user()
        const res = await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role);
        
        expect(res).toEqual("Verify your email to get started.")
    })
})