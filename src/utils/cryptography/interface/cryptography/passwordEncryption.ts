export default interface PasswordEncryption{
    hash(password:string): Promise<string>
    verify(password:string, userPassword: string): Promise<boolean>

}