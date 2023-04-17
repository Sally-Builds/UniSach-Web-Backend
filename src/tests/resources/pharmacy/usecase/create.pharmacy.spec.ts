import PharmacyRepository from '../../../../resources/api/pharmacy/interfaces/pharmacyRepo.interface'
import CreatePharmacyUsecase from '../../../../resources/api/pharmacy/usecases/create.usecase'
import { Pharmacy } from '../../__helpers__/stubs'

const PharmacyRepoFindOneReturnsNull: PharmacyRepository = {
    createPharmacy: jest.fn().mockReturnValue(Promise.resolve(Pharmacy())),
    find: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    findOneAndUpdate: jest.fn()
}

const PharmacyRepoFindOneReturnsAValue: PharmacyRepository = {
    createPharmacy: jest.fn().mockReturnValue(Promise.resolve({})),
    find: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve(Pharmacy())),
    findOneAndUpdate: jest.fn()
}

describe('Create Pharmacy usecase', () => {
    const sut = new CreatePharmacyUsecase(PharmacyRepoFindOneReturnsNull)

    it('should check throw an Exception if pharmacy name already exist', async () => {
        const sut = new CreatePharmacyUsecase(PharmacyRepoFindOneReturnsAValue)
        try {
            await sut.execute(Pharmacy())
        } catch (error) {
            expect(error).toMatchObject({message: 'Pharmacy name already exists', statusCode: 400})
        }
    })
    it('should create the pharmacy successfully', async () => {
        const pharm = await sut.execute(Pharmacy())

        expect(pharm).toEqual(expect.objectContaining({
            userId: '1'
        }))
    })
})

