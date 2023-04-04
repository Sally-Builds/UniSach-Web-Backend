import LoginUsecase from '../../../../../resources/api/users/usecase/auth/login.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {JwtGen, user, dbUser, PasswordEncryptWrongPassword, PasswordEncryptCorrectPassword} from '../../../__helpers__/stubs'
import ResendOTP from '../../../../../resources/api/users/interfaces/usecases/auth/resendOTP.interface'

const UserRepositoryReturnsNull: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsAValue: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], emailVerificationStatus: 'active'})),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsAValueButEmailVerificationIsPending: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], emailVerificationStatus: 'pending'})),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsAValueWithAGoogleID: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], googleID: '1234567890'})),
    findOneAndUpdate: jest.fn()
}


const resendOTPMock: ResendOTP = {
    execute: jest.fn(),
    otpGenerator: jest.fn()
}


describe("Login usecase", () => {
    const loginUsecase = new LoginUsecase(UserRepositoryReturnsAValue, JwtGen,PasswordEncryptCorrectPassword, resendOTPMock)
    const {email, password} = user()

    it('should call getUserByEmail with correct argument', async () => {
        const getUserByEmailSpy = jest.spyOn(UserRepositoryReturnsAValue, 'getUserByEmail')
        await loginUsecase.execute(email, (password as string), 'refreshToken')

        await expect(getUserByEmailSpy).toHaveBeenCalledWith(email)
    })

    it('should throw an Exception if no user was found', async () => {
        const loginUsecase = new LoginUsecase(UserRepositoryReturnsNull, JwtGen, PasswordEncryptCorrectPassword, resendOTPMock)
        await expect(loginUsecase.execute(email, (password as string), 'refreshToken')).rejects.toMatchObject({message: "Email or Password is incorrect", statusCode: 400})
    })

    it('should throw an Exception if user has a googleID', async () => {
        const loginUsecase = new LoginUsecase(UserRepositoryReturnsAValueWithAGoogleID, JwtGen, PasswordEncryptCorrectPassword, resendOTPMock)
        await expect(loginUsecase.execute(email, (password as string), 'refreshToken')).rejects.toMatchObject({message: "Email or Password is incorrect", statusCode: 400})
    })

    it('should throw an Exception if password is incorrect', async () => {
        const loginUsecase = new LoginUsecase(UserRepositoryReturnsAValue, JwtGen, PasswordEncryptWrongPassword, resendOTPMock)
        await expect(loginUsecase.execute(email, (password as string), 'refreshToken')).rejects.toMatchObject({message: "Email or Password is incorrect", statusCode: 400})
    })

    describe('When user verification is pending', () => {
        const loginUsecase = new LoginUsecase(UserRepositoryReturnsAValueButEmailVerificationIsPending, JwtGen, PasswordEncryptCorrectPassword, resendOTPMock)
        it('should call resend otp with the correct arguments', async () => {
            const resendOTPSpy = jest.spyOn(resendOTPMock, 'execute')
            await loginUsecase.execute(email, (password as string), 'refreshToken')
            
            expect(resendOTPSpy).toHaveBeenCalledWith(email)
        })

        it('should return object containing email and message', async () => {
            const res = await loginUsecase.execute(email, (password as string), 'refreshToken')

            expect(res).toEqual(expect.objectContaining({email: dbUser()[0].email, message: expect.anything()}))
        })
    }) 

    it('should call generateTokens with correct argument', async () => {
        const generateTokensSpy = jest.spyOn(loginUsecase, 'generateTokens')
        await loginUsecase.execute(email, (password as string), 'refreshToken')

        expect(generateTokensSpy).toHaveBeenCalledWith(dbUser()[0].id)

    })

    it('should successfully sign the tokens', async () => {
        const jwtGenSpy = jest.spyOn(JwtGen, 'sign')
        await loginUsecase.execute(email, (password as string), 'refreshToken')
        
        expect(jwtGenSpy).toBeCalledTimes(2)
    })

    it('should update the refresh token array', async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
        await loginUsecase.execute(email, (password as string), 'refreshToken')

        expect(findOneAndUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({_id: (dbUser()[0] as any).id}), {refreshToken: expect.arrayContaining(['ok'])})
    })

    it('should remove unwanted fields', async () => {
        const removeUnwantedFieldsSpy = jest.spyOn(loginUsecase, 'removeUnwantedFields')
        await loginUsecase.execute(email, (password as string), 'refreshToken')

        expect(removeUnwantedFieldsSpy).toHaveBeenCalled()
    })

    it('should return correct object', async () => {
        const res = await loginUsecase.execute(email, (password as string), 'refreshToken')

        expect(res).toEqual({accessToken: expect.anything(), refreshToken: expect.anything(), user: expect.anything()})
    })
})