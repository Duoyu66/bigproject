<template>
	<div class="test-container">
		<div class="standardChart pubChartBox">
			<span class="menuIcons1" name="substanceCategory" @click="linkPage($event)"></span>
			<span class="menuIcons2" name="materialConsumption" @click="linkPage($event)"></span>
			<span class="menuIcons3" name="materialCustomizations" @click="linkPage($event)"></span>
			<span class="menuIcons4" name="materialLedger" @click="linkPage($event)"></span>
			<span class="menuIcons5" tabs="table" name="materialPurchase" @click="linkPage($event)"></span>
			<span class="menuIcons6" tabs="form" name="materialPurchase" @click="linkPage($event)"></span>
			<span class="menuIcons7" tabs="table" name="materialMaking" @click="linkPage($event)"></span>
			<span class="menuIcons8" tabs="RmMakeDialog" name="materialMaking" @click="linkPage($event)"></span>
			<span class="menuIcons9" tabs="form" name="periodVerification" @click="linkPage($event)"></span>
			<span class="menuIcons10" tabs="table" name="periodVerification" @click="linkPage($event)"></span>
			<span class="menuIcons11" tabs="tableHistory" name="periodVerification" @click="linkPage($event)"></span>
			<span class="menuIcons12" tabs="form" name="consumptionRecord" @click="linkPage($event)"></span>
			<span class="menuIcons13" tabs="table" name="consumptionRecord" @click="linkPage($event)"></span>
			<span class="menuIcons14" tabs="form" name="verificationPlan" @click="linkPage($event)"></span>
			<span class="menuIcons15" tabs="table" name="verificationPlan" @click="linkPage($event)"></span>
			<span class="menuIcons16" tabs="tableHistory" name="verificationPlan" @click="linkPage($event)"></span>
			<span class="menuIcons17" tabs="form" name="voidedRecord" @click="linkPage($event)"></span>
			<span class="menuIcons18" tabs="table" name="voidedRecord" @click="linkPage($event)"></span>
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
		name: 'standardMenu',
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
				const prefix = '/standardManagement/'
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
</script>
<style lang="scss" scoped>
	.app-main-container {
		overflow: scroll;
	}

	.test-container app-main-height {
		overflow: scroll;
	}

	.standardChart {
		width: 1035px;
		height: 634px;
		margin: 1rem auto 0;
		position: relative;
		margin-top: 30px;
		background: url('./../../assets/images/standardChart.png') no-repeat top center;
		background-size: auto;
	}

	.standardChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.standardChart .menuIcons1 {
		background-position: -120px 0 !important;
		top: 0px;
		left: 120px;
	}

	.standardChart .menuIcons2 {
		background-position: 0px -145px !important;
		left: 0px;
		top: 145px;
	}

	.standardChart .menuIcons3 {
		background-position: -237px -149px !important;
		left: 237px;
		top: 149px;
	}

	.standardChart .menuIcons4 {
		background-position: -513px -149px !important;
		left: 513px;
		top: 149px;
	}

	.standardChart .menuIcons5 {
		background-position: -774px 0 !important;
		left: 774px;
		top: 0px;
	}

	.standardChart .menuIcons6 {
		background-position: -954px 0 !important;
		left: 954px;
		top: 0px;
	}

	.standardChart .menuIcons7 {
		background-position: -773px -149px !important;
		left: 773px;
		top: 149px;
	}

	.standardChart .menuIcons8 {
		background-position: -954px -149px !important;
		left: 954px;
		top: 149px;
	}

	.standardChart .menuIcons9 {
		background-position: -113px -297px !important;
		left: 113px;
		top: 297px;
	}

	.standardChart .menuIcons10 {
		background-position: -113px -418px !important;
		left: 113px;
		top: 418px;
	}

	.standardChart .menuIcons11 {
		background-position: -113px -541px !important;
		left: 113px;
		top: 541px;
	}

	.standardChart .menuIcons12 {
		background-position: -372px -297px !important;
		left: 372px;
		top: 297px;
	}

	.standardChart .menuIcons13 {
		background-position: -372px -417px !important;
		left: 372px;
		top: 417px;
	}

	.standardChart .menuIcons14 {
		background-position: -630px -298px !important;
		left: 630px;
		top: 298px;
	}

	.standardChart .menuIcons15 {
		background-position: -630px -418px !important;
		left: 630px;
		top: 418px;
	}

	.standardChart .menuIcons16 {
		background-position: -630px -541px !important;
		left: 630px;
		top: 541px;
	}

	.standardChart .menuIcons17 {
		background-position: -894px -298px !important;
		left: 894px;
		top: 298px;
	}

	.standardChart .menuIcons18 {
		background-position: -894px -417px !important;
		left: 894px;
		top: 417px;
	}

	//按钮置灰不可点 添加class :unclick
	.standardChart .unclick {
		background: url(./../../assets/images/standardChart.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
