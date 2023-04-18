import GetPharmacyUsecase from '../../../../resources/api/pharmacy/usecases/get.usecase'
import PharmacyRepositoryInterface from '../../../../resources/api/pharmacy/interfaces/pharmacyRepo.interface'
import {Pharmacy} from '../../__helpers__/stubs'


const PharmacyRepoReturnNull: PharmacyRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    createPharmacy: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
}
const PharmacyRepoReturnsAValue: PharmacyRepositoryInterface = {
    findOne: jest.fn().mockReturnValue(Promise.resolve(Pharmacy())),
    createPharmacy: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
}

describe('Get Pharmacy Usecase', () => {
    const sut = new GetPharmacyUsecase(PharmacyRepoReturnsAValue)

    it('should call findOne with the correct value', async () => {
        const findOneSpy = jest.spyOn(PharmacyRepoReturnsAValue, 'findOne')
        await sut.execute({userId: '1'})

        expect(findOneSpy).toHaveBeenCalledWith({userId: '1'})
    })

    it('should throw an Exception if no records was found', async () => {
        const sut = new GetPharmacyUsecase(PharmacyRepoReturnNull)
        try {
            await sut.execute({userId: '1'})
        } catch (error:any) {
            expect(error).toMatchObject({message: "not found", statusCode: 404})
        }
    })

    it('should return the correct result', async () => {
        const result = await sut.execute({userId: '1'})

        expect(result).toEqual(expect.objectContaining({userId: '1'}))
    })
})