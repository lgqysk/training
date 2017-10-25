/**
 * 
 * @authors lg 
 * @date    2017-06-11 15:33:44
 * @version 1.0
 */
/*
	特效库展示
*/
var oWrapper,
	aCards,
	oMenu,
	aMenuOption,
	oThis, //oEffectSet对象
	//这些变量只与oWrapper有关，记录oWrapper的状态
	lastX,  // 上一次鼠标X坐标
	nowX,	//现在鼠标X坐标
	lastY,  //上一次鼠标Y坐标
	nowY,   //现在鼠标Y坐标
	rotX=0,	//绕X轴旋转的度数
	rotY=0, //绕Y轴旋转的度数
	minusX=0, // 最后一次鼠标X坐标的偏移,必须初始化0
	minusY=0, // 最后一次鼠标Y坐标的偏移，必须初始化0
	transZ= -1500; //oWrapper沿Z轴的偏移
var oEffectSet = {
	init : function(){
				oThis = this; 
				oWrapper = document.getElementById("wrapper");
				oMenu = document.getElementById("menu");
				aMenuOption = oMenu.getElementsByTagName("li");
				var cardNum = 5*5*5;
				for(var i=0;i<cardNum;i++){
					var card = document.createElement("div");
					card.className = "card";
					card.innerText = "lg";
					oWrapper.appendChild(card);
				}
				aCards = oWrapper.getElementsByClassName("card");
				for(var i=0;i<aCards.length;i++){
					var x = (Math.random()-0.5)*4600;
					var y = (Math.random()-0.5)*4600;
					var z = (Math.random()-0.5)*4600;
					aCards[i].style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)";
				}
				oThis.addEvent();
				var timer = window.setTimeout(function(){
					oThis.toGrid();
					window.clearInterval(timer);
				},300);
			},
	addEvent: function(){
				document.onmousedown = function(e){
					e = e || window.event;
					lastX = e.clientX;
					lastY = e.clientY;
					//清除上一次的定时器
					oWrapper.timer1 || window.clearInterval(oWrapper.timer1);
					document.onmousemove = function(e){
						e = e || window.event;
						nowX = e.clientX;
						nowY = e.clientY;
						minusX = nowX - lastX;
						minusY = lastY - nowY;
						rotX += minusY*0.2;
						rotY += minusX*0.2;
						oWrapper.style.transform = "translate3d(0,0,"+transZ+"px) rotateX("+rotX+"deg) rotateY("+rotY+"deg)";
						lastX = nowX;
						lastY = nowY;
					}
				}
				document.onmouseup = function(){
					//清除鼠标移动事件
					document.onmousemove = null;
					oWrapper.timer1 = window.setInterval(function(){
						minusX *= 0.95;
						minusY *= 0.95;
						rotX += minusY*0.2;
						rotY += minusX*0.2;
						oWrapper.style.transform = "translate3d(0,0,"+transZ+"px) rotateX("+rotX+"deg) rotateY("+rotY+"deg)";
						if(Math.abs(minusX) < 0.5 && Math.abs(minusY) < 0.5){
							window.clearInterval(oWrapper.timer);
						}
					},13)
				}
				//注册滚轮事件
				this.addMouseWheelEvent(fnScroll);
				function fnScroll(change){
					//清除上一次的定时器
					oWrapper.timer2 || window.clearInterval(oWrapper.timer2);
					transZ += change;
					transZ = Math.min(transZ , 1500);
					transZ = Math.max(transZ , -6000)
					oWrapper.style.transform = "translate3d(0,0,"+transZ+"px) rotateX("+rotX+"deg) rotateY("+rotY+"deg)";
					oWrapper.timer2 = window.setInterval(function(){
						change *= 0.85;
						transZ += change;
						transZ = Math.min(transZ , 1500);
						transZ = Math.max(transZ , -6000)
						oWrapper.style.transform = "translate3d(0,0,"+transZ+"px) rotateX("+rotX+"deg) rotateY("+rotY+"deg)";
						if(Math.abs(change) < 0.5){
							window.clearInterval(oWrapper.timer2);
						}
					},13);
				}
				//菜单按钮点击事件
				for(var i=0;i<aMenuOption.length;i++){
					aMenuOption[i].index = i;
					aMenuOption[i].onclick = function(e){
						e = e || window.event;
						e.cancelBubble = true;
						switch(this.index){
							case 0:
									oThis.toTable()
									break;
							case 1:
									oThis.toSphere()
									break;
							case 2:
									oThis.toHelix();
									break;
							case 3:
									oThis.toGrid();
									break;
						}
					}
				}
	},
	addMouseWheelEvent:function(fn){
				if(document.addEventListener){
					document.addEventListener("DOMMouseScroll",funcScroll,false);
				}
				window.onmousewheel = document.onmousewheel = funcScroll;
				function funcScroll(e){
					e = e || event;
					e.detail?fn(-20*e.detail):fn(e.wheelDelta/2);
				}
	},
	toGrid:function(){
				//disX:distance X 
				var disX = 300, disY = 300, disZ = 500;
				//cardX: card in coordinate x
				var cardX = -2, cardY = 2, cardZ = 0;
				for(var i=0;i<aCards.length;i++){
					aCards[i].style.transform = "translate3d("+disX*cardX+"px,"+disY*cardY+"px,"+disZ*cardZ+"px)";
					cardX++;
					if(cardX == 3){
						cardY--;
						cardX = -2;
					}
					if((i+1)%25 == 0){
						cardY = 2;
						if(Math.floor((i/25)%2) == 0){
							cardZ = -cardZ + 1;
						}else{
							cardZ = -cardZ;
						}
					}
				}
		},
	toHelix:function(){
				var radius = 800, //螺旋的半径
					shiftY = 10,//每个卡片y轴方向的偏移量
					angleY = 12,//绕Y轴旋转偏移量
					topY = -shiftY*Math.floor(aCards.length/2);//最高处卡片的Y偏移量
				//先旋转再沿Z轴平移，因为旋转之后Z轴发生改变
				for(var i=0;i<aCards.length;i++){
					aCards[i].style.transform = "rotateY("+angleY*i+"deg) translate3d("+0+"px,"+(topY + shiftY*i) +"px,"+radius+"px) ";
				}
		},
	toSphere:function(){
		/*var radius = 800, //球体的半径
			num = 8,
			shiftY,
			rotateX,rotateY;

		//先旋转再沿Z轴平移，因为旋转之后Z轴发生改变
		for(var i=0;i<aCards.length;i++){
			var roY = Math.floor(i/num);
			shiftY = 360/(aCards.length/(aCards.length/Math.ceil((aCards.length-1)/7)));
			rotateX = 90-180/num*(i%num);
			rotateY = shiftY*roY;
			if(roY != 0){
				num = 7;
			}
			aCards[i].style.transform = "rotateY("+rotateY+"deg) rotateX("+rotateX+"deg) translateZ("+radius+"px)";
		}*/
		//1 5 9 | 5 1  4*n -3数列,总长度为2*n -1
		var n = Math.ceil((Math.sqrt(4*aCards.length-3)+3)/4),
			sumNum=0, //数列和
			shiftNum, //数列和与卡片总数的差
			shiftN, //1 3 5 | 3 1 2*n - 1数列，差值数列n
			aShiftNum = [],//差值数列
			sumShiftNum = 0,
			aNum = [];//最后得出的卡片数量数列
		//完全4*n -3数列
		for(var i =0;i<n;i++){
			aNum[i] = 4*(i+1) -3;
			sumNum += aNum[i];
			if(n > i+2){
				aNum[2*n -3 -i] = aNum[i];
				sumNum += aNum[i];
			}
		}
		shiftNum = sumNum - aCards.length; //与卡片数量的差
		shiftN = Math.ceil((Math.sqrt(2*shiftNum -1)+1)/2);//差值数列n
		//得出差值数列
		for(var i=0;i<shiftN-1;i++){
			aShiftNum[i] = 2*(i+1) - 1;
			sumShiftNum+=aShiftNum[i];
			if(shiftN > i+1){
				aShiftNum[2*shiftN - 2 - i] = aShiftNum[i];
				sumShiftNum+=aShiftNum[i];
			}
		}
		aShiftNum[shiftN-1] = shiftNum - sumShiftNum;
		var firstIndex = Math.ceil((aNum.length - aShiftNum.length)/2) - 1;
		//最后得出卡片数量分布
		for(var i = firstIndex;i<firstIndex+aShiftNum.length;i++){
			aNum[i] -= aShiftNum[i - firstIndex];
		}

		var radius = 800,
			rotateX,
			rotateY,
			counter = 0;
		//修改样式
		for(var i=0;i<aNum.length;i++){
			var shiftY = 360/aNum[i];
			var rotateX = 90 - i*180/(aNum.length-1);
			for(var j=0;j<aNum[i];j++){
				aCards[counter].style.transform = "rotateY("+(shiftY/2 + shiftY*j)+"deg) rotateX("+rotateX+"deg) translateZ("+radius+"px)";
				counter++;
			}
		}
		
	}

}
oEffectSet.init();
