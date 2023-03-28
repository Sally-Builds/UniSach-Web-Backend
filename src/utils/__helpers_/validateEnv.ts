import { cleanEnv, port, str, num } from 'envalid'


function validateEnv (): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        PORT: port({default: 3000}),
        DATABASE: str(),
        DATABASE_PASSWORD: str(),
        JWT_SECRET: str(),
        EMAIL_USERNAME: str(),
        EMAIL_PASSWORD: str(),
        EMAIL_HOST: str(),
        EMAIL_PORT: num(),
        NODEMAILER_EMAIL_PASSWORD: str(),
        CLIENT_ID: str(),
        CLIENT_SECRET: str(),
        ACCESS_TOKEN_SECRET: str(),
        REFRESH_TOKEN_SECRET: str()
    })
}

export default validateEnv