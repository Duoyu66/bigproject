<template>
	<el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
		<el-tab-pane label="人员登记" name="first">
			<div style="margin:5px 5px 5px 2px;height:500px;width:100%;box-shadow:-webkit-box-shadow: #666 0px 0px 5px; 
   -moz-box-shadow: #666 0px 0px 5px; 
   box-shadow: #666 0px 0px 5px;">
				<div style="width:100%;height:440px;">
					<div style="height:100%;">
						<div style="width:1200px;height:100%;">
							<el-row class="ledgers" style="margin-top:10px;">
								<el-form :model="form1">
									<el-col :span="8">
										<el-form-item label="证书名称" :label-width="formLabelWidth">
											<el-input v-model="form1.number" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="最高学历" :label-width="formLabelWidth">
											<el-select v-model="form1.region" style="width: 250px;">
												<el-option label="专科" value="a"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="毕业时间" :label-width="formLabelWidth">
											<el-input v-model="form1.number1" style="width: 250px"></el-input>
										</el-form-item>
										<el-form-item label="婚姻状况" :label-width="formLabelWidth">
											<el-radio-group v-model="form1.resource">
												<el-radio label="已婚"></el-radio>
												<el-radio label="未婚"></el-radio>
											</el-radio-group>
										</el-form-item>
										<el-form-item label="入职时间" :label-width="formLabelWidth">
											<el-input v-model="form1.number3" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="合同编号" :label-width="formLabelWidth">
											<el-input v-model="form1.number4" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="登录账户" :label-width="formLabelWidth">
											<el-input v-model="form1.number5" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="电话" :label-width="formLabelWidth">
											<el-input v-model="form1.number6" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="微信号" :label-width="formLabelWidth">
											<el-input v-model="form1.number7" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="密码提示答案" :label-width="formLabelWidth">
											<el-input v-model="form1.number8" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="职称扫描件" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
										<el-form-item label="合同扫描件" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="性别" :label-width="formLabelWidth">
											<el-radio-group v-model="form1.resource1">
												<el-radio label="男"></el-radio>
												<el-radio label="女"></el-radio>
											</el-radio-group>
										</el-form-item>
										<el-form-item label="最后专业" :label-width="formLabelWidth">
											<el-input v-model="form1.a" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="政治面貌" :label-width="formLabelWidth">
											<el-select v-model="form1.a1" style="width: 250px;">
												<el-option value="qz" label="群众"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="籍贯" :label-width="formLabelWidth">
											<el-input v-model="form1.a2" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="参加工作时间" :label-width="formLabelWidth">
											<el-input v-model="form1.a3" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="试验领域时间" :label-width="formLabelWidth">
											<el-input v-model="form1.a4" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="昵称" :label-width="formLabelWidth">
											<el-input v-model="form1.a5" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="电子邮件" :label-width="formLabelWidth">
											<el-input v-model="form1.a6" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="工作性质" :label-width="formLabelWidth">
											<el-select v-model="form1.a7" style="width: 250px;">
												<el-option value="person" label="全职"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="备注" :label-width="formLabelWidth">
											<el-input v-model="form1.a8" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="身份证扫描件" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
										<el-form-item label="任命授权书" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="出生年月" :label-width="formLabelWidth">
											<el-input v-model="form1.b" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="毕业学校" :label-width="formLabelWidth">
											<el-input v-model="form1.b1" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="职称" :label-width="formLabelWidth">
											<el-input v-model="form1.b2" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="身份证号" :label-width="formLabelWidth">
											<el-input v-model="form1.b3" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="证书名称" :label-width="formLabelWidth">
											<el-select v-model="form1.b4" style="width: 250px;">
												<el-option value="people" label="高级工程师"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="工号" :label-width="formLabelWidth">
											<el-input v-model="form1.b5" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="手机" :label-width="formLabelWidth">
											<el-input v-model="form1.b6" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="QQ号" :label-width="formLabelWidth">
											<el-input v-model="form1.b7" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="密码提示问题" :label-width="formLabelWidth">
											<el-input v-model="form1.b8" style="width: 250px;"></el-input>
										</el-form-item>
										<el-form-item label="头像" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
										<el-form-item label="近照" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
										<el-form-item label="承诺书" :label-width="formLabelWidth">
											<el-button type="primary">选择文件</el-button>
											<el-button type="primary">开始上传</el-button>
										</el-form-item>
									</el-col>
								</el-form>
							</el-row>
						</div>
					</div>
				</div>
				<div style="width:100%;height:60px;display:flex">
					<el-button style="margin:0 auto;height:40px;width:200px;margin-top:10px" type="primary">确 定
					</el-button>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="人员台账" name="second">
			<div class="table-container definition purchase distribution ledger">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
					<el-form-item style="margin-left:22px">
						<el-input style="border-radius: 30px;" v-model="queryForm.title" placeholder="按人员名称搜索">
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input style="border-radius: 30px;" v-model="queryForm.title1" placeholder="按职称搜索">
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
				<el-container style="height: calc(100vh - 46px - 174px);">
					<el-main style="height: calc(65%); min-height: 275px;" class="box1">
						<el-table ref="tableSort" v-loading="listLoading" :data="list" border
							:element-loading-text="elementLoadingText" highlight-current-row
							@selection-change="setSelectRows" @sort-change="tableSortChange" height="calc(80%)"
							:header-cell-style="{background:'#e8f0ff' }">
							<el-table-column show-overflow-tooltip prop="name" label="姓名"></el-table-column>
							<el-table-column show-overflow-tooltip label="性别" prop="sex"></el-table-column>
							<el-table-column show-overflow-tooltip prop="date" label="出生年月"></el-table-column>
							<el-table-column show-overflow-tooltip prop="title1" label="最后专业"></el-table-column>
							<el-table-column show-overflow-tooltip label="最后毕业学校" prop="professional"></el-table-column>
							<el-table-column show-overflow-tooltip label="最后毕业时间" prop="date2"></el-table-column>
							<el-table-column show-overflow-tooltip prop="post" label="职称"></el-table-column>
							<el-table-column show-overflow-tooltip label="入职时间" prop="date3"></el-table-column>
							<el-table-column show-overflow-tooltip label="手机" prop="number"></el-table-column>
							<el-table-column show-overflow-tooltip label="操作" width="100px">
								<template #default="{ row }">
									<el-dropdown trigger="click" placement="left-start">
										<!-- <span class="el-dropdown-link">
                      下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>-->
										<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary">
										</el-button>
										<el-dropdown-menu slot="dropdown" class="more" style="min-width: 115px;">
											<el-button @click="handleAdd">修改人员</el-button>
											<el-button @click="handleDelete(row)">删除人员</el-button>
											<el-button>人员详情</el-button>
											<el-button @click="dialogFormVisible1 = true">添加教育经历</el-button>
											<el-button @click="dialogFormVisible2 = true">添加工作经历</el-button>
											<el-button @click="dialogFormVisible3 = true">添加培训经历</el-button>
											<el-button @click="dialogFormVisible4 = true">添加主持项目</el-button>
											<el-button @click="dialogFormVisible5 = true">添加调拨记录</el-button>
											<el-button @click="dialogFormVisible6 = true">添加分工记录</el-button>
											<el-button @click="dialogFormVisible7 = true">添加发表论文</el-button>
											<el-button @click="dialogFormVisible8 = true">添加科技成果</el-button>
											<el-button @click="dialogFormVisible9 = true">添加相关证书</el-button>
											<el-button @click="dialogFormVisible10 = true">添加授权记录</el-button>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
							:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
							@size-change="handleSizeChange"></el-pagination>
						<table-edit ref="edit"></table-edit>
					</el-main>
					<!-- add1 -->

					<el-footer style="height: calc(34%); min-height: 188px;" class="table_auto">
						<el-tabs type="border-card" style="height: calc(100%);">
							<el-tab-pane label="教育经历">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="学校" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="学历"></el-table-column>
									<el-table-column show-overflow-tooltip label="专业" prop="professional">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="开始日期" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="结束日期"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify1(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify1(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="工作经历">
								<el-table ref="tableSort" v-loading="listLoading" :data="list2" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="工作单位" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="工作内容"></el-table-column>
									<el-table-column show-overflow-tooltip label="职位" prop="professional">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="职称" prop="position"></el-table-column>
									<el-table-column show-overflow-tooltip label="开始日期" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="结束日期"></el-table-column>
									<el-table-column show-overflow-tooltip label="证明人" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="证明人电话" prop="phone"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify2(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify2(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="培训经历">
								<el-table ref="tableSort" v-loading="listLoading" :data="list3" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip prop="study" label="培训内容"></el-table-column>
									<el-table-column show-overflow-tooltip label="培训时间" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip label="结业证书名称" prop="professional">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="证书编号" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="结业结果" prop="result"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify3(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify3(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="主持项目">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="设计时间" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="项目名称"></el-table-column>
									<el-table-column show-overflow-tooltip label="规模" prop="professional">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="是否主持人" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="证明人"></el-table-column>
									<el-table-column show-overflow-tooltip label="证明人电话" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify4(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify4(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="调拨记录">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="调出机构" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="调入机构"></el-table-column>
									<el-table-column show-overflow-tooltip label="调入时间" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="审批人"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作人" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作时间" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify5(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify5(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="分工记录">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="试验名称" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="参数名称"></el-table-column>
									<el-table-column show-overflow-tooltip label="生效时间" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify6(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify6(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="发表论文">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="论文名称" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="发表期刊名称">
									</el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="发表期刊年、期号">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="发表日期" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="是否第一作者">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="获奖情况" prop="credentials">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify7(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify7(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="科技成果">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="成果名称" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="完成日期"></el-table-column>
									<el-table-column show-overflow-tooltip label="奖励单位" prop="professional">
									</el-table-column>
									<el-table-column show-overflow-tooltip label="等级" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip prop="date2" label="参与情况"></el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify8(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify8(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="相关证书">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="证书名称" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip prop="study" label="证书编号"></el-table-column>
									<el-table-column show-overflow-tooltip label="有效日期" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip label="扫描件" prop="date1">
										<div class="demo-image__preview">
											<el-image style="width: 50px; height: 50px" :src="url1"
												:preview-src-list="srcList1"></el-image>
										</div>
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify9(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify9(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="授权记录">
								<el-table ref="tableSort" v-loading="listLoading" :data="list1" border
									:element-loading-text="elementLoadingText" highlight-current-row
									style="height: calc(18vh);" @selection-change="setSelectRows"
									@sort-change="tableSortChange" :header-cell-style="{background:'#e8f0ff' }">
									<el-table-column show-overflow-tooltip label="授权名称" prop="school"></el-table-column>
									<el-table-column show-overflow-tooltip label="授权日期" prop="date1"></el-table-column>
									<el-table-column show-overflow-tooltip label="扫描件" prop="credentials">
										<div class="demo-image__preview">
											<el-image style="width: 50px; height: 50px" :src="url2"
												:preview-src-list="srcList2"></el-image>
										</div>
									</el-table-column>
									<el-table-column show-overflow-tooltip label="操作" width="150px">
										<template #default="{ row }">
											<el-button @click="handleamendmodify10(row)" class="normal">修改</el-button>
											<el-button @click="handleDeletemodify10(row)" class="danger">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
						</el-tabs>
						<!-- add1 -->
						<el-dialog width="33.3%" title="添加教育经历" :visible.sync="dialogFormVisible1">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="毕业学校" :label-width="formLabelWidth">
									<el-input v-model="input1" placeholder="请输入学校名称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="学历层次" :label-width="formLabelWidth" style="margin-top:10px">
									<el-select v-model="form.number" style="width: 250px;">
										<el-option label="中学" value="single"></el-option>
										<el-option label="高中" value="single"></el-option>
										<el-option label="本科" value="single"></el-option>
										<el-option label="硕士" value="single"></el-option>
										<el-option label="博士" value="single"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="专业" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input2" placeholder="请输入专业" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="开始日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="毕业日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
								<el-button @click="dialogFormVisible1 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add2 -->
						<el-dialog width="33.3%" title="添加工作经历" :visible.sync="dialogFormVisible2">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="工作单位" :label-width="formLabelWidth">
									<el-input v-model="input3" placeholder="请输入单位名称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="工作内容" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input4" placeholder="请输入工作内容" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="职位" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input5" placeholder="请输入职位" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="职称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input6" placeholder="请输入职称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="开始日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="结束日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="证明人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input7" placeholder="请输入证明人姓名" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="电话" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input8" placeholder="请输入" style="width:250px;"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
								<el-button @click="dialogFormVisible2 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add3 -->
						<el-dialog width="33.3%" title="添加培训经历" :visible.sync="dialogFormVisible3">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="培训内容" :label-width="formLabelWidth">
									<el-input type="textarea" :rows="3" placeholder="请输入内容" style="width:250px"
										v-model="add3textarea1"></el-input>
								</el-form-item>
								<el-form-item label="培训日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="结业证书名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input9" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input10" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="结业结果" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input type="textarea" :rows="3" placeholder="请输入内容" style="width:250px"
										v-model="add3textarea2"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
								<el-button @click="dialogFormVisible3 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add4 -->
						<el-dialog width="33.3%" title="添加主持项目" :visible.sync="dialogFormVisible4">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="设计日期" :label-width="formLabelWidth">
									<el-date-picker style="width:250px" v-model="add4value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="项目名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input11" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="规模" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input12" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="是否主持人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">是</el-radio>
									<el-radio v-model="radio" label="2">否</el-radio>
								</el-form-item>
								<el-form-item label="证明人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input13" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证明人电话" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input14" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible4 = false">确 定</el-button>
								<el-button @click="dialogFormVisible4 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add5 -->
						<el-dialog width="33.3%" title="添加调拨记录" :visible.sync="dialogFormVisible5">
							<el-form :model="form" style="margin-right:15px">
								<el-form-item label="调出机构" :label-width="formLabelWidth">
									<el-input v-model="input15" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="调入机构" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input16" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="调入日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add4value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="审批人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input17" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="操作人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input18" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="操作日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add4value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible5 = false">确 定</el-button>
								<el-button @click="dialogFormVisible5 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add6 -->
						<el-dialog width="33.3%" title="添加分工记录" :visible.sync="dialogFormVisible6">
							<el-form :model="form" style="margin-right:15px">
								<el-form-item label="试验名称" :label-width="formLabelWidth">
									<el-cascader v-model="value" :options="options2" :props="{ expandTrigger: 'hover' }"
										@change="handleChange" style="width: 250px;"></el-cascader>
								</el-form-item>
								<el-form-item label="参数名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-select v-model="form2.number" style="width: 250px;">
										<el-option label="含水率" value="single"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="生效日期" :label-width="formLabelWidth" style="margin-top:10px;">
									<el-date-picker v-model="add6value1" type="date" placeholder="选择日期"
										style="width:250px"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible6 = false">确 定</el-button>
								<el-button @click="dialogFormVisible6 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add7 -->
						<el-dialog width="33.3%" title="添加发表论文" :visible.sync="dialogFormVisible7">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="论文名称" :label-width="formLabelWidth">
									<el-input v-model="input19" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="发表期刊名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input20" placeholder="请输入" style="width:250px"></el-input>
									<br />
									<el-input v-model="input21" placeholder="请输入" style="width:90px;margin-top:10px">
									</el-input>
									<span style="margin-left:10px;margin-top:10px">年</span>
									<el-input v-model="input22" placeholder="请输入"
										style="width:90px;margin-left:20px;margin-top:10px"></el-input>
									<span style="margin-left:10px;margin-top:10px">期</span>
								</el-form-item>
								<el-form-item label="发表日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>

								<el-form-item label="是否第一作者" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">是</el-radio>
									<el-radio v-model="radio" label="2">否</el-radio>
								</el-form-item>
								<el-form-item label="获奖情况" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="add7textarea1">
									</el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible7 = false">确 定</el-button>
								<el-button @click="dialogFormVisible7 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add8 -->
						<el-dialog width="33.3%" title="添加科技成果" :visible.sync="dialogFormVisible8">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="成果名称" :label-width="formLabelWidth">
									<el-input v-model="input23" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="完成日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add8value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="奖励单位" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input24" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="等级" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input25" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="参与情况" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">主持</el-radio>
									<el-radio v-model="radio" label="2">参与</el-radio>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible8 = false">确 定</el-button>
								<el-button @click="dialogFormVisible8 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add9 -->
						<el-dialog width="33.3%" title="添加相关证书" :visible.sync="dialogFormVisible9">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="证书名称" :label-width="formLabelWidth">
									<el-input v-model="input26" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input27" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="有效日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add9value1" type="daterange" range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期" style="width:250px">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="扫描件" :label-width="formLabelWidth" style="margin-top:10px">
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
										:on-preview="handlePreview" :on-remove="handleRemove"
										:before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
										:file-list="fileList">
										<el-button size="small" type="primary">点击上传</el-button>
										<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible9 = false">确 定</el-button>
								<el-button @click="dialogFormVisible9 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add10 -->
						<el-dialog width="33.3%" title="添加授权记录" :visible.sync="dialogFormVisible10">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="授权名称" :label-width="formLabelWidth">
									<el-input v-model="input28" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add10value1" style="width:250px" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="有效日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add10value2" type="daterange" range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期" style="width:250px">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="扫描件" :label-width="formLabelWidth" style="margin-top:10px">
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
										:on-preview="handlePreview" :on-remove="handleRemove"
										:before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
										:file-list="fileList">
										<el-button size="small" type="primary">点击上传</el-button>
										<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisible10 = false">确 定</el-button>
								<el-button @click="dialogFormVisible10 = false">取 消</el-button>
							</div>
						</el-dialog>

						<!-- -修改modify- -->
						<el-dialog width="33.3%" title="修改教育经历" :visible.sync="dialogFormVisiblemodify1">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="毕业学校" :label-width="formLabelWidth">
									<el-input v-model="input1" placeholder="请输入学校名称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="学历层次" :label-width="formLabelWidth" style="margin-top:10px">
									<el-select v-model="form.number" style="width: 250px;">
										<el-option label="中学" value="single"></el-option>
										<el-option label="高中" value="single"></el-option>
										<el-option label="本科" value="single"></el-option>
										<el-option label="硕士" value="single"></el-option>
										<el-option label="博士" value="single"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="专业" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input2" placeholder="请输入专业" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="开始日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="毕业日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify1 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify1 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add2 -->
						<el-dialog width="33.3%" title="修改工作经历" :visible.sync="dialogFormVisiblemodify2">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="工作单位" :label-width="formLabelWidth">
									<el-input v-model="input3" placeholder="请输入单位名称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="工作内容" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input4" placeholder="请输入工作内容" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="职位" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input5" placeholder="请输入职位" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="职称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input6" placeholder="请输入职称" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="开始日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="结束日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="证明人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input7" placeholder="请输入证明人姓名" style="width:250px;"></el-input>
								</el-form-item>
								<el-form-item label="电话" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input8" placeholder="请输入" style="width:250px;"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify2 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify2 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add3 -->
						<el-dialog width="33.3%" title="修改培训经历" :visible.sync="dialogFormVisiblemodify3">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="培训内容" :label-width="formLabelWidth">
									<el-input type="textarea" :rows="3" placeholder="请输入内容" style="width:250px"
										v-model="add3textarea1"></el-input>
								</el-form-item>
								<el-form-item label="培训日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="结业证书名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input9" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input10" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="结业结果" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input type="textarea" :rows="3" placeholder="请输入内容" style="width:250px"
										v-model="add3textarea2"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify3 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify3 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add4 -->
						<el-dialog width="33.3%" title="修改主持项目" :visible.sync="dialogFormVisiblemodify4">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="设计日期" :label-width="formLabelWidth">
									<el-date-picker style="width:250px" v-model="add4value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="项目名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input11" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="规模" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input12" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="是否主持人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">是</el-radio>
									<el-radio v-model="radio" label="2">否</el-radio>
								</el-form-item>
								<el-form-item label="证明人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input13" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证明人电话" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input14" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify4 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify4 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add5 -->
						<el-dialog width="33.3%" title="修改调拨记录" :visible.sync="dialogFormVisiblemodify5">
							<el-form :model="form" style="margin-right:15px">
								<el-form-item label="调出机构" :label-width="formLabelWidth">
									<el-input v-model="input15" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="调入机构" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input16" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="调入日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add4value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="审批人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input17" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="操作人" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input18" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="操作日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add4value2" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify5 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify5 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add6 -->
						<el-dialog width="33.3%" title="修改分工记录" :visible.sync="dialogFormVisiblemodify6">
							<el-form :model="form" style="margin-right:15px">
								<el-form-item label="试验名称" :label-width="formLabelWidth">
									<el-cascader v-model="value" :options="options2" :props="{ expandTrigger: 'hover' }"
										@change="handleChange" style="width: 250px;"></el-cascader>
								</el-form-item>
								<el-form-item label="参数名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-select v-model="form2.number" style="width: 250px;">
										<el-option label="含水率" value="single"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="生效日期" :label-width="formLabelWidth" style="margin-top:10px;">
									<el-date-picker v-model="add6value1" type="date" placeholder="选择日期"
										style="width:250px"></el-date-picker>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify6 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify6 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add7 -->
						<el-dialog width="33.3%" title="修改发表论文" :visible.sync="dialogFormVisiblemodify7">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="论文名称" :label-width="formLabelWidth">
									<el-input v-model="input19" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="发表期刊名称" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input20" placeholder="请输入" style="width:250px"></el-input>
									<br />
									<el-input v-model="input21" placeholder="请输入" style="width:90px;margin-top:10px">
									</el-input>
									<span style="margin-left:10px;margin-top:10px">年</span>
									<el-input v-model="input22" placeholder="请输入"
										style="width:90px;margin-left:20px;margin-top:10px"></el-input>
									<span style="margin-left:10px;margin-top:10px">期</span>
								</el-form-item>
								<el-form-item label="发表日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add1value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>

								<el-form-item label="是否第一作者" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">是</el-radio>
									<el-radio v-model="radio" label="2">否</el-radio>
								</el-form-item>
								<el-form-item label="获奖情况" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="add7textarea1">
									</el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify7 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify7 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add8 -->
						<el-dialog width="33.3%" title="修改科技成果" :visible.sync="dialogFormVisiblemodify8">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="成果名称" :label-width="formLabelWidth">
									<el-input v-model="input23" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="完成日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker style="width:250px" v-model="add8value1" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="奖励单位" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input24" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="等级" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input25" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="参与情况" :label-width="formLabelWidth" style="margin-top:10px">
									<el-radio v-model="radio" label="1">主持</el-radio>
									<el-radio v-model="radio" label="2">参与</el-radio>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify8 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify8 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add9 -->
						<el-dialog width="33.3%" title="修改相关证书" :visible.sync="dialogFormVisiblemodify9">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="证书名称" :label-width="formLabelWidth">
									<el-input v-model="input26" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-input v-model="input27" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="有效日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add9value1" type="daterange" range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期" style="width:250px">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="扫描件" :label-width="formLabelWidth" style="margin-top:10px">
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
										:on-preview="handlePreview" :on-remove="handleRemove"
										:before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
										:file-list="fileList">
										<el-button size="small" type="primary">点击上传</el-button>
										<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify9 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify9 = false">取 消</el-button>
							</div>
						</el-dialog>
						<!-- add10 -->
						<el-dialog width="33.3%" title="修改授权记录" :visible.sync="dialogFormVisiblemodify10">
							<el-form :model="form" style="margin-right:15px;">
								<el-form-item label="授权名称" :label-width="formLabelWidth">
									<el-input v-model="input28" placeholder="请输入" style="width:250px"></el-input>
								</el-form-item>
								<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add10value1" style="width:250px" type="date"
										placeholder="选择日期"></el-date-picker>
								</el-form-item>
								<el-form-item label="有效日期" :label-width="formLabelWidth" style="margin-top:10px">
									<el-date-picker v-model="add10value2" type="daterange" range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期" style="width:250px">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="扫描件" :label-width="formLabelWidth" style="margin-top:10px">
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
										:on-preview="handlePreview" :on-remove="handleRemove"
										:before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
										:file-list="fileList">
										<el-button size="small" type="primary">点击上传</el-button>
										<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer" style="margin-left:10px">
								<el-button type="primary" @click="dialogFormVisiblemodify10 = false">确 定</el-button>
								<el-button @click="dialogFormVisiblemodify10 = false">取 消</el-button>
							</div>
						</el-dialog>
					</el-footer>
				</el-container>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import {
		getList,
		doDelete,
		doEdit
	} from '@/api/table'
	import TableEdit from '../components/personnelDialog.vue'
	import treeData from './../../vab/tree/index'
	export default {
		name: 'ComprehensiveTable',
		components: {
			TableEdit,
			treeData,
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				activeName: 'first',
				imgShow: true,
				list: [],
				imageList: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				queryForm1: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				tabPosition: 'left',
				dialogFormVisible: false,
				dialogFormVisible1: false,
				dialogFormVisible2: false,
				dialogFormVisible3: false,
				dialogFormVisible4: false,
				dialogFormVisible5: false,
				dialogFormVisible6: false,
				form2: {
					name: 'xst',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '含水率',
					norms: 'rygz',
				},
				options2: [{
					value: 'material',
					label: '原材料',
					children: [{
						value: 'cement',
						label: '水泥试验'
					}, {
						value: 'coarse',
						label: '粗骨料试验'
					}]
				}],
				dialogFormVisible7: false,
				dialogFormVisible8: false,
				dialogFormVisible9: false,
				dialogFormVisible10: false,
				add1value1: '',
				add1value2: '',
				add2value1: '',
				add2value2: '',
				add3value1: '',
				add3textarea1: '',
				add3textarea2: '',
				add4value1: '',
				add4value2: '',
				add5value1: '',
				add5value2: '',
				add6value1: '',
				add7value1: '',
				add8value1: '',
				add9value1: '',
				add10value1: '',
				add10value2: '',
				input1: '',
				input2: '',
				input3: '',
				input4: '',
				input5: '',
				input6: '',
				input7: '',
				input8: '',
				input9: '',
				input10: '',
				input11: '',
				input12: '',
				input13: '',
				input14: '',
				input15: '',
				input16: '',
				input17: '',
				input18: '',
				input19: '',
				input20: '',
				input21: '',
				input22: '',
				input23: '',
				input24: '',
				input25: '',
				input26: '',
				input27: '',
				input28: '',
				add7textarea1: '',
				url1: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
				srcList1: [
					'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
				],
				url2: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
				srcList2: [
					'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
				],
				dialogFormVisiblemodify1: false,
				dialogFormVisiblemodify2: false,
				dialogFormVisiblemodify3: false,
				dialogFormVisiblemodify4: false,
				dialogFormVisiblemodify5: false,
				dialogFormVisiblemodify6: false,
				dialogFormVisiblemodify7: false,
				dialogFormVisiblemodify8: false,
				dialogFormVisiblemodify9: false,
				dialogFormVisiblemodify10: false,
				radio: '1',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				form1: {
					name: '',
					region: 'a',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '已婚',
					resource1: '男',
					desc: '',
					number: '',
					a1: 'qz',
					a7: 'person',
					b4: 'people'
				},
				formLabelWidth: '120px',
				table: {
					tableHeight: this.$(window).height(),
					tableHeight1: this.$(window).height()
				}
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
		},
		created() {
			this.fetchData()
		},
		beforeDestroy() {},
		mounted: function() {
			this.$nextTick(function() {
				let exceptHeight = 210;
				let exceptHeight1 = 200;
				// this.$refs.table.$el.offsetTop：表格距离浏览器的高度
				//tableSort为table中ref的值
				if (this.$refs.tableSort.$el) {
					this.table.tableHeight = window.innerHeight - this.$refs.tableSort.$el.offsetTop -
						exceptHeight;
					this.table.tableHeight1 = window.innerHeight - this.$refs.tableSort.$el.offsetTop -
						exceptHeight1;
				}

				// 监听窗口大小变化
				let that = this;
				window.onresize = function() {
					if (that.$refs.tableSort.$el) {
						that.table.tableHeight = window.innerHeight - that.$refs.tableSort.$el.offsetTop -
							exceptHeight;
						that.table.tableHeight1 = window.innerHeight - that.$refs.tableSort.$el.offsetTop -
							exceptHeight1;
					}
				}
			});
		},
		methods: {
			tableSortChange() {
				const imageList = []
				this.$refs.tableSort.tableData.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
			},
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				this.$refs['edit'].showEdit()
			},
			handleamend1(row) {
				this.form = row;
				this.dialogFormVisible1 = true;
			},
			handleamend2(row) {
				this.form = row;
				this.dialogFormVisible2 = true;
			},
			handleamend3(row) {
				this.form = row;
				this.dialogFormVisible3 = true;
			},
			handleamend4(row) {
				this.form = row;
				this.dialogFormVisible4 = true;
			},
			handleamend5(row) {
				this.form = row;
				this.dialogFormVisible5 = true;
			},
			handleamend6(row) {
				this.form = row;
				this.dialogFormVisible6 = true;
			},
			handleamend7(row) {
				this.form = row;
				this.dialogFormVisible7 = true;
			},
			handleamend8(row) {
				this.form = row;
				this.dialogFormVisible8 = true;
			},
			handleamend9(row) {
				this.form = row;
				this.dialogFormVisible9 = true;
			},
			handleamend10(row) {
				this.form = row;
				this.dialogFormVisible10 = true;
			},
			handleamendmodify1(row) {
				this.form = row;
				this.dialogFormVisiblemodify1 = true;
			},
			handleamendmodify2(row) {
				this.form = row;
				this.dialogFormVisiblemodify2 = true;
			},
			handleamendmodify3(row) {
				this.form = row;
				this.dialogFormVisiblemodify3 = true;
			},
			handleamendmodify4(row) {
				this.form = row;
				this.dialogFormVisiblemodify4 = true;
			},
			handleamendmodify5(row) {
				this.form = row;
				this.dialogFormVisiblemodify5 = true;
			},
			handleamendmodify6(row) {
				this.form = row;
				this.dialogFormVisiblemodify6 = true;
			},
			handleamendmodify7(row) {
				this.form = row;
				this.dialogFormVisiblemodify7 = true;
			},
			handleamendmodify8(row) {
				this.form = row;
				this.dialogFormVisiblemodify8 = true;
			},
			handleamendmodify9(row) {
				this.form = row;
				this.dialogFormVisiblemodify9 = true;
			},
			handleamendmodify10(row) {
				this.form = row;
				this.dialogFormVisiblemodify10 = true;
			},
			handleDelete(row) {
				if (row.id) {
					this.$baseConfirm('你确定要删除事故时间为()的记录吗', null, async () => {
						const {
							msg
						} = await doDelete({
							ids: row.id
						})
						this.$baseMessage(msg, 'success')
						this.fetchData()
					})
				}
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.fetchData()
			},
			handleQuery() {
				this.queryForm.pageNo = 1
				this.fetchData()
			},
			async fetchData() {
				this.listLoading = true
				const {
					data,
					totalCount
				} = await getList(this.queryForm)
				this.list = [{
						"name": "贺君天",
						"sex": "男",
						"date": "1998-05-06",
						"title1": "软件工程",
						"professional": "张北职业技术学院",
						"date2": "2020-10-10",
						"post": "实施工程师",
						"date3": "2020-11-11",
						"number": "17855555555"
					},
					{
						"name": "胡雨佳",
						"sex": "男",
						"date": "1998-08-12",
						"title1": "市场销售",
						"professional": "邢台学院",
						"date2": "2020-10-10",
						"post": "售前服务",
						"date3": "2020-10-06",
						"number": "17866665555"
					},
					{
						"name": "李星云",
						"sex": "男",
						"date": "1999-10-12",
						"title1": "软件工程",
						"professional": "清华大学",
						"date2": "2020-10-10",
						"post": "采购师",
						"date3": "2020-05-19",
						"number": "13688885555"
					},
					{
						"name": "李薇",
						"sex": "女",
						"date": "2000-01-15",
						"title1": "软件工程",
						"professional": "北京大学",
						"date2": "2020-10-10",
						"post": "化学品管理",
						"date3": "2020-12-21",
						"number": "17855566666"
					}
				]
				this.list1 = [{
						"school": "北京大学",
						"study": "大学本科",
						"professional": "医学",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "无"
					},
					{
						"school": "清华大学",
						"study": "大学本科",
						"professional": "软件工程",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "英语六级"
					},
					{
						"school": "北京交通大学",
						"study": "大学本科",
						"professional": "轨道运输",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "英语四级"
					},
					{
						"school": "河北农业大学",
						"study": "大学本科",
						"professional": "农学",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "无"
					}
				]
				this.list2 = [{
						"school": "测试项目a",
						"study": "中型项目",
						"professional": "项目小组组长",
						"position": "工程师",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "李银河",
						"phone": "18165165"
					},
					{
						"school": "测试项目e",
						"study": "大型项目",
						"professional": "组员",
						"position": "高级工程师",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "张兴",
						"phone": "18165165"
					},
					{
						"school": "测试项目d",
						"study": "中型项目",
						"professional": "前端工程师",
						"position": "工程师",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "王弼",
						"phone": "18165165"
					},
					{
						"school": "测试项目b",
						"study": "小型项目",
						"professional": "java工程师",
						"position": "高级工程师",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "李银河",
						"phone": "18165165"
					}
				]
				this.list3 = [{
						"school": "8个月",
						"study": "python全栈开发",
						"professional": "XX培训基地",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "考核优秀"
					},
					{
						"school": "一年",
						"study": "java全栈开发",
						"professional": "a培训基地",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "考核优秀"
					},
					{
						"school": "四个月",
						"study": "web前端开发",
						"professional": "d培训基地",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "考核优秀"
					},
					{
						"school": "五个月",
						"study": "UI设计",
						"professional": "c培训基地",
						"date1": "2016-9-1",
						"date2": "2019-7-1",
						"credentials": "考核合格"
					}
				]
				const imageList = []
				data.forEach((item, index) => {
					imageList.push(item.img)
				})
				this.imageList = imageList
				this.total = totalCount
				setTimeout(() => {
					this.listLoading = false
				}, 500)
			},
			testMessage() {
				this.$baseMessage('test1', 'success')
			},
			testALert() {
				this.$baseAlert('11')
				this.$baseAlert('11', '自定义标题', () => {
					/* 可以写回调; */
				})
				this.$baseAlert('11', null, () => {
					/* 可以写回调; */
				})
			},
			testConfirm() {
				this.$baseConfirm(
					'你确定要执行该操作?',
					null,
					() => {
						/* 可以写回调; */
					},
					() => {
						/* 可以写回调; */
					}
				)
			},
			testNotify() {
				this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
			},
			showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
		},
	}
</script>
