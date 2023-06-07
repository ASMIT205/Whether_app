//IMPORTING THE http Module(help in creating server that listen to the server and give response )
const http = require("http");
//Importing fs module() (reading the files)
const fs = require("fs");
var requests=require("requests");
const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal = (tempVal,orgVal)=>{
  //  console.log(orgVal.main);
  var a=orgVal.main.temp-270.00;
    let temperature= tempVal.replace("{%tempval%}",a.toFixed(2));
  var b=orgVal.main.temp_min-270.00;
   temperature= temperature.replace("{%tempmin%}",b.toFixed(2));
   var c=orgVal.main.temp_max-270.00;
    temperature= temperature.replace("{%tempmax%}",c.toFixed(2));
    temperature= temperature.replace("{%locatin%}",orgVal.name);
    temperature= temperature.replace("{%country%}",orgVal.sys.country);
  temperature= temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    console.log(temperature);
    return temperature;
};
const server =http.createServer((req,res) =>{
    if(req.url == "/") // denote the root
    {
       requests("https://api.openweathermap.org/data/2.5/weather?q=patna&appid=1edc87faf0cdedde3d795d1426c7c405").on("data", (chunk)=>{
        //converting string to javasript object
        const objdata = JSON.parse(chunk);
        //convert object to array
        const arrData = [objdata];
        const realTimeData = arrData.map((val)=> replaceVal(homeFile,val)).join("  ");  //to convert it into string as we are getting in array forma

      
      //final ready html+node js
  res.write(realTimeData);
   // console.log(realTimeData);
       })
       .on("end",(err)=>{
        if(err) return console.log("connection closed due to errors",err);
     res.end();
      //  console.log("end");
       });
    }
});
server.listen(8080, "127.0.0.1");