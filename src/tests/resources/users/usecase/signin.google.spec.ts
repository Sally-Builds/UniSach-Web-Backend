import SignupWithGoogleUsecase from '../../../../resources/api/users/usecase/auth/signin.google.usecase'
import {JwtGen, dbUser } from '../../__helpers__/stubs'
import EmailTest from '../../__helpers__/email.stub'
import Exception from '../../../../utils/exception/Exception'
import User from '../../../../resources/api/users/interfaces/user.interface'
import UserRepositoryInterface from '../../../../resources/api/users/interfaces/userRepo.interface'

const user = ():User => {
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

const UserRepositoryFindUserByEmailReturnsAValue:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve()),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], googleID: '1234567890', password: undefined})),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}
const UserRepositoryFindUserByEmailReturnsNull:UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], googleID: '1234567890'})),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
}

describe("Register/signup with google", () => {
    const emailAdapter = new EmailTest()
    const {first_name, last_name, email, googleID, role}  = user()

    it('should throw an error not a valid role', async () => {
    const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
    await expect(async () => {await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), "Users")}).rejects.toThrow(Exception)

    })

    it('should throw an error if googleID is empty', async () => {
    const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
    await expect(async () => {await signupWithGoogle.execute((first_name as string), (last_name as string), email, '', role)}).rejects.toThrow(Exception)

    })


    it('should call getUserByEmail with the correct email', async () => {
        const getEmailSpy = jest.spyOn(UserRepositoryFindUserByEmailReturnsAValue, 'getUserByEmail')
        const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
        await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)

        expect(getEmailSpy).toHaveBeenCalledWith(email)

    })

    describe("if email doesn't exist", () => {
        it('should call create User', async () => {
            const createUserSpy = jest.spyOn(UserRepositoryFindUserByEmailReturnsNull, 'createUser')
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(createUserSpy).toHaveBeenCalledWith(expect.objectContaining({
                    first_name,
                    email,
                    name: `${first_name} ${last_name}`,
                    last_name,
                    googleID,
                    role,
                    emailVerificationStatus: 'active'
            }))
    
        })

        it('should call generateTokens with the correct parameter',async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            const generateTokensSpy = jest.spyOn(signupWithGoogle, 'generateTokens')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(generateTokensSpy).toHaveBeenCalledWith('1')
        })
    
        it('should generate the refresh and access tokens',async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            const JwtGenSpy = jest.spyOn(JwtGen, 'sign')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(JwtGenSpy).toBeCalledTimes(2)
        })

        it('generateTokens should return correct object', async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            const generateTokensSpy = jest.spyOn(signupWithGoogle, 'generateTokens')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(await generateTokensSpy.mock.results[0].value).toEqual(expect.objectContaining({
                accessToken: expect.anything(),
                refreshToken: expect.anything()
            }))
        })
    
        it('should update the refresh token in the db', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryFindUserByEmailReturnsNull, 'findOneAndUpdate')
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(findOneAndUpdateSpy).toHaveBeenCalled()
    
        })

        it('should send welcome email', async () => {
            const sendWelcomeSpy = jest.spyOn(emailAdapter, 'sendWelcome')
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(sendWelcomeSpy).toHaveBeenCalledWith(expect.anything(), email, first_name)
    
        })

        it('should return the correct data', async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsNull, JwtGen, emailAdapter)
            const executeSpy = jest.spyOn(signupWithGoogle, 'execute')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)

            expect(await executeSpy.mock.results[0].value).toEqual(expect.objectContaining({
                accessToken: expect.anything(),
                refreshToken: expect.anything(),
                user: expect.objectContaining({id: expect.anything(), email: email, googleID, name: expect.anything()})
            }))
        })
    })

    describe('if user already exist', () => {
        it('should call generateTokens with the correct parameter',async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
            const generateTokensSpy = jest.spyOn(signupWithGoogle, 'generateTokens')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(generateTokensSpy).toHaveBeenCalledWith('1')
        })
    
        it('should update the refresh token in the db', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryFindUserByEmailReturnsAValue, 'findOneAndUpdate')
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(findOneAndUpdateSpy).toHaveBeenCalled()
    
        })

        it('should return the correct data', async () => {
            const signupWithGoogle = new SignupWithGoogleUsecase(UserRepositoryFindUserByEmailReturnsAValue, JwtGen, emailAdapter)
            const executeSpy = jest.spyOn(signupWithGoogle, 'execute')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)

            expect(await executeSpy.mock.results[0].value).toEqual(expect.objectContaining({
                accessToken: expect.anything(),
                refreshToken: expect.anything(),
                user: expect.objectContaining({id: expect.anything(), email: email, googleID, name: expect.anything()})
            }))
        })
    })
})