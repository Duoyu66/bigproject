<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="90%" @close="close" append-to-body>
		<div style="max-height: calc(85vh); overflow-y: auto;height:900px">
			<iframe src="/lucksheet.html" width="100%" height="100%"></iframe>
			 <!-- <div id="luckysheet" style="margin:0px;padding:0px;height: 760px;"></div> -->
			
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: 'dilaog',
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

				this.title = 'lucksheet测试'
				this.dialogFormVisible = true
			},
			initLuckySheet() {
				let that = this
				let lang = 'zh';
				let isShare = 0; // '?share=1' opens the collaborative editing mode
				let gridKey = ''; // workbook id for collaborative editing, or directly define here
				let options = null;
				options = {
					container: 'luckysheet',
					lang: lang,
					// pager: {
					// 	pageIndex: 1,
					// 	pageSize: 10,
					// 	total: 50,
					// 	selectOption: [10, 20]
					// },
					forceCalculation: false,
					//plugins: ['chart'],
					fontList: [{
							"fontName": "HanaleiFill",
							"url": "./assets/iconfont/HanaleiFill-Regular.ttf"
						},
						{
							"fontName": "Anton",
							"url": "./assets/iconfont/Anton-Regular.ttf"
						},
						{
							"fontName": "Pacifico",
							"url": "./assets/iconfont/Pacifico-Regular.ttf"
						}
					],
					hook: {
						cellDragStop: function(cell, postion, sheetFile, ctx, event) {
							// console.info(cell, postion, sheetFile, ctx, event);
						},
						rowTitleCellRenderBefore: function(rowNum, postion, ctx) {
							// console.log(rowNum);
						},
						rowTitleCellRenderAfter: function(rowNum, postion, ctx) {
							// console.log(ctx);
						},
						columnTitleCellRenderBefore: function(columnAbc, postion, ctx) {
							// console.log(columnAbc);
						},
						columnTitleCellRenderAfter: function(columnAbc, postion, ctx) {
							// console.log(postion);
						},
						cellRenderBefore: function(cell, postion, sheetFile, ctx) {
							// console.log(cell,postion,sheetFile,ctx);
						},
						cellRenderAfter: function(cell, postion, sheetFile, ctx) {
							// console.log(postion);
						},
						cellMousedownBefore: function(cell, postion, sheetFile, ctx) {
							// console.log(postion);
						},
						cellMousedown: function(cell, postion, sheetFile, ctx) {
							// console.log(sheetFile);
						},
						sheetMousemove: function(cell, postion, sheetFile, moveState, ctx) {
							// console.log(cell,postion,sheetFile,moveState,ctx);
						},
						sheetMouseup: function(cell, postion, sheetFile, moveState, ctx) {
							// console.log(cell,postion,sheetFile,moveState,ctx);
						},
						cellAllRenderBefore: function(data, sheetFile, ctx) {
							// console.info(data,sheetFile,ctx)
						},
						updated: function(operate) {
							// console.info(operate)
						},
						cellUpdateBefore: function(r, c, value, isRefresh) {
							// console.info('cellUpdateBefore',r,c,value,isRefresh)
						},
						cellUpdated: function(r, c, oldValue, newValue, isRefresh) {
							// console.info('cellUpdated',r,c,oldValue, newValue, isRefresh)
						},
						sheetActivate: function(index, isPivotInitial, isNewSheet) {
							// console.info(index, isPivotInitial, isNewSheet)
						},
						rangeSelect: function(index, sheet) {
							// console.info(index, sheet)
						},
						commentInsertBefore: function(r, c) {
							// console.info(r, c)
						},
						commentInsertAfter: function(r, c, cell) {
							// console.info(r, c, cell)
						},
						commentDeleteBefore: function(r, c, cell) {
							// console.info(r, c, cell)
						},
						commentDeleteAfter: function(r, c, cell) {
							// console.info(r, c, cell)
						},
						commentUpdateBefore: function(r, c, value) {
							// console.info(r, c, value)
						},
						commentUpdateAfter: function(r, c, oldCell, newCell) {
							// console.info(r, c, oldCell, newCell)
						},
						cellEditBefore: function(range) {
							// console.info(range)
						},
						workbookCreateAfter: function(json) {
							// console.info(json)
						},
						rangePasteBefore: function(range, data) {
							// console.info('rangePasteBefore',range,data)
							// return false; //Can intercept paste
						},


					},
				}
				let customformula = new Customformula(luckysheet)
				options.customOptions = {
					Customformula: customformula.GetCustomformula()
				}
			},

			close(status) {
				this.dialogFormVisible = false
			},
			save() {
				let that = this


			},
		},
	}
</script>
<style>
	.luckysheet-cols-menu {
	  z-index: 9004;
	}
	.luckysheet-input-box {z-index:3000}
</style>
