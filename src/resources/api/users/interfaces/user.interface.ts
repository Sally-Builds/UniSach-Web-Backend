export default interface User {
    first_name: string,
    last_name: string,
    phone?: string,
    email: string,
    active?: boolean,
    confirmationStatus?: boolean
    password: string,
    role: string,
}

enum Role {
    'User' = 'User',
    'Pharmacist' = 'Pharmacist'
}

export {Role}