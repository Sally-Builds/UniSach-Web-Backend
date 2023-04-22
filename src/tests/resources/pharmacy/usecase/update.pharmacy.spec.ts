import UpdatePharmacyUsecase from '../../../../resources/api/pharmacy/usecases/update.usecase'
import PharmacyRepositoryInterface from '../../../../resources/api/pharmacy/interfaces/pharmacyRepo.interface'
import {Pharmacy} from '../../__helpers__/stubs'


const PharmacyRepoReturnNull: PharmacyRepositoryInterface = {
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(null)),
    createPharmacy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn()
}
const PharmacyRepoReturnsAValue: PharmacyRepositoryInterface = {
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(Pharmacy())),
    createPharmacy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn()
}

const PharmacyRepoReturnsAValueButNotAuthorizedUser: PharmacyRepositoryInterface = {
    findOneAndUpdate: jest.fn().mockReturnValue(Promise.resolve(Pharmacy())),
    createPharmacy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(Pharmacy()))
}


describe('update pharmacy usecase', () => {
    const sut = new UpdatePharmacyUsecase(PharmacyRepoReturnsAValue)
    const query = {id: '1'}
    const userId = '1'
    const data =  {address: '24 umuezebi', name: "xlp", userId: '1'}

    it('should call findOneAndUpdate with the right argument', async () => {
        const findOneAndUpdateSpy = jest.spyOn(PharmacyRepoReturnsAValue, 'findOneAndUpdate')
        await sut.execute(query, userId, data)

        expect(findOneAndUpdateSpy).toHaveBeenCalledWith(query, data)
    })

    it('should throw an Exception if unauthorized user', async () => {
        const sut = new UpdatePharmacyUsecase(PharmacyRepoReturnsAValueButNotAuthorizedUser)
        try {
            await sut.execute(query, userId, data)
        } catch (error:any) {
            expect(error).toMatchObject({message: 'forbidden', statusCode: 404})
        }
    })

    it('should throw an Exception if user is not found', async () => {
        const sut = new UpdatePharmacyUsecase(PharmacyRepoReturnNull)
        try {
            await sut.execute(query, userId, data)
        } catch (error:any) {
            expect(error).toMatchObject({message: "not found", statusCode: 404})
        }
    })

    it('should return the correct value', async () => {
        const res = await sut.execute(query,userId, data)

        expect(res).toEqual(Pharmacy())
    })
})