import SignupUsecase from '../../../../resources/api/users/usecase/signup.usecase';
import UserRepositoryInterface from '../../../../resources/api/users/interfaces/userRepo.interface';
import PasswordEncryption from '../../../../resources/api/users/interfaces/cryptography/passwordEncryption';
import {BcryptAdapter} from '../../../../resources/api/users/bootstrap/passwordEncryption'
import User from '../../../../resources/api/users/interfaces/user.interface';

const user = ():User => {
    return {
            first_name: 'Jay',
            last_name: "Sally",
            email: "uzoagulujoshua@gmail.com",
            password: 'wgke3mf1234',
            role: 'User'
    }
}
interface dbRes extends User {
    id: string
}
const dbUser = ():dbRes => {
    return {
        first_name: 'Jay',
        last_name: "Sally",
        email: "uzoagulujoshua@gmail.com",
        password: '$2a$12$GF/b0X2HEwQd0PhVptJEouOOhr0ussFRcoELZTaOnqk5NE7aBaeim',
        role: 'User',
        id: "1"
    }
}

const UserRepository: UserRepositoryInterface = {
    createUser: jest.fn().mockReturnValue(Promise.resolve(dbUser())),
    getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
}

const PasswordEncrypt: PasswordEncryption = {
    hash: jest.fn(),
    verify: jest.fn(),
}

describe('Signup usecase', () => {
    const signup = new SignupUsecase(UserRepository, PasswordEncrypt)
    it('should call the password encryption hash function', async() => {
        const hashSpy = jest.spyOn(PasswordEncrypt, 'hash')
        const {first_name, last_name, password, role,email} = user()
        await signup.execute(first_name, last_name, email, password, role);

        expect(hashSpy).toHaveBeenCalled()
    })
    it('should call the geUserByEmail function', async () => {
        const getEmailSpy = jest.spyOn(UserRepository, 'getUserByEmail')
        const {first_name, last_name, password, role,email} = user()
        await signup.execute(first_name, last_name, email, password, role);
        expect(getEmailSpy).toHaveBeenCalled()
    })

    it('should call the createUser function', async () => {
        const createUser = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role,email} = user()
        await signup.execute(first_name, last_name, email, password, role);
        expect(createUser).toHaveBeenCalled()
    })

    it('createUser function should return approproraite result', async () => {
        const createUser = jest.spyOn(UserRepository, 'createUser')
        const {first_name, last_name, password, role,email} = user()
        const res = await signup.execute(first_name, last_name, email, password, role);
        // const result = (): Promise<any> => createUser.mock.results[0].value;
        expect(res).toEqual(
            expect.objectContaining({
            first_name: 'Jay',
            last_name: "Sally",
            email: "uzoagulujoshua@gmail.com",
            password: expect.not.stringContaining(user().password),
            role: 'User',
            id: expect.anything()
        })
        )
    })
    
})