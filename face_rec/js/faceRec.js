var video = document.getElementById("video");
var canvas = document.getElementById('canvas');


function expandLog(node) {
	Array.prototype.forEach.call(node.children,function (elem) {
		elem.style.display = 'block';
		elem.addEventListener('click',function (e) {
			e.stopPropagation();
		})
	});
}

function pcLog () {
	if(uid_p.value === '' | userInfo_p.value === ''){
		alert("账号和用户名不能为空!");
		return;
	}	
	var imgBase64;			
	var cav = document.createElement('canvas');
	var ctx = cav.getContext('2d');				
	var opt ={
		url:'/faceLog',
		type:'post',
		data:{},
		success:function (data) {
			alert(data);
		}
	};
	var node = document.getElementById('pc_log');

	Array.prototype.forEach.call(node.children,function (elem,i) {
		if(i !== 0)	elem.style.display = 'none';
	});

	cav.width = video.offsetWidth;
	cav.height = video.offsetHeight;
	ctx.drawImage(video,0,0,cav.width,cav.height);
	imgBase64 = cav.toDataURL();
	opt.data.uid = uid_p.value;
	opt.data.userInfo = userInfo_p.value;
	opt.data.img = imgBase64;
	wzxAjax(opt);

		
}



function mobileLog (file) {
	if(uid_m.value === '' | userInfo_m.value === ''){
		alert("账号和用户名不能为空!");
		return;
	}
	var fr = new FileReader();
	var opt ={
		url:'/faceLog',
		type:'post',
		data:{},
		success:function (data) {
			alert(data);
		}
	};
	var node = document.getElementById('mobile_log');
	Array.prototype.forEach.call(node.children,function (elem,i) {
		if(i !== 0)	elem.style.display = 'none';
	});
	
	fr.readAsDataURL(file.files[0]);
	fr.onload = function (e) {
		opt.data.uid = uid_m.value;
		opt.data.userInfo = userInfo_m.value;
		opt.data.img = e.target.result;
		wzxAjax(opt);
	}
}


function sendImgToServer (arg) {
	var base64;
	var opt = {
		url:'/faceRec',
		type:'post',
		data:{},
		success:function (data) {
			alert(data);
		}
	};
	var cav = document.createElement('canvas');				
	var ctx = cav.getContext('2d');
	var fr  = new FileReader();
	if (arg) {	
		var img = new Image();
		canvas.width = document.getElementsByClassName('v-s')[0].offsetWidth;
		canvas.height = document.getElementsByClassName('v-s')[0].offsetHeight;					

			fr.onload = function (e) {  
					img.src = e.target.result;					
					opt.data.img = e.target.result;
					wzxAjax(opt);
					img.onload = function () {
						canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);	 	
					}
				};

			fr.readAsDataURL(arg.files[0]);

	} else {
		cav.width = video.offsetWidth;
		cav.height = video.offsetHeight;			
		ctx.drawImage(video,0,0,cav.width,cav.height);					
		base64 = cav.toDataURL();
		opt.data.img = base64;
		wzxAjax(opt);		
		
	}
}




function loadCamera() {

	navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia||navigator.msGetUserMedia;
	shootN=window.URL|| window.webkitURL|| window.mozURL|| window.msURL;
	var videoObj = {
            video: true,
            audio: false
        };
    var errBack=function(err){
    	document.getElementById('pc_camera').style.display = 'none';
    	document.getElementById('pc_log').style.display = 'none';
    	video.style.display = 'none';
    }
    if(!navigator.getUserMedia){
    	errBack();
    }
    navigator.getUserMedia(videoObj,function(stream){
    	if(video.mozSrcObject!==undefined){
    		video.mozSrcObject=stream;		            		
    	}else{
    		video.src=(window.URL&&window.URL.createObjectURL(stream))||stream;
    	}
    	video.play();
    	document.getElementById('mobile_camera').style.display = 'none';
    	document.getElementById('mobile_log').style.display = 'none';
    	canvas.style.display = 'none';
    },errBack);
}	