(function (window, $) {
    "use strict";
    let UI = GrapeCity.UI;
	const PAGER_SIZES = [
		['A4', 8.27, 11.69],
		['A3', 11.69, 16.54],

		['A5', 5.83, 8.27],
		['B4', 9.84, 13.90],
		['B5', 6.93, 9.84],
	];

	const PAGER_ORIENTATIONS = ['portrait', 'landscape'];
	const PAGER_MARGIN = ['0', '10', '20'];

	const orientations = ['portrait', 'landscape'];

	let printExcel = function (spread_init) {
		let that = this
	    this.setSpread(spread_init);
		$('.gtwise-print-left-padding').blur(function(){
		    that.preview()
		});
		$('.gtwise-print-right-padding').blur(function(){
		    that.preview()
		});
		$('.gtwise-print-top-padding').blur(function(){
		    that.preview()
		});
		$('.gtwise-print-bottom-padding').blur(function(){
		    that.preview()
		});
	}

	printExcel.prototype.inches2px = function(inc) {
	  return parseInt(96 * inc, 10);
	}



	printExcel.prototype.pagerSizeChange = function(evt) {
	  const { paper } = this;
	  const { value } = evt.target;
	  const ps = PAGER_SIZES[value];
	  paper.w = this.inches2px(ps[1]);
	  paper.h = this.inches2px(ps[2]);
	  // console.log('paper:', ps, paper);
	  this.preview();
	}
	printExcel.prototype.pagerOrientationChange = function(evt) {
	  const { paper } = this;
	  const { value } = evt.target;
	  const v = PAGER_ORIENTATIONS[value];
	  paper.orientation = v;
	  this.preview();
	}
	printExcel.prototype.pagerMarginChange = function(evt) {
	  const { paper } = this;
	  const { value } = evt.target;
	  const v = PAGER_MARGIN[value];
	  $('.gtwise-print-left-padding').val(v)
	  $('.gtwise-print-right-padding').val(v)
	  $('.gtwise-print-top-padding').val(v)
	  $('.gtwise-print-bottom-padding').val(v)
	  this.preview();
	}



    printExcel.prototype.setSpread = function (spread_init) {
		let that = this
        this.spreadDefult = new spreadDefult(spread_init);
		// const h = new Element('tag', className);
		this.paper = {
		  w: this.inches2px(PAGER_SIZES[0][1]),
		  h: this.inches2px(PAGER_SIZES[0][2]),
		  padding: 50,
		  orientation: PAGER_ORIENTATIONS[0],
		  get width() {
		    return this.orientation === 'landscape' ? this.h : this.w;
		  },
		  get height() {
		    return this.orientation === 'landscape' ? this.w : this.h;
		  },
		};

		this.el = h('div', `gtwise-print`)
		  .children(
		    h('div', `gtwise-print-bar`)
		      .children(
		        h('div', '-title').child('Print settings'),
		        h('div', '-right').children(
		          h('div', 'gtwise-buttons').children(
					h('div', 'gtwise-button').on('click', this.btnClick.bind(this, 'cancel')),
					h('div', 'gtwise-button primary').on('click', this.btnClick.bind(this, 'next')),
		            // new Button('cancel').on('click', btnClick.bind(this, 'cancel')),
		            // new Button('next', 'primary').on('click', btnClick.bind(this, 'next')),
		          ),
		        ),
		      ),
		    h('div', `gtwise-print-content`)
		      .children(
		        this.contentEl = h('div', '-content'),
		        h('div', '-sider').child(
		          h('form', '').children(
		            h('fieldset', '').children(
		              h('label', '').child('纸张大小'),
		              h('select', '').children(
		                ...PAGER_SIZES.map((it, index) => h('option', '').attr('value', index).child(`${it[0]} ( ${it[1]}''x${it[2]}'' )`)),
		              ).on('change', this.pagerSizeChange.bind(this)),
		            ),
		            h('fieldset', '').children(
		              h('label', '').child('纸张方向'),
		              h('select', '').children(
		                ...PAGER_ORIENTATIONS.map((it, index) => h('option', '').attr('value', index).child(`${PAGER_ORIENTATIONS[index]}`)),
		              ).on('change', this.pagerOrientationChange.bind(this)),
		            ),
					h('fieldset', '').children(
					  h('label', '').child('页边距'),
					  h('select', '').children(
					    ...PAGER_MARGIN.map((it, index) => h('option', '').attr('value', index).child(`${PAGER_MARGIN[index]}`)),
					  ).on('change', this.pagerMarginChange.bind(this)),
					),
					h('fieldset', '').children(
					  h('label', '').child('左边距'),
					  this.contentInput = h('input', 'gtwise-print-left-padding')
					),
					h('fieldset', '').children(
					  h('label', '').child('右边距'),
					  this.contentInput = h('input', 'gtwise-print-right-padding')
					),
					h('fieldset', '').children(
					  h('label', '').child('上边距'),
					  this.contentInput = h('input', 'gtwise-print-top-padding')
					),
					h('fieldset', '').children(
					  h('label', '').child('下边距'),
					  this.contentInput = h('input', 'gtwise-print-bottom-padding')
					),
		          ),
		        ),
		      ),
		  ).show();

		console.log(this.contentEl)
		window.document.body.appendChild(this.el.el)

    }

	printExcel.prototype.preview = async function (length,wmuti,hmuti,title,order) {
		this.canvases = []
		this.contentEl.html('');
		const { data, paper } = this;
		const { width, height, padding } = paper;
		let that = this
    let sheet = this.spreadDefult.spread.getActiveSheet()
    let canvashtml=sheet._getCanvas();
    console.log(wmuti,hmuti)
		for(let i=0;i<length;i++)
		{
			var canvas = document.createElement("canvas");
			canvas.setAttribute("id", "print_vp");
			canvas.setAttribute("width",width)
			canvas.setAttribute("height",height)
			$(canvas).html("You need a browser which full supports HTML5 Canvas to run SpreadJS");
			const wrap = h('div', `gtwise-canvas-card`);
			this.contentEl.child(h('div', `gtwise-canvas-card-wraper`).child(
				wrap.child(canvas)
			));
			$('.gtwise-canvas-card').height(height);
			$('.gtwise-canvas-card').width(width);
			var c=document.getElementById("print_vp");
			var ctx=canvas.getContext("2d");

			let leftmargin = Number($('.gtwise-print-left-padding').val())+113
			let rightmargin = Number($('.gtwise-print-right-padding').val())+76
			let topmargin = Number($('.gtwise-print-top-padding').val())+94
			let bottommargin = Number($('.gtwise-print-bottom-padding').val())+94
			// leftmargin=10
			// rightmargin=20
			// topmargin=30
			// bottommargin=40


			let sheet = this.spreadDefult.spread.getSheet(i)
			sheet.setColumnWidth(0, 1);
			var sheetRender = new GrapeCity.UI._SheetRender(sheet);
			console.log(height,width)
			var scale = 3.125
			$('.gtwise-canvas-card').height(height*scale);
			$('.gtwise-canvas-card').width(width*scale);
			canvas.setAttribute("width",width*scale)
			canvas.setAttribute("height",height*scale)
			ctx.scale(scale, scale);
			// debugger
			let mutilist = sheetRender.paintViewportImpPrint(ctx,1,1,3,{x: leftmargin, y: topmargin, width: width-rightmargin-leftmargin, height: height-topmargin-bottommargin},height,width,canvashtml)


			//var sheet1 = sheetRender._sheet;
			// var cellLayouts = sheet._getCellLayout(1, 1, 3);
			// this.setBackGround(ctx)
			ctx.save()
			ctx.fillStyle="#FFFFFF";
			ctx.fillRect(0,0,width,94);
			ctx.restore()
			ctx.save()
			ctx.font="16px 黑体";
			let fontwidth = ctx.measureText(title).width
			console.log(fontwidth)
			ctx.fillText(title,width/2-fontwidth/2,77);
			ctx.restore()

			ctx.save()
			ctx.font="14.67px 宋体";
			fontwidth = ctx.measureText(order).width
			console.log(fontwidth)
			ctx.fillText(order,width-rightmargin-fontwidth,34);
			ctx.restore()
			ctx.moveTo(leftmargin,80);
			ctx.lineTo(width-rightmargin,80);
			ctx.stroke();
      ctx.scale(1/3.125, 1/3.125);
			let pictureData = sheet.getPictureData()
			// for(let j=0;j<picturedata.length;j++)
			// {
			// 	let picture = new Picture(this.spreadDefult.spread);
			// 	console.log(picturedata)
			// 	let test = await picture.setLocation(ctx,picturedata[i].xAxis,picturedata[i].yAxis,1920,600,"http://42.193.118.98:5005/ContractFile/20220105/seal.png",0);
			// }
      // let canvashtml=sheet._getCanvas();
      // sheet.canvasPictureBack = ctx.getImageData(0,0,canvashtml.width,canvashtml.height);
      if(pictureData)
      {
      	let pictureAxis = sheet.getAxis(1,1,3)
      	console.log(pictureAxis,mutilist)
      	for(var j=0;j<pictureData.length;j++)
      	{
      		sheet.setPictureColorPrint(ctx,pictureData,j,[leftmargin*3.125,topmargin*3.125],mutilist,wmuti,hmuti)
      	}
      }


			this.canvases.push(canvas);
		}
		that.toPrint();


	    // this.el.show();
	}
	printExcel.prototype.printPicture = function(spread)
	{

	}
	printExcel.prototype.setBackGround = function(ctx)
	{
		const { data, paper } = this;
		const { width, height, padding } = paper;
		var cellsRect = new GrapeCity.UI.Rect;
		cellsRect.x = 0;
		cellsRect.y = 0;
		cellsRect.width = width;
		cellsRect.height = height;
		ctx.save();
		ctx.rect(cellsRect.x, cellsRect.y, cellsRect.width, cellsRect.height);
		ctx.clip();
		ctx.beginPath();
		ctx.fillStyle = 'lightgray';
		ctx.fillRect(cellsRect.x, cellsRect.y, cellsRect.width, cellsRect.height)
	}

	printExcel.prototype.btnClick = function(type) {
		console.log(this.el)
		if (type === 'cancel') {
			this.el.hide();
		} else {
			this.toPrint();
		}
	}
	printExcel.prototype.toPrint = function() {
		this.el.hide();
		const { paper } = this;
		const iframe = h('iframe', '').hide();
		const { el } = iframe;
		window.document.body.appendChild(el);
		const { contentWindow } = el;
		const idoc = contentWindow.document;
		const style = document.createElement('style');
		let width = paper.width*3.125
		let height = paper.height*3.125
		style.innerHTML = `
		  @page { size: ${width}px ${height}px; left: 0px; right: 0px; top: 0px; bottom: 0px;};
		  canvas {
		    page-break-before: auto;
		    page-break-after: always;
		  };
		`;
		idoc.head.appendChild(style);
		this.canvases.forEach((it) => {
		  const cn = it.cloneNode(false);
		  console.log(it)
		  const ctx = cn.getContext('2d');
		  // ctx.imageSmoothingEnabled = true;
		  ctx.drawImage(it, 0, 0);
		  idoc.body.appendChild(cn);
		});

		contentWindow.print();
	}

	let spreadDefult = function (spread_init) {
	    this.spread = spread_init;
	};



    window.printExcel = printExcel;
})(window, jQuery);
