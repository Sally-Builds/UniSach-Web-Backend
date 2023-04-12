import Exception from "@/utils/exception/Exception";
import SignupWithGoogleInterface, {Signup, TokenGenerate} from "../../interfaces/usecases/auth/signup.google.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";
import { Role } from "../../interfaces/user.interface";
import { JwtGenerate } from "../../../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate";
import EmailInterface from "../../../email/email.interface";

export default class SignupWithGoogleUsecase implements SignupWithGoogleInterface {

    constructor(private readonly userRepository: UserRepositoryInterface, private readonly jwtGen: JwtGenerate, private readonly Email: EmailInterface) {}

    public async execute(first_name: string, last_name: string, email: string, googleID: string, role: string, existingRefreshToken: string): Promise<Signup.Response> {
        try {
            if(!Object.values(Role).includes(role as Role)) throw new Exception('role not valid', 400)

            if(!googleID) throw new Exception('invalid token', 400)

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

                const {refreshToken, accessToken} = await this.generateTokens((user as any).id)

                await this.userRepository.findOneAndUpdate({_id: (user as any).id}, {$push: { refreshToken: refreshToken}})
                await this.Email.sendWelcome('http://localhost:3000/login', user.email, (user as any).first_name)

                user.refreshToken = undefined 
            return {user, accessToken, refreshToken}
            }

            if(isExist.password) throw new Exception("Bad Request", 400)
            const {accessToken, refreshToken} = await this.generateTokens((isExist as any).id)

            const newRefreshTokenArray = !existingRefreshToken ? isExist?.refreshToken  : isExist.refreshToken?.filter((rt: string) => rt != existingRefreshToken)
            newRefreshTokenArray?.push(refreshToken)
            await this.userRepository.findOneAndUpdate({_id: (isExist as any).id}, {refreshToken: newRefreshTokenArray, active: true})

            return {
                user: {...JSON.parse(JSON.stringify(isExist)), refreshToken: undefined, active: true},
                accessToken, refreshToken}
       } catch (error:any) {
        throw new Exception(error.message, error.statusCode)
       }
    }

    async generateTokens(id: string): Promise<TokenGenerate.Response> {
        const accessToken = await this.jwtGen.sign(id, String(process.env.ACCESS_TOKEN_SECRET), String(process.env.ACCESS_TOKEN_EXPIRES_IN))
        const refreshToken = await this.jwtGen.sign(id, String(process.env.REFRESH_TOKEN_SECRET), String(process.env.REFRESH_TOKEN_EXPIRES_IN))

        return {accessToken, refreshToken}
    }
}