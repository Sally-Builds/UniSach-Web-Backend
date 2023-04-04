import RefreshToken from '../../../../../resources/api/users/usecase/auth/refreshToken.usecase'
import UserRepositoryInterface from '../../../../../resources/api/users/interfaces/userRepo.interface'
import {JwtGen, JwtVer, JwtVerExpiredToken, dbUser} from '../../../__helpers__/stubs'
import User from '../../../../../resources/api/users/interfaces/user.interface'


const db: User = {
    ...dbUser()[0]
}

const UserRepositoryReturnsAValue: UserRepositoryInterface = {
    createUser: jest.fn(),
    findOne: jest.fn().mockReturnValue(Promise.resolve({...dbUser()[0], emailVerificationStatus: 'active'})),
    getUserByEmail: jest.fn(),
    findOneAndUpdate: jest.fn()
}

const UserRepositoryReturnsNull: UserRepositoryInterface = {
    createUser: jest.fn(),
    // findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    async findOne(data) {
        if((db as any).refreshToken[2] == data?.refreshToken){
            return  null
        }

        return db
    },
    getUserByEmail: jest.fn(),
    findOneAndUpdate: jest.fn()
}


describe('Refresh Token usecase', () => {
    const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsAValue, JwtVer, JwtGen) 
    

    it('should call findOne with the correct arguments', async () => {
        const findOneSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOne')
        await refreshTokenUsecase.execute('refreshToken')

        expect(findOneSpy).toHaveBeenCalledWith({refreshToken: 'refreshToken'})
    })

    it('should call jwtVerify', async () => {
        const jwtVerifySpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOne')
        await refreshTokenUsecase.execute('refreshToken')

        expect(jwtVerifySpy).toHaveBeenCalled()
    })

    describe('if no user was found', () => {
        it('should call the jwt verify method with the correct value', async () => {
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsNull, JwtVer, JwtGen)
            const jwtVerifySpy = jest.spyOn(JwtVer, 'verify')
            try {
            await refreshTokenUsecase.execute('refreshToken')

        } catch (error) {
                expect(jwtVerifySpy).toHaveBeenCalledTimes(1)
            }
        })

        it('should throw an Exception if jwt is an instance of JsonWebTokenError', async () => {
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsNull, JwtVerExpiredToken, JwtGen)
            try {
                await refreshTokenUsecase.execute('refreshToken')
            } catch (error:any) {
                expect(error).toMatchObject({message: 'forbidden', statusCode: 403})
            }
        })

        it('should call the findOne method if jwt is valid', async () => {
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsNull, JwtVer, JwtGen)
            const findOneSpy = jest.spyOn(UserRepositoryReturnsNull, 'findOne')
            try {
                await refreshTokenUsecase.execute('refreshToken')
            } catch (error) {
                expect(findOneSpy.mock.calls[1][0]).toMatchObject({_id: dbUser()[0].id})
            }
        })

        it('should call the findOneAndUpdate method if jwt is valid', async () => {
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsNull, JwtVer, JwtGen)
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsNull, 'findOneAndUpdate')
            try {
                await refreshTokenUsecase.execute('refreshToken')
            } catch (error) {
                expect(findOneAndUpdateSpy).toHaveBeenCalledWith({_id: dbUser()[0].id}, {refreshToken: []})
            }
        })
    })

    describe('if JwtVerify is Expired or JsonWebTokenError', () => {
        it('jwt verify should update the refresh token array', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsAValue, JwtVerExpiredToken, JwtGen)
            try {
                await refreshTokenUsecase.execute('refreshToken')
    
            } catch (error) {
                expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1)
            }
        })
    
        it('jwt verify should throw an Exception if expired', async () => {
            const refreshTokenUsecase = new RefreshToken(UserRepositoryReturnsAValue, JwtVerExpiredToken, JwtGen)
            
    
            await expect(refreshTokenUsecase.execute('refreshToken')).rejects.toMatchObject({message: 'forbidden', statusCode: 403})
        })
    })

    it('should call generateTokens with correct argument', async () => {
        const generateTokensSpy = jest.spyOn(refreshTokenUsecase, 'generateTokens')
        await refreshTokenUsecase.execute('refreshToken')

        expect(generateTokensSpy).toHaveBeenCalledWith(dbUser()[0].id)

    })

    it('should successfully sign the tokens', async () => {
        const jwtGenSpy = jest.spyOn(JwtGen, 'sign')
        await refreshTokenUsecase.execute('refreshToken')
        
        expect(jwtGenSpy).toBeCalledTimes(2)
    })

    it('jwt verify should update the refresh token array', async () => {
            const findOneAndUpdateSpy = jest.spyOn(UserRepositoryReturnsAValue, 'findOneAndUpdate')
            await refreshTokenUsecase.execute('refreshToken')

            expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1)
    })

    it('should return the correct object', async () => {
        const res = await refreshTokenUsecase.execute('refreshToken')

        expect(res).toEqual(expect.objectContaining({accessToken: expect.anything(), refreshToken: expect.anything()}))
    })

})