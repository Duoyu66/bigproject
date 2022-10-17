(function (window, $) {    "use strict";;    var spread = $.wijmo.wijspread,        UI = GrapeCity.UI;

	function pictureRightClickMenu(sheet) {
		this.sheet=sheet
		this.filelist = []
	}
	
	pictureRightClickMenu.prototype.achieveGuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});

	}
	pictureRightClickMenu.prototype.updateFileList = function(file) {
		for(let i=0;i<this.filelist;i++)
		{
			if(this.filelist[i].id===file.id)
			{
				this.filelist[i]=file;
			}
		}
		this.filelist.push(file);
	}
	pictureRightClickMenu.prototype.openDownload = function(url) {
		//url--对应阿里云资源地址
	   fetch(url).then(res => res.blob().then(blob => {
	        let a = document.createElement('a');
	        let url = window.URL.createObjectURL(blob);
	        let filename = new Date().getTime() +'.png';
	        a.href = url;
	        a.download = filename;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    }))
	}
	
	pictureRightClickMenu.prototype.setMenu = function() {
		let rightClickMenu=[]
		let sheet=this.sheet
		let that = this
		rightClickMenu.push({ "key": "load", "title": "加载", "label": "","func": function(){
			let typeName = sheet.getCellType(sheet.coordinate[0], sheet.coordinate[1]).name
			console.log(typeName)
			if(typeName=="pictureType")
			{
				var obj = document.createElement("input");
				var input_id=that.achieveGuid();
				obj.type = "file";
				obj.id = input_id;
				obj.style = "display:none"
				document.body.appendChild(obj);
				
				document.getElementById(input_id).click()
				document.getElementById(input_id).onchange = function () {
					//1.获取选中的文件列表
					var fileList = document.getElementById(input_id).files;
					var file = fileList[0];
					file.id=input_id;
					console.log(file)
					that.updateFileList(file);
					let ctx=sheet._render._getCtx();
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function (e) {
						//将结果显示到canvas
						var cellType = new $.wijmo.wijspread.PictureType(reader.result);
						sheet.setCellType(sheet.coordinate[0], sheet.coordinate[1], cellType);
					}
				}
			}
			
		}})
		rightClickMenu.push({ "key": "download", "title": "下载", "label": "","func": function(){
			let src = sheet.getCellType(sheet.coordinate[0], sheet.coordinate[1]).src
			if(src)
			{
				that.openDownload("http://42.193.118.98:5005/ContractFile/20220105/%E5%8D%8E%E5%BF%83%E5%BD%A9.mp3");
			}
			
			
		}})
		rightClickMenu.push({ "key": "delete", "title": "删除", "label": "","func": function(){
			let typeName = sheet.getCellType(sheet.coordinate[0], sheet.coordinate[1]).name
			console.log(typeName)
			var cellType = new $.wijmo.wijspread.PictureType("");
			sheet.setCellType(sheet.coordinate[0], sheet.coordinate[1], cellType);
			
		}})
		sheet.paintRightClickMenu(rightClickMenu)
	}
	pictureRightClickMenu.prototype.uploadFileList = function(file) {
		for(let i=0;i<this.filelist;i++)
		{
			
		}
	}
	
	function FileCellType() {
	    this.size = 10;
	}
	FileCellType.prototype = new UI.BaseCellType();
	
	
	FileCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
	    if (!ctx) {
	        return;
	    }
		console.log(x,y,w,h,value)
		
	    let sheet;
		let canvashtml;
	    let that = this;
	    if (context && context.sheet) {
	        sheet = context.sheet;
			console.log(context.row,context.col)
			console.log(sheet._getCanvas())
			canvashtml=sheet._getCanvas()
	    }
		if(canvashtml)
		{
			canvashtml.ondblclick = function(e) {
				
				if(e.offsetX>x && e.offsetX<x+w && e.offsetY>y && e.offsetY<y+h)
				{
					try {
					    var obj = document.createElement("input");
					    obj.type = "file";
					    obj.id = "";
						obj.style = "display:none"
					    document.body.appendChild(obj)
						
						document.getElementById("testfile1").click()
						document.getElementById("testfile1").onchange = function () {
						    //1.获取选中的文件列表
						    var fileList = document.getElementById("testfile1").files;
						    var file = fileList[0];
							console.log(file.name)
							UI.TextCellType.prototype.paint(ctx, "文件名:"+file.name, x, y, w, h, style, context)
						    //读取文件内容
						    
						}
					} catch(e) {
						console.log(e)
					    
					}
				}
				
			}
		}
	
	};	
    function PictureType(src) {
		this.name="pictureType"
        this.src = src;
    }
    PictureType.prototype = new UI.BaseCellType();
	
	PictureType.prototype.mouseDownDelegate = function (e) {
	    console.log(e)
	
	}    PictureType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {        if (!ctx) {            return;        }		console.log(x,y,w,h)
		        let sheet;
		let canvashtml;        let that = this;        if (context && context.sheet) {            sheet = context.sheet;
			console.log(context.row,context.col)
			console.log(sheet._getCanvas())
			canvashtml=sheet._getCanvas()
			// let style = sheet.getStyle(context.row,context.col)
			// style.locked = false
			// sheet.setStyle(context.row,context.col,style)            // w = sheet.getColumnWidth(context.col);            // h = sheet.getRowHeight(context.row);        }
		if(this.src)
		{
			var img = new Image();
			img.src = this.src;
			img.onload = function () {
			    ctx.drawImage(img, x+1, y+1, w-2, h-2);
			}
		}    };


	    spread.PictureType = PictureType;
	spread.FileCellType=FileCellType;
	window.pictureRightClickMenu = pictureRightClickMenu;})(window, jQuery);