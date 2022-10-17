<template>
	<div class="test-container">
		<div class="testDevelopmentChart pubChartBox">
			<span :class="menuClassName('menuIcons1','workingStandard')" name="workingStandard"
				@click="linkPage($event)" data-title="标准"></span>
			<span :class="menuClassName('menuIcons2','standardSelect')" name="standardSelect" @click="linkPage($event)"
				data-title="常用标准"></span>
			<span :class="menuClassName('menuIcons3','parameterManagement')" name="parameterManagement"
				@click="linkPage($event)" data-title="参数"></span>
			<span :class="menuClassName('menuIcons4','dataDictionary')" name="dataDictionary"
				@click="linkPage($event)" data-title="主数据字典"></span>
			<span :class="menuClassName('menuIcons5','testitemManage')" name="testitemManage"
				@click="linkPage($event)" data-title="试验"></span>
			<span :class="menuClassName('menuIcons6','commonTest')" name="commonTest" @click="linkPage($event)"
				data-title="常用试验"></span>
			<span :class="menuClassName('menuIcons6s','testRules')" name="testRules" @click="linkPage($event)"
				data-title="判定规则"></span>
			<span :class="menuClassName('menuIcons_6','routineTestparameters')" name="routineTestparameters"
				@click="linkPage($event)" data-title="常用试验参数"></span>
			<span :class="menuClassName('menuIcons7','parameterDictionary')" name="parameterDictionary"
				@click="linkPage($event)" data-title="参数模板"></span>
			<span :class="menuClassName('menuIcons8','entrustDictionary')" name="entrustDictionary"
				@click="linkPage($event)" data-title="委托模板"></span>
			<span :class="menuClassName('menuIcons9','reportDictionary')" name="reportDictionary"
				@click="linkPage($event)" data-title="报告模板"></span>
			<span :class="menuClassName('menuIcons10','testRules')" name="testRules" @click="linkPage($event)"
				data-title="试验模板"></span>
			<span :class="menuClassName('menuIcons11','dataGroup')" name="dataGroup" @click="linkPage($event)"
				data-title="数据分组"></span>
			<!--
			<span class="menuIcons2 unclick" name="routineTestparameters" @click="linkPage($event)" data-title="常规试验参数"></span>
			<span class="menuIcons3 unclick" name="testformParameter" @click="linkPage($event)" data-title="试验组成参数"></span>
			<span class="menuIcons7 unclick" name="parameterDictionary" @click="linkPage($event)" data-title="参数字典"></span>
		  <span class="menuIcons8" name="parameterTemplateMapping" @click="linkPage($event)" data-title=""></span>
			<span class="menuIcons10 unclick" name="testDictionary" @click="linkPage($event)" data-title="试验字典"></span>
			<span class="menuIcons11 unclick" name="testTemplateMapping" @click="linkPage($event)" data-title="试验模板"></span>
			<span class="menuIcons12 unclick" name="testtemplateMapping" @click="linkPage($event)" data-title="试验标准"></span> -->



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

	import {
		hasPermissionEx,
		hasPermissionMenu
	} from '@/utils/permission'
	export default {
		name: 'testDevelopmentMenu',
		data() {
			return {
				show: true,
				permission: {},

			}
		},
		created() {
			this.permiison()
		},
		mounted() {},
		methods: {
			...mapActions({
				foldSideBar: 'settings/foldSideBar',
				foldOrgexist: 'settings/foldOrgexist',
				openOrgexist: 'settings/openOrgexist',
			}),
			linkPage(e) {

				this.foldSideBar()
				if (routeorg.includes("/chemicalManagement/" + e.target.getAttribute('name'))) {
					this.foldOrgexist()
				} else {
					this.openOrgexist()
				}
				//this.$router.push('/registertest')
				this.$router.push(e.target.getAttribute('name'))
			},
			async permiison() {
				let permission = await this.$store.dispatch("permission/GetALLPermissionByModel", 'test_definition');
				this.permission = permission
			},
			menuClassName(class_name, permisson_name) {
				let config = {
					workingStandard: 'workingStandard',
					standardSelect: 'standardSelect',
					parameterManagement: 'parameterManagement',
					dataDictionary: 'dataDictionary',
					testitemManage: 'testitemManage',
					commonTest: 'commonTest',
					testRules: 'testRules',
					routineTestparameters: 'routineTestparameters',
					parameterDictionary: 'parameterDictionary',
					entrustDictionary: 'entrustDictionary',
					reportDictionary: 'reportDictionary',
					dataGroup: 'dataGroup',
				}
				return hasPermissionMenu(class_name, this.permission, permisson_name)
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
	.testDevelopmentChart {
		width: 896px;
		height: 586px;
		margin: 5rem auto 0;
		position: relative;
		background: url("./../../assets/images/testDevelopmentCharts.png") no-repeat top center;
		background-size: auto;
	}

	.testDevelopmentChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.testDevelopmentChart .menuIcons1 {
		background-position: -432px 0px !important;
		left: 432px;
		top: 0px;
	}

	.testDevelopmentChart .menuIcons2 {
		background-position: -623px 0px !important;
		left: 623px;
		top: 0px;
	}

	.testDevelopmentChart .menuIcons3 {
		background-position: 0px -239px !important;
		left: 0px;
		top: 239px;
	}

	.testDevelopmentChart .menuIcons4 {
		background-position: -226px -239px !important;
		left: 226px;
		top: 239px;
	}

	.testDevelopmentChart .menuIcons5 {
		background-position: -432px -239px !important;
		left: 432px;
		top: 239px;
	}

	.testDevelopmentChart .menuIcons6 {
		background-position: -655px -177px !important;
		left: 655px;
		top: 177px;
	}

	.testDevelopmentChart .menuIcons6s {
		background-position: -656px -302px !important;
		left: 656px;
		top: 302px;
	}

	.testDevelopmentChart .menuIcons_6 {
		background-position: -814px -177px !important;
		left: 814px;
		top: 177px;
	}

	.testDevelopmentChart .menuIcons7 {
		background-position: -131px -456px !important;
		left: 131px;
		top: 456px;
	}

	.testDevelopmentChart .menuIcons8 {
		background-position: -293px -456px !important;
		left: 293px;
		top: 456px;
	}

	.testDevelopmentChart .menuIcons9 {
		background-position: -440px -456px !important;
		left: 440px;
		top: 456px;
	}

	.testDevelopmentChart .menuIcons10 {
		background-position: -594px -456px !important;
		left: 594px;
		top: 456px;
	}

	.testDevelopmentChart .menuIcons11 {
		background-position: 0px -455px !important;
		left: 0px;
		top: 455px;
	}

	//
	// .testDevelopmentChart .menuIcons9 {background-position: -659px -284px !important;left: 659px;top: 284px;}
	// .testDevelopmentChart .menuIcons10 {background-position: -490px -436px !important;left: 490px;top: 436px;}
	// .testDevelopmentChart .menuIcons11 {background-position: -691px -435px !important;left: 691px;top: 435px;}
	// .testDevelopmentChart .menuIcons12 {background-position: -605px -579px !important;left: 605px;top: 579px;}
	// .testDevelopmentChart .menuIcons13 {background-position: -943px -285px !important;left: 943px;top: 285px;}
	// .testDevelopmentChart .menuIcons14 {background-position: -943px -128px !important;left: 943px;top: 128px;}
	//按钮置灰不可点 添加class :unclick
	.testDevelopmentChart .unclick {
		background: url(./../../assets/images/testDevelopmentCharts.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
