import path from "path";
import dotenv from "dotenv";
import 'module-alias/register';

const envPath = path.resolve(__dirname, '..', 'config.env');
dotenv.config({ path: envPath });


import App from ".";


new App(8000).start()