var request = require('request');
var http =require('http');
var express = require('express');
var fs = require('fs');
var bodyParser =require('body-parser');
var AipFaceClient = require("node-sdk").face;
// console.log(AipFaceClient);
// 设置APPID/AK/SK
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";

var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
var app = express();
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}));
app.all("*",function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	next();
})
app.use(express.static(__dirname+'/..'));



var server = app.listen(8082,function () {
	console.log("服务器已开启");
});



app.post('/faceLog',function (req,res) {
	var revImg = decodeURIComponent(req.body.img).replace(/\s/g,'+').replace(/^data:image\/\w+;base64,/,"");
	var uid = req.body.uid;
	var userInfo = req.body.userInfo;
	var groupIds = 'group1';
	client.addUser(uid, userInfo, groupIds, revImg).then(function(result) {
	    console.log(JSON.stringify(result));
	    res.send("注册成功")
	});
	
})

app.post('/faceRec',function (req,res) {
	
	var revImg = decodeURIComponent(req.body.img);
	var revImg = revImg.replace(/\s/g,"+");//.replace(/\s/g,'+');
	revImg = revImg.replace(/^data:image\/\w+;base64,/,"");
	 
	var groupIds = 'group1';
	client.identifyUser(groupIds, revImg, {usertopnum: 5}).then(function(result) {
	   console.log(JSON.stringify(result));
	    try{
	    	if(result.result[0].scores[0]>80)
		    	res.send("欢迎您!"+result.result[0].user_info);
		    else 
		    	res.send("未识别,请先注册!");
	    }catch(e){
	    	res.send("未识别,请先注册")
	    }
	    

	});
})

// client.deleteGroupUsers('group1' , "ww").then(function(result) {
//     console.log(JSON.stringify(result));
// });
// client.deleteGroupUsers('group1' , "ww5").then(function(result) {
//     console.log(JSON.stringify(result));
// });

client.getGroupUsers('group1').then(function(result) {
    console.log(JSON.stringify(result));
});

