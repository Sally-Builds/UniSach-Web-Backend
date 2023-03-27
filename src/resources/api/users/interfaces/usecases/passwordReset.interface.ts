export default interface PasswordReset {
    execute(passwordResetToken: string, password: string): Promise<string>
}
