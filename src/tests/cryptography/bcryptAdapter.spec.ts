import {BcryptAdapter} from '../../utils/cryptography/passwordEncryption'


describe("Bcrypt Adapter", () => {
    const encrypt = new BcryptAdapter(12)
    const password = 'test1234'
    it('should encrypt password', async () => {
        const encryptedPassword = await encrypt.hash(password);

        expect(encryptedPassword).not.toEqual(password)
    })

    it('should verify the password is correct', async () => {
        const encryptedPassword = await encrypt.hash(password);
        const isCorrect = await encrypt.verify(encryptedPassword, 'test1234')

        expect(isCorrect).toEqual(true)
    })

    it('should verify the password is incorrect', async () => {
        const encryptedPassword = await encrypt.hash(password);
        const isCorrect = await encrypt.verify(encryptedPassword, 'test12345')

        expect(isCorrect).toEqual(false)
    })
})