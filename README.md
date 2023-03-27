# UniSach(No stress)
Unisach backend development code

[![CI](https://github.com/Devstrike-DigTech/UniSach-Web-Backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Devstrike-DigTech/UniSach-Web-Backend/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/Devstrike-DigTech/UniSach-Web-Backend/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/Devstrike-DigTechs/UniSach-Web-Backend?branch=main)



# Documentation
*   ### Authentication
    This are the following routes used for the authentication process for the API
    *   Signup (local strategy)
    *   Login/Signup with google
    *   Login (local strategy)
    *   Logout
    *   VerifyOTP
    *   ResentOTP
    *   ForgotPassword
    *   ResetPassword

        ### Signup
        * Route - 
            ```
                /api/users/auth/signup
            ```
        * Request
            ```json
            {
                "first_name": "John",
                "last_name": "Doe",
                "password": "test1234",
                "email": "johndoe@gmail.com",
                "role": "Pharmacist | User",
            }
            ```
        * Response
            ```json
            {
                "data": "Check you email"
            }
            ```
