import { cleanData, connect, disconnect } from "../../../../utils/__helpers_/mongodb.memory.test.helpers";
import UserRepository from "../../../../resources/api/users/repository";
import User from "../../../../resources/api/users/interfaces/user.interface";


const userRepository = new UserRepository() 
const user = ():User => {
    return {
            first_name: 'Jay',
            last_name: "Sally",
            name: `Jay Sally`,
            email: "uzoagulujoshua@gmail.com",
            phone: "+234123456789",
            password: 'test1234',
            role: 'User'
    }
}

describe('User Repository', () => {
    beforeAll(connect)
    beforeEach(cleanData)
    afterAll(disconnect)

    it('should create a user', async () => {
        const userData:User = user();
        const newUser = await userRepository.createUser(userData)

        expect(newUser).toEqual(expect.objectContaining({
            first_name: 'Jay',
            last_name: "Sally",
            email: "uzoagulujoshua@gmail.com",
            name: `Jay Sally`,
            phone: "+234123456789",
            password: 'test1234',
            emailVerificationStatus: 'pending',
            role: 'User',
            id: expect.anything()
        }))
    })

    it('should return a user', async () => {
        const userData:User = user();
        await userRepository.createUser(userData)
        const isExist = await userRepository.getUserByEmail(userData.email)

        expect(isExist).toEqual(expect.objectContaining({
            email: "uzoagulujoshua@gmail.com",
            role: 'User',
            id: expect.anything()
        }))
    })

    it('should return null', async () => {
        const isExist = await userRepository.getUserByEmail('johndoe@gmail.com')

        expect(isExist).toEqual(null)
    })

    it('should return correct query', async () => {
        const userData:User = user();
        await userRepository.createUser(userData)
        const isExist = await userRepository.findOne({email: userData.email})

        expect(isExist).toEqual(expect.objectContaining({
            email: "uzoagulujoshua@gmail.com",
            role: 'User',
            emailVerificationStatus: 'pending',
            id: expect.anything()
        }))
    })

    it('should return null', async () => {
        const isExist = await userRepository.findOne({email: "johndoe@gmail.com"})

        expect(isExist).toEqual(null)
    })

    it('should return updated user', async () => {
        const userData:User = user();
        await userRepository.createUser(userData)
        const isExist = await userRepository.findOneAndUpdate({email: userData.email}, {emailVerificationStatus: 'active'})

        expect(isExist).toEqual(expect.objectContaining({
            emailVerificationStatus: 'active'
        }))
    })

    it('should return null', async () => {
    //    await expect(async() => await userRepository.findOneAndUpdate({email: 'jay@gmail.com'}, {emailVerificationStatus: 'active'})).rejects.toThrow(new Exception("not found", 400))
    const res = await userRepository.findOneAndUpdate({email: 'jay@gmail.com'}, {emailVerificationStatus: 'active'})
    await expect(res).toBe(null)
    })

})