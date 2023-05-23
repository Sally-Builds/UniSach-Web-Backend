import { cleanData, connect, disconnect } from "../../../../utils/__helpers_/mongodb.memory.test.helpers";
import DrugRepo from '../../../../resources/api/drugs/repository'
import { Drug } from "../../__helpers__/stubs";


const DrugRepository = new DrugRepo()
describe('Drug Repository model', () => {
    beforeAll(connect)
    beforeEach(cleanData)
    afterAll(disconnect)
    

    it('should create drugs', async () => {
        const result = await DrugRepository.create(...[{...Drug(), name: '1'}, {...Drug(), name: '2'}])

        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({slug: '1'})]))
    })

    it('should find one document', async () => {
        const result = await DrugRepository.create(...[{...Drug(), name: '1'}, {...Drug(), name: '2'}])
        const findOne = await DrugRepository.findOne({name: '2'})

        expect(findOne).toEqual(expect.objectContaining({name: '2'}))
    })

    it('should getAll documents', async () => {
        const result = await DrugRepository.create(...[{...Drug(), name: '1'}, {...Drug(), name: '2'}])
        const find = await DrugRepository.find({})

        expect(find.length).toEqual(2)
    })

    it('should getAll documents given query', async () => {
        const result = await DrugRepository.create(...[{...Drug(), name: '1', description: 'hey'}, {...Drug(), name: '2', description: 'hey'}])

        const find = await DrugRepository.find({description: 'hey'})
        const expected = expect.objectContaining({description: 'hey'})

        expect(find).toEqual(expect.arrayContaining([expected, expected]))
    })

    it('should update drugs', async () => {
        const create = await DrugRepository.create(...[{...Drug(), name: '1', description: 'hey'}, {...Drug(), name: '2', description: 'hey'}])
        const find = await DrugRepository.find({})

        const data = {id: find[0].id, name: 'updatedDrug', pharmacy: find[0].pharmacy}
        await DrugRepository.updateDoc(...[data])

        const findOne = await DrugRepository.findOne({_id: (find[0] as any)._id})

        expect(findOne).toEqual(expect.objectContaining({name: 'updatedDrug'}))
    })

    it('should delete drugs', async () => {
        const create = await DrugRepository.create(...[{...Drug(), name: '1', description: 'hey'}, {...Drug(), name: '2', description: 'hey'}])
        let find = await DrugRepository.find({})
        const data = find[0]
        
        await DrugRepository.deleteDoc(...[{id: (data.id as string), pharmacy: (data.pharmacy as string)}])
        const findOne = await DrugRepository.findOne({_id: data})

        expect(findOne).toEqual(null)
    })
})