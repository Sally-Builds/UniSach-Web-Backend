import { cleanData, connect, disconnect } from "../../../../utils/__helpers_/mongodb.memory.test.helpers";
import UserRepository from "../../../../resources/api/users/repository";
import User from "../../../../resources/api/users/interfaces/user.interface";


const userRepository = new UserRepository() 
const user = ():User => {
    return {
            first_name: 'Jay',
            last_name: "Sally",
            email: "uzoagulujoshua@gmail.com",
            password: 'wgke3mf',
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
            password: 'wgke3mf',
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
})