<template>
  <div class="test-container ">
    <div class="personnelChart pubChartBox">
      <span class="menuIcons1"  name="substanceCategory" @click="linkPage($event)"></span>
      <span class="menuIcons2" name="materialConsumption" @click="linkPage($event)"></span>
      <span class="menuIcons3 unclick" name="" @click="linkPage($event)"></span>
      <span class="menuIcons4 " name="materialLedger" @click="linkPage($event)"></span>
      <span class="menuIcons5"  name="materialPurchase" @click="linkPage($event)"></span>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { routeorg } from '@/config'
  export default {
    name: 'personnelMenu',
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
  .test-container{ border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	#{$base-padding})!important;}
  .personnelChart{
    width:518px;height:402px;margin:1rem auto 0;position: relative;margin-top:90px;
    background:url("./../../assets/images/personnalChart.png") no-repeat top center;
    background-size: auto ;
  }
  .personnelChart span {width:81px;height:93px;display:block;position: absolute;cursor:pointer;}
  .personnelChart .menuIcons1{background-position: -91px 0 !important;top: 0px;left: 91px;}
  .personnelChart .menuIcons2{background-position:0px -159px !important;left: 0px;top: 159px;}
  .personnelChart .menuIcons3{background-position:0px -159px !important;left:0;top: 159px;}
  .personnelChart .menuIcons4{background-position:-448px -163px !important;left: 448px;top: 163px;}
  .personnelChart .menuIcons5{background-position: -627px 0 !important;left:627px;top: 0px;}
  //按钮置灰不可点 添加class :unclick
  .personnelChart .unclick{background:url(./../../assets/images/personnalChart.png) no-repeat top center;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

</style>
