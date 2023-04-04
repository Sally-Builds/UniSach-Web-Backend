import UpdateUsecase from '../../../../../resources/api/users/usecase/userOp/update.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {Update} from '../../../../../resources/api/users/interfaces/usecases/userOp/update.interface'
import {dbUser} from '../../../__helpers__/stubs'
import Exception from '../../../../../utils/exception/Exception'

const UserRepositoryFindOneAndUpdateReturnsAValue: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(dbUser()[0])),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}

const UserRepositoryFindOneAndUpdateReturnsNull: UserRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
}

describe("update user usecase", () => {
    const updateUsecase = new UpdateUsecase(UserRepositoryFindOneAndUpdateReturnsAValue)
    const payload: Update.Request = {first_name: "john", last_name: "doe", phone: '12345678912'}

    it('should call findOne method with the user id', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryFindOneAndUpdateReturnsAValue, 'findOne')
        await updateUsecase.execute(payload, '1')

        expect(findOneSpy).toHaveBeenCalledWith({_id: '1'})
    })

    it('should throw an Exception if no user was found', async () => {
        const updateUsecase = new UpdateUsecase(UserRepositoryFindOneAndUpdateReturnsNull)

        await expect(updateUsecase.execute(payload, '1')).rejects.toMatchObject(expect.objectContaining({message: expect.anything(), statusCode: 404}))  
    })

    it('should call findOneAndUpdate method with the correct argument', async () => {
        const findOneAndUpdateSpy = jest.spyOn(UserRepositoryFindOneAndUpdateReturnsAValue, 'findOneAndUpdate')
        await updateUsecase.execute(payload, '1')

        expect(findOneAndUpdateSpy).toHaveBeenCalledWith({_id: '1'}, {...payload, name: 'john doe'})
    })

    it('should return updated user', async () => {
        const updatedUser = await updateUsecase.execute(payload, '1')

        expect(updatedUser).toEqual(expect.objectContaining({id: expect.anything(), phone: expect.anything(), last_name: expect.anything(), first_name: expect.anything()}))
    })
})