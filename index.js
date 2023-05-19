import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
import fileUpload from 'express-fileupload' 

import products from './routes.js'

dotenv.config() 

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/templates'));
app.use(express.static(__dirname + '/images'));

app.use(fileUpload({

    useTempFiles: true,
    tempFileDir: './uploads'

}))
app.use(bodyParser.json())

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/templates/index.html')
})

app.use('/', products)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Port listening on ${PORT}`)
}) 