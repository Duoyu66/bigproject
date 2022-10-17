(function (window, $) {
    "use strict";;
    var spread = $.wijmo.wijspread,
        UI = GrapeCity.UI;
    function echartArea(id,spread_init,cellData) {
        this.id=id;
		this.spread_init=spread_init;
		this.cellData=cellData;
    }
    echartArea.prototype.createArea = function (chart_id,option) {
        try {
			var echartOption = this.getOptions(option);
			console.log(this.cellData)
            var div_child = '<div id="'+chart_id+'" style="height:'+this.cellData.height.toString()+'px;width:'+this.cellData.width.toString()
			+'px;background-color:#fff;box-sizing:content-box;border: 1px solid #939393;position: absolute;left:'
			+(this.cellData.x+$('#'+this.id).offset().left).toString()+'px;top:'+(this.cellData.y+$('#'+this.id).offset().top).toString()+'px;"></div>';
            
            $("#"+this.id).append(div_child);
            
            var chartDom = document.getElementById(chart_id);
			
            var myChart = echarts.init(chartDom);
            
            myChart.setOption(echartOption);
        } catch (e) {
            console.log(e);
        }
    }
    echartArea.prototype.setStyle = function (chart_id) {
        try {
            $('#'+chart_id)
        } catch (e) {
            console.log(e);
        }
    }
    echartArea.prototype.setBackgroud = function () {
        try {
            
        } catch (e) {
            console.log(e);
        }
    }
	echartArea.prototype.getOptions = function (option) {
	    try {
	        var echartOption = {
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: 'line'
                },{
                  data: [182, 230, 224, 218, 135, 147, 260],
                  type: 'line'
                }
              ]
            };
			return echartOption;
	    } catch (e) {
	        console.log(e);
	    }
	}
	window.echartArea = echartArea;

})(window, jQuery);
