<template>
	<div class="definition purchase equipment_btn calc">
		<el-tabs type="border-card" :value="activeName" class="box_center" @tab-click="clickTab">
			<el-tab-pane label="个人信息" class="center" name="form">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<personnelFrom ref="personnelFrom" :formData.sync="form"></personnelFrom>
							</div>
						</div>
					</div>
					<div style="width: 100%; height: 60px; display: flex">
						<el-button @click="submitForm"
							style="margin: 0 auto; height: 40px; width: 200px;margin-top: 10px;" type="primary">
							确 定
						</el-button>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="修改密码" class="center" name="editPassword">
				<div
					style="display: flex;justify-content: center;box-shadow: rgb(170, 170, 170) 1px 1px 10px 1px;width: 1200px;margin: 0 auto;flex-wrap: wrap; padding-bottom: 20px; ">
					<div style="width: 100%;">
						<div style="height: 100%">
							<div class="purchasefrom">
								<personelEditPasswordForm ref="personelEditPasswordForm"></personelEditPasswordForm>
							</div>
						</div>
					</div>
					<div style="width: 100%; height: 60px; display: flex">
						<el-button @click="submitFormPassword"
							style="margin: 0 auto; height: 40px; width: 200px;margin-top: 10px;" type="primary">
							确 定
						</el-button>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>

</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import personnelFrom from '../form/personnelFrom'
	import personelEditPasswordForm from '../form/personelEditPasswordForm'

	export default {
		name: 'personalInfo',
		components: {
			personnelFrom,
			personelEditPasswordForm,
		},
		provide() {
			return {
				reload: this.reload,
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				person_name: 'user/username',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				foldSideBar: 'settings/foldSideBar',
				foldOrgexist: 'settings/foldOrgexist',
				openOrgexist: 'settings/openOrgexist',
			}),
		},
		data() {
			return {
				form: {},
				activeName: this.$route.query.tabs ? this.$route.query.tabs : 'form',
				searchData: undefined,
				primary_key: -1,
				permission: {
					person_role: false,
					// person_role: {
					// 	person_role_manage: false,
					// },
					self: false
				},
			}
		},
		watch: {

		},
		computed: {

		},
		created() {
			//this.foldOrgexist()
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
				await this.fetchData()
			},
			reload() {},
			handlExport() {

			},
			async fetchData() {
				try {
					let list = [{
						field: 'person_id',
						type: 3,
						level: 1,
					}]

					let that = this
					let index = setInterval(async function() {
						let id = that.$store.getters['user/person_id']
						console.log('person_id', id)
						if (id && id > 0) {
							clearInterval(index)
							let form = {}
							form.person_id = that.$store.getters['user/person_id']
							let {
								data
							} = await that.QueryExec_fob(308, list, form)
							console.log('personalInfo', data)
							if (data && data.length > 0) {
								that.form = data[0]
							}
						}
					})

				} catch (e) {
					console.log(e)
				}
			},
			clickTab(VueComponent, MouseEvent) {
				this.activeName = VueComponent.name
				this.$route.query.tabs = VueComponent.name
			},
			submitForm() {
				let that = this
				that.$refs["personnelFrom"].save(async function(status) {
					if (!status) {
						return false
					}
					await that.init()
				})
			},
			submitFormPassword() {
				let that = this
				that.$refs["personelEditPasswordForm"].save(async function(status) {
					if (!status) {
						return false
					}
				})
			}
		},


	}
</script>

<style>
</style>
