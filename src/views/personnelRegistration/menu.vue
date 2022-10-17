<template>
	<div class="test-container">
		<div class="personnelRegistrationChart pubChartBox">
			<span class="menuIcons1" name="personnelLedger" tabs="add" @click="linkPage($event)"></span>
			<span class="menuIcons2" name="personnelLedger" tabs="table" @click="linkPage($event)"></span>
			<span class="menuIcons3" name="personnelAllocation" @click="linkPage($event)"></span>
			<span class="menuIcons4" name="personnelCertification" @click="linkPage($event)"></span>
			<span class="menuIcons5" name="personnelSupervision" @click="linkPage($event)"></span>
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
		name: 'PersonnelRegistrationMenu',
		data() {
			return {
				show: true,
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
			// linkPage(e) {
			//   console.log(e.target.getAttribute('name'))
			//   this.foldSideBar()
			//   if(routeorg.includes("/userManages/"+e.target.getAttribute('name')))
			//   {
			//     this.foldOrgexist()
			//   }
			//   else{
			//     this.openOrgexist()
			//   }
			//   this.$router.push(e.target.getAttribute('name'))
			// },
			async linkPage(e) {
				//console.log(e.target.getAttribute('tabs'))
				const prefix = '/personnelRegistration/'
				const name = e.target.getAttribute('name')
				const tabs = e.target.getAttribute('tabs')
				if (name) {
					this.foldSideBar()
					if (routeorg.includes(prefix + name)) {
						this.foldOrgexist()
					} else {
						this.openOrgexist()
					}
					// console.log(this)
					// console.log(this.$router)
					// let flag2 = await this.$store.dispatch('routes/hasRouteByPath', name)
					// console.log(flag2)
					if (tabs) {
						this.$router.push({
							path: name,
							query: {
								tabs: tabs,
							},
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
	.app-main-container {
		overflow: scroll;
	}

	.test-container app-main-height {
		overflow: scroll;
	}
  .test-container{
    border: 1px solid #dbe0e6;background:#fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	#{$base-padding})!important;
}
	.personnelRegistrationChart {
		width: 518px;
		height: 402px;
		margin: 1rem auto 0;
		position: relative;
		margin-top: 90px;
		background: url('./../../assets/images/personnalChart.png') no-repeat top center;
		background-size: auto;
	}

	.personnelRegistrationChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.personnelRegistrationChart .menuIcons1 {
		background-position: -218px 0 !important;
		left: 218px;
		top: 0px;
	}

	.personnelRegistrationChart .menuIcons2 {
		background-position: -218px -155px !important;
		left: 218px;
		top: 155px;
	}

	.personnelRegistrationChart .menuIcons3 {
		background-position: 0px -308px !important;
		left: 0;
		top: 308px;
	}

	.personnelRegistrationChart .menuIcons4 {
		background-position: -218px -308px !important;
		left: 218px;
		top: 308px;
	}

	.personnelRegistrationChart .menuIcons5 {
		background-position: -437px -309px !important;
		left: 437px;
		top: 309px;
	}

	//按钮置灰不可点 添加class :unclick
	.personnelRegistrationChart .unclick {
		background: url(./../../assets/images/personnalChart.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
