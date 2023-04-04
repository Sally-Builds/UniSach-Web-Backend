import ForgotPassword from '../../../../../resources/api/users/usecase/auth/forgotPassword.usecase'
import Exception from '../../../../../utils/exception/Exception'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {dbUser, user} from '../../../__helpers__/stubs'
import EmailTest from '../../../__helpers__/email.stub'

const UserRepositoryReturnsAValue: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsAValueWithGoogleID: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], googleID: '1234567890'})),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsNull: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    getUserByEmail: jest.fn(),
    findOneAndUpdate: jest.fn()
}


describe("Forgot Password usecase", () => {
    const emailAdapter = new EmailTest()
    const forgotPasswordUsecase = new ForgotPassword(UserRepositoryReturnsAValue, emailAdapter)
    const {email} = user();


    it('should throw Exception "no user with this email"', async () => {
        const forgotPasswordUsecase = new ForgotPassword(UserRepositoryReturnsNull, emailAdapter)
        
        await expect(forgotPasswordUsecase.execute(email)).rejects.toMatchObject({statusCode:404})
    })

    it('should throw Exception if user has googleID', async () => {
        const forgotPasswordUsecase = new ForgotPassword(UserRepositoryReturnsAValueWithGoogleID, emailAdapter)

        await expect(forgotPasswordUsecase.execute(email)).rejects.toMatchObject({statusCode:400})
    })

    it('should call linkGenerator method and return correct paramters', async () => {
        const linkGeneratorSpy = jest.spyOn(forgotPasswordUsecase, 'linkGenerator')
        await forgotPasswordUsecase.execute(email)

        expect(linkGeneratorSpy.mock.results[0].value).toEqual({
            link: expect.anything(), 
            expiresIn: expect.anything(), 
            passwordResetTokenHash: expect.anything()
        })
    })

    it('should call findOneAndUpdate method with the correct arguments', async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
        await forgotPasswordUsecase.execute(email)

        expect(findOneAndUpdateSpy).toHaveBeenCalledWith({email}, {passwordResetToken: expect.anything(), passwordResetTokenExpiresIn: expect.anything()})
    })

    it('should send email resetlink to user email', async () => {
        const linkGeneratorSpy = jest.spyOn(forgotPasswordUsecase, 'linkGenerator')
        const emailSpy = jest.spyOn(emailAdapter, 'sendPasswordReset')
        await forgotPasswordUsecase.execute(email)

        expect(emailSpy).toHaveBeenCalledWith(linkGeneratorSpy.mock.results[0].value.link, email, dbUser()[0].name)
    })
})