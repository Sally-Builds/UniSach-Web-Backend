import Exception from "@/utils/exception/Exception";
import SignupWithGoogleInterface, {Signup} from "../interfaces/usecases/signup.google.interface";
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import { Role } from "../interfaces/user.interface";
import { JwtGenerate } from "../interfaces/cryptography/jsonwebtoken/generate";
import EmailInterface from "../../email/email.interface";

export default class SignupWithGoogleUsecase implements SignupWithGoogleInterface {

    constructor(private readonly userRepository: UserRepositoryInterface, private readonly jwtGen: JwtGenerate, private readonly Email: EmailInterface) {}

    public async execute(first_name: string, last_name: string, email: string, googleID: string, role: string): Promise<Signup.Response> {
        try {
            if(!Object.values(Role).includes(role as Role)) throw new Exception('role not valid', 400)

            //1) check if user already exist
            const isExist = await this.userRepository.getUserByEmail(email)
            if(!isExist) {
                //4) persist to db
                const user = await this.userRepository.createUser({
                    first_name,
                    email,
                    name: `${first_name} ${last_name}`,
                    last_name,
                    googleID,
                    role,
                    emailVerificationStatus: 'active'
                })

                const token = await this.jwtGen.sign((user as any).id)

                await this.Email.sendWelcome('http://localhost:3000/login', user.email, (user as any).first_name)

                return {user, token}
            }


            
                const token = await this.jwtGen.sign((isExist as any).id)
                return {user: isExist, token}
       } catch (error:any) {
        throw new Exception(error.message, error.statusCode)
       }
    }
}