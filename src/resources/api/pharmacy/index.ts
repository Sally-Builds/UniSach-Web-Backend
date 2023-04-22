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
        this.router.patch('/:id', authenticate, validationMiddleware(validation.update), this.update)
        this.router.get('/', authenticate, this.getAllPharmacy)

        this.router.get('/me', authenticate, this.getMyPharmacy)
        this.router.get('/:id', authenticate, this.getPharmacy)
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

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.pharmacyService.updatePharmacy({_id: req.params.id}, (req.user.id as string), req.body)

            res.status(200).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private getMyPharmacy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.pharmacyService.getPharmacy({userId: req.user.id})

            res.status(200).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private getPharmacy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.pharmacyService.getPharmacy({_id: req.params.id})

            res.status(200).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private getAllPharmacy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query || {}
            console.log(query)
            const result = await this.pharmacyService.getAllPharmacy(query)

            res.status(200).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }
}