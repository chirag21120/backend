const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
const cors = require('cors');

connectToMongo();
const app = express();
const port = process.env.PORT || 5000

app.use(express.static(path.resolve(__dirname,'build')))
app.use(cors());
app.use(express.json());
//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port,()=>{
    console.log(`listnening at http://localhost:${port}`);
})