import express, {Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';



class App {
    public PORT;
    public app: Application;

    constructor(port: number) {
        this.PORT = port;
        this.app = express()
        this.initializeMiddleware()
        this.initializeRoutes()
    }

    //middlewares
    private initializeMiddleware () {
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    //routes
    private initializeRoutes () {
        this.app.get('/', (req, res, next) => {
            res.send('hello world')
        })
    }

    //db connection

    //spin up server
    public start() {
        this.app.listen(this.PORT, () => {
            console.log(`Application started on port ${this.PORT}`)
        })
    }
}

export default App