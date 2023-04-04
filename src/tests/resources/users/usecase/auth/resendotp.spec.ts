import ResendOTPUsecase from '../../../../../resources/api/users/usecase/auth/resendOTP.usecase'
import Exception from '../../../../../utils/exception/Exception'
import EmailTest from '../../../__helpers__/email.stub'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import { dbUser, user } from '../../../__helpers__/stubs'

const UserRepositoryFindUserByEmailReturnsAValue:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0]})),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
}
const UserRepositoryFindUserByEmailReturnsNull:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve(null)),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve()),
}

describe('resendOTP usecase', () => {
    const emailAdapter = new EmailTest()
    const {email} = user()

    it('should call the getUserByEmail with the correct argument', async () => {
        const getUserByEmailSpy = jest.spyOn(UserRepositoryFindUserByEmailReturnsAValue, 'getUserByEmail')
        const resendOTPUsecase =  new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        await resendOTPUsecase.execute(email)

        expect(getUserByEmailSpy).toHaveBeenCalledWith(email)
    })

    it('should throw an exception if no user is found', async () => {
        const resendOTPUsecase =  new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsNull, emailAdapter)
        
        await expect(async () => {await resendOTPUsecase.execute(email)})
        .rejects.toThrow(Exception)
    })

    it('should call otpGenerator function', async () => {
        const resendOTPUsecase =  new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        const otpGeneratorSpy = jest.spyOn(resendOTPUsecase, 'otpGenerator')
        await resendOTPUsecase.execute(email)

        expect(otpGeneratorSpy).toHaveBeenCalled()
    })

    it('should call otpGenerator function to return correct object', async () => {
        const resendOTPUsecase =  new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        const otpGeneratorSpy = jest.spyOn(resendOTPUsecase, 'otpGenerator')
        await resendOTPUsecase.execute(email)

        expect(otpGeneratorSpy.mock.results[0].value).toEqual({
            OTP: expect.anything(), 
            OTPHash: expect.anything(), 
            expiresIn: expect.anything()
        })
    })

    it('should call findOneAndUpdate function with correct arguments', async () => {
        const findOneAndUpdateSpy =  jest.spyOn(UserRepositoryFindUserByEmailReturnsAValue, 'findOneAndUpdate')
        const resendOTPUsecase = new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        await resendOTPUsecase.execute(email)

        expect(findOneAndUpdateSpy).toBeCalledWith({email: email}, {verificationCode: expect.anything(), confirmationCodeExpiresIn: expect.anything()})
    })

    it('should send otp to users email', async () => {
        const emailAdapterSpy =  jest.spyOn(emailAdapter, 'EmailVerification')
        const resendOTPUsecase = new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        await resendOTPUsecase.execute(email)

        expect(emailAdapterSpy).toHaveBeenCalledWith(expect.anything(), email, dbUser()[0].first_name)
    })

    it('execute should return a string', async () => {
        
        const resendOTPUsecase = new ResendOTPUsecase(UserRepositoryFindUserByEmailReturnsAValue, emailAdapter)
        const executeSpyOn =  jest.spyOn(resendOTPUsecase, 'execute')
        await resendOTPUsecase.execute(email)

        expect(typeof await executeSpyOn.mock.results[0].value).toEqual('string')
    })
})