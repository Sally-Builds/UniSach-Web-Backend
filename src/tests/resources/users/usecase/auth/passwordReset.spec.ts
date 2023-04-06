import PasswordReset from '../../../../../resources/api/users/usecase/auth/passwordReset.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import crypto from 'crypto'
import {dbUser, user, PasswordEncryptCorrectPassword} from '../../../__helpers__/stubs'
import Exception from '../../../../../utils/exception/Exception'


const UserRepositoryReturnsAValue: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    getUserByEmail: jest.fn(),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsNull: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    getUserByEmail: jest.fn(),
    findOneAndUpdate: jest.fn()
}

describe('Password Reset usecase', () => {
    const passwordResetUsecase = new PasswordReset(UserRepositoryReturnsAValue, PasswordEncryptCorrectPassword)
    const {email, password} = user()
    it('should hash the reset token', async () => {
        const cryptoSpy = jest.spyOn(crypto, 'createHash')
        await passwordResetUsecase.execute('hashedToken', (password as string))

        expect(cryptoSpy).toHaveBeenCalled()
    })

    it('findOne method should be called with correct arguments', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOne')
        await passwordResetUsecase.execute('hashedTokens', 'test1234')

        expect(findOneSpy).toHaveBeenCalledWith({passwordResetToken: expect.anything(), passwordResetTokenExpiresIn: expect.anything()})

    })

    it('should throw an Exception if no user is found', async () => {
        const passwordResetUsecase = new PasswordReset(UserRepositoryReturnsNull, PasswordEncryptCorrectPassword)

        expect(async () => {await passwordResetUsecase.execute('hashed', (password as string))}).rejects.toThrow(Exception)
    })

    it('should hash the new password', async () => {
        const hashedPasswordSpy = jest.spyOn(PasswordEncryptCorrectPassword, 'hash')
        await passwordResetUsecase.execute('hashedTokens', (password as string))

        expect(hashedPasswordSpy).toHaveBeenCalledWith(password)
    })

    it('should update the users password with the correct arguments',async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
            const hashedPasswordSpy = jest.spyOn(PasswordEncryptCorrectPassword, 'hash')
            await passwordResetUsecase.execute('hashedTokens', (password as string))

            const hashedPassword = await hashedPasswordSpy.mock.results[0].value

            expect(findOneAndUpdateSpy).toHaveBeenCalledWith({email}, {password: hashedPassword})
    })

    it('should return a string', async () => {
        const res = await passwordResetUsecase.execute('hashedTokens', (password as string))

        await expect(typeof res).toBe('string')
    })
})