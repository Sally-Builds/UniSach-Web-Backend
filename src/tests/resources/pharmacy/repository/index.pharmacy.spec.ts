import { cleanData, connect, disconnect } from "../../../../utils/__helpers_/mongodb.memory.test.helpers";
import PharmacyRepo from '../../../../resources/api/pharmacy/repository/index'
import Pharmacy from "../../../../resources/api/pharmacy/interfaces/pharmacy.interface";
import { pharmacy } from "../../../../resources/api/pharmacy/interfaces/pharmacyRepo.interface";


const pharmacyRepository = new PharmacyRepo() 
const pharmacy = ():Pharmacy => {
    return {
        pharmacistLicense: 'string',
        pharmacistQualification: 'string',
        name: 'string',
        type: 'string',
        userId: '1',
        phone_number: 'string',
        motto: 'string',
        license_number: 'string',
        address: 'string',
        location: {
            type: "Point",
            coordinates: [34.94839, 45.9448839]
        },
        email: 'string',
        description: 'string',
        images: ['test'],
        created_at: new Date(),
        updated_at: new Date(),
        verified: true
    }
}

describe('Pharmacy Repository', () => {
    beforeAll(connect)
    beforeEach(cleanData)
    afterAll(disconnect)

    it('should create a user', async () => {
        const pharmacyData = pharmacy();
        const newPharmacy = await pharmacyRepository.createPharmacy(pharmacyData)

        expect(newPharmacy).toEqual(expect.objectContaining({
            userId: '1',
            phone_number: 'string',
            motto: 'string',
            license_number: 'string',
            address: 'string',
            location: {
                type: "Point",
                coordinates: [34.94839, 45.9448839]
            },
            email: 'string',
            description: 'string',
            id: expect.anything()
        }))
    })

    it('should find one', async () => {
        const pharmacyData = pharmacy();
        await pharmacyRepository.createPharmacy(pharmacyData)

        const pharm = await pharmacyRepository.findOne({userId: '1'})

        expect(pharm).toEqual(expect.objectContaining({
            userId: '1'
        }))
    })

    it('should return array of pharmacy', async () => {
        const pharmacyData = pharmacy();
        await pharmacyRepository.createPharmacy(pharmacyData)

        const pharmacies = await pharmacyRepository.find({userId: '1'})

        expect(pharmacies).toEqual(expect.arrayContaining([expect.objectContaining({
            userId: '1'
        })]))
    })

    it('should update pharmacy', async () => {
        const pharmacyData = pharmacy();
        await pharmacyRepository.createPharmacy(pharmacyData)

        const newName = 'newName'
        const pharmacies = await pharmacyRepository.findOneAndUpdate({userId: '1'}, {name: newName})

        expect(pharmacies).toEqual(expect.objectContaining({name: newName}))
    })

})