const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

require('dotenv').config({path : 'vars/.env'});
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){

    const FirstName = req.body.fname;
    const LastName = req.body.lname;
    const Email = req.body.ename;

    var data = {
        members:[
            {
                email_address:Email,
                status:"subscribed",
                merge_fields: {
                    FNAME:FirstName,
                    LNAME:LastName
                }
            }
        ]
    }
        const jsonData = JSON.stringify(data);

        const url = "https://"+MAPI_SERVER+".api.mailchimp.com/3.0/lists/"+MLIST_ID;

        const options = {
            method:"POST",
            auth:"mayur:"+ MAPI_KEY
        }

       const request = https.request(url,options,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        } else{
            res.sendFile(__dirname+"/failure.html");
        }
            response.on("data",function(data){
                console.log(JSON.parse(data));
            })
        })

        request.write(jsonData);
        request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}.`);
});

        