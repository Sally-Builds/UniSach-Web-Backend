import {Router, Application, Request, Response, NextFunction } from "express";
import SignupBootstrap from "./bootstrap";
import Exception from "@/utils/exception/Exception";
import User from "./interfaces/user.interface";

export default class UserAPI {
    public router = Router();
    private userService = new SignupBootstrap()

    constructor(private readonly app: Application) {
        this.router.post('/', this.create)
    }

    private create  = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.userService.signup(req.body as User)

            res.status(201).json({
                data: data
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }
}