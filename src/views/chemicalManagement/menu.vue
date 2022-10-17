<template>
	<div class="test-container">
		<!--  化学品管理-->
		<div class="chemicalChart pubChartBox">
			<span class="menuIcons1" tabs="PurchaseForm" name="chemicalPurchase" @click="linkPage($event)"></span>
			<span class="menuIcons2" name="chemicalPreserve" @click="linkPage($event)"></span>
			<span class="menuIcons3" name="parameterEquipment" @click="linkPage($event)"></span>
			<span class="menuIcons4" name="chemicalDistribution" @click="linkPage($event)"></span>
			<span class="menuIcons5" tabs="PurchaseTalbe" name="chemicalPurchase" @click="linkPage($event)"></span>
			<span class="menuIcons6" name="chemicalStock" @click="linkPage($event)"></span>
			<span class="menuIcons7" name="chemicalConsumption" @click="linkPage($event)"></span>
			<span class="menuIcons8" name="chemicalInventory" @click="linkPage($event)"></span>
			<span class="menuIcons9" name="voidRecord" @click="linkPage($event)"></span>
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
		name: 'ChemiclMenu',
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
			linkPage(e) {
				const prefix = '/equipmentManagement/'
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

	.test-container app-main-height {overflow: scroll;}
.test-container{
  border: 1px solid #dbe0e6;background:#fff;
  	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
  	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
  	#{$base-padding})!important;
}
	.chemicalChart {
		width: 749px;
		height: 538px;
		margin: 60px auto 0;
		position: relative;
		background: url('./../../assets/images/chemicalChart.png') no-repeat top center;
		background-size: auto;
	}

	.chemicalChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.chemicalChart .menuIcons1 {
		background-position: -417px -0px !important;
		left: 417px;
		top: 0px;
	}

	.chemicalChart .menuIcons2 {
		background-position: -105px -148px !important;
		left: 105px;
		top: 148px;
	}

	.chemicalChart .menuIcons3 {
		background-position: 0px -293px !important;
		left: 0px;
		top: 293px;
	}

	.chemicalChart .menuIcons4 {
		background-position: -208px -293px !important;
		left: 208px;
		top: 293px;
	}

	.chemicalChart .menuIcons5 {
		background-position: -418px -148px !important;
		left: 418px;
		top: 148px;
	}

	.chemicalChart .menuIcons6 {
		background-position: -419px -293px !important;
		left: 419px;
		top: 293px;
	}

	.chemicalChart .menuIcons7 {
		background-position: -668px -154px !important;
		left: 668px;
		top: 154px;
	}

	.chemicalChart .menuIcons8 {
		background-position: -668px -293px !important;
		left: 668px;
		top: 293px;
	}

	.chemicalChart .menuIcons9 {
		background-position: -668px -445px !important;
		left: 668px;
		top: 445px;
	}

	//按钮置灰不可点 添加class :unclick
	.chemicalChart .unclick {
		background: url(./../../assets/images/chemicalChart.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
