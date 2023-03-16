import express, {Application} from 'express';
import { connect, ConnectOptions } from 'mongoose'
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import UserAPI from './resources/api/users';
import errorMiddleware from './middleware/error.middleware';



class App {
    public PORT;
    public app: Application;

    constructor(port: number) {
        this.PORT = port;
        this.app = express()
        this.initializeDB()
        this.initializeMiddleware()
        this.initializeRoutes()
        this.app.use(errorMiddleware)
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
        this.app.use('/api/users', new UserAPI(this.app).router)
    }

    //db connection
    private initializeDB () {
        type ConnectionOptionsExtend = {
          useNewUrlParser: boolean
          useUnifiedTopology: boolean
        }
        const connectionOptions:ConnectOptions & ConnectionOptionsExtend = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
        let url = `${process.env.DATABASE}`
        connect(url, connectionOptions).then(() => {
          console.log('Database Connected Successfully')
        })
      }

    //spin up server
    public start() {
        this.app.listen(this.PORT, () => {
            console.log(`Application started on port ${this.PORT}`)
        })
    }
}

export default App