export default interface RefreshToken {
    execute(refreshToken: string): Promise<RefreshTokenResponse.Response>
    generateTokens(id: string): Promise<GenerateToken.Response>
}

export namespace RefreshTokenResponse {
    export type Response = {accessToken: string, refreshToken: string}
}

export namespace GenerateToken {
    export type Response = {accessToken: string, newRefreshToken: string}
}