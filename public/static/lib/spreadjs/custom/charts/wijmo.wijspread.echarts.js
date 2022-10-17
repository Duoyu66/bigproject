(function (window, $) {


    function AddMiniChart(temp_vob, muti) {
        if (muti == null || muti == undefined) {
            muti = 1;
        }
        temp_vob.addSparklineEx(new DChart1(muti)); //添加自定义迷你图 
    }
})(this, jQuery)