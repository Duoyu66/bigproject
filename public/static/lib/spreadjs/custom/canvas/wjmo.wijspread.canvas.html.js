(function (window, $) {
    "use strict";;
    function Pen(x, y, pressure) {
        this.x = x;
        this.y = y;
        this.pressure = pressure;
    }
    Pen.prototype.GetPressure = function () {
        try {
            return this.x
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.SetPressure = function (pressure) {
        try {
            switch (typeof pressure) {
                case 'string':
                    pressure = parseFloat(pressure);
                    break;
            }
            this.pressure = pressure;
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.GetX = function () {
        try {
            return this.x
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.SetX = function (x) {
        try {
            switch (typeof x) {
                // case 'string':
                //     x = parseFloat(x);
                //     break;
                default:
                    x = new Decimal(x)
                    break;
            }
            this.x = x;
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.GetY = function () {
        try {
            return this.y;
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.SetY = function (y) {
        try {
            switch (typeof y) {
                // case 'string':
                //     y = parseFloat(y);
                //     break;
                default:
                    y = new Decimal(y)
                    break;
            }
            this.y = y;
        } catch (e) {
            console.log(e);
        }
    }
    Pen.prototype.UnlongToThis = function (source) {
        try {
            switch (typeof source) {
                case 'string':
                    source = new Decimal(source)
                    //source = parseFloat(source);
                    break;
            }
            //source = source >>> 0;
            let x = (source >>> 21);
            let y = ((source >>> 10) & 0x7ff);
            let pressure = source & 0x3ff;
            this.SetX(x);
            this.SetY(y);
            this.SetPressure(pressure);
            return 1;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }
    function Handwriting() {
        this.list = [];
        this.maxX = -Number.MAX_VALUE;
        this.maxY = -Number.MAX_VALUE;
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxPressure = -Number.MAX_VALUE;
        this.minPressure = Number.MAX_VALUE;
    }
    Handwriting.prototype.FromString = function (source) {
        return this.UnlongToThis(source);
    }
    Handwriting.prototype.UnlongToThis = function (source) {
        let sPanList = source.split(';');
        let length = sPanList.length;
        let pen;
        for (let i = 0; i < length; i++) {
            pen = new Pen();
            if (pen.UnlongToThis(sPanList[i]) > 0) {
                this.ListAdd(pen);
            }
        }
        return this.list.length;
    }
    Handwriting.prototype.getList = function (pen) {
        return this.list;
    }
    Handwriting.prototype.ListAdd = function (pen) {
        // if (pen.GetX() > this.maxX) {
        //     this.maxX = pen.GetX();
        // }
        // if (pen.GetY() > this.maxY) {
        //     this.maxY = pen.GetY();
        // }
        // if (pen.GetX() < this.minX) {
        //     this.minX = pen.GetX();
        // }
        // if (pen.GetY() < this.minY) {
        //     this.minY = pen.GetY();
        // }
        if (pen.GetPressure() > this.maxPressure) {
            this.maxPressure = pen.GetPressure();
        }
        if (pen.GetPressure() < this.minPressure) {
            this.minPressure = pen.GetPressure();
        }
        this.list.push(pen);
    }
    Handwriting.prototype.addList = function (x, y, pressure) {
        try {
            let pen = new Pen(x, y, pressure);
            this.ListAdd(pen);
        } catch (e) {
            console.log(e);
        }
    }
    function SignCellType(source, option) {
        this.defaultOtpion = {
            isCompress: true,
            hAlign: 1,
            vAlign: 1,
        }
        this.option = $.extend({}, JSON.parse(JSON.stringify(this.defaultOtpion)), option);
        this.source = source;
        this.size = 10;
        this.generateHandwriting();
    }
    SignCellType.prototype.unzip = function (source) {

        if (!source) {
            source = this.source;
        }
        switch (typeof source) {
            case 'string':
            case 'number':
                source = this.source;
                break;
            case 'object':
                source = this.source.handwriting;
                break
        }
        if (!source) {
            return '';
        }
        if (!this.option.isCompress) {
            return source;
        }
        if (source.replaceAll) {
            source = source.replaceAll(' ', '+');
        } else {
            source = source.replace(/\s/g, '+');
        }

        return this.unzipPako(source);
    }
    SignCellType.prototype.unzipPako = function (b64Data) {
      if (!b64Data || typeof b64Data != 'string') {
      	return b64Data;
      }
      let strData = base64js.toByteArray(b64Data);
      // // Convert binary string to character-number array
      // let charData = strData.split('').map(function(x) {
      // 	return x.charCodeAt(0);
      // });
      // Turn number array into byte-array
      // let binData = new Uint8Array(strData);
      // // unzip
      let array = pako.ungzip(strData);
      // Convert gunzipped byteArray back to ascii string:
      //strData = String.fromCharCode.apply(null, new Uint16Array(array));
      let chunk = 8 * 1024;
      let i;
      array = new Uint16Array(array)
      strData = ''
      for (i = 0; i < array.length / chunk; i++) {
      	strData += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
      }
      strData += String.fromCharCode.apply(null, array.slice(i * chunk));
      // 将乱码的中文进行转换
      // let jsonResult = decodeURIComponent(escape((strData)))
      let jsonResult = decodeURIComponent(strData)
      return jsonResult;
    }
    SignCellType.prototype.generateHandwriting = function (source) {
        if (!source) {
            source = this.source;
        }
        let HandwritingList = [];
        let sDecompress = this.unzip(source);
        if (!sDecompress && source && source.person_name) {
            this.person_name = source.person_name;
            return this.person_name;
        }
        let sHandwriting = sDecompress.split(',');
        console.log(sDecompress)
        let length = sHandwriting.length;
        let handwriting = '';
        let temp, width, heigth, maxPressure, minPressure;
        minPressure = Number.MAX_VALUE;
        if (length > 1) {
            temp = Number(sHandwriting[0]);
            width = new Decimal(temp >>> 21);;
            heigth = new Decimal((temp >>> 10) & 0x7ff);
            maxPressure = temp & 0x3ff;
        }

        //恢复笔迹
        for (let i = 1; i < length; i++) {
            handwriting = new Handwriting();
            if (handwriting.FromString(sHandwriting[i]) > 0) {
                HandwritingList.push(handwriting);
                if (HandwritingList.minPressure < minPressure) {
                    minPressure = HandwritingList.minPressure;
                }
            }
        }
        this.HandwritingList = HandwritingList;
        this.signWidth = width;
        this.signHeight = heigth;
        this.maxPressure = maxPressure;
        this.minPressure = minPressure;
    }
    SignCellType.prototype.drawLine = function (ctx, startX, startY, endX, endY, pressure) {
        if (pressure > 3) {
            //pressure = 1.5;
            //console.log('pressure',pressure);
            pressure = 3;
        }


        ctx.lineWidth = pressure;
        ctx.beginPath();
        ctx.moveTo(startX.toNumber(), startY.toNumber());
        ctx.lineTo(endX.toNumber(), endY.toNumber());
        ctx.stroke();
        ctx.closePath();

    }
    SignCellType.prototype.drawSign = function (ctx, x, y, w, h) {
      console.log(this.HandwritingList);
      if (this.HandwritingList && this.HandwritingList.length > 0) {
          ctx.save();
          // draw inside the cell's boundary
          ctx.rect(x, y, w, h);
          ctx.clip();
          ctx.strokeStyle = '#000';
          this.paintSign(ctx, x, y, w, h);
          ctx.fill();
          ctx.restore();
      }
    }
    SignCellType.prototype.paintSign = function (ctx, x, y, cellWidth, cellHeigth) {
        let length = 0;
        let handwriting = '';
        let temp, width, heigth, tempList, maxPressure, minPressure;
        let pen, last_pen;
        let widthZoom, heigthZoom, zoom, heigthMargin, widthMargin, wpressure, hpressure, npressureZoom, npressure;
        let padding = new Decimal('0.1');
        maxPressure = this.maxPressure;
        minPressure = this.minPressure;
        width = this.signWidth;
        heigth = this.signHeight;
        cellWidth = new Decimal(cellWidth);
        cellHeigth = new Decimal(cellHeigth);
        widthZoom = cellWidth.div(width);
        heigthZoom = cellHeigth.div(heigth);
        if (heigthZoom.toNumber() > widthZoom.toNumber()) {
            //console.log(1);
            widthZoom = cellWidth.sub(cellWidth.mul(padding.mul(new Decimal(2)))).div(width);
            zoom = widthZoom;
            heigthMargin = cellHeigth.sub(heigth.mul(zoom)).div(new Decimal(2));
            widthMargin = cellWidth.mul(padding);
        }
        else if (heigthZoom.toNumber() < widthZoom.toNumber()) {
            //console.log(2);
            heigthZoom = cellHeigth.sub(cellHeigth.mul(padding.mul(new Decimal(2)))).div(heigth);
            //heigthZoom = cellHeigth * (1 - 2 * padding) / heigth;
            zoom = heigthZoom;
            widthMargin = cellWidth.sub(width.mul(zoom)).div(new Decimal(2));
            //widthMargin = (cellWidth - (width * zoom)) / 2;
            heigthMargin = cellHeigth.mul(padding);
            //heigthMargin = cellHeigth * padding;
        }
        else if (heigthZoom.equals(widthZoom)) {
            //console.log(3);
            widthZoom = cellWidth.sub(cellWidth.mul(padding.mul(new Decimal(2)))).div(width);
            //widthZoom = cellHeigth * (1 - 2 * padding) / width;
            zoom = widthZoom;
            widthMargin = cellWidth.mul(padding);
            heigthMargin = cellHeigth.mul(padding);
        }
        widthMargin = widthMargin.add(x);
        heigthMargin = heigthMargin.add(y);
        wpressure = (maxPressure - minPressure) / cellWidth.toNumber();
        hpressure = (maxPressure - minPressure) / cellHeigth.toNumber();
        npressureZoom = wpressure > hpressure ? wpressure : hpressure;
        npressureZoom = npressureZoom / 5;
        //
        length = this.HandwritingList.length;

        for (let i = 0; i < length; i++) {
            handwriting = this.HandwritingList[i];
            tempList = handwriting.getList();
            last_pen = '';
            for (let j = 0; j < tempList.length; j++) {
                pen = tempList[j];
                if (last_pen) {

                    npressure = pen.GetPressure() / 200;

                    if (npressureZoom) {
                        npressure = npressure / npressureZoom;
                    }
                    this.drawLine(ctx, last_pen.GetX().mul(zoom).add(widthMargin), last_pen.GetY().mul(zoom).add(heigthMargin), pen.GetX().mul(zoom).add(widthMargin), pen.GetY().mul(zoom).add(heigthMargin), npressure);
                }
                last_pen = pen;

            }

        }
    }

    SignCellType.prototype.focus = function (editorContext) {
        if (editorContext && editorContext.focus)
            editorContext.focus()
    }
    SignCellType.prototype.getEditorValue = function (editorContext, context) {
        return this.person_name;
    }
    SignCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
        var xm = cellRect.x + cellRect.width / 2,
            ym = cellRect.y + cellRect.height / 2,
            size = 10;
        var info = { x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: context.sheetArea };
        if (xm - size <= x && x <= xm + size && ym - size <= y && y <= ym + size) {
            info.isReservedLocation = true;
        }
        return info;
    };
    window.SignCellType = SignCellType;
})(window, jQuery);
