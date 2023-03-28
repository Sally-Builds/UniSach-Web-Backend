import {Router, Application, Request, Response, NextFunction } from "express";
import SignupBootstrap from "./bootstrap";
import Exception from "@/utils/exception/Exception";
import User from "./interfaces/user.interface";

export default class UserAPI {
    public router = Router();
    private userService = new SignupBootstrap()

    constructor(private readonly app: Application) {
        this.router.post('/auth/signup', this.register)
        this.router.post('/auth/login', this.login)
        this.router.post('/auth/signin/google', this.googleRegister)
        this.router.post('/auth/verifyotp', this.verifyOTP)
        this.router.get('/auth/resendotp', this.resendOTP)
        this.router.post('/auth/forgotpassword', this.forgotPassword)
        this.router.post('/auth/passwordreset/:token', this.passwordReset)
    }

    private register  = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.userService.signup(req.body as User)

            res.status(201).json({
                data: data
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private googleRegister  = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.userService.googleAuth(req.body.token as string, req.body.role)
            res.cookie('refreshToken', data.refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

            res.status(200).json({
                data: {
                    accessToken: data.accessToken,
                    user: data.user
                }
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.userService.login(req.body.email, req.body.password)

            if((data as any).accessToken) {
                res.cookie('refreshToken', (data as any).refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
                return res.status(200).json({
                    data: {
                        accessToken: (data as any).accessToken,
                        user: (data as any).user
                    }
                })
            }

            res.status(200).json({
                data
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private verifyOTP = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.userService.verifyOTP(req.body.email, req.body.otp)

            res.cookie('refreshToken', data.refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

            res.status(200).json({
                data: {
                    accessToken: data.accessToken,
                    user: data.user
                }
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private resendOTP = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const message = await this.userService.resendOTP(req.body.email)

            res.status(200).json({
                data: message
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const message = await this.userService.forgotPassword(req.body.email)

            res.status(200).json({
                data: message
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private passwordReset = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const message = await this.userService.passwordReset(req.params.token, req.body.password)

            res.status(200).json({
                data: message
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

}