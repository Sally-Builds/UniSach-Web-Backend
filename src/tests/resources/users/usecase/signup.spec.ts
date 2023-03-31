import SignupUsecase from '../../../../resources/api/users/usecase/auth/signup.usecase';
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
    hash: jest.fn().mockReturnValue(Promise.resolve('hashedPassword')),
    verify: jest.fn(),
}

describe('Signup usecase', () => {
    const sendMail = new EmailTest()
    const signup = new SignupUsecase(UserRepository, PasswordEncrypt, sendMail)
    const {first_name, last_name, password, role,email, phone} = user()

    it('should throw an error not a valid role', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), 'NotValidRole')})
        .rejects.toThrow(Exception)

    })


    it('throw Error if user Exist', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role)})
        .rejects.toThrow(Exception)
    })

    it('throw Error if Password length is less than 8 characters', async () => {
        await expect(async () => {await signup.execute((first_name as string), (last_name as string), 'email', '1234', (phone as string), role)})
        .rejects.toThrow(Exception)
    })

    it('should call the password encryption hash function', async() => {
        const hashSpy = jest.spyOn(PasswordEncrypt, 'hash')
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);

        expect(hashSpy).toHaveBeenCalledWith(password)
    })

    it('should call the otp generator function', async () => {
        const OTPGeneratorSpy = jest.spyOn(signup, 'otpGenerator')
        // const {first_name, last_name, password, role,phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        
        await expect(OTPGeneratorSpy.mock.results[0].value).toEqual(expect.objectContaining({
            OTP: expect.anything(),
            expiresIn: expect.anything(),
            OTPHash: expect.anything()
        }))
    })

    it('should call the createUser function', async () => {
        const createUserRepoSpy = jest.spyOn(UserRepository, 'createUser')
        // const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        expect(createUserRepoSpy).toHaveBeenCalledWith({
                first_name,
                last_name,
                name: `${first_name} ${last_name}`,
                email: "email",
                password: expect.anything(), 
                role, 
                phone,
                emailVerificationStatus: 'pending',
                verificationCode: expect.anything(),
                confirmationCodeExpiresIn: expect.anything(),
        })
    })

    it('should send otp to user Email', async () => {
        const EmailSpy = jest.spyOn(sendMail, 'EmailVerification')
        // const {first_name, last_name, password, role, phone, email} = user()
        await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        expect(EmailSpy).toHaveBeenCalledWith(expect.anything(), 'email', first_name)
    })

    it('createUser function should return appropriate result', async () => {
        const createUser = jest.spyOn(UserRepository, 'createUser')
        // const {first_name, last_name, password, role,phone, email} = user()
        const res = await signup.execute((first_name as string), (last_name as string), 'email', (password as string), (phone as string), role);
        
        expect(typeof res).toBe('string')
    })
})