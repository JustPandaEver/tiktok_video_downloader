const express = require('express');
const bodyParser = require('body-parser');
const tiktok=require('tiktok-scraper')
const request = require('request');
const app = express();

const PORT = process.env.PORT || 5000;

// use body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

const getMetaData=async (req,res,next)=>{
    try{
        const videoMetadata = await tiktok.getVideoMeta(req.params[0]);
        const newUrl=`https://www.tiktok.com/@${videoMetadata.authorMeta.name}/video/${videoMetadata.id}`
        req.newUrl=newUrl
        next()
                
	}catch(e){
		next(e)
	}
}
const getId=async(req, res, next)=>{
    try{

   
        const fecth=`https://tiktok.codespikex.com/api/v1/fetch?url=${req.newUrl}?lang=en`

        request({url:fecth,headers: {
            'TOKEN': '715f22af-c70b-4850-9598-d27aa625f835'
        },json : true 
        },(error,res,body)=>{ 
            if(error){
                throw new Error('not connected')
            }else if(body.error){
                throw new Error('no result found')
            }else{
               
                req.video_id=body.video_id

            }
            next();
        })
        
    }catch(e){
        next(e)
    }
	
	
}
const getVideo= async(req, res,next)=>{
    try{
        const fecth='https://tiktok.codespikex.com/api/v1/fetch-videos/'+req.video_id+'?lang=en'
        request.post({url:fecth,headers: {
            'TOKEN': '715f22af-c70b-4850-9598-d27aa625f835'
        },json : true },(error,res,body)=>{ 
            if(error){
                throw new Error('not connected')
            }else if(body.error){
                throw new Error('no result found')
            }else{
                
            }
            next();
        })
    }catch(e){
        next(e);
    }
	
}
const finalCallBack=function (req, res) {
	try{
				
        const url=`https://tiktok.codespikex.com/download?id=${req.video_id}&type=video&nwm=true`;
        res.send({
            video_url:url,
        });
		
	}catch(e){
		next(e)
	}
  
};


app.get('/*',[getMetaData,getId,getVideo,finalCallBack])

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