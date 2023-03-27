export default interface User {
    first_name?: string,
    last_name?: string,
    name: string,
    googleID?: string,
    phone?: string,
    email: string,
    active?: boolean,
    confirmationCodeExpiresIn?:  number,
    verificationCode?: string,
    emailVerificationStatus?: String
    password?: string,
    passwordResetToken?: string,
    passwordResetTokenExpiresIn?: number,
    role: string,
}

enum Role {
    'User' = 'User',
    'Pharmacist' = 'Pharmacist'
}

export {Role}