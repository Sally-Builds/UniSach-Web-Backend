import Exception from "@/utils/exception/Exception";
import SignupInterface, { Signup } from "../interfaces/usecases/signup.usecase";
import UserRepository from "../repository";
import { Role } from "../interfaces/user.interface";
import PasswordEncryption from "../interfaces/cryptography/passwordEncryption";
import User from "../interfaces/user.interface";

export default class SignupUsecase implements SignupInterface {

    constructor(private readonly userRepository: UserRepository, private EncryptPassword: PasswordEncryption) {}

    public async execute(first_name: string, last_name: string, email: string, password: string, role: string): Promise<Signup.Response> {
        try {
            if(!Object.values(Role).includes(role as Role)) throw new Exception('role not valid', 400)
            //1) check if user already exist
            const isExist = await this.userRepository.getUserByEmail(email)
            if(isExist) throw new Exception("email already exist", 400)
            //2) verify that password is valid
            if(password.length < 8) throw new Exception('password must be greater than 8 characters', 400)
            //3) hash password
            const passwordHash = await this.EncryptPassword.hash(password)
            //4) persist to db
            const user = await this.userRepository.createUser({
                first_name,
                last_name,
                email,
                password: passwordHash, 
                role
            })
            if((user as User).password) {
                (user as any).password = undefined;
            }
            return user
       } catch (error:any) {
        throw new Exception(error.message, error.statusCode)
       }
    }
}