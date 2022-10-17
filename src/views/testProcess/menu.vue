<template>
	<div class="test-container">
		<!--    试验流程-->
		<div class="testProcessChart pubChartBox">
			<span :class="menuClassName('menuIcons1','entrust')" name="entrustAccount" @click="linkPage($event)"
				data-title="委托申请"></span>
			<span :class="menuClassName('menuIcons2','entrustAccept')" name="entrustAccept" @click="linkPage($event)"
				data-title="受理计价">
				<b v-if="domGetAnglemark('Entrust')>0">{{domGetAnglemark('Entrust')}}</b></span>
			<span :class="menuClassName('menuIcons3','Task')" name="testTask" @click="linkPage($event)"
				data-title="试验任务">
				<b v-if="domGetAnglemark('Testing')>0">{{domGetAnglemark('Testing')}}</b>
			</span>
			<!-- <span class="menuIcons4 unclick" name=""></span> -->
			<span :class="menuClassName('menuIcons4','testDataNoAlloc')" name="testDataNoAlloc"
				@click="linkPage($event)" data-title="未分配试验任务"></span>
			<span :class="menuClassName('menuIcons5','samplelLedger')" name="samplelLedger" @click="linkPage($event)"
				data-title="样品台账"></span>
			<span :class="menuClassName('menuIcons6','testExcute')" name="testExcute" @click="linkPage($event)"
				data-title="试验"></span>
			<span :class="menuClassName('menuIcons7','sampleLeave')" name="sampleLeave" @click="linkPage($event)"
				data-title="留样"></span>
			<span :class="menuClassName('menuIcons8','sampleLeaveLeave')" name="sampleLeaveLeave"
				@click="linkPage($event)" data-title="留样处置"></span>
			<span :class="menuClassName('menuIcons9','testCheck')" name="testCheck" @click="linkPage($event)"
				data-title="试验复核">
				<b v-if="domGetAnglemark('review')>0">{{domGetAnglemark('review')}}</b>
			</span>
			<span :class="menuClassName('menuIcons10','testApprove')" name="testApprove" @click="linkPage($event)"
				data-title="报告批准">
				<b v-if="domGetAnglemark('approval')>0">{{domGetAnglemark('approval')}}</b>
			</span>
			<span :class="menuClassName('menuIcons11','testpay')" name="testpay" @click="linkPage($event)"
				data-title="试验收费"></span>
      <span :class="menuClassName('menuIcons14','reportSeal','unclick')" name="reportPrint" @click="linkPage($event)"
        data-title="报告打印"></span>
			<span :class="menuClassName('menuIcons12','reportSeal','unclick')" name="reportSeal" @click="linkPage($event)"
				data-title="报告用印"></span>
			<span :class="menuClassName('menuIcons13','reportSend','unclick')" name="reportSend" @click="linkPage($event)"
				data-title="报告寄发"></span>
		</div>
	</div>
