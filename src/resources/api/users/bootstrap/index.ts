import UserRepository from "../repository";
import SignupUsecase from "../usecase/auth/signup.usecase";
import Exception from "@/utils/exception/Exception";
import User from "../interfaces/user.interface";
import { BcryptAdapter } from "../../../../utils/cryptography/passwordEncryption";
import { JwtAdapter } from "../../../../utils/cryptography/jwtEncryption";
import GoogleAdapter from "./googleAdapter";
import SignupWithGoogleUsecase  from '../usecase/auth/signin.google.usecase'
import {Signup} from "../interfaces/usecases/auth/signup.google.interface";
import Email from "../../email";
import VerifyOTPUsecase from "../usecase/auth/verifyOTP.usecase";
import ResendOTPUsecase from "../usecase/auth/resendOTP.usecase";
import ForgotPasswordUsecase from "../usecase/auth/forgotPassword.usecase";
import PasswordResetUsecase from "../usecase/auth/passwordReset.usecase";
import LoginUsecase from "../usecase/auth/login.usecase";
import { VerifyOTP } from "../interfaces/usecases/auth/verifyOTP.interface";
import { Login } from "../interfaces/usecases/auth/login.interface";
import RefreshTokenUsecase from "../usecase/auth/refreshToken.usecase";
import {RefreshTokenResponse} from "../interfaces/usecases/auth/refreshToken.interface";
import LogoutUsecase from "../usecase/auth/logout.usecase";
import UpdateUsecase  from "../usecase/userOp/update.usecase";
import { Update } from "../interfaces/usecases/userOp/update.interface";
import PasswordUpdateUsecase from "../usecase/userOp/passwordUpdate.usecase";

export default class UserBootstrap  {
    private SignupUsecase;
    private GoogleAdapter;
    private SignupWithGoogleUsecase;
    private VerifyOTPUsecase;
    private ResendOTPUsecase;
    private ForgotPasswordUsecase;
    private PasswordResetUsecase;
    private LoginUsecase;
    private RefreshTokenUsecase;
    private LogoutUsecase;

    private UpdateUsecase;
    private PasswordUpdateUsecase;

    constructor() {
        const userRepository = new UserRepository()
        const email = new Email()
        const jwtAdapter = new JwtAdapter()
        const bcryptAdapter = new BcryptAdapter(12)
        this.SignupUsecase = new SignupUsecase(userRepository, bcryptAdapter, email )
        this.SignupWithGoogleUsecase = new SignupWithGoogleUsecase(userRepository, jwtAdapter, email)
        this.VerifyOTPUsecase = new VerifyOTPUsecase(userRepository, jwtAdapter,email)
        this.ResendOTPUsecase = new ResendOTPUsecase(userRepository, email)
        this.ForgotPasswordUsecase = new ForgotPasswordUsecase(userRepository, email)
        this.PasswordResetUsecase = new PasswordResetUsecase(userRepository, bcryptAdapter)
        this.LoginUsecase = new LoginUsecase(userRepository, jwtAdapter, bcryptAdapter, this.ResendOTPUsecase)
        this.RefreshTokenUsecase = new RefreshTokenUsecase(userRepository, jwtAdapter, jwtAdapter)
        this.LogoutUsecase = new LogoutUsecase(userRepository)
        this.UpdateUsecase = new UpdateUsecase(userRepository)
        this.PasswordUpdateUsecase = new PasswordUpdateUsecase(userRepository, bcryptAdapter)
        this.GoogleAdapter = GoogleAdapter
    }

    public signup = async (data: User): Promise<string> => {
        try {
            const {first_name, last_name, email, password, phone, role} = data
            const user = await this.SignupUsecase.execute((first_name as string), (last_name as string), email, (password as string), (phone as string), role)
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

    public login = async (email: string, password: string, refreshToken: string): Promise<Login.Response> => {
        try {
            const data = await this.LoginUsecase.execute(email, password, refreshToken);

            return data;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public verifyOTP = async (email: string, OTP: string, refreshToken: string) : Promise<VerifyOTP.Response> => {
        try {
            const data = await this.VerifyOTPUsecase.execute(email, OTP, refreshToken)

            return data
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public resendOTP = async (email: string) : Promise<string> => {
        try {
            const message = await this.ResendOTPUsecase.execute(email)

            return message
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public forgotPassword = async (email: string): Promise<string> => {
        try {
            const message = await this.ForgotPasswordUsecase.execute(email);

            return message;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public passwordReset = async (token: string, password: string): Promise<string> => {
        try {
            const message = await this.PasswordResetUsecase.execute(token, password);

            return message;
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public refreshToken = async(refreshToken: string): Promise<RefreshTokenResponse.Response> => {
        try {
            const tokens = await this.RefreshTokenUsecase.execute(refreshToken)

            return tokens
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public logout = async (refreshToken: string): Promise<string> => {
        try {
            const status = this.LogoutUsecase.execute(refreshToken);

            return status
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public update = async (data: Update.Request, id: string): Promise<User> => {
        try {
            const result = await this.UpdateUsecase.execute(data, id)

            return result
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    public passwordUpdate = async (id: string, password: string, newPassword: string): Promise<string> => {
        try {
            const message = await this.PasswordUpdateUsecase.execute(id, password, newPassword) 

            return message
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}