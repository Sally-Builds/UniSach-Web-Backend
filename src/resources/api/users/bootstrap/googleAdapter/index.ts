import Exception from '@/utils/exception/Exception'
import {OAuth2Client, TokenPayload} from 'google-auth-library'


class GoogleAdapter {
    public static readonly client = new OAuth2Client(process.env.CLIENT_ID)
    public static async verify(token: string): Promise<TokenPayload | undefined> {
        try {
            const ticket =  await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID,
            })
            const payload = ticket.getPayload()
    
            return payload
        } catch (error:any) {
            throw new Exception('Invalid token', 400)
        }
    }
}


export default GoogleAdapter