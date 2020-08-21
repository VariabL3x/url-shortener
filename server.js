const express = require('express');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./public'))


// app.get('/',(req,res)=>{
//     res.json({
//         message:'Shorten your url'
//     })
// })


app.get('/:id',(req,res)=>{
    const {id} = req.params;
})

app.post('/url',(req,res)=>{

})


app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`);
})