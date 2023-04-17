import {Router, Application, Request, Response, NextFunction } from "express";
import Exception from "@/utils/exception/Exception";
import authenticate from "@/middleware/authenticate.middleware";
import PharmacyBootstrap from "./bootstrap";
import validation from "./validation";
import validationMiddleware from "@/middleware/validation.middleware";

export default class PharmacyAPI {
    public router = Router();
    private pharmacyService = new PharmacyBootstrap()

    constructor(private readonly app: Application) {
        this.router.post('/', authenticate, validationMiddleware(validation.create), this.create)
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user
            req.body.userId = user.id as string
            const result = await this.pharmacyService.createPharmacy(req.body)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }
}