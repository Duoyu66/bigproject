
(function (window, $) {
    "use strict";;
    let UI = GrapeCity.UI;
    let Calc = GrapeCity.Calc;
    function GetNumberMax() {
        return Number.MAX_VALUE
    }
    function GetNumberMin() {
        return -Number.MAX_VALUE
    }

    //getMetaIdByMetaName_fob
    //需要用到更据meta_id查名称
    function GetTestDataFunction() {
        this.name = "GetTestData";
        this.minArgs = 1;
        this.maxArgs = 1;
    }
    GetTestDataFunction.prototype = new Calc.Functions.Function();
    GetTestDataFunction.prototype.evaluate = GetTestDataFunctionEval_fob;
    function GetTestDataFunctionEval_fob() {
        var P1_vob = "";
        var sValue_vob = "";
        try {
            if (arguments[0].length < 1)
                return "";
            P1_vob = arguments[0];
            sValue_vob = GetValueByNameInTest(P1_vob[0]);
            console.log(P1_vob[0]);
            console.log(sValue_vob);
            if (typeof (sValue_vob) != "undefined") {
                return sValue_vob;
            }
            else {
                return "/";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            console.log("出错了" + e.message);
            return "/";
        }

    }
    //获取设备名称
    //DeviceList_vob
    function GETDEVICEINFOFunction() {
        this.name = "GETDEVICEINFO";
        this.minArgs = 2;
        this.maxArgs = 2;
    }
    GETDEVICEINFOFunction.prototype = new Calc.Functions.Function();
    GETDEVICEINFOFunction.prototype.evaluate = GETDEVICEINFOFunctionEval_fob;
    function GETDEVICEINFOFunctionEval_fob(args) {
        var DeviceList_vob = window.deviceData
        for (var i = 0; i < DeviceList_vob.length; i++) {
            if (DeviceList_vob[i].manage_id == args[0]) {
                switch (args[1]) {
                    case 1:
                        return DeviceList_vob[i].name;
                    case 2:
                        return DeviceList_vob[i].model;
                    case 3:
                        return DeviceList_vob[i].show_scope;
                    case 4:
                        return DeviceList_vob[i].resolution;
                }
            }
        }
        return "/";
    }
    function GetBoxWeightFunction() {
        this.name = "GetBoxWeight";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    GetBoxWeightFunction.prototype = new Calc.Functions.Function();
    GetBoxWeightFunction.prototype.evaluate = GetBoxWeightFunctionEval_fob;
    function GetBoxWeightFunctionEval_fob(args) { //未完成 待完成
        if (args.length < 1) {
            return "/";
        }
        //    var
        //        P1: Variant;
        //    sValue,sIniFilePath : string;
        //    begin
        //    try
        //        sIniFilePath:=g_sSharePath+'config.ini';
        //    if Sender.GetParamsCount(AParams)< 1 then
        //    begin
        //    Sender.AddValue('');
        //    end;
        //    P1 := Sender.ExtractStringParameter(AParams,0);
        //    sValue := ReadIniString(sIniFilePath,'WEIGHT',P1,'');
        //    Sender.AddValue(sValue);
        //    except
        //    on e: exception do
        //        LogEx(DEBUG,'GetTestData error [%s]',[e.message]);
        //end;
    }



    function AverageExMaxMinFunction() {
        this.name = "AverageExMaxMin";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExMaxMinFunction.prototype = new Calc.Functions.Function();
    AverageExMaxMinFunction.prototype.evaluate = AverageExMaxMinFunctionEval_fob;
    function AverageExMaxMinFunctionEval_fob(args) {
        try {
            if (!args || args.length < 3) {
                return "/";
            }
            var dSum_vob = 0;
            var nCount_vob = 0;
            var dMax_vob = 0;
            var dMin_vob = GetNumberMax();
            var dAvg_vob = 0;
            let array = args;
            for (var i = 0; i < array.length; i++) {
                var P1_vob = array[i];
                var d = parseFloat(P1_vob);
                if (!isNaN(d)) {
                    if (dMax_vob < d) { dMax_vob = d; }
                    if (dMin_vob > d) { dMin_vob = d; }
                    dSum_vob = dSum_vob + d;
                    nCount_vob++;
                }
            }
            dAvg_vob = (dSum_vob - dMax_vob - dMin_vob) / (nCount_vob - 2);
            if (isNaN(dAvg_vob)) {
                return "";
            }
            return dAvg_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }

    function CvExFunction() {
        this.name = "CvEx";
        this.minArgs = 2;
        this.maxArgs = 10
    }
    CvExFunction.prototype = new Calc.Functions.Function();
    CvExFunction.prototype.evaluate = CvExFunctionEval_fob;
    function CvExFunctionEval_fob(args) {

        try {
            var dSum_vob = 0;
            var dAvg_vob = 0;
            if (!args || args.length < 2) {
                return "/";
            }
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob)
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(P1_vob);
                    dSum_vob = dSum_vob + dTemp_vob;
                }
            }
            if (args.length > 0) {
                dAvg_vob = dSum_vob / args.length;
            }
            dSum_vob = 0;
            for (var i = 0; i < dValue_vob.length; i++) {
                dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
            }
            dSum_vob = Math.sqrt(dSum_vob / (dValue_vob.length));
            return dSum_vob / dAvg_vob * 100;

        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function GetStandardFunction() {
        this.name = "GetStandard";
        this.minArgs = 1;
        this.maxArgs = 3;
    }
    GetStandardFunction.prototype = new Calc.Functions.Function();
    GetStandardFunction.prototype.evaluate = GetStandardFunctionEval_fob;
    function GetStandardFunctionEval_fob(args) {
        try {
            var sStandards_vob = args;

            var arrTemp1_vob = new Array();
            //采用标准 100036  评定依据 100008 试验依据 100058
            var sTemp_vob = sStandards_vob[0];
            if (sTemp_vob == undefined || sTemp_vob == "采用标准") {
                sTemp_vob = GetValueByNameInTest("采用标准");
            }
            console.log(sTemp_vob)
            var Result_vob = '';
            let listStandard = window.liststandard;
            if(sTemp_vob===undefined)
            {
              sTemp_vob = '';
              var sTemp1 = GetValueByNameInTest("评定依据");
              if (sTemp1 == undefined) {
                  sTemp1 = '';
              }
              for(let i=0;i<listStandard.length;i++)
              {
                if(sTemp1==listStandard[i].standard_id  && listStandard[i].usage == '1')
                {
                  Result_vob = Result_vob+listStandard[i].standard_id+' '+listStandard[i].doc_name;
                }
              }
            }
            else {
              for(let i=0;i<listStandard.length;i++)
              {
                arrTemp1_vob = sTemp_vob.split(";");
                for(let j=0;j<arrTemp1_vob.length;j++)
                {
                  if(arrTemp1_vob[j]==listStandard[i].standard_id && listStandard[i].usage == '2')
                  {
                    Result_vob = Result_vob+listStandard[i].standard_id+' '+listStandard[i].doc_name;
                  }
                }
              }
              console.log(Result_vob)
              var sTemp1 = GetValueByNameInTest("评定依据");
              if (sTemp1 == undefined) {
                  sTemp1 = '';
              }
              console.log(sTemp1)
              for(let i=0;i<listStandard.length;i++)
              {
                if(sTemp1==listStandard[i].standard_id && listStandard[i].usage == '1')
                {
                  Result_vob = Result_vob+listStandard[i].standard_id+' '+listStandard[i].doc_name;
                }
              }
              console.log(Result_vob)
            }
            // if (sTemp_vob == undefined) {
            //     sTemp_vob = '';
            //     Result_vob = GetStandards(arrTemp1_vob, sTemp1);
            // } else {
            //     arrTemp1_vob = sTemp_vob.split(";");
            //     Result_vob = GetStandards(arrTemp1_vob, sTemp1);
            // }

            // if (baseData_vob.stage < 5) {
            //     dataList_vob.set("100058", Result_vob);
            // }
            return Result_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function PluginFunction() {
        this.name = "Plugin";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    PluginFunction.prototype = new Calc.Functions.Function();
    PluginFunction.prototype.evaluate = PluginFunctionEval_fob;
    function PluginFunctionEval_fob(args) {
        var res = '';
        try {
            if (!args || args.length == 0) {
                return '';
            }
            let str = args[0] + '(';
            let temp = '';
            for (let i = 1; i < args.length; i++) {
                temp += args[i] + ',';
            }
            if (temp.length > 0) {
                temp = temp.substring(0, temp.length - 1);
            }
            str = str + temp + ')';
            res = setJudgeProcInEval(window.listdata.judge_proc,str);
            if(parseInt(res[0]) && parseInt(res[0])>0)
            {
              return res[1];
            }
            else {
              return "/";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            console.log(arguments[0] + " 方法执行失败");
            return "/";
        }

    }
    function AverageExD2Function() {
        this.name = "AverageExD2";
        this.minArgs = 2;
        this.maxArgs = 10;
    }
    AverageExD2Function.prototype = new Calc.Functions.Function();
    AverageExD2Function.prototype.evaluate = AverageExD2FunctionEval_fob;
    function AverageExD2FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 2) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            if (arrTemp_vob.length == 3) {
                c = parseFloat(arrTemp_vob[2]);
            }
            z = (a + b) / 2;
            if (arrTemp_vob.length == 3) {
                if (Math.abs(a - b).toFixed(5) > c) {
                    return "-";
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExD3Function() {
        this.name = "AverageExD3";
        this.minArgs = 2;
        this.maxArgs = 10;
    }
    AverageExD3Function.prototype = new Calc.Functions.Function();
    AverageExD3Function.prototype.evaluate = AverageExD3FunctionEval_fob;
    function AverageExD3FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            if (arrTemp_vob.length == 4) {
                d = parseFloat(arrTemp_vob[3]);
                if (a < b) {
                    z = a;
                    a = b;
                    b = z;
                }
                if (a < c) {
                    z = a;
                    a = c;
                    c = z;
                }
                if (b < c) {
                    z = b;
                    b = c;
                    c = z;
                }
                if (Math.abs(a - b) > d && Math.abs(c - b) > d) {
                    z = 0;
                    return '-';
                }
                else if (Math.abs(a - b) > d || Math.abs(c - b) > d) {
                    z = b;
                }
                else {
                    z = (a + b + c) / 3;
                }
            }
            else {
                z = (a + b + c) / 3;
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExP2Function() {
        this.name = "AverageExP2";
        this.minArgs = 2;
        this.maxArgs = 5;
    }
    AverageExP2Function.prototype = new Calc.Functions.Function();
    AverageExP2Function.prototype.evaluate = AverageExP2FunctionEval_fob;
    //差值和最小值之比及差值大于阀值超差
    function AverageExP2FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (!args || arrTemp_vob.length < 2) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            if (arrTemp_vob.length == 3) {
                c = parseFloat(arrTemp_vob[2]);
            }
            z = (a + b) / 2;
            if (arrTemp_vob.length == 3) {
                if (Math.abs(a - b) / ((a + b) / 2).toFixed(5) > c) {
                    return "-";
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExDL2Function() {
        this.name = "AverageExDL2";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExDL2Function.prototype = new Calc.Functions.Function();
    AverageExDL2Function.prototype.evaluate = AverageExDL2FunctionEval_fob;
    //当两个数值均值大于某阀值时,两值之差大于某值超差，均值大于e时判断差值
    function AverageExDL2FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, e = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 2) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            d = parseFloat(arrTemp_vob[3]);
            e = parseFloat(arrTemp_vob[4]);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e)) {
                return "/";
            }
            z = (a + b) / 2;
            if (Math.abs(a - b) > c) {
                z = 0;
                return "-";
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExDW2Function() {
        this.name = "AverageExDW2";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExDW2Function.prototype = new Calc.Functions.Function();
    AverageExDW2Function.prototype.evaluate = AverageExDW2FunctionEval_fob;
    //差值和最小值之比及差值大于阀值超差
    function AverageExDW2FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 2) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            if (isNaN(a) || isNaN(b)) {
                return "/";
            }
            z = (a + b) / 2;
            if (a < 100 && b > 100) {
                if (Math.abs(a - b) / Math.min(a, b) > 0.05) {
                    return "-";
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExA3Function() {
        this.name = "AverageExA3";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExA3Function.prototype = new Calc.Functions.Function();
    AverageExA3Function.prototype.evaluate = AverageExA3FunctionEval_fob;
    function AverageExA3FunctionEval_fob(args) {
        var P1_vob, P2_vob, P3_vob, P4_vob, a, b, c, d, z, v, nCount_vob = 0, dSum_vob = 0;
        try {
            if (args.length < 3) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            if (args.length == 4) {
                P4_vob = args[3];
                d = args[3];
            }
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
                return "/";
            }
            if (args.length == 4) {
                v = (a + b + c) / 3;
                if (v != 0) {
                    dSum_vob = 0;
                    nCount_vob = 0;
                    if (Math.abs(a - v) / v <= d) {
                        dSum_vob += a;
                        nCount_vob++;
                    }
                    if (Math.abs(b - v) / v <= d) {
                        dSum_vob += b;
                        nCount_vob++;
                    }
                    if (Math.abs(c - v) / v <= d) {
                        dSum_vob += c;
                        nCount_vob++;
                    }
                    if (nCount_vob > 1) {
                        z = dSum_vob / nCount_vob;
                        return z;
                    }
                    else {
                        return "/";
                    }
                }
            }
            else {
                z = (a + b + c) / 3;
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }

    function AverageExM3Function() {
        this.name = "AverageExM3";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExM3Function.prototype = new Calc.Functions.Function();
    AverageExM3Function.prototype.evaluate = AverageExM3FunctionEval_fob;
    function AverageExM3FunctionEval_fob(args) {
        var P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, a, b, c, d, z;
        try {
            if (args.length < 3) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            if (P1_vob == "-" || P2_vob == "-" || P3_vob == "-") {
                return "-";
            }
            if (args.length == 5) {
                P5_vob = args[4];
                P4_vob = args[3];
                d = parseFloat(P4_vob);
            }
            else if (args.length == 4) {
                P4_vob = args[3];
                d = parseFloat(P4_vob);
            }
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                return "/";
            }
            if (args.length >= 4) {
                if(isNaN(d)) {
                  return "/";
                }
                if (a < b) {
                    z = a;
                    a = b;
                    b = z;
                }
                if (a < c) {
                    z = a;
                    a = c;
                    c = z;
                }
                if (b < c) {
                    z = b;
                    b = c;
                    c = z;
                }
                if (b != 0) {
                    if ((Math.abs(a - b) / b > d) && Math.abs(c - b) / b > d) {
                        if (P5_vob == 1) {
                            z = b;
                        }
                        else {
                            z = 0;
                            return "-";
                        }
                    }
                    else if (Math.abs(a - b) / b > d) {
                        if (P5_vob == 1) {
                            z = (b + c) / 2;
                        }
                        else {
                            z = b;
                        }
                    }
                    else if (Math.abs(c - b) / b > d) {
                        if (P5_vob == 1) {
                            z = (a + b) / 2;
                        }
                        else {
                            z = b;
                        }
                    }
                    else {
                        z = (a + b + c) / 3;
                    }
                }
                else {
                    return (a + b) / 2;
                }
            }
            else {
                z = (a + b + c) / 3;
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExPM3Function() {
        this.name = "AverageExPM3";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExPM3Function.prototype = new Calc.Functions.Function();
    AverageExPM3Function.prototype.evaluate = AverageExPM3FunctionEval_fob;
    function AverageExPM3FunctionEval_fob(args) {
        var P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, a, b, c, d, z;
        try {
            if (args.length < 3) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                return "/";
            }
            P4_vob = args[3];
            d = parseFloat(P4_vob);
            if (isNaN(d)) {
                return (a + b + c) / 3;
            }
            if (args.length == 4) {
                if (a < b) {
                    z = a;
                    a = b;
                    b = z;
                }
                if (a < c) {
                    z = a;
                    a = c;
                    c = z;
                }
                if (b < c) {
                    z = b;
                    b = c;
                    c = z;
                }
                if ((Math.abs(a - b) / b > d) && Math.abs(c - b) / b > d) {
                    z = 0;
                    return "-";
                }
                else if ((Math.abs(a - b) / b > d) && Math.abs(c - b) / b > d) {
                    z = b;
                }
                else {
                    z = (a + b + c) / 3;
                }
            }
            else {
                z = (a + b + c) / 3;
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExP6Function() {
        this.name = "AverageExP6";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExP6Function.prototype = new Calc.Functions.Function();
    AverageExP6Function.prototype.evaluate = AverageExP6FunctionEval_fob;
    function AverageExP6FunctionEval_fob(args) {
        var z, a, b, c, d, e, f, g, m, P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, P6_vob, P7_vob;
        try {
            if (args.length < 6) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            P4_vob = args[3];
            P5_vob = args[4];
            P6_vob = args[5];
            if (args.length == 7) {
                P7_vob = args[6];
                g = parseFloat(P7_vob);
            }
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            d = parseFloat(P4_vob);
            e = parseFloat(P5_vob);
            f = parseFloat(P6_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(g)) {
                return "/";
            }
            z = (a + b + c + d + e + f) / 6;
            var t = new Array();
            t[0] = Math.abs(a - z) / z;
            t[1] = Math.abs(b - z) / z;
            t[2] = Math.abs(c - z) / z;
            t[3] = Math.abs(d - z) / z;
            t[4] = Math.abs(e - z) / z;
            t[5] = Math.abs(f - z) / z;
            var n = 0;
            var t1 = t[0];
            for (var m = 0; m < 6; m++) {
                if (t[m] > t1) {
                    t1 = t[m];
                    n = m;
                }
            }
            var m = 6;
            if (n == 0 && t1 > g) {
                a = 0;
                m = 5;
            }
            else if (n == 1 && t1 > g) {
                b = 0;
                m = 5;
            }
            else if (n == 2 && t1 > g) {
                c = 0;
                m = 5;
            }
            else if (n == 3 && t1 > g) {
                d = 0;
                m = 5;
            }
            else if (n == 4 && t1 > g) {
                e = 0;
                m = 5;
            }
            else if (n == 5 && t1 > g) {
                f = 0;
                m = 5;
            }
            /*if (arguments.length == 7) {
                if (z == 0) {
                    return "/";
                }
                m = 0;
                if (Math.abs(a - z) / z > g) {
                    a = 0;
                    m++;
                }
                else if (Math.abs(b - z) / z > g) {
                    b = 0;
                    m++;
                }
                else if (Math.abs(c - z) / z > g) {
                    c = 0;
                    m++;
                }
                else if (Math.abs(d - z) / z > g) {
                    d = 0;
                    m++;
                }
                else if (Math.abs(e - z) / z > g) {
                    e = 0;
                    m++;
                }
                else if (Math.abs(f - z) / z > g) {
                    f = 0;
                    m++;
                }
                else {
                    return z;
                }*/
            z = (a + b + c + d + e + f) / m;
            if (((a != 0) && (Math.abs(a - z) / z > g)) || ((b != 0) && (Math.abs(b - z) / z > g)) ||
                ((c != 0) && (Math.abs(c - z) / z > g)) || ((d != 0) && (Math.abs(d - z) / z > g)) ||
                ((e != 0) && (Math.abs(e - z) / z > g)) || ((f != 0) && (Math.abs(f - z) / z > g))) {
                return "-";
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExT6Function() {
        this.name = "AverageExT6";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExT6Function.prototype = new Calc.Functions.Function();
    AverageExT6Function.prototype.evaluate = AverageExT6FunctionEval_fob;
    function AverageExT6FunctionEval_fob(args) {
        var z, a, b, c, d, e, f, g, m, P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, P6_vob, P7_vob;
        try {
            if (args.length < 6) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            P4_vob = args[3];
            P5_vob = args[4];
            P6_vob = args[5];
            if (args.length == 7) {
                P7_vob = args[6];
                g = parseFloat(P7_vob);
            }
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            d = parseFloat(P4_vob);
            e = parseFloat(P5_vob);
            f = parseFloat(P6_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(g)) {
                return "/";
            }
            m = 6;
            z = (a + b + c + d + e + f) / 6;
            if (args.length == 7) {
                if (z == 0) {
                    return "-";
                }
                if (Math.abs(a - z) / z > g) {
                    a = 0;
                    m--;
                }
                if (Math.abs(b - z) / z > g) {
                    b = 0;
                    m--;
                }
                if (Math.abs(c - z) / z > g) {
                    c = 0;
                    m--;
                }
                if (Math.abs(d - z) / z > g) {
                    d = 0;
                    m--;
                }
                if (Math.abs(e - z) / z > g) {
                    e = 0;
                    m--;
                }
                if (Math.abs(f - z) / z > g) {
                    f = 0;
                    m--;
                }
                if (m < 3) {
                    return "-";
                }
                else {
                    z = (a + b + c + d + e + f) / m;
                    return z;
                }
            }
            else {
                return z;
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExMaxMin6Function() {
        this.name = "AverageExMaxMin6";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExMaxMin6Function.prototype = new Calc.Functions.Function();
    AverageExMaxMin6Function.prototype.evaluate = AverageExMaxMin6FunctionEval_fob;
    function AverageExMaxMin6FunctionEval_fob(args) {
        var z, a, b, c, d, e, f, g, m, P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, P6_vob, P7_vob;
        var v = new Array();
        try {
            if (args.length < 6) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            P4_vob = args[3];
            P5_vob = args[4];
            P6_vob = args[5];
            if (args.length == 7) {
                P7_vob = args[6];
                g = parseFloat(P7_vob);
            }
            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            d = parseFloat(P4_vob);
            e = parseFloat(P5_vob);
            f = parseFloat(P6_vob);
            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(g)) {
                return "/";
            }
            v.push(a); v.push(b); v.push(c); v.push(d); v.push(e); v.push(f); v.push(g);

            m = 6;
            z = (a + b + c + d + e + f) / 6;
            v = BubbleSort(z);
            if (args.length == 7) {
                if ((Math.abs(v[0] - z) / z > g) || Math.abs(v[5] - z) / z > g) {
                    z = (v[1] = v[2] + v[3] + v[4]) / 4;
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageEXMMD3Function() {
        this.name = "AverageEXMMD3";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageEXMMD3Function.prototype = new Calc.Functions.Function();
    AverageEXMMD3Function.prototype.evaluate = AverageEXMMD3FunctionEval_fob;
    function AverageEXMMD3FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            z = (a + b + c) / 3;
            if (arrTemp_vob.length == 4) {
                d = parseFloat(arrTemp_vob[3]);
                if (a < b) {
                    z = a;
                    a = b;
                    b = z;
                }
                if (a < c) {
                    z = a;
                    a = c;
                    c = z;
                }
                if (b < c) {
                    z = b;
                    b = c;
                    c = z;
                }

                if (Math.abs(a - c) > d * z) {
                    z = 0;
                    return '-';
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function AverageEXMMD3_1Function() {
        this.name = "AverageEXMMD3_1";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageEXMMD3_1Function.prototype = new Calc.Functions.Function();
    AverageEXMMD3_1Function.prototype.evaluate = AverageEXMMD3_1FunctionEval_fob;
    function AverageEXMMD3_1FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0;
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            if (a < 0) {
                a = 0;
            }
            if (b < 0) {
                b = 0;
            }
            if (c < 0) {
                c = 0;
            }
            if (arrTemp_vob.length == 4) {
                d = parseFloat(arrTemp_vob[3]);
                if (a < b) {
                    z = a;
                    a = b;
                    b = z;
                }
                if (a < c) {
                    z = a;
                    a = c;
                    c = z;
                }
                if (b < c) {
                    z = b;
                    b = c;
                    c = z;
                }

                if (Math.abs(a - b) > d && Math.abs(a - c) > d) {
                    z = b;
                }
                else if (Math.abs(a - b) > d) {
                    z = (b + c) / 2;
                }
                else if (Math.abs(c - b) > d) {
                    z = (b + a) / 2;
                }
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function AverageTimeFunction() {
        this.name = "AverageTime";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageTimeFunction.prototype = new Calc.Functions.Function();
    AverageTimeFunction.prototype.evaluate = AverageTimeFunctionEval_fob;
    function AverageTimeFunctionEval_fob(args) {
        var nMsec = 0, P1_vob, P2_vob, P3_vob;
        P1_vob = args[0];
        P2_vob = args[1];
        P3_vob = args[2];
        try {
            if (P3_vob != null && typeof (P3_vob) != "undefined" && P3_vob != "") {
                nMsec = parseInt(P3_vob);
            }
            var myDate1 = new Date('2000-01-01 00:' + P1_vob);
            var myDate2 = new Date('2000-01-01 00:' + P2_vob);
            if (nMsec != 0) {

                if (Math.abs((myDate1.getTime() - myDate2.getTime()) / 1000) > nMsec) {
                    return "-";
                }
            }

            var tTime_vob = Math.abs(myDate1.getMinutes() * 60 + myDate1.getSeconds() + myDate2.getMinutes() * 60 + myDate2.getSeconds()) / 2;
            var m = Math.floor(tTime_vob / 60);
            if (m < 10) {
                m = '0' + m;
            }
            var s = Math.floor(tTime_vob % 60);
            if (s < 10) {
                s = '0' + s;
            }
            var temp_vob = m + ":" + s;
            return temp_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function RoundExFunction() {
        this.name = "RoundEx";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    RoundExFunction.prototype = new Calc.Functions.Function();
    RoundExFunction.prototype.evaluate = RoundExFunctionEval_fob;
    function RoundExFunctionEval_fob(args) {
        try {
            var Value = args[0];
            var dUnit_vob = args[1];
            var dScale = args[2];
            if (Value + "a" == "a") { //判断是不是空字符串
                return "/";
            }
            var sValue_vob = "";


            if (isNaN(Value) || isNaN(dUnit_vob) || isNaN(dScale)) {
                if (Value == "-" || Value == "/") {
                    return Value;
                }
                else {
                    return "";
                }
            }
            else {
                Value = parseFloat(Value);
                dUnit_vob = parseFloat(dUnit_vob);
                dScale = parseFloat(dScale);
                var dValue_vob = RoundToEx(Value, dUnit_vob, dScale);
                var nScale_vob = Math.trunc(dScale);
                if (dScale >= 0) {
                    sValue_vob = String(dValue_vob.toFixed(nScale_vob));//使用toFix之前原数加一,使用之后减一
                }
                else {
                    sValue_vob = String(dValue_vob);
                }
            }
            return sValue_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            console.log(e.message);
            return "";
        }
    }
    function RoundEx1Function() {
        this.name = "RoundEx1";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    RoundEx1Function.prototype = new Calc.Functions.Function();
    RoundEx1Function.prototype.evaluate = RoundEx1FunctionEval_fob;
    function RoundEx1FunctionEval_fob(args) {
        var Value, dUnit_vob = "", dScale = "";
        try {
            if (args.length != 1) {
                return "";
            }
            if (args[0] == "") { return ""; }
            else if (!isNaN(parseFloat(args[0]))) {
                Value = parseFloat(args[0]);
                if (Value <= 200) {
                    return RoundToEx(Value, 1, 0);
                }
                else if ((Value > 200) && (Value <= 1000)) {
                    return RoundToEx(Value, 0.5, 0);
                }
                else {
                    return RoundToEx(Value, 1, -1);
                }
            }
            else {
                return "";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "";
        }
    }
    function RoundEx2Function() {
        this.name = "RoundEx2";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    RoundEx2Function.prototype = new Calc.Functions.Function();
    RoundEx2Function.prototype.evaluate = RoundEx2FunctionEval_fob;
    function RoundEx2FunctionEval_fob(args) {
        var Value = "";
        var dUnit_vob = "";
        var dScale = "";
        try {
            if (args.length != 1) {
                return "";
            }
            if (args[0] == "" || args[0] == '/') {
                return "";
            }
            else if (!isNaN(parseFloat(args[0]))) {
                Value = parseFloat(args[0]);
                if (Value <= 10) {
                    return RoundToEx(Value, 0.5, 1);
                }
                else {
                    return RoundToEx(Value, 1, 0);
                }
            }
            else {
                return "";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "";
        }

    }
    function FindExFunction() {
        this.name = "FindEx";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    FindExFunction.prototype = new Calc.Functions.Function();
    FindExFunction.prototype.evaluate = FindExFunctionEval_fob;
    function FindExFunctionEval_fob(args) {
        if (args.length < 2) {
            return '';
        }
        try {
            return args[1].indexOf(args[0]);
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return '';
        }
    }
    function MinuteDiffFunction() {
        this.name = "MinuteDiff";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    MinuteDiffFunction.prototype = new Calc.Functions.Function();
    MinuteDiffFunction.prototype.evaluate = MinuteDiffFunctionEval_fob;
    function MinuteDiffFunctionEval_fob(args) {
        try {
            var P1_vob = args[0];
            var P2_vob = args[1];
            var t1 = new Date('2000-01-01 00:' + P1_vob);
            var t2 = new Date('2000-01-01 00:' + P2_vob);
            var tTime_vob;
            if (t1 < t2) {
                //tTime_vob = t1 + 1 - t2;
                tTime_vob = (t1.getTime() / 1000 + 86400) * 1000 - t2.getTime();
            }
            else {
                //tTime_vob = t1 - t2;
                tTime_vob = (t1.getTime() - t2.getTime()) / 1000;
            }
            //var myDate = new Date(tTime_vob);
            //return myDate.getHours() * 60 + myDate.getMinutes();
            return tTime_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function SecondDiffFunction() {
        this.name = "SecondDiff";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    SecondDiffFunction.prototype = new Calc.Functions.Function();
    SecondDiffFunction.prototype.evaluate = SecondDiffFunctionEval_fob;
    function SecondDiffFunctionEval_fob(args) {

        try {
            var P1_vob = args[0];
            var P2_vob = args[1];
            var tTime_vob = 0;
            var nPos, sHour, sMin, sSec;
            var Result_vob = 0;

            nPos = P1_vob.indexOf(":");
            if (nPos >= 0) {
                sHour = P1_vob.substring(0, nPos);
                P1_vob = P1_vob.substring(nPos + 1);
                nPos = P1_vob.indexOf(":");
                sMin = P1_vob.substring(0, nPos);
                sSec = P1_vob.substring(nPos + 1, 5);
                P1_vob = parseInt(sHour) * 3600 + parseInt(sMin) * 60 + parseInt(sSec);
            }
            nPos = P2_vob.indexOf(":");
            if (nPos >= 0) {
                sHour = P2_vob.substring(0, nPos);
                P2_vob = P2_vob.substring(nPos + 1);
                nPos = P2_vob.indexOf(":");
                sMin = P2_vob.substring(0, nPos);
                sSec = P2_vob.substring(nPos + 1, 5);
                P2_vob = parseInt(sHour) * 3600 + parseInt(sMin) * 60 + parseInt(sSec);
            }
            return Math.abs(P2_vob - P1_vob);
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }

    function ScopeCompareFunction() {
        this.name = "ScopeCompare";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    ScopeCompareFunction.prototype = new Calc.Functions.Function();
    ScopeCompareFunction.prototype.evaluate = ScopeCompareFunctionEval_fob;
    function ScopeCompareFunctionEval_fob(args) {
        try {
            var P1_vob = args[0];
            var P2_vob = args[1];
            if ((P1_vob == "/") || (P2_vob == "0")) {
                if (P1_vob == "0") {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if ((P2_vob != "") && (P2_vob != "-")) {
                    var sExp = P2_vob.replace("～", "<=" + P1_vob + "<=");
                    if (Boolean(eval(sExp)) == true) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return false;
        }
    }
    function ModulusAverageFunction() {
        this.name = "ModulusAverage";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    ModulusAverageFunction.prototype = new Calc.Functions.Function();
    ModulusAverageFunction.prototype.evaluate = ModulusAverageFunctionEval_fob;
    function ModulusAverageFunctionEval_fob(args) {
        var z, a, b, c, d, e, f, g, h, i, j, k, n, P1_vob, P2_vob, P3_vob, P4_vob, P5_vob, P6_vob, P7_vob, P8_vob, P9_vob;
        n = 3;
        try {
            if (args.length < 9) {
                return "/";
            }
            P1_vob = args[0];
            P2_vob = args[1];
            P3_vob = args[2];
            P4_vob = args[3];
            P5_vob = args[4];
            P6_vob = args[5];
            P7_vob = args[6];
            P8_vob = args[7];
            P9_vob = args[8];

            a = parseFloat(P1_vob);
            b = parseFloat(P2_vob);
            c = parseFloat(P3_vob);
            d = parseFloat(P4_vob);
            e = parseFloat(P5_vob);
            f = parseFloat(P6_vob);
            g = parseFloat(P7_vob);
            h = parseFloat(P8_vob);
            i = parseFloat(P9_vob);

            if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(g) || isNaN(h) || isNaN(i)) {
                return "/";
            }

            if (Math.abs(a - d) / d > 0.2) {
                g = 0;
                n--;
            }
            else if (Math.abs(b - e) / e > 0.2) {
                h = 0;
                n--;
            }
            else if (Math.abs(c - f) / f > 0.2) {
                i = 0;
                n--;
            }
            if (n >= 2) {
                return (g + h + i) / n;
            }
            else {
                return "-";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function GetSampleAreaFunction() {
        this.name = "GetSampleArea";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    GetSampleAreaFunction.prototype = new Calc.Functions.Function();
    GetSampleAreaFunction.prototype.evaluate = GetSampleAreaFunctionEval_fob;
    function GetSampleAreaFunctionEval_fob(args) {

        try {
            var sSize_vob = "", dL1_vob = 0, dL2_vob = 0, dArea_vob = 0;
            var slTemp_vob = new Array();
            if (args.length != 1) {
                return "/";
            }
            sSize_vob = args[0];
            slTemp_vob = sSize_vob.split("×");
            if (slTemp_vob.length >= 2) {
                if (slTemp_vob[0].substr(0, 1) == "Φ") {
                    if (!isNaN(parseFloat(slTemp_vob[1]))) {
                        dL1_vob = parseFloat(slTemp_vob[1]);
                        dArea_vob = 3.1415926 * dL1_vob * dL1_vob / 4;
                    }
                }
                else if ((!isNaN(parseFloat(slTemp_vob[0]))) && (parseFloat(slTemp_vob[1]))) {
                    dL1_vob = parseFloat(slTemp_vob[0]);
                    dL2_vob = parseFloat(slTemp_vob[1]);
                    dArea_vob = Math.round(dL1_vob * dL2_vob);
                }
                if (dArea_vob != 0) {
                    return dArea_vob;
                }
            }
            else {
                return "/";
            }
        } catch (e) {
            console.log('fun fail ' + e.message);
            return "/";

        }
    }
    function ComputeTestDateFunction() {
        this.name = "ComputeTestDate";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    ComputeTestDateFunction.prototype = new Calc.Functions.Function();
    ComputeTestDateFunction.prototype.evaluate = ComputeTestDateFunctionEval_fob;
    function ComputeTestDateFunctionEval_fob(args) {
        var sProductDate_vob = "", sTestDate_vob = "", P1_vob, nAge_vob = 0;
        try {
            if (args.length != 2) {
                return "/";
            }
            else {
                sProductDate_vob = args[0];
                P1_vob = args[1];
                if (!isNaN(parseInt(P1_vob))) {
                    nAge_vob = parseInt(P1_vob);
                }
                var dDate = new Date(sProductDate_vob);
                dDate.setDate(dDate.getDate() + nAge_vob);
                var m = dDate.getMonth() + 1;
                if (dDate.getMonth() + 1 < 10) {
                    m = '0' + Number(dDate.getMonth() + 1);
                }
                var d = dDate.getDate();
                if (dDate.getDate() < 10) {
                    d = '0' + Number(dDate.getDate());
                }
                return dDate.getFullYear() + "-" + m + "-" + d;

            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function ComputeAreaFunction() {
        this.name = "ComputeArea";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    ComputeAreaFunction.prototype = new Calc.Functions.Function();
    ComputeAreaFunction.prototype.evaluate = ComputeAreaFunctionEval_fob;
    function ComputeAreaFunctionEval_fob(args) {
        try {
            var P1_vob = args[0];
            if (P1_vob == "") {
                return "/";
            }
            var dDia_vob = parseFloat(P1_vob);
            if (dDia_vob == 50) {
                return 1964;
            }
            else if (dDia_vob > 32) {
                return RoundToEx(GetPi() * dDia_vob * dDia_vob / 4, 1, 0);
            }
            else if (dDia_vob > 10) {
                return RoundToEx(GetPi() * dDia_vob * dDia_vob / 4, 1, 1);
            }
            else {

                return RoundToEx(GetPi() * dDia_vob * dDia_vob / 4, 1, 2);
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function DistExFunction() {
        this.name = "DistEx";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    DistExFunction.prototype = new Calc.Functions.Function();
    DistExFunction.prototype.evaluate = DistExFunctionEval_fob;
    function DistExFunctionEval_fob(args) {
        try {
            var dSum_vob = 0;
            var dAvg_vob = 0;
            if (args.length < 2) {
                return "/";
            }
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob)
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(P1_vob);
                    dSum_vob = dSum_vob + dTemp_vob;
                }
            }
            if (dValue_vob.length > 0) {
                dAvg_vob = dSum_vob / dValue_vob.length;
            }
            dSum_vob = 0;
            for (var i = 0; i < dValue_vob.length; i++) {
                dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
            }
            dSum_vob = Math.sqrt(dSum_vob / dValue_vob.length);
            return dSum_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function DistEx1Function() {
        this.name = "DistEx1";
        this.minArgs = 1;
        this.maxArgs = 200;
    }
    DistEx1Function.prototype = new Calc.Functions.Function();
    DistEx1Function.prototype.evaluate = DistEx1FunctionEval_fob;
    function DistEx1FunctionEval_fob(args) {
        try {
            var dSum_vob = 0;
            var dAvg_vob = 0;
            if (args.length < 2) {
                return "/";
            }
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob)
                if (isNaN(dTemp_vob) == false) {
                    dValue_vob.push(P1_vob);
                    dSum_vob = dSum_vob + dTemp_vob;
                }
            }
            if (args.length > 0) {
                dAvg_vob = dSum_vob / args.length;
            }
            dSum_vob = 0;
            for (var i = 0; i < dValue_vob.length; i++) {
                dSum_vob = dSum_vob + (dValue_vob[i] - dAvg_vob) * (dValue_vob[i] - dAvg_vob);
            }
            dSum_vob = Math.sqrt(dSum_vob / dValue_vob.length);
            return dSum_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExFunction() {
        this.name = "AverageEx";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    AverageExFunction.prototype = new Calc.Functions.Function();
    AverageExFunction.prototype.evaluate = AverageExFunctionEval_fob;
    function AverageExFunctionEval_fob(args) {
        var dSum_vob = 0;
        var nCount_vob = 0;

        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 2) {
                return "/";
            }
            for (var i = 0; i < arrTemp_vob.length; i++) {
                var P1_vob = arrTemp_vob[i];
                if (P1_vob == '/' || P1_vob == null) {
                    continue;
                }
                var dTemp_vob = parseFloat(P1_vob);
                if (!isNaN(dTemp_vob)) {
                    dSum_vob += dTemp_vob;
                    nCount_vob++;
                }
            }

            if (nCount_vob > 0) {
                return dSum_vob / nCount_vob;
            }

            return "/";
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExUFunction() {
        this.name = "AverageExU";
        this.minArgs = 1;
        this.maxArgs = 30;
    }
    AverageExUFunction.prototype = new Calc.Functions.Function();
    AverageExUFunction.prototype.evaluate = AverageExUFunctionEval_fob;
    function AverageExUFunctionEval_fob(args) {
        try {

            if (args.length < 16) {
                return "/";
            }
            var dSum_vob = 0;
            var nCount_vob = 0;
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob);
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(dTemp_vob);
                    nCount_vob++;
                }
                else {
                    continue;
                }
            }
            dValue_vob = BubbleSort(dValue_vob);
            for (var I = 3; I <= 12; I++) {
                dSum_vob = dSum_vob + dValue_vob[I];
            }
            var dAvg_vob = dSum_vob / 10;
            return dAvg_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExT3Function() {
        this.name = "AverageExT3";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    AverageExT3Function.prototype = new Calc.Functions.Function();
    AverageExT3Function.prototype.evaluate = AverageExT3FunctionEval_fob;
    function AverageExT3FunctionEval_fob(args) {

        try {
            if (args.length < 3) {
                return '';
            }
            var a = parseFloat(args[0]);
            var b = parseFloat(args[1]);
            var c = parseFloat(args[2]);
            var a1 = Math.abs(a - b);
            var b1_vob = Math.abs(b - c);
            var c1 = Math.abs(c - a);
            var z = a1;
            if (z > b1_vob) {
                z = b1_vob;
            }
            if (z > c1) {
                z = c1;
            }
            if (z == a1) {
                z = (a + b) / 2;
            }
            else if (z == b1_vob) {
                z = (b + c) / 2;
            }
            else {
                z = (a + c) / 2;
            }
            return z;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return '';
        }
    }
    function MaxDiameterFunction() {
        this.name = "MaxDiameter";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    MaxDiameterFunction.prototype = new Calc.Functions.Function();
    MaxDiameterFunction.prototype.evaluate = MaxDiameterFunctionEval_fob;
    function MaxDiameterFunctionEval_fob(args) {
        try {
            if (args.length < 2) {
                return "";
            }
            var nType_vob = parseInt(args[0]);
            var dValue_vob = new Array();
            var dValue2_vob = new Array();
            for (var i = 1; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob);
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(P1_vob);
                }
            }
            var dSum_vob = 0;

            for (i = 0; i < dValue_vob.length; i++) {
                dSum_vob += dValue_vob[i];
                dValue2_vob.push(dSum_vob);
            };
            var d = 0;
            if (nType_vob == 1) {
                if (dValue2_vob[11] == 0) { d = 2.36; }
                else if (dValue2_vob[10] == 0) { d = 4.75; }
                else if (dValue2_vob[9] == 0) { d = 9.5; }
                else if (dValue2_vob[8] == 0) { d = 16; }
                else if (dValue2_vob[7] == 0) { d = 19; }
                else if (dValue2_vob[6] == 0) { d = 26.5; }
                else if (dValue2_vob[5] == 0) { d = 31.5; }
                else if (dValue2_vob[4] == 0) { d = 37.5; }
                else if (dValue2_vob[3] == 0) { d = 53; }
                else if (dValue2_vob[2] == 0) { d = 63; }
                else if (dValue2_vob[1] == 0) { d = 75; }
                else if (dValue2_vob[0] == 0) { d = 90; }
            }
            else if (nType_vob == 2) {
                if (dValue2_vob[9] == 0) { d = 0.075; }
                else if (dValue2_vob[8] == 0) { d = 0.5; }
                else if (dValue2_vob[7] == 0) { d = 2.5; }
                else if (dValue2_vob[6] == 0) { d = 5; }
                else if (dValue2_vob[5] == 0) { d = 10; }
                else if (dValue2_vob[4] == 0) { d = 20; }
                else if (dValue2_vob[3] == 0) { d = 25; }
                else if (dValue2_vob[2] == 0) { d = 30; }
                else if (dValue2_vob[1] == 0) { d = 40; }
                else if (dValue2_vob[0] == 0) { d = 50; }
            }
            else if (nType_vob == 3) {
                if (dValue2_vob[6] == 0) { d = 0.1; }
                else if (dValue2_vob[5] == 0) { d = 0.5; }
                else if (dValue2_vob[4] == 0) { d = 1.7; }
                else if (dValue2_vob[3] == 0) { d = 7.1; }
                else if (dValue2_vob[2] == 0) { d = 22.4; }
                else if (dValue2_vob[1] == 0) { d = 31.5; }
                else if (dValue2_vob[0] == 0) { d = 45; }
            }
            if (d == 0) {
                return "-";
            }
            else {
                return d;
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function MinExFunction() {
        this.name = "MinEx";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    MinExFunction.prototype = new Calc.Functions.Function();
    MinExFunction.prototype.evaluate = MinExFunctionEval_fob;
    function MinExFunctionEval_fob(args) {
        try {
            if (args[0].length < 1) {
                return "/";
            }
            var dMin_vob = 0;
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob)
                if (!isNaN(dTemp_vob)) {
                    if (dMin_vob == 0 || dMin_vob > dTemp_vob) {
                        dMin_vob = dTemp_vob;
                    }
                }
            }
            if (args.length > 0) {
                return dMin_vob;
            }
            return "/";
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function CFFunction() {
        this.name = "CF";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    CFFunction.prototype = new Calc.Functions.Function();
    CFFunction.prototype.evaluate = CFFunctionEval_fob;
    function CFFunctionEval_fob(args) {
        try {
            if (args.length < 1) {
                return "0";
            }
            var P1_vob = args[0];
            if (!isNaN(parseFloat(P1_vob))) {
                return P1_vob;
            }
            else {
                return "0";
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "0";
        }
    }
    function ComputeLostFunction() {
        this.name = "ComputeLost";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    ComputeLostFunction.prototype = new Calc.Functions.Function();
    ComputeLostFunction.prototype.evaluate = ComputeLostFunctionEval_fob;
    function ComputeLostFunctionEval_fob(args) {
        try {
            if (args.length < 2) {
                return "/";
            }
            var dSum_vob = parseFloat(args[0]);
            for (var i = 1; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob);
                if (!isNaN(dTemp_vob)) {
                    dSum_vob = dSum_vob - dTemp_vob;
                }
            }
            if (dSum_vob == 0) {
                return "/";
            }
            return dSum_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function SqrtExFunction() {
        this.name = "SqrtEx";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    SqrtExFunction.prototype = new Calc.Functions.Function();
    SqrtExFunction.prototype.evaluate = SqrtExFunctionEval_fob;
    function SqrtExFunctionEval_fob(args) {
        try {
            var d = Number(args[0]);
            return Math.sqrt(d, d);
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function SqrSumFunction() {
        this.name = "SqrSum";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    SqrSumFunction.prototype = new Calc.Functions.Function();
    SqrSumFunction.prototype.evaluate = SqrSumFunctionEval_fob;
    function SqrSumFunctionEval_fob(args) {
        try {
            if (args.length < 2) {
                return "/";
            }
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob)
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(P1_vob);
                }
            }
            var dSum_vob = 0;
            for (var i = 0; i <= dValue_vob.length; i++) {
                dSum_vob = dSum_vob + dValue_vob[i] * dValue_vob[i];
            }
            return dSum_vob;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }

    }
    function MedianExFunction() {
        this.name = "MedianEx";
        this.minArgs = 1;
        this.maxArgs = 10;
    }
    MedianExFunction.prototype = new Calc.Functions.Function();
    MedianExFunction.prototype.evaluate = MedianExFunctionEval_fob;
    function MedianExFunctionEval_fob(args) {
        try {
            if (args.length < 3) {
                return "/";
            }
            var dSum_vob = 0;
            var nCount_vob = 0;
            var dValue_vob = new Array();
            for (var i = 0; i < args.length; i++) {
                var P1_vob = args[i];
                var dTemp_vob = parseFloat(P1_vob);
                if (!isNaN(dTemp_vob)) {
                    dValue_vob.push(dTemp_vob);
                    nCount_vob++;
                }
                else {
                    continue;
                }
            }
            dValue_vob = BubbleSort(dValue_vob);
            var d = dValue_vob[Math.floor(nCount_vob / 2)]
            return d;

        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function ADDEXFunction() {
        this.name = "ADDEX";
        this.minArgs = 1;
        this.maxArgs = 20;
    }
    ADDEXFunction.prototype = new Calc.Functions.Function();
    ADDEXFunction.prototype.evaluate = ADDEXFunctionEval_fob;
    function ADDEXFunctionEval_fob(args) {
        try {
            if (args.length < 1) {
                return "/";
            }
            var nCount_vob = 0;
            var dSum_vob = 0;
            for (var i = 0; i < args.length; i++) {
                try {

                    var d = parseFloat(args[i]);
                    if (isNaN(d)) {
                        continue;
                    }
                    nCount_vob++;
                    dSum_vob += d;
                }
                catch (e) {
                    console.log('fun fail ' + e.message);

                }
            }
            if (nCount_vob == 0) {
                return "/";
            }
            else {
                return dSum_vob;
            }
        } catch (e) {
            console.log(e)
            return '/'
        }

    }
    function SUBEXFunction() {
        this.name = "SUBEX";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    SUBEXFunction.prototype = new Calc.Functions.Function();
    SUBEXFunction.prototype.evaluate = SUBEXFunctionEval_fob;
    function SUBEXFunctionEval_fob(args) {
        try {
            if (args.length < 1) {
                return "/";
            }
            var nCount_vob = 0;
            var dSum_vob = 0;
            dSum_vob = parseFloat(args[0]);
            for (var i = 1; i < args.length; i++) {
                try {
                    var d = parseFloat(args[i]);
                    nCount_vob++;
                    dSum_vob = Number(dSum_vob) - Number(d);
                }
                catch (e) {
                    console.log('fun fail ' + e.message);

                }
            }
            if (nCount_vob == 0) {
                return "/";
            }
            else {
                return dSum_vob;
            }
        } catch (e) {
            console.log(e);
            return '/';
        }

    }
    function MaxExFunction() {
        this.name = "MaxEx";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    MaxExFunction.prototype = new Calc.Functions.Function();
    MaxExFunction.prototype.evaluate = MaxExFunctionEval_fob;
    function MaxExFunctionEval_fob(args) {
        try {
            if (args.length < 1) {
                return "/";
            }
            var nCount_vob = 0;
            var dMax_vob = 0;
            for (var i = 0; i < args.length; i++) {
                try {
                    var d = parseFloat(args[i]);
                    if (dMax_vob < d) {
                        dMax_vob = d;
                    }
                    nCount_vob++;

                }
                catch (e) {
                    console.log('fun fail ' + e.message);

                }
            }
            if (nCount_vob >= 1) {
                return dMax_vob;
            }
            else {
                return '/';
            }
        } catch (e) {
            console.log(e);
            return '/';
        }

    }
    function AverageExD3_1Function() {
        this.name = "AverageExD3_1";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    AverageExD3_1Function.prototype = new Calc.Functions.Function();
    AverageExD3_1Function.prototype.evaluate = AverageExD3_1FunctionEval_fob;
    function AverageExD3_1FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0, a1 = 0, b1 = 0, c1 = 0;
        var dValue = new Array();
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            d = parseFloat(arrTemp_vob[3]);
            if (arrTemp_vob[0] != '' && arrTemp_vob[0] != '/') {
                dValue.push(a);
                z += a;
            }
            if (arrTemp_vob[1] != '' && arrTemp_vob[1] != '/') {
                dValue.push(b);
                z += b;
            }
            if (arrTemp_vob[2] != '' && arrTemp_vob[2] != '/') {
                dValue.push(c);
                z += c;
            }
            if (dValue.length < 2) {
                return '';
            }
            if (dValue.length >= 2) {
                a1 = Math.abs(dValue[0] - dValue[1]);
                if (a1 < (dValue[0] + dValue[1]) / 2 * d / 100) {
                    return (dValue[0] + dValue[1]) / 2;
                }
                else {
                    if (dValue.length == 3) {
                        return (dValue[0] + dValue[1] + dValue[2]) / 3;
                    }
                    else {
                        return '-';
                    }
                }
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExD3_2Function() {
        this.name = "AverageExD3_2";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    AverageExD3_2Function.prototype = new Calc.Functions.Function();
    AverageExD3_2Function.prototype.evaluate = AverageExD3_2FunctionEval_fob;
    function AverageExD3_2FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0, a1 = 0, b1 = 0, c1 = 0;
        var dValue = new Array();
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            d = parseFloat(arrTemp_vob[3]);
            if (arrTemp_vob[0] != '' && arrTemp_vob[0] != '/') {
                dValue.push(a);
                z += a;
            }
            if (arrTemp_vob[1] != '' && arrTemp_vob[1] != '/') {
                dValue.push(b);
                z += b;
            }
            if (arrTemp_vob[2] != '' && arrTemp_vob[2] != '/') {
                dValue.push(c);
                z += c;
            }
            if (dValue.length < 2) {
                return '';
            }
            if (dValue.length >= 2) {
                a1 = Math.abs(dValue[0] - dValue[1]);
                if (a1 < d) {
                    return (dValue[0] + dValue[1]) / 2;
                }
                else {
                    if (dValue.length == 3) {
                        if (Math.abs(dValue[0] - dValue[2]) <= d) {
                            return (dValue[0] + dValue[2]) / 2;
                        } else if (Math.abs(dValue[1] - dValue[2]) <= d) {
                            return (dValue[1] + dValue[2]) / 2;
                        }
                        else {
                            return '-';
                        }

                    }
                    else {
                        return '-';
                    }
                }
            }
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
    function AverageExDT3Function() {
        this.name = "AverageExDT3";
        this.minArgs = 1;
        this.maxArgs = 100;
    }
    AverageExDT3Function.prototype = new Calc.Functions.Function();
    AverageExDT3Function.prototype.evaluate = AverageExDT3FunctionEval_fob;
    function AverageExDT3FunctionEval_fob(args) {
        var a = 0, b = 0, c = 0, d = 0, z = 0, a1 = 0, b1 = 0, c1 = 0;
        var dValue = new Array();
        try {
            var arrTemp_vob = new Array();
            arrTemp_vob = args;
            if (arrTemp_vob.length < 3) {
                return "/";
            }
            a = parseFloat(arrTemp_vob[0]);
            b = parseFloat(arrTemp_vob[1]);
            c = parseFloat(arrTemp_vob[2]);
            d = parseFloat(arrTemp_vob[3]);
            if (Math.abs(a - b) > d || Math.abs(a - c) > d || Math.abs(c - b) > d) {
                z = 0;
                return '-';
            }
            else {
                z = (a + b + c) / 3;
                return z;
            }
            return (a + b + c) / 3;
        }
        catch (e) {
            console.log('fun fail ' + e.message);
            return "/";
        }
    }
	function DChart1() {
	    this.name = "singleLogCurve";
	    this.minArgs = 1;
	    this.maxArgs = 100;
	}
	DChart1.prototype = new Calc.Functions.Function();
	DChart1.prototype.evaluate = DChart1Eval_fob;

	async function DChart1Eval_fob(args) {
	    try {
			var arrTemp_vob = new Array();
			arrTemp_vob=args;
			var spread = window.$("#ss").wijspread("spread");
			let sheet=spread.getSheet(args[0]);
			var sheetRender = new GrapeCity.UI._SheetRender(sheet);
			let context=sheetRender._getCtx()
			var cellData = sheet._getCellLocation(args[1],args[2]);
	        var offcanvas = await DrawChart1_fob(arrTemp_vob,cellData.width, cellData.height);
			console.log(offcanvas)
	        if (!offcanvas) {
	            return;
	        }
	        context.save();
	        context.drawImage(offcanvas, cellData.x, cellData.y, cellData.width-1, cellData.height-1);
	        context.stroke();
	        context.restore();
	    }
	    catch (e) {
	        console.log('fun fail ' + e.message);
	        return "/";
	    }
	}
	async function DrawChart1_fob(args, width_vob, height_vob) {
		var X = new Array();
		var aX = new Array();
		var aY = new Array();
		var percentdata = args;
		var I = 0;
		var sValue_vob;
		var aX1_vob = 0,
		    aX2_vob = 0,
		    aX3_vob = 0,
		    dCc = 0,
		    d2mmUp = 0,
		    d2mmDown = 0,
		    dRatio = 0;
		X[0] = 0.075;
		X[1] = 0.25;
		X[2] = 0.5;
		X[3] = 1;
		X[4] = 2;
		X[5] = 2;
		X[6] = 5;
		X[7] = 10;
		X[8] = 20;
		X[9] = 40;
		X[10] = 60;
		X[11] = 75;
		X[12] = 100;
		X[13] = 150;
		d2mmUp = GetValueByName_fob(args[6]);
		d2mmDown = GetValueByName_fob(args[7]);
		if ((d2mmDown + d2mmUp) == 0) {
		    return null;
		}
		dRatio = parseFloat(d2mmUp) / (parseFloat(d2mmDown) + parseFloat(d2mmUp));
		if (dRatio < 0.1) {
		    for (I = 14; I >= 10; I--) {
		        sValue_vob = GetValueByName_fob(args[3] + IntToStr(I));
		        if ((sValue_vob != '') && (sValue_vob != '/')) {
		            aX.push(X[14 - I]);
		            aY.push(StrToFloatEx(sValue_vob));
		        }

		    }
		} else if (dRatio > 0.9) {
		    for (I = 9; I >= 1; I--) {
		        sValue_vob = GetValueByName_fob(args[3] + IntToStr(I));
		        if ((sValue_vob != '') && (sValue_vob != '/')) {
		            aX.push(X[14 - I]);
		            aY.push(StrToFloatEx(sValue_vob));
		        }
		    }
		} else {
		    for (I = 14; I >= 1; I--) {
		        sValue_vob = GetValueByName_fob(args[3] + IntToStr(I));
		        if ((sValue_vob != '') && (sValue_vob != '/')&& (I != 10)) {
		            aX.push(X[14 - I]);
		            aY.push(StrToFloatEx(sValue_vob));
		        }
		    }
		}
	    return await DrawCurve1(aX, aY, aX1_vob, aX2_vob, aX3_vob, width_vob, height_vob, dRatio);
	}
	async function DrawCurve1(aX, aY, aX1_vob, aX2_vob, aX3_vob, width_vob, height_vob, dRatio) {
	        aX.reverse();
	        aY.reverse();

	        var q = 60,
	            r = 30,
	            z = 10;
	        if ((aX.length < 4) || (aY.length < 4)) {
	            return null;
	        };
	        var length = aX.length;
	        var data = new Array();
	        var data1 = new Array();
	        var data2 = new Array();
	        var data3 = new Array();
	        var d60Flag = true;
	        var d30Flag = true;
	        var d10Flag = true;
			var i=0;
	        for (i = 0; i < length; i++) {
	            data.push([aX[i], aY[i]]);
	            if (d60Flag && (aY[i] - 60) < 10) {
	                var temp0 = new Point2D(aX[i - 2], aY[i - 2]);
	                var temp1 = new Point2D(aX[i - 1], aY[i - 1]);
	                var temp2 = new Point2D(aX[i], aY[i]);
	                var temp3 = new Point2D(aX[i + 1], aY[i + 1]);
	                data1.push(temp0);
	                data1.push(temp1);
	                data1.push(temp2);
	                data1.push(temp3);
	                d60Flag = false;
	            }
	            if (d30Flag && (aY[i] - 30) < 5) {
	                var temp0 = new Point2D(aX[i - 2], aY[i - 2]);
	                var temp1 = new Point2D(aX[i - 1], aY[i - 1]);
	                var temp2 = new Point2D(aX[i], aY[i]);
	                var temp3 = new Point2D(aX[i + 1], aY[i + 1]);
	                data2.push(temp0);
	                data2.push(temp1);
	                data2.push(temp2);
	                data2.push(temp3);
	                d30Flag = false;
	            }

	            if (d10Flag && (aY[i] - 10) < 5) {
	                var temp0 = new Point2D(aX[i - 2], aY[i - 2]);
	                var temp1 = new Point2D(aX[i - 1], aY[i - 1]);
	                var temp2 = new Point2D(aX[i], aY[i]);
	                var temp3 = new Point2D(aX[i + 1], aY[i + 1]);
	                data3.push(temp0);
	                data3.push(temp1);
	                data3.push(temp2);
	                data3.push(temp3);
	                d10Flag = false;
	            }
	        };
	        var d60 = PointOnCubicBezier(data1, bisection(data1, 60));
	        var d30 = PointOnCubicBezier(data2, bisection(data2, 30));
	        var d10 = PointOnCubicBezier(data3, bisection(data3, 10));
	        if (dRatio >= 0.1) {
	            SetValueByName(args[8], d60.x.toFixed(3), true);
	            SetValueByName(args[9], d30.x.toFixed(3), true);
	            SetValueByName(args[10], d10.x.toFixed(3), true);
	        }

	        var option = {
	            title: {
	                text: '颗粒大小单对数曲线',
	                left: 'center'
	            },
	            tooltip: {
	                trigger: 'axis',
	                axisPointer: {
	                    animation: false
	                }
	            },
	            xAxis: {
	                type: 'log',
	                name: '粒径mm',
	                nameLocation: 'middle',
	                inverse: true,
	                splitNumber: 5,
	                axisLine: { onZero: true },
	                min: 0.001,
	                max: 100,
	            },
	            yAxis: {
	                type: 'value',
	                name: '小于某粒径土质量百分数%',
	                scale: true,
	                boundaryGap: false,
	                axisLine: { onZero: true },
	                //min: 10,
	                data: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
	            },
	            series: [{
	                name: '颗粒大小单对数曲线',
	                type: 'line',
	                symbol : 'none',
	                animation: false,
	                smooth: true,
	                markPoint: {
	                    symbolSize: '5',
	                    symbol: 'emptytriangle',
	                    data: [{
	                        coord: [d60.x, d60.y],
	                        valueIndex: 1,
	                        symbol: 'emptytriangle',
	                        label: {
	                            normal: {
	                                show: true,
	                                formatter: PointOnCubicBezier(data1, bisection(data1, 60).toFixed(2)).x.toFixed(3),
	                            }
	                        },
	                        itemStyle: { normal: { color: '#000', label: { position: 'right' } } }
	                    },
	                    {
	                        coord: [d30.x, d30.y],
	                        valueIndex: 1,
	                        symbol: 'emptytriangle',
	                        label: {
	                            normal: {
	                                show: true,
	                                formatter: d30.x.toFixed(3),
	                            }
	                        },
	                        itemStyle: { normal: { color: '#000', label: { position: 'right' } } }
	                    },
	                    {
	                        coord: [d10.x, d10.y],
	                        valueIndex: 1,
	                        symbol: 'emptytriangle',
	                        label: {
	                            normal: {
	                                show: true,
	                                formatter: d10.x.toFixed(3),
	                            }
	                        },
	                        itemStyle: { normal: { color: '#000', label: { position: 'right' } } }
	                    },
	                    ]
	                },
	                data: data
	            }]
	        };
			console.log(JSON.stringify(option) )
	        var new_div_vob = document.createElement("div");
	        new_div_vob.style.width = (width_vob-1) + "px";
	        new_div_vob.style.height = (height_vob-1) + "px";
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
	        $("#" + sId_vob + "").hide();
	        return await getCanvas(myChart_vob);
	}

  function DChart5Function() {
      this.name = "limeCurve";
      this.minArgs = 1;
      this.maxArgs = 100;
  }
  DChart5Function.prototype = new Calc.Functions.Function();
  DChart5Function.prototype.evaluate = DChart5FunctionEval_fob;
  function DChart5FunctionEval_fob(args) {
      try {
          var spread = window.$("#ss").wijspread("spread");
          let sheet=spread.getSheet(args[0]);
          sheet.setCellType(args[1], args[2], new $.wijmo.wijspread.DChart5(args));
      }
      catch (e) {
          console.log('fun fail ' + e.message);
          return "/";
      }
  }

	async function DrawChart10_fob(width_vob, height_vob) {
	    var aX = new Array();
	    var aY = new Array();
	    var aY1_vob = new Array();
	    var aY2_vob = new Array();
	    var I = 0;
	    var K = 0;
	    var sValue_vob = "",
	        sValue1 = "",
	        aImage_vob = "",
	        aX0 = 0,
	        aX1_vob = 0,
	        aX2_vob = 0,
	        aX3_vob = 0,
	        dCc = 0;

	    for (I = 1; I <= 6; I++) {
	        sValue_vob = GetValueByName_fob('筛孔边长' + IntToStr(I));
	        sValue1 = GetValueByName_fob('过筛占比' + IntToStr(I));

	        if ((sValue_vob != '') && (sValue_vob != '/')) {

	            aX.push(StrToFloatEx(sValue_vob));
	            aY.push(StrToFloatEx(sValue1));
	        };
	        sValue_vob = GetValueByName_fob('过筛占比' + IntToStr(I) + '标准值');
	        if ((sValue_vob != '') && (sValue_vob != '/')) {
	            K = sValue_vob.indexOf("~");
	            if (K >= 0) {
	                sValue1 = sValue_vob.substring(0, K);
	                sValue_vob = sValue_vob.substring(K + 1, sValue_vob.length);
	                aY1_vob.push(StrToFloatEx(sValue1));
	                aY2_vob.push(StrToFloatEx(sValue_vob));
	            } else {
	                aY1_vob.push(StrToFloatEx(sValue_vob));
	                aY2_vob.push(StrToFloatEx(sValue_vob));
	            }
	        }
	    }
      console.log(width_vob,height_vob)
	    return await DrawCurve10(aX, aY, aY1_vob, aY2_vob, width_vob, height_vob);
	}

	async function DrawCurve10(aX, aY, aY1_vob, aY2_vob, width_vob, height_vob) {
	    if (aX.length < 4 || aY.length < 4) {
	        return null;
	    }
	    var data1 = new Array();
	    var data2 = new Array();
	    var data3 = new Array();
	    for (var i = 0; i < aX.length; i++) {
	        data1.push([aX[i], aY[i]]);
	        data2.push([aX[i], aY1_vob[i]]);
	        data3.push([aX[i], aY2_vob[i]]);
	    }

	    option = {
	        title: {
	            text: '颗粒级配曲线',
	            left: 'center',
	            textStyle: {
	                color: '#111'
	            }

	        },
	        tooltip: {
	            trigger: 'axis'
	        },
	        xAxis: {
	            type: 'value',
	            name: '筛孔边长(mm)',
	            boundaryGap: false,
	            nameLocation: 'middle',
	            nameGap: 20,
	            min: 10,
	            max: 70,
	            splitNumber: 7
	        },
	        yAxis: {
	            type: 'value',
	            name: '过筛质量(%)',
	            min: 0,
	            max: 100,
	            splitNumber: 20
	        },
	        grid: {
	            left: 35
	        },
	        series: [{
	            type: 'line',
	            symbol:'none',
	            smooth: '1/5',
	            animation: false,
	            data: data1
	        },
	        {
	            type: 'line',
	            symbol: 'none',
	            smooth: '1/5',
	            animation: false,
	            data: data2
	        },
	        {
	            type: 'line',
	            symbol: 'none',
	            smooth: '1/5',
	            animation: false,
	            data: data3
	        }
	        ]
	    };

	    var new_div_vob = document.createElement("div");

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
	    $("#" + sId_vob + "").hide();
	    return await getCanvas(myChart_vob);
	}

	async function getCanvas(myChart_vob) {
		return new Promise((resolve, reject) => {
			var loading=false;
			myChart_vob.on('finished', function () {
			    loading=true
			});
			let index = setInterval(function() {
				console.log(1)
				if(loading)
				{
					clearInterval(index)
					var offcanvas = myChart_vob.getRenderedCanvas({
					    pixelRatio: 1,
					    backgroundColor: '#fff'
					});

					resolve(offcanvas);
				}
			},100)
		})
	}



	function AddFunctions(temp_vob) {
        temp_vob.addCustomFunction(new AverageExMaxMinFunction());
        temp_vob.addCustomFunction(new CvExFunction());
        temp_vob.addCustomFunction(new GetStandardFunction());
        temp_vob.addCustomFunction(new PluginFunction());
        temp_vob.addCustomFunction(new GetTestDataFunction());
        temp_vob.addCustomFunction(new AverageExD2Function());
        temp_vob.addCustomFunction(new AverageExD3Function());
        temp_vob.addCustomFunction(new AverageExP2Function());
        temp_vob.addCustomFunction(new AverageExDL2Function());
        temp_vob.addCustomFunction(new AverageExDW2Function());
        temp_vob.addCustomFunction(new AverageExA3Function());
        temp_vob.addCustomFunction(new AverageExM3Function());
        temp_vob.addCustomFunction(new AverageExPM3Function());
        temp_vob.addCustomFunction(new AverageExP6Function());
        temp_vob.addCustomFunction(new AverageExT6Function());
        temp_vob.addCustomFunction(new AverageExMaxMin6Function());
        temp_vob.addCustomFunction(new AverageEXMMD3Function());
        temp_vob.addCustomFunction(new AverageEXMMD3_1Function());
        temp_vob.addCustomFunction(new AverageTimeFunction());
        temp_vob.addCustomFunction(new RoundExFunction());
        temp_vob.addCustomFunction(new RoundEx1Function());
        temp_vob.addCustomFunction(new RoundEx2Function());
        temp_vob.addCustomFunction(new FindExFunction());
        temp_vob.addCustomFunction(new MinuteDiffFunction());
        temp_vob.addCustomFunction(new SecondDiffFunction());
        temp_vob.addCustomFunction(new ScopeCompareFunction());
        temp_vob.addCustomFunction(new ModulusAverageFunction());
        temp_vob.addCustomFunction(new GetSampleAreaFunction());
        temp_vob.addCustomFunction(new ComputeTestDateFunction());
        temp_vob.addCustomFunction(new ComputeAreaFunction());
        temp_vob.addCustomFunction(new DistExFunction());
        temp_vob.addCustomFunction(new DistEx1Function());
        temp_vob.addCustomFunction(new AverageExFunction());
        temp_vob.addCustomFunction(new AverageExUFunction());
        temp_vob.addCustomFunction(new AverageExT3Function());
        temp_vob.addCustomFunction(new MaxDiameterFunction());
        temp_vob.addCustomFunction(new MinExFunction());
        temp_vob.addCustomFunction(new CFFunction());
        temp_vob.addCustomFunction(new ComputeLostFunction());
        temp_vob.addCustomFunction(new SqrtExFunction());
        temp_vob.addCustomFunction(new SqrSumFunction());
        temp_vob.addCustomFunction(new MedianExFunction());
        temp_vob.addCustomFunction(new GETDEVICEINFOFunction());
        temp_vob.addCustomFunction(new ADDEXFunction());
        temp_vob.addCustomFunction(new SUBEXFunction());
        temp_vob.addCustomFunction(new MaxExFunction());
        temp_vob.addCustomFunction(new GetBoxWeightFunction());
        temp_vob.addCustomFunction(new AverageExD3_1Function());
        temp_vob.addCustomFunction(new AverageExD3_2Function());
        temp_vob.addCustomFunction(new AverageExDT3Function());
        temp_vob.addCustomFunction(new DChart1());
        temp_vob.addCustomFunction(new DChart5Function());
    }
    function GetPi() {
        if (Math.PI) {
            return Math.PI;
        }
        return 3.1415926;
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
  function IntToStr(sValue_vob)
  {
    return sValue_vob.toString()
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

    window.AddFunctions = AddFunctions
    window.AverageExFunctionEval_fob = AverageExFunctionEval_fob
})(this, jQuery)
