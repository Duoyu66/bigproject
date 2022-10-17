<template>
  <!-- 物探资料管理 -->
  <div class="test-container ">
    <div class="datamanagement pubChartBox">
      <span class="menuIcons1 "  name="" @click="linkPage($event)" data-title="物探开工前资料管理"></span>
      <span class="menuIcons2 " name="" @click="linkPage($event)" data-title="物探任务书"></span>
      <span class="menuIcons3 " name="GeoReport" @click="linkPage($event)" data-title="物探报告编写"></span>
      <span class="menuIcons4 " name="" @click="linkPage($event)" data-title="物探报告复核"></span>
      <span class="menuIcons5 "  name="" @click="linkPage($event)" data-title="物探报告审核"></span>
      <span class="menuIcons6 "  name="" @click="linkPage($event)" data-title="物探报告审定"></span>
      <span class="menuIcons7 " name="" @click="linkPage($event)" data-title="物探原始记录"></span>
      <span class="menuIcons8 " name="" @click="linkPage($event)" data-title="物探周报"></span>
      <span class="menuIcons9 " name="" @click="linkPage($event)" data-title="物探月报"></span>
      <span class="menuIcons10 " name="" @click="linkPage($event)" data-title="竣工报表"></span>
      <span class="menuIcons11" name="" @click="linkPage($event)" data-title="决算单"></span>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { routeorg } from '@/config'
  export default {
    name: 'officeMenu',
    data() {
      return { show: true }
    },
    created() {},
    mounted() {},
    methods: {
      ...mapActions({
        foldSideBar: 'settings/foldSideBar',
        foldOrgexist: 'settings/foldOrgexist',
        openOrgexist: 'settings/openOrgexist',
      }),
      linkPage(e) {
        console.log(e.target.getAttribute('name'))
        this.foldSideBar()
        if(routeorg.includes("/chemicalManagement/"+e.target.getAttribute('name')))
        {
          this.foldOrgexist()
        }
        else{
          this.openOrgexist()
        }
        this.$router.push(e.target.getAttribute('name'))
      },
    },
  }
  // 原生rem布局引用
  // document.documentElement.style.fontSize = innerWidth/32+'px';
  // window.onresize= function(){
  //   document.documentElement.style.fontSize = innerWidth/32+'px';
  // }
</script>
<style lang="scss" scoped>
  .app-main-container{overflow: scroll;}
  .test-container app-main-height{overflow: scroll;}
  .test-container{border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	  #{$base-padding})!important;}
  .datamanagement{
    width:761px;height:333px;margin:90px auto 0;position: relative;
    background:url("./../../assets/images/datamanagement.png") no-repeat top center;
    background-size: auto ;
  }
  .datamanagement span {width:104px;height:46px;display:block;position: absolute;cursor:pointer;}
  .datamanagement .menuIcons1{background-position: 0px 0px !important;left: 0px;top: 0px;}
  .datamanagement .menuIcons2{background-position:-0px -94px !important;left: 0;top: 94px;}
  .datamanagement .menuIcons3{background-position: -244px 0px !important;left:244px;top: 0px;}
  .datamanagement .menuIcons4{background-position: -244px -94px !important;left:244px;top:94px;}
  .datamanagement .menuIcons5{background-position:-244px -190px !important;left: 244px;top:190px;}
  .datamanagement .menuIcons6{background-position: -244px -287px !important;left: 244px;top:287px;}
  .datamanagement .menuIcons7{background-position:-417px -0px !important;left: 417px;top: 0px;}
  .datamanagement .menuIcons8{background-position:-417px -94px !important;left:417px;top: 94px;}
  .datamanagement .menuIcons9{background-position: -417px -190px !important;left:417px;top: 190px;}
  .datamanagement .menuIcons10{background-position:-657px -0px !important;left: 657px;top: 0px;}
  .datamanagement .menuIcons11{background-position:-657px -94px !important;left:657px;top: 94px;}
  //按钮置灰不可点 添加class :unclick
  .datamanagement .unclick{background:url(./../../assets/images/datamanagement.png) no-repeat top center;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

</style>
