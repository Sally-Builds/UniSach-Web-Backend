export default interface PasswordUpdateInterface {
    execute(id: string, password: string, newPassword: string): Promise<string>
}