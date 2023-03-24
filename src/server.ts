import path from "path";
import 'dotenv/config';
import 'module-alias/register';
import validateEnv from "./utils/__helpers_/validateEnv";

validateEnv()


import App from ".";


new App(Number(process.env.PORT)).start()