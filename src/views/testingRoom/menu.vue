<template>
	<div class="test-container">
		<div class="testingRoomChart pubChartBox">
			<span class="menuIcons1" name="detectionRoomdefinition" @click="linkPage($event)"></span>
			<span class="menuIcons2" name="roomAllocation" @click="linkPage($event)" ></span>
			<span class="menuIcons3" name="detectionRoomallocation" @click="linkPage($event)" tabs="second"></span>
			<span class="menuIcons4" name="accessControlrecord" @click="linkPage($event)"></span>
			<span class="menuIcons5" name="real-timeMonitoring" @click="linkPage($event)"></span>
			<span class="menuIcons6" name="alarmRecord" @click="linkPage($event)"></span>
			<span class="menuIcons7" name="environmentalMonitoring" @click="linkPage($event)"></span>
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
		name: 'testingRoomMenu',
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
				const profix = '/testingRoom/'
				const name = e.target.getAttribute("name");
				const tabs = e.target.getAttribute("tabs");
				if (name) {
					this.foldSideBar();
					if (routeorg.includes(profix + name)) {
						//this.foldOrgexist();
					} else {
						//this.foldOrgexist();
					}
					if (tabs) {
						this.$router.push({
							path: name,
							query: {
								tabs: tabs
							}
						})
					} else {
						this.$router.push(name);
					}
				}
			},
		},
		// 原生rem布局引用
		// document.documentElement.style.fontSize = innerWidth/32+'px';
		// window.onresize= function(){
		//   document.documentElement.style.fontSize = innerWidth/32+'px';
		// }
	}
</script>
<style lang="scss" scoped>
	.app-main-container {overflow: scroll;}
	.test-container app-main-height {overflow: scroll;}
  .test-container{border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	  #{$base-padding})!important;}
	.testingRoomChart {
		width: 735px;
		height: 532px;
		margin: 1rem auto 0;
		position: relative;
		margin-top: 90px;
		background: url('./../../assets/images/testingRoomChart.png') no-repeat top center;
		background-size: auto;
	}

	.testingRoomChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.testingRoomChart .menuIcons1 {
		background-position: -339px 0 !important;
		left: 339px;
		top: 0px;
	}

	.testingRoomChart .menuIcons2 {
		background-position: -340px -135px !important;
		left: 340px;
		top: 135px;
	}

	.testingRoomChart .menuIcons3 {
		background-position: -339px -270px !important;
		left: 339px;
		top: 270px;
	}

	.testingRoomChart .menuIcons4 {
		background-position: -0px -439px !important;
		left: 0px;
		top: 439px;
	}

	.testingRoomChart .menuIcons5 {
		background-position: -218px -438px !important;
		left: 218px;
		top: 438px;
	}

	.testingRoomChart .menuIcons6 {
		background-position: -436px -439px !important;
		left: 436px;
		top: 439px;
	}

	.testingRoomChart .menuIcons7 {
		background-position: -654px -439px !important;
		left: 654px;
		top: 439px;
	}

	//按钮置灰不可点 添加class :unclick
	.testingRoomChart .unclick {
		background: url(./../../assets/images/testingRoomChart.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
