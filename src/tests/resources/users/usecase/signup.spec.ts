import SignupUsecase from '../../../../resources/api/users/usecase/auth/signup.usecase';
import UserRepositoryInterface from '../../../../resources/api/users/interfaces/userRepo.interface';
import PasswordEncryption from '../../../../utils/cryptography/interface/cryptography/passwordEncryption';
import User from '../../../../resources/api/users/interfaces/user.interface';
import EmailTest from '../../__helpers__/email.stub';
import Exception from '../../../../utils/exception/Exception';
import { UserRepository } from '../../__helpers__/stubs';


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


const PasswordEncrypt: PasswordEncryption = {
    hash: jest.fn(),
    verify: jest.fn(),
}

describe('Signup usecase', () => {
    const sendMail = new EmailTest()
    const signup = new SignupUsecase(UserRepository, PasswordEncrypt, sendMail)
    const {first_name, last_name, password, role,email, phone} = user()

    it('should throw an error not a valid role', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), 'NotValidRole')})
        .rejects.toThrow(new Exception('role not valid', 400))

    })


    it('throw Error if user Exist', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role)})
        .rejects.toThrow(new Exception("Email already exist", 400))
    })

    it('throw Error if Password length is less than 8 characters', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), 'email', '1234', (phone as string), role)})
        .rejects.toThrow(new Exception('password must be greater than 8 characters', 400))
    })

    it('should call the password encryption hash function', async() => {
        const hashSpy = jest.spyOn(PasswordEncrypt, 'hash')
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);

        expect(hashSpy).toHaveBeenCalled()
    })

    it('should call the otp generator function', async () => {
        const OTPGeneratorSpy = jest.spyOn(signup, 'otpGenerator')
        const {first_name, last_name, password, role,phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        
        expect(OTPGeneratorSpy).toHaveBeenCalled()
    })

    it('should call the createUser function', async () => {
        const createUserRepoSpy = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        expect(createUserRepoSpy).toHaveBeenCalled()
    })

    it('should send otp to user Email', async () => {
        const EmailSpy = jest.spyOn(sendMail, 'EmailVerification')
        const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        expect(EmailSpy).toHaveBeenCalled()
    })

    it('createUser function should return appropriate result', async () => {
        const createUser = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role,phone, email} = user()
        const res = await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        
        expect(res).toEqual("Verify your email to get started.")
    })
})