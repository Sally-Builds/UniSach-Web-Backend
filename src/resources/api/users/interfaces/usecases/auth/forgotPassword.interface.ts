

export default interface ForgotPassword {
    execute(email: string): Promise<string>
    linkGenerator(): linkArtifacts.Response
}

export namespace linkArtifacts {
    export type Response = {link: string, expiresIn: number, passwordResetTokenHash: string}
}