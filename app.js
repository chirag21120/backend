const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());
//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port,()=>{
    console.log(`listnening at http://localhost:${port}`);
})