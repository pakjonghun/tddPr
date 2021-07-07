const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const app = express();


mongoose.connect('mongodb+srv://fireking5997:Wjdgns001&@freeforever.yuoyg.mongodb.net/mySecondDB?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology: true 
}).then(()=>console.log('db is working')).catch(e=>console.log(e))


const PORT = 8080;


//body-parser 가 바뀌었다.
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/product',routes)


app.use((error,req,res,next)=>{
    res.status(500).json({message:'error is occured'})
})

app.listen(PORT,()=>console.log(`server is runnin on ${PORT}`));
module.exports = app;