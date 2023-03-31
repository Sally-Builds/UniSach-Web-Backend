import VerifyUsecase from '../../../../resources/api/users/usecase/auth/verifyOTP.usecase'
import { UserRepositoryVerifyOTP, UserRepository, JwtGen } from '../../__helpers__/stubs';
import EmailTest from '../../__helpers__/email.stub';
import Exception from '../../../../utils/exception/Exception';

describe("Test Verify OTP usecase", () => {
    const EmailClass = new EmailTest()
    const verifyUsecase = new VerifyUsecase(UserRepositoryVerifyOTP, JwtGen, EmailClass)

    const verifyUsecase2 = new VerifyUsecase(UserRepository, JwtGen, EmailClass)


    it('should encrypt the otp', async () => {
        const encryptOTPSpy = jest.spyOn(verifyUsecase, 'encryptOTP')
       await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(encryptOTPSpy).toHaveBeenCalled()
    })

    it('should throw an exception if no user is found', async () => {
        await expect(async () => {await verifyUsecase2.execute('johndoe@gmail.com', '123456', '')})
        .rejects.toThrow(new Exception("Wrong OTP or Expired OTP", 400))
    })

    it('should call findOneAndUpdate 2 times',async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryVerifyOTP, 'findOneAndUpdate')
       await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(findOneAndUpdateSpy).toBeCalledTimes(2)
    })

    it('should generate the refresh and access tokens',async () => {
        const JwtGenSpy = jest.spyOn(JwtGen, 'sign')
       await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(JwtGenSpy).toBeCalledTimes(2)
    })

    it('should send welcome email to user', async () => {
        const emailSpy = jest.spyOn(EmailClass, 'sendWelcome')
        await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(emailSpy).toBeCalled()
    })


    it('should return valid data', async () => {
        const data = await verifyUsecase.execute('johndoe@gmail.com', '123456', '')

        expect(data).toEqual(expect.objectContaining({
            accessToken: expect.anything(),
            refreshToken: expect.anything(),
            user: expect.anything()
        }))
    })
    
})