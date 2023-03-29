import User from '@/resources/api/users/interfaces/user.interface'

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}
