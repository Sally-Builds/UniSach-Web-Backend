export interface JwtGenerate {
    sign(id: string, jwtSecret: string, jwtExpiresIn: string): Promise<string>
}