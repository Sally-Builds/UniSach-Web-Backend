export default interface RefreshToken {
    execute(refreshToken: string): Promise<RefreshTokenResponse.Response>
}

export namespace RefreshTokenResponse {
    export type Response = {accessToken: string, refreshToken: string}
}