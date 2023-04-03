import UserRepositoryInterface from '../../../../resources/api/users/interfaces/userRepo.interface'
import LogoutUsecase from '../../../../resources/api/users/usecase/auth/logout.usecase'
import {dbUser} from '../../__helpers__/stubs'

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

describe('Logout usecase', () => {
    const logoutusecase = new LogoutUsecase(UserRepositoryReturnsAValue)

    it('should call findone method with the correct argument', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOne')
        await logoutusecase.execute('refreshToken')

        expect(findOneSpy).toHaveBeenCalledWith({refreshToken: 'refreshToken'})
    })

    it('should return "success" if no user', async () => {
        const logoutusecase = new LogoutUsecase(UserRepositoryReturnsNull)
        const res = await logoutusecase.execute('refreshToken')
        expect(res).toBe('success') 
    })

    it('should call findOneAndUpdate method with the correct arguments', async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
        await logoutusecase.execute('refreshToken')

        expect(findOneAndUpdateSpy).toHaveBeenCalledWith({refreshToken: 'refreshToken'}, {refreshToken: ["one", "two"]})
    })

    it('should return "success" after refresh token has been deleted', async () => {
        const res = await logoutusecase.execute('refreshToken')

        expect(res).toBe("success")
    })
})