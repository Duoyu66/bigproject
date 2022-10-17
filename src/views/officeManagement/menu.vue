<template>
  <div class="test-container ">
    <div class="officeChart pubChartBox">
      <span class="menuIcons1 "  name="postRegistration" @click="linkPage($event)" data-title="起草"></span>
      <span class="menuIcons2 " name="examinationAndapproval" @click="linkPage($event)" data-title="公文审批"></span>
      <span class="menuIcons3 " name="draft" @click="linkPage($event)" data-title="发文管理"></span>
      <span class="menuIcons4 " name="receiptRecord" @click="linkPage($event)" data-title="收文管理"></span>
      <span class="menuIcons5 "  name="dispatchRegister" @click="linkPage($event)" data-title="收文登记"></span>
      <span class="menuIcons6 "  name="sealLedger" @click="linkPage($event)" data-title="印章台账"></span>
      <span class="menuIcons7 " name="sealRecords" @click="linkPage($event)" data-title="用印记录"></span>
      <span class="menuIcons8 " name="points" @click="linkPage($event)" data-title="个人扣分定义"></span>
      <span class="menuIcons9 " name="personalIntegral" @click="linkPage($event)" data-title="个人积分"></span>
      <span class="menuIcons10 " name="mechanismIntegral" @click="linkPage($event)" data-title="机构积分"></span>
      <span class="menuIcons11" name="qualificationCert" @click="linkPage($event)" data-title="资质管理"></span>

<!--      <span class="menuIcons11 unclick" name="clientManagement" @click="linkPage($event)"></span>-->
<!--      <span class="menuIcons12 unclick" name="consumptionRecord" @click="linkPage($event)"></span>-->
<!--      <span class="menuIcons13 unclick" name="contractManagement" @click="linkPage($event)"></span>-->
<!--      <span class="menuIcons14 unclick" name="rechargeRecord" @click="linkPage($event)"></span>-->
<!--      <span class="menuIcons15 unclick" name="collectionRecord" @click="linkPage($event)"></span>-->
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
  .officeChart{
    width:641px;height:503px;margin:1rem auto 0;position: relative;margin-top:90px;
    background:url("./../../assets/images/officeChart.png") no-repeat top center;
    background-size: auto ;
  }
  .officeChart span {width:81px;height:93px;display:block;position: absolute;cursor:pointer;}
  .officeChart .menuIcons1{background-position: -1px -2px !important;left: 1px;top: 2px;}
  .officeChart .menuIcons2{background-position:-178px -2px !important;left: 178px;top: 2px;}
  .officeChart .menuIcons3{background-position: -357px -2px !important;left: 357px;top: 2px;}
  .officeChart .menuIcons4{background-position: -537px -2px !important;left: 537px;top:2px;}
  .officeChart .menuIcons5{background-position:-537px -149px !important;left: 537px;top:149px;}
  .officeChart .menuIcons6{background-position: -1px -212px !important;left: 1px;top:212px;}
  .officeChart .menuIcons7{background-position:-178px -211px !important;left: 178px;top: 211px;}
  .officeChart .menuIcons8{background-position:-1px -408px !important;left:1px;top: 408px;}
  .officeChart .menuIcons9{background-position: -178px -408px !important;left:178px;top: 408px;}
  .officeChart .menuIcons10{background-position:-357px -408px !important;left: 357px;top: 408px;}
  .officeChart .menuIcons11{background-position:-538px -408px !important;left: 538px;top: 408px;}
  //按钮置灰不可点 添加class :unclick
  .officeChart .unclick{background:url(./../../assets/images/officeChart.png) no-repeat top center;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

</style>
