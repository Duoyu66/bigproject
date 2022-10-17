(function (window, $) {
    "use strict";;
    var spread = $.wijmo.wijspread,
        UI = GrapeCity.UI;
	function DChart5(args) {
	    this.args = args;
	}
	DChart5.prototype = new UI.BaseCellType();
	DChart5.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
	    try {
	        var offcanvas = DrawChart5_fob(this.args, w, h);

	        if (!offcanvas) {
	            return;
	        }
	        ctx.save();
	        ctx.drawImage(offcanvas, x+1, y+1, w-2, h-2);
	        ctx.stroke();
	        ctx.restore();
	    }
	    catch (e) { console.log('fun fail ' + e.message); }
	};

	function DrawChart5_fob(args, width_vob, height_vob) {
	    var aX = new Array();
	    var aY = new Array();
	    var aZ = new Array();
	    var I = 0;
	    var nIndex_vob = 0;
	    var sXValue_vob = "",sYValue_vob = "",sYValue1 = "",sZValue = "",sDesign = "",aImage_vob = "";
	    var aX1_vob = 0,aX2_vob = 0,aX3_vob = 0,aY1_vob = 0,aY2_vob = 0,aY3_vob = 0,dDesign = 0;
	    var nCompute = 0,sIniFilePath = "";
	    //nIndex_vob = g_nActiveSheet - 1;
	    for (I = 1; I <= 5; I++) {
          // console.log(args[3] + IntToStr(I))
	        sXValue_vob = GetValueByMetaNameInReport(args[3] + IntToStr(I));
           // console.log(sXValue_vob)
	        sYValue_vob = GetValueByMetaNameInReport(args[6] + IntToStr(I));
          // console.log(sXValue_vob)
	        if ((sYValue_vob != '') && (sYValue_vob != '/') && (sXValue_vob != '/') && (sXValue_vob != '')) {
	            aX.push(StrToFloatEx(sXValue_vob));
	            aY.push(StrToFloatEx(sYValue_vob));
	        }
	    }
	    for (I = 1; I <= 6; I++) {
	        sZValue = GetValueByMetaNameInReport(args[6] + IntToStr(I));
	        if ((sZValue != '') && (sZValue != '/')) {
	            aZ.push(StrToFloatEx(sZValue));
	        }
	    }
	    for (I = 1; I <= 4; I++) {
	        sZValue = GetValueByMetaNameInReport(args[6] + IntToStr(11 + I));
	        if ((sZValue != '') && (sZValue != '/')) {
	            aZ.push(StrToFloatEx(sZValue));
	        }
	    }

	    sDesign = GetValueByMetaNameInReport(args[9]);
	    if ((sDesign != '/') && (sDesign != '') && (sDesign != '-')){
	        dDesign = StrToFloatEx(sDesign);
	    }
	    else
	    {
	        dDesign = -1;
	    }
      // console.log(args, aX, aY, aZ, dDesign, width_vob, height_vob)
	    return DrawCurve5(args, aX, aY, aZ, dDesign, width_vob, height_vob);
	}
	function DrawCurve5(args, aX, aY, aZ, dBase, width_vob, height_vob) {
	    var dX = 0,dY = 0,I = 0;
	    var k1_vob = 0,k2_vob = 0,k3_vob = 0,x1 = 0,x2 = 0,a = 0,b = 0,b1_vob = 0,b2_vob = 0;
	    var aTemp = new Array();
	    var aTemp1 = new Array();
	    var aTemp3 = new Array();
	    var bFlag = false;
	    var sTx = new Array();
	    var sTy = new Array();
	    var Result_vob = true;
	    var p;
	    var index = aY.length;
	    if ((aX.length < 3) || (aY.length < 3)) {

	    }
	    for (I = 0; I <= 5; I++) {
	        aTemp[I] = 0;
	    }
	    for (I = 0; I < aZ.length; I++) {
	        aTemp[I] = aZ[I];
	    }
	    if (aX.length == 0) {
	        bFlag = true;
	        aX = LoadCurve(1);
	        aY = LoadCurve(2);
	    }
	    a = FitLineA(aX, aY, a, b);
	    b = FitLineB(aX, aY, a, b);
	    if (b < 0) {
	        SetValueByName(args[10], 'y=' + a.toFixed(6) + 'x' + b.toFixed(6), true)
	    }
	    else {
	        SetValueByName(args[10], 'y=' + a.toFixed(6) + 'x + ' + b.toFixed(6), true);
	    }
	    if (dBase < 0) {
	        dX = aX[2];
	        dY = aY[2];
	    } else {
	        dX = dBase;
	        dY = a * dBase + b;
	    }
	    if (a != 0) {
	        if (aZ.length >= 1)
	            aZ[0] = (aZ[0] - b) / a;
	        if (aZ.length >= 2)
	            aZ[1] = (aZ[1] - b) / a;
	        if (aZ.length >= 3)
	            aZ[2] = (aZ[2] - b) / a;
	        if (aZ.length >= 4)
	            aZ[3] = (aZ[3] - b) / a;
	        if (aZ.length >= 5)
	            aZ[4] = (aZ[4] - b) / a;
	        if (aZ.length >= 6)
	            aZ[5] = (aZ[5] - b) / a;
	        if (aZ.length >= 7)
	            aZ[6] = (aZ[6] - b) / a;
	        if (aZ.length >= 8)
	            aZ[7] = (aZ[7] - b) / a;
	        if (aZ.length >= 9)
	            aZ[8] = (aZ[8] - b) / a;
	        if (aZ.length >= 10)
	            aZ[9] = (aZ[9] - b) / a;

	        for (I = 0; I < aZ.length; I++) {
	            if (aZ[I] != -1) {
	                aTemp1.push(aZ[I]);
	                aTemp3.push(aTemp[I]);
	            }
	        }
	    var data = new Array();
	    for (var i = 0; i < index; i++) {
	        data.push([aX[i], a * aX[i] + b]);
	    }

	    var new_div_vob = document.createElement("div");
	    var option = {
	        title: {
	            text: 'EDTA滴定法标准曲线图',
	            left: 'center'
	        },
	        xAxis: {
	            type: 'value',
	            name: '灰剂量(%)',
	            nameLocation: 'middle',
	            nameGap: 20,
	            min: 0,
	            max: 8,
	            splitNumber: 8,

	        },
	        yAxis: {
	            type: 'value',
	            name: 'EDTA消耗量(ml)',
	            nameLocation : 'end', //坐标轴位置
	            nameGap: 15, //与坐标轴的距离
	            nameRotate: 0,//坐标轴标题的旋转角度
	            min: 0,
	            scale: true,
	            max: 25,
	            splitNumber: 10,
	            nameTextStyle: {
	                fontSize :10,
	            }
	        },
	        series: [{
	            type: 'line',
	            markLine:  {
	                animation: false,
	                lineStyle: {
	                    normal: {
	                        type: 'solid'
	                    }
	                },
	                label: {
	                    normal: {
	                        //formatter: 'y=' + a.toFixed(6) + 'x + ' + b.toFixed(6),
	                        textStyle: {
	                            align: 'right'
	                        }
	                    }
	                },
	                tooltip: {
	                    formatter: 'y=' + a.toFixed(6) + 'x + ' + b.toFixed(6),
	                },
	                data: [
	                    [{
	                        coord: [aX[0], aY[0]],  //直线的起点 两点确定一条直线
	                        symbol: 'none'
	                    }, {
	                        coord: [aX[index - 1], aY[index - 1]], //直线的末尾 两点确定一条直线
	                        symbol: 'none'
	                    }],

	                ]

	            },
	            markPoint: {
	                symbolSize: '8',
	                label: {
	                    normal: {
	                        show: true,
	                        formatter: dY.toFixed(2),
	                        position: 'right',
	                        color:'#fff'
	                    }
	                },
	                data: [
	                    {
	                        coord: [dX, dY],
	                        symbol: 'triangle',
	                    }
	                ]
	            }
	        },
	        {
	            type: 'line',
	            smooth: false,
	            itemStyle:{
	                normal:{
	                    lineStyle:{
	                        width:2,
	                        type: 'dotted',  //'dotted'虚线 'solid'实线
	                        lineStyle: {
	                            color: "#FF4500"
	                        }
	                    },
	                    color: "#FF4500"
	                }
	            },
	            markLine: {
	                data: [
	                     [{
	                         coord: [0, dY],  //直线的起点 两点确定一条直线
	                         symbol: 'none'
	                     }, {
	                         coord: [dX, dY], //直线的末尾 两点确定一条直线
	                         symbol: 'none'
	                     }]
	                ]
	            }
	        }, {
	            type: 'line',
	            smooth: false,
	            itemStyle: {
	                normal: {
	                    lineStyle: {
	                        width: 2,
	                        type: 'dotted',  //'dotted'虚线 'solid'实线
	                        lineStyle: {
	                            color: "#FF4500"
	                        }
	                    },
	                    color: "#FF4500"
	                }
	            },
	            markLine: {
	                data: [
	                     [{
	                         coord: [dX, 0],  //直线的起点 两点确定一条直线
	                         symbol: 'none'
	                     }, {
	                         coord: [dX, dY], //直线的末尾 两点确定一条直线
	                         symbol: 'none'
	                     }]
	                ]
	            }
	        }]
	    };
      // console.log(JSON.stringify(option))
	    new_div_vob.style.width = (width_vob) + "px";
	    new_div_vob.style.height = (height_vob) + "px";
	    new_div_vob.style.display = 'none';
	    document.body.appendChild(new_div_vob);
	    var sId_vob = "ks" + Math.random();
	    new_div_vob.id = sId_vob;
	    var myChart_vob = echarts.init(new_div_vob);
	    myChart_vob.setOption(option);
		myChart_vob.dispatchAction({
		    type: 'highlight',
		    seriesIndex: 0,
		    dataIndex: 0
		});
			var aTemp1 = new Array();
		    aTemp1.push(dX);
		    var aTemp3 = new Array();
		    aTemp3.push(dY);

		}
	    var nCompute = 100;
	    if (nCompute == 100) {
	        for (I = 0; I < aZ.length; I++) {
	            if (aZ[I] > 0) {
	                if (I < 6) {
	                    SetValueByName(args[3] + IntToStr(I + 1), parseFloat(aZ[I]).toFixed(1), false)
	                } else {
	                    SetValueByName(args[3] + IntToStr(11 + I - 6 + 1), parseFloat(aZ[I]).toFixed(1), false)
	                }
	            }
	        }
	    }
	    return getCanvas(myChart_vob);
	}

	function getCanvas(myChart_vob) {
    var offcanvas = myChart_vob.getRenderedCanvas({
        pixelRatio: 1,
        backgroundColor: '#fff'
    });
    return offcanvas;
		// return new Promise((resolve, reject) => {
		// 	var loading=false;
		// 	myChart_vob.on('finished', function () {
		// 	    loading=true
		// 	});
		// 	let index = setInterval(function() {
		// 		console.log(1)
		// 		if(loading)
		// 		{
		// 			clearInterval(index)

		// 		}
		// 	},100)
		// })
	}

	function Point2D(x, y) {
	    this.x = x || 0.0;
	    this.y = y || 0.0;
	}
	function bisection(data, value) {
	    if (data.length <=0) {
	        return -1;
	    }
	    var low_vob = PointOnCubicBezier(data, 1.000),
	        high_vob = PointOnCubicBezier(data, 0),
	        mid_vob = 0;
	    var temp_vob = 1.00;
	    while (low_vob.y < high_vob.y) {

	        mid_vob = (temp_vob + mid_vob) / 2;
	        if (PointOnCubicBezier(data, mid_vob).y == value) {
	            return mid_vob;
	        } else if (PointOnCubicBezier(data, mid_vob).y > value) {
	            mid_vob = mid_vob + 0.001;
	            temp_vob = mid_vob;
	            high_vob = PointOnCubicBezier(data, mid_vob);
	        } else {
	            mid_vob = mid_vob - 0.001;
	            temp_vob = mid_vob;
	            low_vob = PointOnCubicBezier(data, mid_vob);
	        }
	    }
	    return mid_vob;
	}
	function PointOnCubicBezier(cp, t) {
	    if (t==-1) {
	        return new Point2D;
	    }
	    var ax, bx, cx;
	    var ay, by, cy;
	    var tSquared, tCubed;
	    var Result_vob = new Point2D;

	    //求多值系数/
	    cx = 3.0 * (cp[1].x - cp[0].x);
	    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
	    ax = cp[3].x - cp[0].x - cx - bx;

	    cy = 3.0 * (cp[1].y - cp[0].y);
	    by = 3.0 * (cp[2].y - cp[1].y) - cy;
	    ay = cp[3].y - cp[0].y - cy - by;

	    //计算曲线点/

	    tSquared = t * t;
	    tCubed = tSquared * t;

	    Result_vob.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
	    Result_vob.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;

	    return Result_vob;
	}
	function BubbleSort(dValue_vob) {
	    var temp_vob = 0;
	    for (var i = 0; i < dValue_vob.length - 1; i++) {
	        for (var j = 0; j < dValue_vob.length - 1; j++) {
	            if (dValue_vob[j] > dValue_vob[j + 1]) {
	                temp_vob = dValue_vob[j];
	                dValue_vob[j] = dValue_vob[j + 1];
	                dValue_vob[j + 1] = temp_vob;
	            }
	        }
	    }
	    return dValue_vob;
	}
	function StrToFloatEx(sValue_vob) {
	    if (isNaN(parseFloat(sValue_vob))) {
	        return 0;
	    }
	    else {
	        return parseFloat(sValue_vob);
	    }
	}
	function RoundToEx(aValue_vob, dUnit_vob, nScale_vob) {
	    var sValue_vob;
	    var dValue_vob;
	    var dResult_vob;
	    var nPointPos;
	    var n;
	    if (dUnit_vob < 1 && nScale_vob >= 0) {
	        nScale_vob = nScale_vob - 1;
	    }
	    if (nScale_vob >= 0) {
	        n = (Math.round(nScale_vob) + 10);
	        aValue_vob = aValue_vob.toFixed(n);
	    }
	    dValue_vob = aValue_vob / dUnit_vob;
	    dValue_vob = Math.abs(dValue_vob) * Math.pow(10, nScale_vob);
	    sValue_vob = dValue_vob.toString();
	    //for (var i = 0; i < n; i++) {
	    //	sValue_vob += "0";
	    //}

	    nPointPos = sValue_vob.indexOf(".");
	    dResult_vob = dValue_vob;
	    if (nPointPos >= 0) {

	        if (sValue_vob[nPointPos + 1] > "5") {
	            dResult_vob = parseInt(dValue_vob) + 1;
	        }

	        else if (sValue_vob[nPointPos + 1] == "5") {
	            if ((nPointPos + 2) > sValue_vob.length - 1) {
	                n = sValue_vob.charCodeAt(nPointPos - 1) - 48;
	                if (n % 2 == 0) {
	                    dResult_vob = parseInt(dValue_vob);
	                }
	                else {
	                    dResult_vob = parseInt(dValue_vob) + 1;
	                }
	            }
	            else {
	                dResult_vob = parseInt(dValue_vob) + 1;
	            }
	        }
	        else {
	            dResult_vob = parseInt(dValue_vob);
	        }
	    }
	    var sign_vob = aValue_vob < 0 ? -1 : 1;
	    var Result_vob = dResult_vob * sign_vob / Math.pow(10, nScale_vob);
	    Result_vob = Result_vob * dUnit_vob;
	    return Result_vob;
	}
	//返回a b 为 变参
	function FitLineA(X, Y, a, b) {
	    var I = 0,nCount_vob = 0,sumx = 0,sumy = 0,sumxy = 0,sumxx = 0,averagex = 0,averagey = 0;
	    var Result_vob = true;
	    nCount_vob = X.length;
	    sumx = 0;
	    sumy = 0;
	    sumxy = 0;
	    sumxx = 0;
	    for (I = 0; I < nCount_vob; I++) {
	        sumx = sumx + X[I];
	        sumy = sumy + Y[I];
	        sumxy = sumxy + X[I] * Y[I];
	        sumxx = sumxx + X[I] * X[I];
	    }
	    try {
	        averagex = sumx / nCount_vob;
	        averagey = sumy / nCount_vob;

	        a = (nCount_vob * sumxy - sumx * sumy) / (nCount_vob * sumxx - sumx * sumx);
	        b = (sumxx * sumy - sumx * sumxy) / (nCount_vob * sumxx - sumx * sumx);
	    } catch (e) {
	        console.log('fun fail ' + e.message);
	        a = 0;
	        b = 0;
	        Result_vob = false;
	    }
	    return a;
	}
	//返回a b 为 变参
	function FitLineB(X, Y, a, b) {
	    var I = 0,nCount_vob = 0,sumx = 0,sumy = 0,sumxy = 0,sumxx = 0,averagex = 0,averagey = 0;
	    var Result_vob = true;
	    nCount_vob = X.length;
	    sumx = 0;
	    sumy = 0;
	    sumxy = 0;
	    sumxx = 0;
	    for (I = 0; I < nCount_vob; I++) {
	        sumx = sumx + X[I];
	        sumy = sumy + Y[I];
	        sumxy = sumxy + X[I] * Y[I];
	        sumxx = sumxx + X[I] * X[I];
	    }
	    try {
	        averagex = sumx / nCount_vob;
	        averagey = sumy / nCount_vob;

	        a = (nCount_vob * sumxy - sumx * sumy) / (nCount_vob * sumxx - sumx * sumx);
	        b = (sumxx * sumy - sumx * sumxy) / (nCount_vob * sumxx - sumx * sumx);
	    } catch (e) {
	        console.log('fun fail ' + e.message);
	        a = 0;
	        b = 0;
	        Result_vob = false;
	    }
	    return b;
	}
	function LoadCurve(nDir) {
	    var slTemp_vob = "";
	    var sX = "",
	        sY = "",
	        sIniFilePath = "";
	    var I = 0;
	    var a = new Array();
	    //ini 文件
	    // sIniFilePath = g_sSharePath + 'config.ini';
	    // sX = ReadIniString(sIniFilePath, 'ASHCURVE', 'XVALUE', '');
	    //sY = ReadIniString(sIniFilePath, 'ASHCURVE', 'YVALUE', '');
	    //1&`3.2,2,4&`2.1,3.6
	    var Res_vob = localStorage.getItem(baseData_vob.org_id + '-1000-config');
	    if (Res_vob != null && Res_vob != undefined) {
	        var aList_vob = Res_vob.split("&`");
	        for (var i = 0; i < aList_vob.length; i++) {
	            sX = aList_vob[1];
	            sY = aList_vob[2];
	        }
	    }
	    if (nDir == 1) {
	        slTemp_vob = sX.split(";");
	        if (slTemp_vob.length > 0) {
	            for (I = 0; I <= slTemp_vob.length - 1; I++) {
	                a[I] = StrToFloat(slTemp_vob[I]);
	            }
	        }
	    } else if (nDir == 2) {

	        slTemp_vob = sY.split(";");
	        if (slTemp_vob.length > 0) {

	            for (I = 0; I <= slTemp_vob.length - 1; I++) {
	                a[I] = StrToFloat(slTemp_vob[I]);
	            }
	        }
	    }
	    return a;
	}
	function IntToStr(sValue_vob)
	{
	  return sValue_vob.toString()
	}

	spread.DChart5 = DChart5;
})(window, jQuery);
