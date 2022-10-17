/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */
//const Vue = () => import("vue")
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
//import Layout from '@/layouts'
//import EmptyLayout from '@/layouts/EmptyLayout'
import {
	publicPath,
	routerMode,
	tokenTableName
} from '@/config'

const Layout = () => import('@/layouts')
const EmptyLayout = () => import('@/layouts/EmptyLayout')

Vue.use(VueRouter)
export const constantRoutes = [{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
	},
	{
		path: '/register',
		component: (resolve) => import('@/views/register/index'),
		hidden: true,
	},
	{
		path: '/luckSheetTemplate',
		name: 'luckSheetTemplate',
		component: (resolve) => import('@/views/testDevelopment/lucksheet/template'),
		hidden: true,
	},
	{
		path: '/401',
		name: '401',
		component: () => import('@/views/401'),
		hidden: true,
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/404'),
		hidden: true,
	},
]

export const asyncRoutes = [
	//{
	// 		path: '/',
	// 		component: Layout,
	// 		redirect: 'index',
	// 		children: [{
	// 			path: 'index',
	// 			name: 'Index',
	// 			component: () => import('@/views/index/index'),
	// 			meta: {
	// 				title: '首页',
	// 				icon: 'home',
	// 				affix: true,
	// 			},
	// 		}, ],
	// 	},
	// 	{
	// 		path: '/testDevelopment',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '试验定义',
	// 			icon: 'flask',
	// 		},
	// 		//hidden: true,
	// 		children: [{
	// 				path: 'menu',
	// 				name: '试验定义流程图',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/menu'),
	// 				meta: {
	// 					title: '试验定义',
	// 					icon: 'flask',
	// 				},
	// 				//hidden: true,
	// 			},
	// 			{
	// 				path: 'testParameter',
	// 				name: 'testDevelopment',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testParameter'),
	// 				meta: {
	// 					title: '试验参数',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterCriterion',
	// 				name: '参数判定标准',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/parameterCriterion'),
	// 				meta: {
	// 					title: '参数判定标准',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'routineTestparameters',
	// 				name: '常规试验参数',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/routineTestparameters'),
	// 				meta: {
	// 					title: '常规试验参数',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testformParameter',
	// 				name: '试验组成参数',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testformParameter'),
	// 				meta: {
	// 					title: '试验组成参数',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterManagement',
	// 				name: '参数管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/parameterManagement'),
	// 				meta: {
	// 					title: '参数管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'dataDictionary',
	// 				name: '主数据字典',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/dataDictionary'),
	// 				meta: {
	// 					title: '主数据字典',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testitemManage',
	// 				name: '试验管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testitemManage'),
	// 				meta: {
	// 					title: '试验管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'commonTest',
	// 				name: '机构常用试验',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/commonTest'),
	// 				meta: {
	// 					title: '机构常用试验',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterTemplate',
	// 				name: '参数模板管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/parameterTemplate'),
	// 				meta: {
	// 					title: '参数模板管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testDictionary',
	// 				name: '试验字典管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testDictionary'),
	// 				meta: {
	// 					title: '试验字典管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testTemplate',
	// 				name: '试验模板管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testTemplate'),
	// 				meta: {
	// 					title: '试验模板管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'workingStandard',
	// 				name: '操作标准定义',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/workingStandard'),
	// 				meta: {
	// 					title: '操作标准定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'standardSelect',
	// 				name: '试验室标准规范选定',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/standardSelect'),
	// 				meta: {
	// 					title: '试验室标准规范选定',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testtemplateMapping',
	// 				name: '试验模板映射',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/testtemplateMapping'),
	// 				meta: {
	// 					title: '试验模板映射',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterTemplateMapping',
	// 				name: '参数模板映射',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/parameterTemplateMapping'),
	// 				meta: {
	// 					title: '参数模板映射',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterDictionary',
	// 				name: '参数字典管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/parameterDictionary'),
	// 				meta: {
	// 					title: '参数字典管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'dataGroup',
	// 				name: '数据分组管理',
	// 				component: (resolve) =>
	// 					import('@/views/testDevelopment/pages/dataGroup'),
	// 				meta: {
	// 					title: '参数字典管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/chemicalManagement',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '化学品管理',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '化学品管理流程图',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/menu'),
	// 				meta: {
	// 					title: '化学品管理',
	// 					icon: 'vial',
	// 				},
	// 			},
	// 			{
	// 				path: 'chemicalPreserve',
	// 				name: '化学品品种维护',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalPreserve'),
	// 				meta: {
	// 					title: '化学品品种维护',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'voidRecord',
	// 				name: '化学品作废记录',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/voidRecord'),
	// 				meta: {
	// 					title: '化学品作废记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalPurchase',
	// 				name: '化学品购入记录',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalPurchase'),
	// 				meta: {
	// 					title: '化学品购入记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalDistribution',
	// 				name: '化学品分配',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalDistribution'),
	// 				meta: {
	// 					title: '化学品分配',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalInventory',
	// 				name: '化学品盘点记录',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalInventory'),
	// 				meta: {
	// 					title: '化学品盘点记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalAccount',
	// 				name: '化学品台账',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalAccount'),
	// 				meta: {
	// 					title: '化学品台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'parameterEquipment',
	// 				name: '参数化学品消耗定义',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/parameterEquipment'),
	// 				meta: {
	// 					title: '参数化学品消耗定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalStock',
	// 				name: '化学品库存',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalStock'),
	// 				meta: {
	// 					title: '化学品库存',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'chemicalConsumption',
	// 				name: '化学品消耗记录',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/chemicalConsumption'),
	// 				meta: {
	// 					title: '化学品消耗记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'buyRegister',
	// 				name: '化学品购入登记',
	// 				component: (resolve) =>
	// 					import('@/views/chemicalManagement/pages/buyRegister'),
	// 				meta: {
	// 					title: '化学品购入登记',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/standardManagement',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '标准物质管理',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '标准物质管理流程图',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/menu'),
	// 				meta: {
	// 					title: '标准物质管理',
	// 					icon: 'dice-d6',
	// 				},
	// 			},
	// 			{
	// 				path: 'substanceCategory',
	// 				name: '标准物质定义',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/substanceCategory'),
	// 				meta: {
	// 					title: '标准物质定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialCustomizations',
	// 				name: '试验室标准物质定制',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialCustomizations'),
	// 				meta: {
	// 					title: '试验室标准物质定制',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialConsumption',
	// 				name: '标准物质消耗定义',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialConsumption'),
	// 				meta: {
	// 					title: '标准物质消耗定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialCustomization',
	// 				name: '标准物质分配',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialCustomization'),
	// 				meta: {
	// 					title: '标准物质分配',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialPurchase',
	// 				name: '标准物质购入记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialPurchase'),
	// 				meta: {
	// 					title: '标准物质购入记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialMaking',
	// 				name: '标准物质制作记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialMaking'),
	// 				meta: {
	// 					title: '标准物质制作记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'consumptionRecord',
	// 				name: '标准物质消耗记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/consumptionRecord'),
	// 				meta: {
	// 					title: '标准物质消耗记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'voidedRecord',
	// 				name: '标准物质作废记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/voidedRecord'),
	// 				meta: {
	// 					title: '标准物质作废记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'verificationPlan',
	// 				name: '标准物质校检计划',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/verificationPlan'),
	// 				meta: {
	// 					title: '标准物质校检计划',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'periodVerification',
	// 				name: '标准物质期间核查计划',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/periodVerification'),
	// 				meta: {
	// 					title: '标准物质期间核查计划',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'verificationRecord',
	// 				name: '标准物质期间核查记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/verificationRecord'),
	// 				meta: {
	// 					title: '标准物质期间核查记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'checkRecord',
	// 				name: '标准物质期间校检记录',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/checkRecord'),
	// 				meta: {
	// 					title: '标准物质期间校检记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'materialLedger',
	// 				name: '标准物质台账',
	// 				component: (resolve) =>
	// 					import('@/views/substanceCategory/pages/materialLedger'),
	// 				meta: {
	// 					title: '标准物质台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/postArticle',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '办公管理',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '办公管理',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/menu'),
	// 				meta: {
	// 					title: '办公管理',
	// 					icon: 'user-edit',
	// 				},
	// 			},
	// 			{
	// 				path: 'draft',
	// 				name: '审核',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/draft'),
	// 				meta: {
	// 					title: '审核',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'examinationAndapproval',
	// 				name: '起草审批与接收',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/examinationAndapproval'),
	// 				meta: {
	// 					title: '起草审批与接收',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'receiptRecord',
	// 				name: '收文记录',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/receiptRecord'),
	// 				meta: {
	// 					title: '收文记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'postingRecord',
	// 				name: '发文记录',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/postingRecord'),
	// 				meta: {
	// 					title: '发文记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'points',
	// 				name: '个人扣分定义',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/points'),
	// 				meta: {
	// 					title: '个人扣分定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'personalIntegral',
	// 				name: '个人积分',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/personalIntegral'),
	// 				meta: {
	// 					title: '个人积分',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'mechanismIntegral',
	// 				name: '机构积分',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/mechanismIntegral'),
	// 				meta: {
	// 					title: '机构积分',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'printingRecords',
	// 				name: '用印记录',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/printingRecords'),
	// 				meta: {
	// 					title: '用印记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'collectionRecord',
	// 				name: '收款记录',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/collectionRecord'),
	// 				meta: {
	// 					title: '收款记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'sealLedger',
	// 				name: '印章台账',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/sealLedger'),
	// 				meta: {
	// 					title: '印章台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},

	// 			{
	// 				path: 'priceControl',
	// 				name: '价格管理',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/priceControl'),
	// 				meta: {
	// 					title: '价格管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'prepare',
	// 				name: '拟稿',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/prepare'),
	// 				meta: {
	// 					title: '拟稿',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'postRegistration',
	// 				name: '发文登记',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/postRegistration'),
	// 				meta: {
	// 					title: '发文登记',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'dispatchRegister',
	// 				name: '收文登记',
	// 				component: (resolve) =>
	// 					import('@/views/officeManagement/pages/dispatchRegister'),
	// 				meta: {
	// 					title: '收文登记',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/customer',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '客户管理',
	// 			icon: 'users',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '客户管理',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/menu'),
	// 				meta: {
	// 					title: '客户管理',
	// 					icon: 'users',
	// 				},
	// 			},
	// 			// {
	// 			// 	path: 'customer',
	// 			// 	name: '客户登记',
	// 			// 	component: (resolve) =>
	// 			// 		import('@/views/customerManagement/pages/customer'),
	// 			// 	meta: {
	// 			// 		title: '客户登记',
	// 			// 		icon: 'home',
	// 			// 	},
	// 			// 	hidden: true,
	// 			// },
	// 			{
	// 				path: 'clientManagement',
	// 				name: '客户台账',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/pages/clientManagement'),
	// 				meta: {
	// 					title: '客户台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'contractManagement',
	// 				name: '合同台账',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/pages/contractManagement'),
	// 				meta: {
	// 					title: '合同台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'contractRegistration',
	// 				name: '合同登记',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/pages/contractRegistration'),
	// 				meta: {
	// 					title: '合同登记',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'consumptionRecord',
	// 				name: '客户消费记录',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/pages/consumptionRecord'),
	// 				meta: {
	// 					title: '客户消费记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'consumption',
	// 				name: '消费',
	// 				component: (resolve) =>
	// 					import('@/views/customerManagement/pages/consumption'),
	// 				meta: {
	// 					title: '消费',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			// {
	// 			// 	path: 'rechargeRecord',
	// 			// 	name: '客户充值记录',
	// 			// 	component: (resolve) =>
	// 			// 		import('@/views/customerManagement/pages/rechargeRecord'),
	// 			// 	meta: {
	// 			// 		title: '客户充值记录',
	// 			// 		icon: 'home',
	// 			// 	},
	// 			// 	hidden: true,
	// 			// },
	// 			// {
	// 			// 	path: 'recharge',
	// 			// 	name: '充值',
	// 			// 	component: (resolve) =>
	// 			// 		import('@/views/customerManagement/pages/recharge'),
	// 			// 	meta: {
	// 			// 		title: '充值',
	// 			// 		icon: 'home',
	// 			// 	},
	// 			// 	hidden: true,
	// 			// },
	// 		],
	// 	},
	// 	{
	// 		path: '/testProcess',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '试验流程',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '试验流程',
	// 				component: (resolve) => import('@/views/testProcess/menu'),
	// 				meta: {
	// 					title: '试验流程',
	// 					icon: 'bezier-curve',
	// 				},
	// 			},
	// 			{
	// 				path: 'entrustAccount',
	// 				name: '委托申请',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/entrustAccount'),
	// 				meta: {
	// 					title: '委托申请',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'entrustAccept',
	// 				name: '受理分派',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/entrustAccept'),
	// 				meta: {
	// 					title: '受理分派',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testTask',
	// 				name: '试验任务',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/testTask'),
	// 				meta: {
	// 					title: '试验任务',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'sampleAccept',
	// 				name: '样品台账',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/sampleAccept'),
	// 				meta: {
	// 					title: '样品台账',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testCheck',
	// 				name: '试验复核',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/testCheck'),
	// 				meta: {
	// 					title: '试验复核',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testApprove',
	// 				name: '试验批准',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/testApprove'),
	// 				meta: {
	// 					title: '试验批准',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testExcute',
	// 				name: '试验',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/testExcute'),
	// 				meta: {
	// 					title: '试验',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'sampleLeave',
	// 				name: '留样',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/sampleLeave'),
	// 				meta: {
	// 					title: '留样',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testpay',
	// 				name: '试验收费',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/testpay'),
	// 				meta: {
	// 					title: '试验收费',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'reportSend',
	// 				name: '报告寄发',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/reportSend'),
	// 				meta: {
	// 					title: '报告寄发',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},

	// 			{
	// 				path: 'sampleLeaveLeave',
	// 				name: '留样处置记录',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/sampleLeaveLeave'),
	// 				meta: {
	// 					title: '留样处置记录',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'reportSeal',
	// 				name: '报告用印',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/pages/reportSeal'),
	// 				meta: {
	// 					title: '报告用印',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'HelloWorld',
	// 				name: '委托表格',
	// 				component: (resolve) =>
	// 					import('@/views/testProcess/luckysheet/HelloWorld'),
	// 				meta: {
	// 					title: '报告用印',
	// 					icon: 'bezier-curve',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/userManages',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '人员管理',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '人员管理',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/menu'),
	// 				meta: {
	// 					title: '人员管理',
	// 					icon: 'user-cog',
	// 				},
	// 			},
	// 			{
	// 				path: 'personnelLedger',
	// 				name: '人员台账',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/pages/personnelLedger'),
	// 				meta: {
	// 					title: '人员台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'personnelAllocation',
	// 				name: '人员调拨记录',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/pages/personnelAllocation'),
	// 				meta: {
	// 					title: '人员调拨记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'personnelCertification',
	// 				name: '人员持证记录',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/pages/personnelCertification'),
	// 				meta: {
	// 					title: '人员持证记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'personnelSupervision',
	// 				name: '人员监督检查记录',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/pages/personnelSupervision'),
	// 				meta: {
	// 					title: '人员监督检查记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'personnelRegistration',
	// 				name: '人员登记',
	// 				component: (resolve) =>
	// 					import('@/views/personnelRegistration/pages/personnelRegistration'),
	// 				meta: {
	// 					title: '人员登记',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/device',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '设备管理',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '设备管理',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/menu'),
	// 				meta: {
	// 					title: '设备管理',
	// 					icon: 'server',
	// 				},
	// 			},
	// 			{
	// 				path: 'equipmentPurchase',
	// 				name: '设备购入记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentPurchase'),
	// 				meta: {
	// 					title: '设备购入记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentAcceptance',
	// 				name: '设备验收',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentAcceptance'),
	// 				meta: {
	// 					title: '设备验收',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'deviceClass',
	// 				name: '设备类别定义',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/deviceClass'),
	// 				meta: {
	// 					title: '设备类别定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentCalibration',
	// 				name: '设备检定计划',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentCalibration'),
	// 				meta: {
	// 					title: '设备检定计划',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentPeriodcheck',
	// 				name: '设备期间核查计划',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentPeriodcheck'),
	// 				meta: {
	// 					title: '设备期间核查计划',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			// {
	// 			// 	path: 'equipmentVerificationrecord',
	// 			// 	name: '设备期间核查记录',
	// 			// 	component: () =>
	// 			// 		require('@/views/deviceManagement/pages/equipmentVerificationrecord'),
	// 			// 	meta: {
	// 			// 		title: '设备期间核查记录',
	// 			// 		icon: 'home',
	// 			// 	},
	// 			// 	hidden: true,
	// 			// },
	// 			{
	// 				path: 'Maintenance',
	// 				name: '维护保养记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/Maintenance'),
	// 				meta: {
	// 					title: '维护保养记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			// {
	// 			// 	path: 'MaintenanceAdd',
	// 			// 	name: '添加维护保养记录',
	// 			// 	component: () =>
	// 			// 		require('@/views/deviceManagement/pages/MaintenanceAdd'),
	// 			// 	meta: {
	// 			// 		title: '添加维护保养记录',
	// 			// 		icon: 'home',
	// 			// 	},
	// 			// 	hidden: true,
	// 			// },
	// 			{
	// 				path: 'equipmentAllocation',
	// 				name: '设备调拨记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentAllocation'),
	// 				meta: {
	// 					title: '设备调拨记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentAccident',
	// 				name: '设备事故记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentAccident'),
	// 				meta: {
	// 					title: '设备事故记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentMaintenance',
	// 				name: '设备维修记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentMaintenance'),
	// 				meta: {
	// 					title: '设备维修记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentLedger',
	// 				name: '设备台账',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentLedger'),
	// 				meta: {
	// 					title: '设备台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentUsage',
	// 				name: '参数设备使用定义',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentUsage'),
	// 				meta: {
	// 					title: '参数设备使用定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'equipmentSealUnseal',
	// 				name: '设备封存/启封记录',
	// 				component: (resolve) =>
	// 					import('@/views/deviceManagement/pages/equipmentSealUnseal'),
	// 				meta: {
	// 					title: '设备封存/启封记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/testingRoom',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		meta: {
	// 			title: '检测室监管',
	// 			icon: 'home',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '检测室监管',
	// 				component: (resolve) => import('@/views/testingRoom/menu'),
	// 				meta: {
	// 					title: '检测室监管',
	// 					icon: 'warehouse',
	// 				},
	// 			},
	// 			{
	// 				path: 'detectionRoomdefinition',
	// 				name: '检测室定义',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/pages/detectionRoomdefinition'),
	// 				meta: {
	// 					title: '检测室定义',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'detectionRoomallocation',
	// 				name: '检测室定制',
	// 				component: (resolve) =>
	// 					import('@/views/testingRoom/pages/detectionRoomallocation'),
	// 				meta: {
	// 					title: '检测室定制',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'testRoomledger',
	// 				name: '检测室台账',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/pages/testRoomledger'),
	// 				meta: {
	// 					title: '检测室台账',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'accessControlrecord',
	// 				name: '检测室门禁记录',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/pages/accessControlrecord'),
	// 				meta: {
	// 					title: '检测室门禁记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'real-timeMonitoring',
	// 				name: '检测室监控记录',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/pages/real-timeMonitoring'),
	// 				meta: {
	// 					title: '检测室监控记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'alarmRecord',
	// 				name: '检测室报警记录',
	// 				component: (resolve) =>
	// 					import('@/views/standardManagement/pages/alarmRecord'),
	// 				meta: {
	// 					title: '检测室报警记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'environmentalMonitoring',
	// 				name: '环境监测记录',
	// 				component: (resolve) =>
	// 					import('@/views/testingRoom/pages/environmentalMonitoring'),
	// 				meta: {
	// 					title: '环境监测记录',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		path: '/system',
	// 		component: Layout,
	// 		redirect: 'noRedirect',
	// 		name: 'system',
	// 		meta: {
	// 			title: '系统管理',
	// 			icon: 'cog',
	// 		},
	// 		children: [{
	// 				path: 'menu',
	// 				name: '系统管理',
	// 				component: (resolve) => import('@/views/system/menu'),
	// 				meta: {
	// 					title: '系统管理',
	// 					icon: 'cog',
	// 				},
	// 			},
	// 			{
	// 				path: 'permissionTypes',
	// 				name: '权限类型定义',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/permissionTypes'),
	// 				meta: {
	// 					title: '权限类型定义',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'permissionType',
	// 				name: '权限类型',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/permission'),
	// 				meta: {
	// 					title: '权限类型',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'permission',
	// 				name: 'permission',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/permissionType'),
	// 				meta: {
	// 					title: '权限定义',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'rolePermissionMapping',
	// 				name: '角色权限映射',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/rolePermissionMapping'),
	// 				meta: {
	// 					title: '角色赋权',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'regulatoryBody',
	// 				name: '监管机构',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/regulatoryBody'),
	// 				meta: {
	// 					title: '监管机构',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'branchInstitutions',
	// 				name: '分支机构',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/branchInstitutions'),
	// 				meta: {
	// 					title: '分支机构',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 			{
	// 				path: 'expatriateProject',
	// 				name: '外委机构管理',
	// 				component: (resolve) =>
	// 					import('@/views/system/pages/expatriateProject'),
	// 				meta: {
	// 					title: '外委机构管理',
	// 					icon: 'home',
	// 				},
	// 				hidden: true,
	// 			},
	// 		],
	// 	},
]

const router = new VueRouter({
	base: publicPath,
	mode: routerMode,
	scrollBehavior: () => ({
		y: 0,
	}),
	routes: constantRoutes,
})


//注释的地方是允许路由重复点击，如果你觉得框架路由跳转规范太过严格可选择放开
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch((err) => err)
}
const originalPush_1 = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush_1.call(this, location).catch((err) => err)
}
export function resetRouter() {
	router.matcher = new VueRouter({
		base: publicPath,
		mode: routerMode,
		scrollBehavior: () => ({
			y: 0,
		}),
		routes: constantRoutes,
	}).matcher
}

export default router
//添加一次菜单高亮 2020-12-04 hui开始
export function menuActive() {}

//添加一次菜单高亮 2020-12-04 hui结束
