import {Router, Application, Request, Response, NextFunction } from "express";
import SignupBootstrap from "./bootstrap";
import Exception from "@/utils/exception/Exception";
import User from "./interfaces/user.interface";
import { Verified } from "./interfaces/usecases/auth/login.interface";
import authenticate from "@/middleware/authenticate.middleware";

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
        this.router.get('/auth/refreshtoken', this.refreshToken)
        this.router.get('/auth/logout', this.logout)
        this.router.get('/me', authenticate, this.getMe)
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
            const refreshToken = req.cookies.refreshToken || ''
            const data = await this.userService.login(req.body.email, req.body.password, refreshToken)

            if((data as Verified).accessToken) {
                res.cookie('refreshToken', (data as Verified).refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
                return res.status(200).json({
                    data: {
                        accessToken: (data as Verified).accessToken,
                        user: (data as Verified).user
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
            const refreshToken = req.cookies?.refreshToken || ''
            const data = await this.userService.verifyOTP(req.body.email, req.body.otp, refreshToken)

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

    private refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookies = req.cookies;
            if(!cookies?.refreshToken) return res.status(401).json({data: 'Unauthorized Access'});
            const token = cookies.refreshToken
            res.clearCookie('refreshToken', {httpOnly: true, })

            const message = await this.userService.refreshToken(token)
            res.cookie('refreshToken', message.refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

            res.status(200).json({
                accessToken: message.accessToken
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookies = req.cookies;
            if(!cookies?.refreshToken) res.clearCookie('refreshToken', {httpOnly: true, });
            const token = cookies.refreshToken

            const message = await this.userService.logout(token)
            res.clearCookie('refreshToken', {httpOnly: true, })

            res.sendStatus(204)
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json({
                data: req.user
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

}