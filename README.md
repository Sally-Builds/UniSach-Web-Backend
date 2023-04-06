# UniSach(No stress)
Unisach backend development code 
* [API link](https://unisach-dev.onrender.com/)
* [Postman docs link](https://www.postman.com/devstrike/workspace/unisach-public/overview)

[![CI](https://github.com/Devstrike-DigTech/UniSach-Web-Backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Devstrike-DigTech/UniSach-Web-Backend/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/Devstrike-DigTech/UniSach-Web-Backend/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/Devstrike-DigTechs/UniSach-Web-Backend?branch=main)



# Documentation
* [Authentication](#authentication)
* [user](#user)
#

*   ### Authentication
    This are the following routes used for the authentication process for the API
    *   [Signup (local strategy)](#signup)
    *   [VerifyOTP](#verify-otp)
    *   [ResendOTP](#resend-otp)
    *   [Login/Signup with google](#signup-or-login-with-google)
    *   [Login (local strategy)](#login)
    *   [Refresh Token](#refresh-token)
    *   [Logout](#logout)
    *   [ForgotPassword](#forgot-password)
    *   [ResetPassword](#reset-password) 

    #


    ### Signup
    * Route - 
        ```
            POST - /api/users/auth/signup
        ```
    * Request
        ```json
        {
            "first_name": "John",
            "last_name": "Doe",
            "password": "test1234",
            "email": "johndoe@gmail.com",
            "phone": "+234123456789",
            "role": "Pharmacist | User",
        }
        ```

    * Response
        ```javascript
            status: 200
        ```
        ```json
        {
            "data": "Verify your email to get started."
        }
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Email already exist"
            }
        ```

    ### Verify OTP
    * Route
        ```
        POST - /api/users/auth/verifyotp
        ```
    * Request
        ```json
        {
            "email": "johndoe@gmail.com", 
            "otp": "E7X1TO"
        }

        ```
    * Response
        ```javascript
            status: 200
        ```
        ```json
            {
                "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjNlYmI5ODkwY2ZmZWMzODQ3MjI3OCIsImlhdCI6MTY4MDA4MzA5NiwiZXhwIjoxNjgwMDgzMTI2fQ.ZcaWreigp2Wj1s-OwNtAJV3ZU2LlYUZ0hKwKvPJvgc8",
                    "user": {
                        "_id": "6423ebb9890cffec38472278",
                        "first_name": "John",
                        "last_name": "Doe",
                        "name": "John Doe",
                        "email": "johndoe@gmail.com",
                        "role": "Pharmacist",
                        "emailVerificationStatus": "active",
                        "active": true,
                        "__v": 0
                    }
                }
            }
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Wrong OTP or Expired OTP"
            }
        ```
    
    ### Resend OTP
    * Route
        ```
        GET - /api/users/auth/resendotp/:email
        ```
    * RESPONSE
        ```javascript
            status: 200
        ```
        ```json
            {
                "data": "Verification code sent to email."
            }
        ```
        #
        ```javascript
            status: 404
        ```
        ```json
            {
                "data": "Email not found"
            }
        ```
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Email already verified"
            }
        ```

    ### Signup or Login with google
    * Route
        ```
        POST - /api/users/auth/signin/google
        ```

    * Request
        ```json
        {
            "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhYWU4ZDdjOTIwNThiNWVlQ",
            "role": " Pharmacist | User"
        }

        ```
    * Response
        ```javascript
            status: 200
        ```
        ```json
            {
                "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjNlYmI5ODkwY2ZmZWMzODQ3MjI3OCIsImlhdCI6MTY4MDA4MzA5NiwiZXhwIjoxNjgwMDgzMTI2fQ.ZcaWreigp2Wj1s-OwNtAJV3ZU2LlYUZ0hKwKvPJvgc8",
                    "user": {
                        "_id": "6423ebb9890cffec38472278",
                        "first_name": "John",
                        "last_name": "Doe",
                        "name": "John Doe",
                        "googleID": "107656169386193608245",
                        "email": "johndoe@gmail.com",
                        "role": "Pharmacist",
                        "emailVerificationStatus": "active",
                        "active": true,
                        "__v": 0
                    }
                }
            }
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Invalid token"
            }
        ```


    * **Description** <br>
        For the request data we see that the role is also included, this is because this route performs two(2) functions:
        * Signup user if user does'nt exist. This requires the role of the authenticating user.
        * login user if user already exist. Any role will do in this case.

    ### Login
    * Route
        ```
        POST - /api/users/auth/login
        ```
    * Request
        ```json
            {
                "email": "johndoe@yahoo.com",
                "password": "test1234"
            }
        ```
    * Response 
        ```javascript
            status: 200
        ```
        ```json
            {
                "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjNlYmI5ODkwY2ZmZWMzODQ3MjI3OCIsImlhdCI6MTY4MDA4MzA5NiwiZXhwIjoxNjgwMDgzMTI2fQ.ZcaWreigp2Wj1s-OwNtAJV3ZU2LlYUZ0hKwKvPJvgc8",
                    "user": {
                        "_id": "6423ebb9890cffec38472278",
                        "first_name": "John",
                        "last_name": "Doe",
                        "name": "John Doe",
                        "email": "johndoe@gmail.com",
                        "role": "Pharmacist",
                        "emailVerificationStatus": "active",
                        "active": true,
                        "__v": 0
                    }
                }
            }        
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Email or Password is incorrect"
            }
        ```

    ### Refresh Token
    * **Description** <br>
        This route is responsible for refreshing the accessToken.
        It is advised to use interceptors to look out for status code ```401``` and then calling this route to be issued a new access token to gain access to authenticated resources.
    * Route
        ```
        GET - /api/users/auth/refreshtoken
        ```
    * Response
         ```javascript
            status: 200
        ```
        ```json
            {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjNlYmI5ODkwY2ZmZWMzODQ3MjI3OCIsImlhdCI6MTY4MDA4MzA5NiwiZXhwIjoxNjgwMDgzMTI2fQ.ZcaWreigp2Wj1s-OwNtAJV3ZU2LlYUZ0hKwKvPJvgc8",
            }
        ```
        #
        ```javascript
            status: 403
        ```
        ```json
            {
                "data": "forbidden"
            }
        ```

    ### Logout
    * Route
        ```
        GET - /api/users/auth/refreshtoken
        ```
    * Response
        ```javascript
           status code - 204 No Content  
        ```


    ### Forgot Password
    * Route
        ```
        POST - /api/users/auth/forgotpassword
        ```
    * Request
        ```json
            {
                "email": "uzoagulujoshua@gmail.com"
            }
        ```
    * Response 
         ```javascript
            status: 200
        ```
        ```json
            {
                "data": "Check your email"
            }
        ```
        #
        ```javascript
            status: 404
        ```
        ```json
            {
                "data": "No user with this email"
            }
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Not a valid operation for this user"
            }
        ```

    
    ### Reset Password
    * Route
        ```
        POST - /api/users/auth/passwordreset/:resetToken
        ```
    * Request
        ```json
            {
                "password": "test1234"
            }
        ```
    * Response
         ```javascript
            status: 200
        ```
        ```json
            {
                "data": "Password reset successful"
            }
        ```
        #
        ```javascript
            status: 400
        ```
        ```json
            {
                "data": "Token is invalid or has expired"
            }
        ```

* ### User
    This are the following routes used for user CRUD
    * [Get me](#getme)
    * [Update me](#update-user)
    * [Update Password](#update-password)

    #

    ### Get Me
    * Route
    ```javascript
        GET - "/api/users/me"

        const config = {
            headers: { Authorization: "Bearer " + `${accessToken}` }
        };
    ```
    * Response
        ```javascript
            status: 200
        ```
        ```json
            "data": {
                    "_id": "6423ebb9890cffec38472278",
                    "first_name": "John",
                    "last_name": "Doe",
                    "name": "John Doe",
                    "email": "johndoe@gmail.com",
                    "role": "Pharmacist",
                    "emailVerificationStatus": "active",
                    "active": true,
                    "__v": 0
                }
        ```
    #
    ```javascript
        status: 401
    ```
    ```json
        {
            "statusCode": 401,
            "message": "Unauthorized access"
        }
    ```

    ### update User
    * Route
    ```javascript
        PATCH - "/api/users/me"
    ```
    * Request<br>
    The "?" in the keys means that the fields are not required
    ```json
        {
            "first_name?": "Javier",
            "last_name?": "Rodriguez",
            "phone?": "+23489019393"
        }
    ```
    * Response
    ```javascript
        status: 200
    ```
    ```json
        "data": {
                    "_id": "6423ebb9890cffec38472278",
                    "first_name": "Javier",
                    "last_name": "Rodriguez",
                    "name": "Javier Rodriguez",
                    "email": "johndoe@gmail.com",
                    "role": "Pharmacist",
                    "emailVerificationStatus": "active",
                    "active": true,
                    "__v": 0
                }
    ```
    ```javascript
        status: 404
    ```
    ```json
        "data": {
                    "message": "user not found",
                    "statusCode": 404
                }
    ```
    
    ### Update Password
    * Route
    ```javascript
        PATCH - "/api/users/updatepassword"
    ```
    * Request
    ```json
        {
            "password": "currentPassword",
            "newPassword": "newPassword"
        }
    ```
    * Response
    ```js
        status: 200
    ```
    ```json
        {
            "data": "successful"
        }
    ```
    ```js
        {
        statusCode: 401
        message: "current password incorrect" // if current password is incorrect
        }
    ```
    ```js
        {
        statusCode: 400
        message: "Password must be greater than 8 characters"
        }
    ```


    