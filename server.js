const express = require('express');
const cors = require('cors');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
require('dotenv').config();


const PORT = process.env.PORT || 5000;
const db = monk(process.env.MONGODB_URI);
db.then(()=>{
    console.log("db connected");
})
const urls = db.get('urls');
urls.createIndex({slug:1},{unique:true});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./public'))

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/\w/i),
    url: yup.string().trim().url().required()
})


app.get('/:id',async (req,res)=>{
    const {id:slug} = req.params;
    try {
        const url = await urls.findOne({slug});
        console.log(url);
        if(url){
            res.redirect(url.url);
        }
        res.redirect(`/?error=${slug} not found`)
    } catch (error) {
        res.redirect(`/?error=link not found`)
    }
    

})

app.post('/url',async (req,res,next)=>{
    let {slug , url} = req.body;
    try {
        await schema.validate({
            slug,
            url
        })
        if(!slug){
            slug = nanoid(5);
        }
        slug = slug.toLowerCase();
        const newUrl = {
            slug,
            url
        }
        const created = await urls.insert(newUrl);
        res.json(created);
    } catch (error) {
        next(error)
    }
})

app.use((error,req,res,next)=>{
    if(error.status){
        res.status(error.status);
    }else{
        res.status(500);
    }
    if(error.message.startsWith("E11000")){
        error.message = "Slug in use";
    }
    res.json({
        message:error.message,
        stack:error.stack,
    })
})

app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`);
})