export default interface Logout {
    execute(refreshToken: string): Promise<string>
}