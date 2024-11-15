import express from 'express'
import dotenv from 'dotenv'
import db from './config/dbConnect.js'
import userRoutes from './routes/userRoutes.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs';
import cookieParser from 'cookie-parser'
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf8'));

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;
db(DB_URL)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", userRoutes);


app.listen(PORT,()=>{
    console.log(`App is listening at port : ${PORT}`);
})
