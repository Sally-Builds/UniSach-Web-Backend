import Exception from "@/utils/exception/Exception";


export default interface VerifyOTP {
    execute(email: string, OTP: string): Promise<string>
}