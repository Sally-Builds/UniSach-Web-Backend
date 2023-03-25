import UserRepository from "../repository";
import SignupUsecase from "../usecase/signup.usecase";
import Exception from "@/utils/exception/Exception";
import User from "../interfaces/user.interface";
import { BcryptAdapter } from "./cryptography/passwordEncryption";
import { JwtAdapter } from "./cryptography/jwtEncryption";
import GoogleAdapter from "./googleAdapter";
import SignupWithGoogleUsecase  from '../usecase/signin.google.usecase'
import {Signup} from "../interfaces/usecases/signup.google.interface";
import Email from "../../email";
import VerifyOTPUsecase from "../usecase/verifyOTP.usecase";

export default class UserBootstrap  {
    private SignupUsecase
    private GoogleAdapter
    private SignupWithGoogleUsecase
    private VerifyOTPUsecase
    constructor() {
        const userRepository = new UserRepository()
        const jwtAdapter = new JwtAdapter('process.env.JWT_SECRET', '80d')
        this.SignupUsecase = new SignupUsecase(new UserRepository(), new BcryptAdapter(12), jwtAdapter, new Email() )
        this.SignupWithGoogleUsecase = new SignupWithGoogleUsecase(new UserRepository(), jwtAdapter)
        this.VerifyOTPUsecase = new VerifyOTPUsecase(userRepository)
        this.GoogleAdapter = GoogleAdapter
    }

    public signup = async (data: User): Promise<string> => {
        try {
            const {first_name, last_name, email, password, role} = data
            const user = await this.SignupUsecase.execute((first_name as string), (last_name as string), email, (password as string), role)
            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public googleAuth = async(token: string, role: string): Promise<Signup.Response> => {
        try {
            const ticket = await this.GoogleAdapter.verify(token)
        if(!ticket) throw new Exception("there was an error signing in.", 400)
        const user = await this.SignupWithGoogleUsecase.execute((ticket.given_name as string), (ticket.family_name as string) , (ticket.email as string), ticket.sub, role)
        return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public verifyOTP = async (email: string, OTP: string) : Promise<string> => {
        try {
            const message = await this.VerifyOTPUsecase.execute(email, OTP)

            return message
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}