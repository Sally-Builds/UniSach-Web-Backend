import SignupWithGoogleUsecase from '../../../../resources/api/users/usecase/auth/signin.google.usecase'
import { UserRepository, UserRepository2, user, JwtGen } from '../../__helpers__/stubs'
import EmailTest from '../../__helpers__/email.stub'
import Exception from '../../../../utils/exception/Exception'


describe("Register/signup with google", () => {
    const emailAdapter = new EmailTest()
    const signupWithGoogle = new SignupWithGoogleUsecase(UserRepository, JwtGen, emailAdapter)
    const signupWithGoogle2 = new SignupWithGoogleUsecase(UserRepository2, JwtGen, emailAdapter)
    const {first_name, last_name, email, googleID, role}  = user()

    it('should throw an error not a valid role', async () => {
        await expect(async () => {await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), "Users")}).rejects.toThrow(Exception)

    })

    it('should throw an error if googleID is empty', async () => {
        await expect(async () => {await signupWithGoogle.execute((first_name as string), (last_name as string), email, '', role)}).rejects.toThrow(Exception)

    })

    it('should call get user by email once', async () => {
        const getEmailSpy = jest.spyOn(UserRepository, 'getUserByEmail')
        await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)

        expect(getEmailSpy).toHaveBeenCalled()

    })

    describe('if new user', () => {
        it('should call create User', async () => {
            const createUserSpy = jest.spyOn(UserRepository2, 'createUser')
            await signupWithGoogle2.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(createUserSpy).toHaveBeenCalled()
    
        })
    
        it('should send welcome email', async () => {
            const sendWelcomeSpy = jest.spyOn(emailAdapter, 'sendWelcome')
            await signupWithGoogle.execute((first_name as string), (last_name as string), "newemail@gmail.com", (googleID as string), role)
    
            expect(sendWelcomeSpy).toHaveBeenCalled()
    
        })

        it('should call jwt generate fn more than once', async () => {
            const jwtSpy = jest.spyOn(JwtGen, 'sign')
            await signupWithGoogle2.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(jwtSpy).toBeCalledTimes(2)
        })
    
        it('should update the refresh token in the db', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepository2, 'findOneAndUpdate')
            await signupWithGoogle2.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(findOneAndUpdateSpy).toHaveBeenCalled()
    
        })
    })

    describe('if user already exist', () => {
        it('should call jwt generate fn more than once', async () => {
            const jwtSpy = jest.spyOn(JwtGen, 'sign')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(jwtSpy).toBeCalledTimes(2)
        })
    
        it('should update the refresh token in the db', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepository, 'findOneAndUpdate')
            await signupWithGoogle.execute((first_name as string), (last_name as string), email, (googleID as string), role)
    
            expect(findOneAndUpdateSpy).toHaveBeenCalled()
    
        })
    })
})