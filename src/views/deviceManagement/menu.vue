<template>
  <!--  设备管理-->
  <div class="test-container ">
    <div class="deviceManagementChart pubChartBox">
      <span class="menuIcons1 " name="equipmentPurchase" tabs="0" @click="linkPage($event)"></span>
      <span class="menuIcons2 " name="equipmentPurchase" tabs="1" @click="linkPage($event)"></span>
      <span class="menuIcons_3 " tabs="1" name="equipmentAcceptance" @click="linkPage($event)"></span>
      <span class="menuIcons3 " tabs="0" name="equipmentAcceptance" @click="linkPage($event)"></span>
      <span class="menuIcons4 " name="deviceClass" @click="linkPage($event)"></span>
      <span class="menuIcons5 " name="equipmentUsage" @click="linkPage($event)"></span>
      <span class="menuIcons6 " name="equipmentLedger" @click="linkPage($event)"></span>
      <span class="menuIcons7 " tabs='0' name="equipmentCalibration" @click="linkPage($event)"></span>
      <span class="menuIcons8 " tabs='1' name="equipmentCalibration" @click="linkPage($event)"></span>
      <span class="menuIcons9 " tabs='2' name="equipmentCalibration" @click="linkPage($event)"></span>
      <span class="menuIcons10 " tabs='0' name="equipmentPeriodcheck" @click="linkPage($event)"></span>
      <span class="menuIcons11 " tabs='1' name="equipmentPeriodcheck" @click="linkPage($event)"></span>
      <span class="menuIcons12 " tabs='2' name="equipmentPeriodcheck" @click="linkPage($event)"></span>
      <span class="menuIcons13 " tabs='0' name="Maintenance" @click="linkPage($event)"></span>
      <span class="menuIcons14 " tabs='1' name="Maintenance" @click="linkPage($event)"></span>
      <span class="menuIcons15 " tabs='0' name="equipmentAllocation" @click="linkPage($event)"></span>
      <span class="menuIcons16 " tabs='1' name="equipmentAllocation" @click="linkPage($event)"></span>
      <!-- 新加按钮 -->
      <span class="menuIcons_16 " tabs='2' name="equipmentAllocation" @click="linkPage($event)"></span>
      <span class="menuIcons17 " tabs='0' name="equipmentAccident" @click="linkPage($event)"></span>
      <span class="menuIcons18 " tabs='1' name="equipmentAccident" @click="linkPage($event)"></span>
      <span class="menuIcons19 " tabs='0' name="equipmentMaintenance" @click="linkPage($event)"></span>
      <span class="menuIcons20 " tabs='1' name="equipmentMaintenance" @click="linkPage($event)"></span>
      <!-- 新加按钮 -->
      <span class="menuIcons21 " tabs='0' name="equipmentSealUnseal" @click="linkPage($event)"></span>
      <span class="menuIcons22 " tabs='1' name="equipmentSealUnseal" @click="linkPage($event)"></span>
    </div>
  </div>
</template>
<script>
  import {
    mapActions
  } from 'vuex'
  import {
    routeorg
  } from '@/config'
  export default {
    name: 'deviceMenu',
    data() {
      return {
        show: true
      }
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
        //console.log(e.target.getAttribute('tabs'))
        const prefix = "/equipmentManagement/"
        console.log(e.target.getAttribute('name'))
        const name = e.target.getAttribute('name')
        const tabs = e.target.getAttribute('tabs')
        if (name) {
          this.foldSideBar()
          if (routeorg.includes(prefix + name)) {
            this.foldOrgexist()
          } else {
            this.openOrgexist()
          }

          if (tabs) {
            this.$router.push({
              path: name,
              query: {
                tabs: tabs
              }
            })
          } else {
            this.$router.push(name)
          }
        }

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
  .app-main-container {overflow: scroll;}
  .test-container app-main-height {overflow: scroll;}
  .test-container{
  border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	  #{$base-padding})!important;
  }
  .deviceManagementChart {width: 1200px;height:566px;margin: 150px auto 0;position: relative;margin-top: 80px;
    background: url("./../../assets/images/deviceManagementChart.png") no-repeat top center;background-size: auto;}
  .deviceManagementChart span {width: 81px;height: 93px;display: block;position: absolute;cursor: pointer;}
  .deviceManagementChart .menuIcons1 {background-position: -3px -206px !important;left: 3px;top: 206px;}
  .deviceManagementChart .menuIcons2 {background-position: -174px -207px !important;left: 174px;top:207px;}
  .deviceManagementChart .menuIcons_3 {background-position: -377px -47px !important;left: 377px;top: 47px;}
  .deviceManagementChart .menuIcons3 {background-position: -377px -207px !important;left: 377px;top:207px;}
  .deviceManagementChart .menuIcons4 {background-position: -237px -334px !important;left:237px;top: 334px;}
  .deviceManagementChart .menuIcons5 {background-position: -375px -448px !important;left: 375px;top: 448px;}
  .deviceManagementChart .menuIcons6 {background-position: -526px -208px !important;left: 526px;top: 208px;}
  .menuIcons7,.menuIcons8,.menuIcons9,.menuIcons10,.menuIcons11,.menuIcons12,.menuIcons13,.menuIcons14,
  .menuIcons15,.menuIcons16,.menuIcons_16,.menuIcons17,.menuIcons18,.menuIcons19,.menuIcons20,.menuIcons21,.menuIcons22{width:104px!important;height:46px!important;}
  .deviceManagementChart .menuIcons7 {background-position: -739px -2px !important;left:739px;top: 2px;}
  .deviceManagementChart .menuIcons8 {background-position: -917px -2px !important;left:917px;top: 2px;}
  .deviceManagementChart .menuIcons9 {background-position: -1095px -2px !important;left:1095px;top:2px;}
  .deviceManagementChart .menuIcons10 {background-position: -739px -88px !important;left:739px;top:88px;}
  .deviceManagementChart .menuIcons11 {background-position: -917px -88px !important;left:917px;top:88px;}
  .deviceManagementChart .menuIcons12 {background-position: -1095px -88px !important;left:1095px;top:88px;}
  .deviceManagementChart .menuIcons13 {background-position: -738px -174px !important;left: 738px;top: 174px;}
  .deviceManagementChart .menuIcons14 {background-position: -917px -174px !important;left: 917px;top: 174px;}
  .deviceManagementChart .menuIcons15 {background-position: -740px -260px !important;left: 740px;top: 260px;}
  .deviceManagementChart .menuIcons16 {background-position: -917px -260px !important;left: 917px;top: 260px;}
  .deviceManagementChart .menuIcons_16 {background-position: -1095px -260px !important;left: 1095px;top: 260px;}
  .deviceManagementChart .menuIcons17 {background-position: -738px -346px !important;left: 738px;top: 346px;}
  .deviceManagementChart .menuIcons18 {background-position: -918px -346px !important;left: 918px;top: 346px;}
  .deviceManagementChart .menuIcons19 {background-position: -739px -432px !important;left: 739px;top: 432px;}
  .deviceManagementChart .menuIcons20 {background-position: -917px -432px !important;left: 917px;top: 432px;}
  .deviceManagementChart .menuIcons21 {background-position: -739px -518px !important;left: 739px;top: 518px;}
  .deviceManagementChart .menuIcons22 {background-position: -917px -518px !important;left: 917px;top: 518px;}
  //按钮置灰不可点 添加class :unclick
  .deviceManagementChart .unclick {
    background: url(./../../assets/images/deviceManagementChart.png) no-repeat top center;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }
</style>
