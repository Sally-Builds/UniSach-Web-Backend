import {Router, Application, Request, Response, NextFunction } from "express";
import Exception from "@/utils/exception/Exception";
import authenticate from "@/middleware/authenticate.middleware";
import DrugBootstrap from "./bootstrap";
import validation from "./validation";
import validationMiddleware from "@/middleware/validation.middleware";

export default class PharmacyAPI {
    public router = Router();
    private pharmacyService = new DrugBootstrap()

    constructor(private readonly app: Application) {
        this.router.post('/', authenticate, validationMiddleware(validation.create), this.create)
        this.router.get('/', authenticate, this.find)
        this.router.get('/:id', authenticate, this.findOne)
        this.router.patch('/', authenticate,validationMiddleware(validation.update), this.update)
        this.router.delete('/', authenticate, validationMiddleware(validation.del), this.delete)

    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user
            const result = await this.pharmacyService.createDrug((user.id as string), req.body.drugs)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private find = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query || {}
            const result = await this.pharmacyService.findDrugs(query)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }

    private findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.pharmacyService.findDrugs(req.params.id)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }


    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            const user = req.user
            const result = await this.pharmacyService.updateDrugs((user.id as string), req.body.drugs)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }
    
    private delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user
            const result = await this.pharmacyService.deleteDrugs((user.id as string), req.body.drugs)

            res.status(201).json({
                data: result
            })
        } catch (error:any) {
            next(new Exception(error.message, error.statusCode))
        }
    }
}