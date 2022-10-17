<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" append-to-body>
		<div style="max-height: calc(100vh - 220px); overflow-y: auto">
			<el-form ref="form" :model="form" :rules="rules">
				<el-row>
					<el-col :span="45">
						<el-form-item label="时间" :label-width="formLabelWidth">
							<el-input id="luckysheet-input-box" v-model="form.date" placeholder="请输入"
								style="width: 100%" @focus="focus" @blur="blur">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import flatpickr from 'flatpickr'
	export default {
		name: 'flatpickrDialog',
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
		},
		components: {

		},
		data() {
			let that = this
			return {
				fp: '',
				formLabelWidth: '120px',
				rules: {},
				form: {
					date: ''
				},
				title: '',
				dialogFormVisible: false,
			}

		},

		created() {},
		methods: {
			showEdit(row, person_info) {

				this.title += '时间控件测试'
				this.dialogFormVisible = true
				//this.initFlatPicKr()
			},
			focus(event) {
				this.initFlatPicKr()
			},
			destroyFlatPicKr() {
				if (this.fp) {
					try {
						this.fp.destroy()
					} catch (e) {
						console.log(e)
					}
				}
			},
			blur(event) {
				
			},
			initFlatPicKr() {
				
				let that = this
				const fitFormat = (formatStr) => {
					let dateFormat = formatStr.replace(/y/g, 'Y');
					dateFormat = dateFormat.replace(/d/g, 'D');
					dateFormat = dateFormat.replace(/h/g, 'H');

					dateFormat = dateFormat.replace(/上午\/下午/g, 'A');
					dateFormat = dateFormat.replace(/上午/g, 'A');
					dateFormat = dateFormat.replace(/下午/g, 'A');

					dateFormat = dateFormat.replace(/AM\/PM/g, 'A');
					dateFormat = dateFormat.replace(/AM/g, 'A');
					dateFormat = dateFormat.replace(/PM/g, 'A');
					dateFormat = dateFormat.replace(/\"/g, '');

					if (dateFormat.includes('A')) {
						dateFormat = dateFormat.replace(/H/g, 'h');
					}
					return dateFormat
				}
				let type = 'YYYY-MM-DD';
				let defaultDate = this.form.date
				let dateFormat = fitFormat(type);
				let enableTime = false;
				let noCalendar = false;
				let enableSeconds = false;
				let time_24hr = true;
				let hasChineseTime = false;


				// $(".cell-date-picker").show().css({
				//     width: col - col_pre + 1,
				//     height: row - row_pre + 1,
				//     left: col_pre,
				//     top: row_pre
				// })
				console.log(new Date())
				console.log(flatpickr)
				if (/[上午下午]/.test(type)) {
					hasChineseTime = true
				}
				if (/[Hhms]/.test(dateFormat)) {
					enableTime = true;
				}
				if (!/[YMD]/.test(dateFormat)) {
					noCalendar = true;
				}
				if (/s/.test(dateFormat)) {
					enableSeconds = true;
				}
				if (/A/.test(dateFormat)) {
					time_24hr = false;
				}
				if(this.fp){
					return 1;
				}
				let index = setInterval(() => {
					console.log(that.$('#luckysheet-input-box'))
					if (that.$('#luckysheet-input-box')[0]) {
						clearInterval(index)
						console.log(that.$('#luckysheet-input-box')[0])
						that.fp = flatpickr('#luckysheet-input-box', {
							allowInput: false,
							noCalendar,
							enableSeconds,
							enableTime,
							dateFormat,
							time_24hr,
							defaultDate,
							onClose() {

							},
							parseDate: (datestr, format) => {

							},
							formatDate: (date, format, locale) => {

							},
							onChange: function(selectedDates, dateStr) {
								console.log(selectedDates, dateStr)
								that.form.date = selectedDates[0]
							}
						});
						$("#luckysheet-input-box").click();
					}

				})


			},
			close(status) {
				this.destroyFlatPicKr()
				this.dialogFormVisible = false

			},
			save() {
				let that = this


			},
		},
	}
</script>
