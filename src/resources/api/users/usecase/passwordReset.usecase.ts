import PasswordReset from "../interfaces/usecases/passwordReset.interface";
import crypto from 'crypto'
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import Exception from "@/utils/exception/Exception";

export default class PasswordResetUsecase implements PasswordReset {

    constructor(private readonly userRepo: UserRepositoryInterface) {}

    public async execute(passwordResetToken: string, password: string): Promise<string> {
        try {
            const hashedToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

            const user = await this.userRepo.findOne({passwordResetToken: hashedToken, passwordResetTokenExpiresIn: {$gt: Date.now()}})

            if(!user) throw new Exception('Token is invalid or has expired', 400);

            await this.userRepo.findOneAndUpdate({email: user.email}, {password})

            return 'Password reset successful'
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}