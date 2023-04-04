import VerifyUsecase from '../../../../../resources/api/users/usecase/auth/verifyOTP.usecase'
import {JwtGen, dbUser } from '../../../__helpers__/stubs';
import EmailTest from '../../../__helpers__/email.stub';
import Exception from '../../../../../utils/exception/Exception';
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface';


const UserRepositoryFindOneReturnsAValue:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}
const UserRepositoryFindOneReturnsNull:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}

describe("Test Verify OTP usecase", () => {
    const EmailClass = new EmailTest()
    it('should encrypt the otp', async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsAValue, JwtGen, EmailClass)
        const encryptOTPSpy = jest.spyOn(verifyUsecase, 'encryptOTP')
        await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(encryptOTPSpy).toHaveBeenCalled()
    })

    it('should throw an exception if no user is found', async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsNull, JwtGen, EmailClass)
        await expect(async () => {await verifyUsecase.execute('johndoe@gmail.com', '123456', '')})
        .rejects.toThrow(Exception)
    })

    it('should call generateTokens with the correct parameter',async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsAValue, JwtGen, EmailClass)
        const generateTokensSpy = jest.spyOn(verifyUsecase, 'generateTokens')
        await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(generateTokensSpy).toHaveBeenCalledWith('1')
    })

    it('should generate the refresh and access tokens',async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsAValue, JwtGen, EmailClass)
        const JwtGenSpy = jest.spyOn(JwtGen, 'sign')
        await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(JwtGenSpy).toBeCalledTimes(2)
    })

    it('should send welcome email to user', async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsAValue, JwtGen, EmailClass)
        const emailSpy = jest.spyOn(EmailClass, 'sendWelcome')
        await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(emailSpy).toBeCalled()
    })


    it('should return valid data', async () => {
        const verifyUsecase = new VerifyUsecase(UserRepositoryFindOneReturnsAValue, JwtGen, EmailClass)
        const data = await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(data).toEqual(expect.objectContaining({
            accessToken: expect.anything(),
            refreshToken: expect.anything(),
            user: expect.anything()
        }))
    })
    
})