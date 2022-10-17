<template>
  <div class="test-container ">
	<div class="indexChart pubChartBox">
	    <span class="menuIcons1 " name="clientManagement"  tabs="0" @click="linkPage($event)" data-title="客户登记"></span>
	    <span class="menuIcons2 " name="clientManagement"  tabs="1" @click="linkPage($event)" data-title="客户台账"></span>
      <span class="menuIcons3 " name="contacts"  tabs="1" @click="linkPage($event)" data-title="联系人"></span>

	    <span class="menuIcons4 " tabs="0" name="contractDeviceManagement" @click="linkPage($event)" data-title="设备合同登记"></span>
      <span class="menuIcons5 " tabs="1" name="contractDeviceManagement" @click="linkPage($event)" data-title="设备合同台账"></span>
	    <span class="menuIcons6 " tabs="0" name="contractCalibrationManage" @click="linkPage($event)" data-title="校检合同登记"></span>
	    <span class="menuIcons7 " tabs="1" name="contractCalibrationManage" @click="linkPage($event)" data-title="校检合同台账"></span>
	    <span class="menuIcons8 " tabs="0" name="contractChemicalManage" @click="linkPage($event)" data-title="消耗品合同登记"></span>
	    <span class="menuIcons9 " tabs="1" name="contractChemicalManage" @click="linkPage($event)"  data-title="消耗品合同台账"></span>
	    <span class="menuIcons10 " tabs="0" name="contractManagement" @click="linkPage($event)" data-title="服务合同登记"></span>
	    <span class="menuIcons11 " tabs="1" name="contractManagement" @click="linkPage($event)"  data-title="服务合同台账"></span>
	    <span class="menuIcons12 " tabs="0" name="contractEntrustManagement" @click="linkPage($event)"  data-title="委外合同登记"></span>
	    <span class="menuIcons13 " tabs="1" name="contractEntrustManagement" @click="linkPage($event)"  data-title="委外合同台账"></span>
	    <span class="menuIcons14 " tabs="1" name="/device/equipmentPurchase" @click="linkPage($event)" data-title="设备采购台账"></span>
	    <span class="menuIcons15 " tabs="" name="" @click="linkPage($event)" data-title="校检台账"></span>
      <span class="menuIcons16 " tabs="" name="" @click="linkPage($event)" data-title="消耗品采购台账"></span>
      <span class="menuIcons17 " tabs="0" name="Charge" @click="linkPage($event)" data-title="已付款登记"></span>
      <span class="menuIcons18 " tabs="1" name="Charge" @click="linkPage($event)" data-title="已付款记录"></span>
      <span class="menuIcons19 " tabs="0" name="" @click="linkPage($event)"  data-title="联系记录"></span>
      <span class="menuIcons20 " tabs="0" name="receipt" @click="linkPage($event)"  data-title="发票登记"></span>
      <span class="menuIcons21 " tabs="1" name="receipt" @click="linkPage($event)" data-title="发票记录"></span>
      <!-- <span class="menuIcons22 " tabs="0" name="Receivable" @click="linkPage($event)" data-title="应收款记录"></span> -->
      <span class="menuIcons23 unclick" tabs="0" name="Received" @click="linkPage($event)" data-title="已收款登记"></span>
      <span class="menuIcons24 unclick" tabs="1" name="Received" @click="linkPage($event)" data-title="收款记录"></span>
      <span class="menuIcons25 " tabs="0" name="ContractReceivable" @click="linkPage($event)" data-title="验工计价添加"></span>
      <span class="menuIcons26 " tabs="0" name="ContractReceivable" @click="linkPage($event)" data-title="验工计价统计"></span>




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
        // console.log(e.target.getAttribute('name'))
        const prefix = "/equipmentManagement/"
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
      linkPage1(e) {
        // console.log(e.target.getAttribute('name'))
        const prefix = "/equipmentManagement/"
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
  .test-container app-main-height{overflow: scroll;}
  .app-main-container {overflow: scroll;}
  .test-container app-main-height {overflow: scroll;}
  .test-container{border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	  #{$base-padding})!important;}
  .indexChart {width:975px;height:647px;margin:30px auto 0;position: relative;
    background: url("./../../assets/images/indexChart.png") no-repeat top center;background-size: auto;}
  .indexChart span {width:104px;height:46px;display: block;position: absolute;cursor: pointer;}
  .indexChart .menuIcons1 {background-position: 0px -90px !important;left:0px;top: 90px;}
  .indexChart .menuIcons2 {background-position: 0px -207px !important;left: 0px;top:207px;}
  .indexChart .menuIcons3 {background-position: 0px -325px !important;left:0px;top:325px;}
  .indexChart .menuIcons4 {background-position: -159px -42px !important;left:159px;top: 42px;}
  .indexChart .menuIcons5 {background-position: -304px -42px !important;left: 304px;top: 42px;}
  .indexChart .menuIcons6 {background-position: -159px -154px !important;left: 159px;top: 154px;}
  .indexChart .menuIcons7 {background-position: -304px -156px !important;left:304px;top: 156px;}
  .indexChart .menuIcons8 {background-position: -159px -271px !important;left:159px;top: 271px;}
  .indexChart .menuIcons9 {background-position: -304px -271px !important;left:304px;top:271px;}
  .indexChart .menuIcons10 {background-position: -159px -397px !important;left:159px;top:397px;}
  .indexChart .menuIcons11 {background-position: -304px -397px !important;left:304px;top:397px;}
  .indexChart .menuIcons12 {background-position: -304px -468px !important;left:304px;top:468px;}
  .indexChart .menuIcons13 {background-position: -304px -538px !important;left: 304px;top:538px;}
  .indexChart .menuIcons14 {background-position: -550px -1px !important;left: 550px;top: 1px;}
  .indexChart .menuIcons15 {background-position: -550px -89px !important;left: 550px;top: 89px;}
  .indexChart .menuIcons16 {background-position: -550px -180px !important;left: 550px;top:180px;}
  .indexChart .menuIcons17 {background-position: -550px -267px !important;left: 550px;top:267px;}
  .indexChart .menuIcons18 {background-position: -710px -267px !important;left: 710px;top:267px;}
  .indexChart .menuIcons19 {background-position: -550px -351px !important;left: 550px;top:351px;}
  .indexChart .menuIcons20 {background-position: -550px -432px !important;left: 550px;top:432px;}
  .indexChart .menuIcons21 {background-position: -710px -432px !important;left: 710px;top:432px;}
  // .indexChart .menuIcons22 {background-position: -550px -518px !important;left: 550px;top:518px;}
  .indexChart .menuIcons23 {background-position: -550px -518px !important;left: 550px;top:518px;}
  .indexChart .menuIcons24 {background-position: -710px -518px !important;left: 710px;top:518px;}
  .indexChart .menuIcons25 {background-position: -550px -601px !important;left: 550px;top:601px;}
  .indexChart .menuIcons26 {background-position: -710px -601px !important;left: 710px;top:601px;}
  //按钮置灰不可点 添加class :unclick
  .indexChart .unclick {
    background: url(./../../assets/images/indexChart.png) no-repeat top center;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

</style>
