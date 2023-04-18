import GetAllUsecase from '../../../../resources/api/pharmacy/usecases/getAll.usecase'
import PharmacyRepositoryInterface from '../../../../resources/api/pharmacy/interfaces/pharmacyRepo.interface'
import { Pharmacy } from '../../__helpers__/stubs'

const PharmacyRepo: PharmacyRepositoryInterface = {
    find: jest.fn().mockReturnValue(Promise.resolve([Pharmacy()])),
    createPharmacy: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn()
}

describe('Get all pharmacies usecase', () => {
    const sut = new GetAllUsecase(PharmacyRepo)


    it('should call find pharm repo with the correct argument', async () => {
        const findSpy = jest.spyOn(PharmacyRepo, 'find')
        await sut.execute({name: 'xyz'})

        expect(findSpy).toHaveBeenCalledWith({name: 'xyz'})
    })

    it('should return an array of pharmacies', async () => {
        const res = await sut.execute({})
        
        expect(res).toEqual(expect.arrayContaining([expect.objectContaining({userId: '1'})]))
    })
})