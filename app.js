import express from 'express';
import db from './mongodb/db.js';
import config from 'config-lite';
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';
import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';
import history from 'connect-history-api-fallback';
import Statistic from './middlewares/statistic'
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.1',
        description: 'Demonstrating how to desribe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
};
// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(Statistic.apiRecord)
const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
        url: config.url
    })
}))

// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/success.log'
//         })
//     ]
// }));

router(app);

// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/error.log'
//         })
//     ]
// }));

app.use(history());
app.use(express.static('./public'));
app.listen(config.port);