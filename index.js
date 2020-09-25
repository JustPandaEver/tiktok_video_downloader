const express = require('express');
const bodyParser = require('body-parser');
const tiktok=require('tiktok-scraper')

const app = express();

const PORT = process.env.PORT || 5000;

// use body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.post('/metadata', async (req, res,next)=>{
	try{
        const url=req.body.url
        const videoMeta = await tiktok.getVideoMeta(url);
        res.send(videoMeta);
                
	}catch(e){
		next(e)
	}
  
});



/////error handling route
app.use((req,res,next)=>{
    const error=new Error(`Not found -${req.originalUrl}`)
    res.status(404)
    next(error)
})
app.use((error,req,res,next)=>{
    res.send({
        error:error.message
    })
})


app.listen(PORT, () => console.log('Server Listening on port ' + PORT));