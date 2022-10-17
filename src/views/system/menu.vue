<template>
	<div class="test-container">

		<el-row :gutter="24">
			<el-col :span="8">
				<p><b></b>权限管理</p>
				<div class="borderBox permissionChart">
					<span class="menuIcons1 " name="permissionType" @click="linkPage($event)"></span>
					<span class="menuIcons2 " name="permissionManage" @click="linkPage($event)"></span>
					<span class="menuIcons3  " name="roleDefinition" @click="linkPage($event)"></span>
					<span class="menuIcons4 " name="rolePermissionMapping" @click="linkPage($event)"></span>
          <span class="menuIcons_4 " name="sysDataGroup" @click="linkPage($event)"></span>
					<b></b>
				</div>
			</el-col>
			<el-col :span="16">
				<p style=""><b></b>机构管理</p>
				<div class="borderBox mechanismChart">
					<span class="menuIcons5 " name="outsourcingOrganization" @click="linkPage($event)"></span>
					<span class="menuIcons6 " name="regulatoryBody" @click="linkPage($event)"></span>
					<span class="menuIcons7" name="branchInstitutions" @click="linkPage($event)"></span>
					<span class="menuIcons8 " name="expatriateProject" @click="linkPage($event)"></span>
					<span class="menuIcons9 unclick" name="" @click="linkPage($event)"></span>
					<span class="menuIcons10  unclick" name="" @click="linkPage($event)"></span>
					<span class="menuIcons11 unclick" name="" @click="linkPage($event)"></span>
				</div>
			</el-col>
		</el-row>
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
		name: 'Test',
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
				console.log(e.target.getAttribute('name'))
				this.foldSideBar()
				if (routeorg.includes("/system/" + e.target.getAttribute('name'))) {
					this.foldOrgexist()
				} else {
					this.openOrgexist()
				}
				this.$router.push(e.target.getAttribute('name'))
			},
		},
	}
</script>
<style lang="scss" scoped>
	.el-row {
		min-width: 1060px;
		overflow-x: scroll
	}
.test-container{border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	  #{$base-padding})!important;}
	.test-container p {
		color: #666;
		margin-top: 0 !important;
		padding-left: 50px;

		b {
			width: 42px;
			height: 15px;
			display: inline-block;
			background: url("./../../assets/images/h3IconBg.png") no-repeat;
			position: relative;
			top: 2px;
			margin-right: 8px;
		}
	}

	/*权限管理*/
	.permissionChart {
		background: url("./../../assets/images/permissionChart.jpg") no-repeat;
	}

	/*机构管理*/
	.mechanismChart {
		background: url("./../../assets/images/mechanismChart.png") no-repeat;
	}

	.borderBox {
		margin-top: 80px;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		height: 600px;
	}

	.borderBox span {
		width: 81px;
		height: 95px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.menuIcons1 {
		background-position: -19px -7px !important;
		top: 7px;
		left: 19px
	}

	.menuIcons2 {
		background-position: -19px -163px !important;
		left: 19px;
		top: 163px;
	}

	.menuIcons3 {
		background-position: -208px -164px !important;
		left: 208px;
		top: 164px;
	}

	.menuIcons4 {
		background-position: -113px -337px !important;
		left: 113px;
		top: 337px;
	}
.menuIcons_4{background-position:-208px -7px !important;
		top: 7px;
		left:208px}
	.menuIcons5 {
		background-position: -306px -13px !important;
		left: 306px;
		top: 13px;
	}

	.menuIcons6 {
		background-position: -4px -183px !important;
		left: 4px;
		top: 183px;
	}

	.menuIcons7 {
		background-position: -208px -189px !important;
		left: 208px;
		top: 189px;
	}

	.menuIcons8 {
		background-position: -409px -188px !important;
		left: 409px;
		top: 188px;
	}

	.menuIcons9 {
		background-position: -593px -191px !important;
		left: 593px;
		top: 191px;
	}

	.menuIcons10 {
		background-position: -211px -433px !important;
		left: 211px;
		top: 433px;
	}

	.menuIcons11 {
		background-position: -596px -435px !important;
		left: 596px;
		top: 435px;
	}

	//按钮置灰不可点 添加class :unclick
	.permissionChart .unclick {
		background: url(./../../assets/images/permissionChart.jpg)no-repeat top center;
	}

	.mechanismChart .unclick {
		background: url(./../../assets/images/mechanismChart.png)no-repeat top center;
	}

	.unclick {
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}

</style>
