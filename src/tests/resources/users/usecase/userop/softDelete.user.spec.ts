import SoftDeleteUsecase from '../../../../../resources/api/users/usecase/userOp/softDelete.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {dbUser} from '../../../__helpers__/stubs'


const UserRepositoryFindOneReturnsNull: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}

const UserRepositoryFindOneReturnsAValue: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}
describe('Soft delete usecase', () => {
    const softDeleteUsecase = new SoftDeleteUsecase(UserRepositoryFindOneReturnsAValue)


    it('should call findOne with the correct value', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryFindOneReturnsAValue, 'findOne')
        await softDeleteUsecase.execute('1')

        await expect(findOneSpy).toBeCalledWith({_id: '1'})
    })

    it('should throw exception if findOne returns null', async () => {
        const softDeleteUsecase = new SoftDeleteUsecase(UserRepositoryFindOneReturnsNull)

        await expect(softDeleteUsecase.execute('1')).rejects.toMatchObject({message: "user not found", statusCode: 404})
    })

    it('should call findOneAndUpdate with the correct values', async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryFindOneReturnsAValue, 'findOneAndUpdate')
        await softDeleteUsecase.execute('1')

        await expect(findOneAndUpdateSpy).toHaveBeenCalledWith({_id: '1'}, {active: false, refreshToken: []})
    })
})