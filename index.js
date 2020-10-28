const http=require('http')
const fs=require('fs')
var requests=require('requests');
const homefile=fs.readFileSync('home.html','utf-8')

const replaceval=(tempval,orgval)=>{
    let temperature=tempval.replace('{%tempval%}',(orgval.main.temp)-273.15)
    temperature=temperature.replace('{%location%}',orgval.name)
    temperature=temperature.replace('{%country%}',orgval.sys.country)
    temperature=temperature.replace('{%tempmin%}',(orgval.main.temp_min)-273.15)
    temperature=temperature.replace('{%tempmax%}',(orgval.main.temp_max)-273.15)
    return temperature;
};

const server=http.createServer((req,res)=>{

    if(req.url=='/'){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=96410b41b4b02798a7a394eadb359357")
        .on('data',(chunk)=>{
            // console.log(chunk)
            const objdata=JSON.parse(chunk)
            const arrdata=[objdata]
            // console.log(arrdata[0].main.temp )
            const realtimedata=arrdata
            .map((val) => replaceval(homefile,val))
            .join("");
            res.write(realtimedata)
        })
        .on('end',(err)=>{
            if(err) return console.log('connection loss due to error')
            console.log('end')
        })
    }
    else{
        res.end('file not found');
    }

}).listen(3000,'127.0.0.1',()=>{
    console.log("listenig at 127.0.0.1:3000")
});