</template>
<script>
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		routeorg
	} from '@/config'
	import {
		hasPermission,
		menuClassName
	} from '@/utils/permission'
	export default {
		name: 'testProcessMenu',
		data() {
			return {
				show: true,
				AnglemarkAbout: {
					AnglemarkData: [],
					isLoadComplete: false
				},
				permission: [],
				CannotJumpClass: "unclick"
			}
		},
		computed: {
			...mapGetters({
				person_id: 'user/person_id',
				current_org_id: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				org_pid: 'user/org_pid',
				org_id: 'user/org_id',
			}),


		},
		created() {
			this.init()
		},
		mounted() {},
		methods: {
			...mapActions({
				foldSideBar: 'settings/foldSideBar',
				foldOrgexist: 'settings/foldOrgexist',
				openOrgexist: 'settings/openOrgexist',
			}),
			async init() {
				this.$set(this.AnglemarkAbout, 'isLoadComplete', false)
				await this.GetPermissonFromStore()
				await this.Anglemark()
			},
			isCanJumpAndTips(element) {
				let flag = this.isCanJump(element)
				if (!flag) {
					this.$notify.error({
						title: '错误',
						message: '无权限打开此页面，请联系管理员'
					});
				}
				return flag
			},
			domGetAnglemark(type) {
				if (!this.AnglemarkAbout.isLoadComplete) {
					return -1
				}
				let name = ''
				switch (type) {
					case 'Entrust':
						name = 'entrustAccept'
						break
					case 'Testing':
						name = 'Task'
						break
					case 'review':
						name = 'testCheck'
						break
					case 'approval':
						name = 'testApprove'
						break
				}
				if (!this.ishasPermission(name)) {
					return -1
				}
				let data = this.AnglemarkAbout.AnglemarkData
				console.log(type)
				console.log(this.AnglemarkAbout.AnglemarkData)
				let length = data.length
				let item = undefined
				for (let i = 0; i < length; i++) {
					item = data[i]
					if (item.type == type) {
						return Number(item.count)
					}
				}

				return -1;
			},
			isCanJump(element) {
				try {

					if (!element) {
						return false
					}
					let class_name = element.getAttribute('class')
					if (!class_name) {
						return true
					}
					class_name = class_name.split(' ')
					if (class_name.length == 0) {
						return true
					}
					if (class_name.indexOf(this.CannotJumpClass) >= 0) {
						return false
					}
					return false
				} catch (e) {
					console.log(e)
					return false
				}

			},
			async linkPage(e) {
				if (!await this.$store.dispatch('permission/isCanJumpAndTips', e.target)) {
					return false
				}
				this.foldSideBar()
				if (routeorg.includes("/testProcess/" + e.target.getAttribute('name'))) {
					this.foldOrgexist()
				} else {
					this.openOrgexist()
				}
				this.$router.push(e.target.getAttribute('name'))
			},
			async GetPermissonFromStore() {
				let permissionList = ['testProcess'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				return this.permission
			},
			menuClassName(class_name, permisson_name, event) {
				let bishasPermission = this.ishasPermission(permisson_name)
				if (!class_name) {
					class_name = ''
				}
				if (bishasPermission) {
					return class_name
				}
				return class_name + " " + menuClassName()
			},
			ishasPermission(name) {
				let permission_name = ''
				switch (name) {
					case 'entrust':
						//委托申请
						permission_name = 'entrustAccount'
						break
					case 'entrustAccept':
						//受理分派
						permission_name = 'entrustAccept'
						break
					case 'Task':
						//试验任务
						permission_name = 'testTask'
						break
					case 'sampleAccept':
						//收样
						permission_name = 'sampleAccept'
						break
					case 'testCheck':
						//试验复核
						permission_name = 'testCheck'
						break
					case 'testApprove':
						//试验批准
						permission_name = 'testApprove'
						break
					case 'testExcute':
						//试验
						permission_name = 'testExcute'
						break
					case 'sampleLeave':
						//留样
						permission_name = 'sampleLeave'
						break
					case 'testpay':
						//试验收费
						permission_name = 'testpay'
						break
					case 'reportSend':
						//报告寄发
						permission_name = 'reportSend'
						break
					case 'sampleLeaveLeave':
						//留样处置记录
						permission_name = 'sampleLeaveLeave'
						break
					case 'reportSeal':
						//报告用印
						permission_name = 'reportSeal'
						break
					case 'samplelLedger':
						//样品台账
						permission_name = 'samplelLedger'
						break
					case 'testDataNoAlloc':
						//未分配的试验任务
						permission_name = 'testDataNoAlloc'
						break
					default:
						permission_name = name
						break
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name)
				if (!flag) {
					return flag
				}

				switch (name) {
					default:
						flag = flag
						break;
				}
				return flag
			},
			GetCurrentOrg() {
				console.log(this.current_and_chrilren_org)
				if (this.current_and_chrilren_org) {
					return this.current_and_chrilren_org.toString()
				}
				if (this.current_org_id > 0) {
					return this.current_org_id.toString()
				}
				return this.org_id.toString()
			},
			async Anglemark() {
				try {
					let that = this
					let select_list = [{
						field: 'person_id',
						type: 3,
						level: 1,
					}, {
						field: 'org_id',
						type: 3,
						level: 2,
					}, ]
					let form = {}
					if (that.option) {
						form = Object.assign(that.option, form)
					}
					let tempArray = that.GetCurrentOrg().split(',')
					for (let i = 0; i < tempArray.length; i++) {
						tempArray[i] = parseFloat(tempArray[i].replace(/'/g, ''))
					}
					let org_id = tempArray.join(',')
					let temp = {
						person_id: that.person_id,
						stage: that.stage,
						org_id: org_id
					}
					console.log(temp)
					form = Object.assign(temp, form)
					let {
						data
					} = await that.QueryExec_fob(471, select_list, form)
					this.AnglemarkAbout.AnglemarkData = data
					this.$set(this.AnglemarkAbout, 'isLoadComplete', true)
				} catch (e) {
					console.log(e)
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	.app-main-container {
		overflow: scroll;
	}

	.test-container app-main-height {overflow: scroll;}
	.test-container {
    border: 1px solid #dbe0e6;background:#fff;
    	  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);padding: 10px;box-sizing: border-box;border-radius:5px;
    	  min-height: calc(100vh - #{$base-nav-bar-height} - #{$base-tabs-bar-height} - #{$base-padding} -
    	#{$base-padding})!important;
  }
	.testProcessChart {
		width: 1097px;
		height: 510px;
		margin: 1rem auto 0;
		position: relative;
		margin-top: 120px;
		background: url("./../../assets/images/testProcessChart.png") no-repeat top center;
		background-size: auto;
	}

	.testProcessChart span {
		width: 81px;
		height: 93px;
		display: block;
		position: absolute;
		cursor: pointer;
	}

	.testProcessChart .menuIcons1 {
		background-position: 0 0px !important;
		left: 0;
		top: 0px;
	}

	.testProcessChart .menuIcons2 {
		background-position: -168px 0px !important;
		left: 168px;
		top: 0px;
	}

	.testProcessChart .menuIcons3 {
		background-position: -331px 0px !important;
		left: 331px;
		top: 0px;
	}

	// .testProcessChart .menuIcons4{background-position:-431px -0px !important;left:431px;top:0;}
	.testProcessChart .menuIcons4 {
		background-position: -331px -155px !important;
		left: 331px;
		top: 155px;
	}

	.testProcessChart .menuIcons5 {
		background-position: -331px -311px !important;
		left: 331px;
		top: 311px;
	}

	.testProcessChart .menuIcons6 {
		background-position: -503px 0px !important;
		left: 503px;
		top: 0px;
	}

	.testProcessChart .menuIcons7 {
		background-position: -503px -155px !important;
		left: 503px;
		top: 155px;
	}

	.testProcessChart .menuIcons8 {
		background-position: -503px -311px !important;
		left: 503px;
		top: 311px;
	}

	.testProcessChart .menuIcons9 {
		background-position: -679px 0px !important;
		left: 679px;
		top: 0px;
	}

	.testProcessChart .menuIcons10 {
		background-position: -849px 0px !important;
		left: 849px;
		top: 0px;
	}

	.testProcessChart .menuIcons11 {
		background-position: -1016px 0px !important;
		left: 1016px;
		top: 0px;
	}
	.testProcessChart .menuIcons14 {
		background-position: -1016px -139px !important;
		left: 1016px;
		top: 139px;
	}
	.testProcessChart .menuIcons12 {
		background-position: -1016px -278px !important;
		left: 1016px;
		top: 278px;
	}

	.testProcessChart .menuIcons13 {
		background-position: -1016px -417px !important;
		left: 1016px;
		top: 417px;
	}


	//按钮置灰不可点 添加class :unclick
	.testProcessChart .unclick {
		background: url(./../../assets/images/testProcessChart.png) no-repeat top center;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
	}
</style>
