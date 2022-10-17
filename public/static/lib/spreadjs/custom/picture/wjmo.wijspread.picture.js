(function (window, $) {    "use strict";;    var spread = $.wijmo.wijspread,        UI = GrapeCity.UI;    let Picture = function(spread_init) {
		this.spread=spread_init;
		this.img=[];    }      //   Picture.prototype.paint = function (ctx, value, x, y, w, h, style, context) {  //       if (!ctx) {  //           return;  //       }		// console.log(x,y,w,h)  //       let sheet;  //       let that = this;  //       if (context && context.sheet) {  //           sheet = context.sheet;  //           // w = sheet.getColumnWidth(context.col);  //           // h = sheet.getRowHeight(context.row);  //       }
		  //   };
	Picture.prototype.getImg = function() {
		return this.img;
	}
	Picture.prototype.setNewImg = function(imageData,imageDataBack) {
		for (var index = 0; index < imageData.data.length; index += 4) {
		  var r = imageData.data[index];
		  var g = imageData.data[index + 1];
		  var b = imageData.data[index + 2];
		  //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
		  if((r+g+b)/3<128)
		  {
			  imageData.data[index] = 255;
			  imageData.data[index+1] = 0;
			  imageData.data[index+2] = 0;
		  }
		  else {
			  imageData.data[index] = 255;
			  imageData.data[index+1] = 255;
			  imageData.data[index+2] = 255;
		  }
		}
		for (var index = 0; index < imageData.data.length; index += 4) {
		  //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
		  imageDataBack.data[index]=imageDataBack.data[index] & imageData.data[index]
		  imageDataBack.data[index+1]=imageDataBack.data[index+1]&imageData.data[index+1]
		  imageDataBack.data[index+2]=imageDataBack.data[index+2]&imageData.data[index+2]
		}
	}
	Picture.prototype.setPictureMouseClick = function(ctx,i) {
		let sheet = this.spread.getSheet(i)
		var sheetRender = new GrapeCity.UI._SheetRender(sheet);
		let canvashtml=sheet._getCanvas();
		var isDown = true;
		let img,x,y,imageData,guid,index=-1;
		let img1,x1,y1,imageData1,guid1,pictureAxis;
    
		let that = this;
		canvashtml.onmousemove = function (e) {
			if (isDown == false) {
			    return;
			}
			if(img)
			{
				// // e.offsetX为事件相对事件源的坐标
				x = e.offsetX - img.width / 6.25;
				// // e.offsetY为事件相对事件源的坐标
				y = e.offsetY - img.height / 6.25;
			}
			
		};
		// 使用定时器，不停的清画布，重绘图片以实现类似拖拽的效果
		canvashtml.onmousedown = function (e) {
			let pictureData = sheet.getPictureData()
      pictureAxis = sheet.getAxis(1,1,3)
			// console.log(e.offsetX,e.offsetY,img.width,img.height,x,y)
			index=-1
			for(let j=0;j<pictureData.length;j++)
			{
				x=pictureData[j].xAxis-pictureAxis[0]
				y = pictureData[j].yAxis-pictureAxis[1]
				img = pictureData[j].img
				imageData = pictureData[j].imageData
				guid = pictureData[j].id
				console.log(pictureData[j])
				if(e.offsetX>x && e.offsetX<img.width/3.125+x && e.offsetY>y && e.offsetY<img.height/3.125+y)
				{
					index = j;
					
					break;
				}
			}
			console.log(index)
			if(index>-1)
			{
				sheet.setCanvasBack(ctx);
				isDown = true;
				x=pictureData[index].xAxis-pictureAxis[0]
				y = pictureData[index].yAxis-pictureAxis[1]
				img = pictureData[index].img
				imageData = pictureData[index].imageData
				guid = pictureData[index].id
				let imagerect = ctx.getImageData(0, 0, canvashtml.width,canvashtml.height);
				// 更新新数据
				// ctx.putImageData(imageData, 0, 0);
				let index1 = setInterval(function () {
					// ctx.clearRect(0, 0, w,h);
					ctx.putImageData(imagerect, 0, 0);
					let imageDataBack = ctx.getImageData(x, y, img.width/3.125,img.height/3.125);
					ctx.clearRect(x, y, img.width/3.125,img.height/3.125);
					ctx.drawImage(img, 0, 0,img.width,img.height,x, y, img.width/3.125, img.height/3.125);
					let imageData = ctx.getImageData(x, y, img.width/3.125,img.height/3.125); //获取画布上的区域图像
					that.setNewImg(imageData,imageDataBack);
					// console.log(imageDataBack,imageData)
					ctx.putImageData(imageDataBack, x, y);
					for(let j=0;j<pictureData.length;j++)
					{
						if(index !== j)
						{
							x1=pictureData[j].xAxis-pictureAxis[0]
							y1 = pictureData[j].yAxis-pictureAxis[1]
							img1 = pictureData[j].img
							let imageDataBack1 = ctx.getImageData(x1, y1, img1.width/3.125,img1.height/3.125);
							ctx.clearRect(x1, y1, img1.width/3.125,img1.height/3.125);
							ctx.drawImage(img1, 0, 0,img1.width,img1.height,x1, y1, img1.width/3.125, img1.height/3.125);
							let imageData1 = ctx.getImageData(x1, y1, img1.width/3.125,img1.height/3.125); //获取画布上的区域图像
							that.setNewImg(imageData1,imageDataBack1);
							// console.log(imageDataBack,imageData)
							ctx.putImageData(imageDataBack1, x1, y1);
						}
					}
					if(isDown==false)
					{
						clearInterval(index1); 
					}
				}, 20);
			}
		};
		canvashtml.onmouseup = function (e) {
			if(isDown)
			{
				isDown = false;
				let imageData = ctx.getImageData(x, y, img.width,img.height);
				console.log(sheet.getPictureData())
				// debugger
				sheet.setPictureData({ "id": guid, "xAxis": x+pictureAxis[0], "yAxis": y+pictureAxis[1], "width": img.width/3.125, "height": img.height/3.125, "imageData": imageData, "img":img})
		
			}
			
		};
	}
	Picture.prototype.setLocation = function (ctx,x,y,w,h,src,i) {
		return new Promise((resolve, reject)=>{
			let sheet = this.spread.getSheet(i)
			var sheetRender = new GrapeCity.UI._SheetRender(sheet);
			
			var mousedownsimple = 0; //0无状态 1按下鼠标
			let canvashtml=sheet._getCanvas()
			if(!ctx)
			{
				ctx=sheetRender._getCtx()
			}
			console.log(canvashtml.width,canvashtml.height)
			var img = new Image();
			
			img.src = src;
			img.crossOrigin = "Anonymous";
			var guid = this.setGuid();
			img.id = guid;
			var isDown = true;
			var backImage = ctx.getImageData(0,0,w,h);
			var rectImage;
			console.log(sheet)
			let that = this;
			// 图片加载完成
			img.onload = function () {
			    // 要绘制的飞机的位置
			    // 监听鼠标在画布上方移动事件
				let imageDataBack = ctx.getImageData(x, y, img.width/3.125,img.height/3.125);
				ctx.clearRect(x, y, img.width/3.125,img.height/3.125);
				ctx.drawImage(img, 0, 0,img.width,img.height,x, y, img.width/3.125, img.height/3.125);
				let imageData = ctx.getImageData(x, y, img.width/3.125,img.height/3.125); //获取画布上的区域图像
				for (var index = 0; index < imageData.data.length; index += 4) {
				  var r = imageData.data[index];
				  var g = imageData.data[index + 1];
				  var b = imageData.data[index + 2];
				  //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
				  if((r+g+b)/3<128)
				  {
					  imageData.data[index] = 255;
					  imageData.data[index+1] = 0;
					  imageData.data[index+2] = 0;
				  }
				  else {
					  imageData.data[index] = 255;
					  imageData.data[index+1] = 255;
					  imageData.data[index+2] = 255;
				  }
				}
				for (var index = 0; index < imageData.data.length; index += 4) {
				  //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
				  imageDataBack.data[index]=imageDataBack.data[index] & imageData.data[index]
				  imageDataBack.data[index+1]=imageDataBack.data[index+1]&imageData.data[index+1]
				  imageDataBack.data[index+2]=imageDataBack.data[index+2]&imageData.data[index+2]
				}
				console.log(imageDataBack,imageData)
				ctx.putImageData(imageDataBack, x, y);

				sheet.setPictureData({ "id": guid, "xAxis": x, "yAxis": y, "width": img.width/3.125, "height": img.height/3.125, "imageData": imageDataBack, "img":img})
				that.img.push(img);
				that.setPictureMouseClick(ctx,i)
				resolve(1);
			}
		})

	
	};
	Picture.prototype.setGuid = function () {
		
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });

	}

	    window.Picture = Picture;})(window, jQuery);