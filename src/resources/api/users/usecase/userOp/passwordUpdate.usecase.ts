import Exception from "@/utils/exception/Exception";
import PasswordUpdateInterface from "../../interfaces/usecases/userOp/passwordUpdate.interface";
import PasswordEncryption from "@/utils/cryptography/interface/cryptography/passwordEncryption";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";

export default class PasswordUpdateUsecase implements PasswordUpdateInterface {
    constructor(private readonly UserRepo: UserRepositoryInterface, private readonly PasswordEncrypt: PasswordEncryption) {}
    
    async execute(id: string, password: string, newPassword: string): Promise<string> {
        try {
            if(password.length < 8) throw new Exception('current password incorrect', 400)
            if(newPassword.length < 8) throw new Exception('Password must be greater than 8 characters', 400)

            const user = await this.UserRepo.findOne({_id: id})
            if(!user) throw new Exception("current password incorrect", 401)

            const isCorrectPassword = await this.PasswordEncrypt.verify((user.password as string), password)
            if(!isCorrectPassword) throw new Exception("current password incorrect", 401)

            const hashNewPassword = await this.PasswordEncrypt.hash(newPassword)

            const updatePassword = await this.UserRepo.findOneAndUpdate({_id: id}, {password: hashNewPassword})
            if(!updatePassword) throw new Exception('Incorrect password', 400)
            
            return 'successful'
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}