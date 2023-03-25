import {Router, Application, Request, Response, NextFunction } from "express";
import SignupBootstrap from "./bootstrap";
import Exception from "@/utils/exception/Exception";
import User from "./interfaces/user.interface";

export default class UserAPI {
    public router = Router();
    private userService = new SignupBootstrap()

    constructor(private readonly app: Application) {
        this.router.post('/signup', this.register)
        this.router.post('/signin/google', this.googleRegister)
        this.router.post('/auth/verifyotp', this.verifyOTP)
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

            res.status(201).json({
                data: data
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private verifyOTP =async (req:Request, res: Response, next: NextFunction) => {
        try {
            const message = await this.userService.verifyOTP(req.body.email, req.body.otp)

            res.status(200).json({
                data: message
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

}