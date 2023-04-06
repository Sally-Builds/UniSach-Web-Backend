import PasswordUpdate from '../../../../../resources/api/users/usecase/userOp/passwordUpdate.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {PasswordEncryptCorrectPassword, PasswordEncryptWrongPassword, dbUser} from '../../../__helpers__/stubs'

const UserRepositoryFindOneAndUpdateReturnsAValue: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}
const UserRepositoryFindOneAndUpdateReturnsAValueButFindOneReturnsNull: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}
const UserRepositoryFindOneAndUpdateReturnsNull: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}
describe('Password update usecase', () => {
    const passwordUpdateUsecase = new PasswordUpdate(UserRepositoryFindOneAndUpdateReturnsAValue, PasswordEncryptCorrectPassword)

    it('should throw an Exception if password length is less than 8', async () => {
        await expect(passwordUpdateUsecase.execute('1', 'pass', 'test1234')).rejects.toMatchObject({message: "current password incorrect", statusCode: 400})
    })

    it('should throw an Exception if new password length is less than 8', async () => {
        await expect(passwordUpdateUsecase.execute('1', 'password', 'test')).rejects.toMatchObject({message: "Password must be greater than 8 characters", statusCode: 400})
    })

    it('should call findOne method with the correct value', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryFindOneAndUpdateReturnsAValue, 'findOne')
        await passwordUpdateUsecase.execute('1', 'password', 'test1234')
        await expect(findOneSpy.mock.calls[0][0]).toEqual({_id: '1'})
    })

    it('should throw an Error if findOne returns null', async () => {
        const passwordUpdateUsecase = new PasswordUpdate(UserRepositoryFindOneAndUpdateReturnsAValueButFindOneReturnsNull, PasswordEncryptCorrectPassword)

        await expect(passwordUpdateUsecase.execute('1', 'password', 'test1234')).rejects.toMatchObject({message: "current password incorrect", statusCode: 401})
    })

    it('should throw an Error if current password is wrong', async () => {
        const passwordUpdateUsecase = new PasswordUpdate(UserRepositoryFindOneAndUpdateReturnsAValue, PasswordEncryptWrongPassword)

        await expect(passwordUpdateUsecase.execute('1', 'password', 'test1234')).rejects.toMatchObject({message: "current password incorrect", statusCode: 401})
    })

    it('should  hash the new password with the correct values', async () => {
        const hashSpy = jest.spyOn(PasswordEncryptCorrectPassword, 'hash')
        const password = 'password'
        const newPassword = 'test1234'
        await passwordUpdateUsecase.execute('1', password, newPassword)
        expect(hashSpy.mock.calls[0][0]).toEqual(newPassword)
    })

    it('should call findOndAndUPdate method with the correct values', async () => {
        const hashSpy = jest.spyOn(PasswordEncryptCorrectPassword, 'hash')
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryFindOneAndUpdateReturnsAValue, 'findOneAndUpdate')
        await passwordUpdateUsecase.execute('1', 'password', 'test1234')

        const hashedNewPassword = await hashSpy.mock.results[0].value
        await expect(findOneAndUpdateSpy).toHaveBeenCalledWith({_id: '1'}, {password: hashedNewPassword})
    })

    it('should throw an Exception if findOneAndUpdate returns null', async() => {
        const passwordUpdateUsecase = new PasswordUpdate(UserRepositoryFindOneAndUpdateReturnsNull, PasswordEncryptCorrectPassword)
        await expect(passwordUpdateUsecase.execute('1', 'password', 'test1234')).rejects.toMatchObject({message: "Incorrect password", statusCode: 400})
    })

    it('should return a string', async () => {
        const result = await passwordUpdateUsecase.execute('1', 'password', 'test1234')

        expect(typeof result).toEqual('string')
    })
})