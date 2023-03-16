import UserRepository from "../repository";
import SignupUsecase from "../usecase/signup.usecase";
import { Signup } from "../interfaces/usecases/signup.usecase";
import Exception from "@/utils/exception/Exception";
import User from "../interfaces/user.interface";
import { BcryptAdapter } from "./passwordEncryption";

export default class UserBootstrap  {
    private SignupUsecase
    constructor() {
        this.SignupUsecase = new SignupUsecase(new UserRepository(), new BcryptAdapter(12))
    }

    public signup = async (data: User): Promise<Signup.Response> => {
        try {
            const {first_name, last_name, email, password, role} = data
            const user = await this.SignupUsecase.execute(first_name, last_name, email, password, role)
            return user
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}