import {JwtAdapter} from '../../utils/cryptography/jwtEncryption'
import Token from '../../utils/cryptography/interface/cryptography/jsonwebtoken/token'
import { JsonWebTokenError } from 'jsonwebtoken'
import Exception from '../../utils/exception/Exception'

describe('Test JWT Adapter', () => {
    const jwtAdapter = new JwtAdapter()
    const secret = 'secret'
    const expiresIn = '2s'
    const id = '1'
    it('should generate a token', async () => {
        const token = await jwtAdapter.sign(id, secret, expiresIn);

        expect(typeof token).toBe('string')
    })

    it('should verify a token correctly', async () => {
        const token = await jwtAdapter.sign(id, secret, expiresIn);
        const decoded = await jwtAdapter.verify(token, secret)
        expect((decoded as Token).id).toBe('1')

    })

    it('should throw an Exception for expired tokens', async () => {
        const token = await jwtAdapter.sign(id, secret, expiresIn);
        
        const delay = (ms: number) => {
            const startPoint = new Date().getTime()
            while (new Date().getTime() - startPoint <= ms) {/* wait */}
        }

        delay(3000)
        
        await expect(async () => {await jwtAdapter.verify(token, secret)}).rejects.toThrow(JsonWebTokenError)
    })
})