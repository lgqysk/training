
	/*
		util class document
	*/

	/* 
		class  name: getStyle
		description: get a attribute of a html element
		@param  obj: object
		@param attr: attribute
		return string
	*/
	function getStyle(obj , attr){
		if(typeof obj )
		return obj.currentStyle?obj.currentStyle[attr]: getComputedStyle(obj)[attr];
	}

	/* 
		class  name: getElementsByClass
		description: get  html elements by class name
		@param parent: the parent object of elements
		@param  cName: class name
		return array
	*/
	function getElementsByClass(cName,parent){
		parent = parent || document;
		var arr = [];
		if(parent.getElementsByClassName){
			arr = parent.getElementsByClassName(cName);
		}else{
			var aChild = parent.getElementsByTagName("*");
			for(var i=0;i<aChild.length;i++){
				var aClassName = aChild[i].className.split(" ");
				for(var j=0;j<aClassName.length;j++){
					if(aClassName[j] == cName)
						arr.push(aChild[i]);
					break;
				}
			}
		}
		return arr;
	}

	/*
		class name: ajax
		description: 
		@param type: 访问方式(get/post),默认为get,string
		@param url : 访问地址,必传，string
		@param data: 发送的数据，需要发送数据时才写，json
		@param success：请求数据成功时调用的方法，function
		@param error：请求数据失败时调用的方法，function
	*/

	function ajax(json){
		var type = json.type || "get";
		var data = json.data;
		var url = json.url;
		var dataType = json.dataType || "text";
		var processData = json.processData;
		var contentType = json.contentType || "application/x-www-form-urlencoded";
		var success = json.success;
		var error = json.error;
		var dataStr = "";
		var xhr = new XMLHttpRequest();
		if(data && processData){
			switch(dataType){
				case "json":{
					dataStr = JSON.stringify(data);
					xhr.setRequestHeader('content-type','application/json;charset=UTF-8');
				}break;
				case "text":{
					var keys = Object.Keys(data);
					for(var i=0;i<keys.length-1;i++){
						dataStr += keys[i]+"="+data[key[i]]+"&"
					}
					dataStr += keys[i] + "=" + data[key[i]];
					dataStr += "_=" + new Date().getTime();
					if(type.toLowerCase() == "get"){
						url += "?" + dataStr;
					}
					contentType && xhr.setRequestHeader('content-type',contentType);
				}break;
			}
		}
		xhr.open(type,url,true);
		xhr.send(dataStr);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status>=200&&xhr.status<300){
					try{
						var json = JSON.parse(xhr.responseText);
					}catch(Error){
						console.log("json parse error");
					}finally{
						if(json){
							success&&success(json);
						}else{
							success&&success(xhr.responseText)
						}
					}
				}else{
					error&&error(xhr.responseText);
				}
			}
		}
	}
	/*
		class name: addEvent
		description: 给某元素对象添加一个事件
		@param obj: 元素对象
		@param event : 事件名称,没有前缀on ，string
		@param fn : 事件执行的方法，function
	*/
	function addEvent( obj , event , fn ){
		document.addEventListener?obj.addEventListener( event , fn , false ):obj.attachEvent( 'on'+event , fn );
	};

	/*
		class name : clearBubble
		description: 清除某个元素的事件冒泡
		@param obj: 元素对象
		@param event : 事件名称，没有前缀on ，string
	*/
	function clearBubble(obj,event){
		addEvent(obj,event,function(e){
			e = e || event;
			e.cancelBubble = true;
		});
	}

	 function trim(str){
		return str.replace(/^\s+|\s+$/gm,'');
	 }

	 /*
		class name:getParams
		description: 获取get传递的参数
		return object 参数键值对对象
	*/
	function getURIParams(){
		var location = document.location.href;
		if(location.indexOf("?") < 0){
			return null;
		}
		var strParams = location.substring( location.indexOf("?") + 1);
		return divideParams(strParams,"&");
	}
	/*
		class name: divideParams
		description:分割 分割符分离的参数对 例: name=qy&passowrd=123456
		return object 返回参数键值对对象{name:qy,password:123456}
	*/
	function divideParams(strParams,separator){
		var params = {};
		var aStrParams = strParams.split(separator);
		for(var param in aStrParams){
			var aTempParam = aStrParams[param].trim().split("=");
			params[aTempParam[0]] = aTempParam[1];
		}
		return params;
	}
	/*
		class name:getCookie
		description:通过key获取cookie值
		return string key对应的值
	*/
	function getCookie(key){
		var params = divideParams(document.cookie,";");
		return unescape(params[key]);
	}
	/*
		class name:setCookie
		description:设置cookie
		@param key string 
		@param value string
		@param expire 整数毫秒数
	*/
	function setCookie(key,value,expire){
		var exp = new Date();
		expire?exp.setTime(exp.getTime()+expire):exp.setTime(exp.getTime()+7*24*60*60);
		document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";";
	}
	/*
		class name:delCookie
		description:通过key删除cookie
	*/
	function delCookie(key){
		var exp = new Date();
		var value = getCookie(key);
		if(value){
			exp.setTime(exp.getTime()-1);
			document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";";
		}
	}
	
	function delCookieAll(){
		var params = divideParams(document.cookie,";");
		for(var key in params){
			delCookie(key);
		}
	}

	function responsive(json){
		var maxWidth = json.maxWidth || 1200;
		var minWidth = json.minWidth || 320;
		var callback = json.callback;
		var oHtml = document.getElementsByTagName('html')[0];
		addEvent(window,"resize",resize);
		function resize(){
			var w = window.innerWidth//浏览器窗口大小
			var font = w/20;
			font = Math.min(maxWidth/20,font);//取最小值，限定最大值(10以下就OK)
			font = Math.max(minWidth/20,font);//取最大值,限定最小值
			oHtml.style.fontSize = font + 'px';
			callback && callback();
		}
	}
	//多文件上传，input多次选择工具
	function MultiFile(json){
		this.oInput = document.getElementById(json.inputId);
		this.limitNum = json.limitNum;
		this.callback = json.callback;
		this.files = [];
		this.fileNeedSign = [];
		this.fileNum = 0;
	}
	MultiFile.prototype = {
		initEvent : function(){
			var that = this;
			addEvent(that.oInput,"click",function(){
				if(that.fileNum >= that.limitNum){
					that.callback || that.callback({isOver:true;that.files:getFiles()});
				}
			});
			addEvent(that.oInput,"change",function(){
				if(this.files){
					for(var i=0;i<this.files.length;i++){
						that.files.push(this.files[i]);
						that.fileNeedSign.push(true);
						that.fileNum++;
					}
				}else{
					that.files.push(this.files[i].value);
					that.fileNeedSign.push(true);
					that.fileNum++;
				}
			});
		},
		getFiles : function(){
			var tempFiles = [];
			for(var i=0;i<fileNeedSign.length;i++){
				if(fileNeedSign[i]){
					tempFiles.push(tempFiles[i]);
				}
			}
			return tempFiles;
		},
		deleteFile : function(index){
			var count = 0;
			for(var i=0;i<this.fileNeedSign.length;i++){
				if(this.fileNeedSign[i]){
					count++;
					if(count == index){
						this.fileNeedSign[i] = false;
						break;
					}
				}
			}
		}
	}