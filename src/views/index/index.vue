<template>
	<div id="app" v-loading="loading">
		<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
<!-- 		<div v-if="org_type=='市建委'||org_type=='区建委'||org_type=='建委' ||roleMax=='super_admin'">
			<MixMap></MixMap>
		</div> -->
    欢迎来到工程质量管理平台
	</div>
</template>

<script>
	import VuetifulBoard from '@/components/vueful-board/VuetifulBoard.vue';
	import MixMap from './ConstructionCommittee/MixMap.vue'
	import palette from '@/utils/palette.json'
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			VuetifulBoard,
			MixMap
		},
		name: 'App',
		data() {
			return {
				roleMax: '',
				loading: true,
				org_type: '',
				theme: 'classic',
				darkMode: false,
				monochrome: undefined,
				layoutEditable: true,
				colNum: 12,
				datasets: [],
				rowHeight: 30,
				palette: {
					type: Array,
					palette,
				},
			}
		},
		created() {
			this.init();
			this.fetchData();
		},
		watch: {
			org_id(newVal, oldVal) {
				this.init();
			},
		},
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
				org_id: 'user/org_id',
			}),
		},
		methods: {
			async init() {
				if (this.org_id && this.org_id > 0) {
					let org_type = await this.$store.dispatch('org/GetOrgType', this.org_id);
					this.org_type = org_type;
					let roleMax = await this.$store.dispatch('user/getRoleMax');
					this.roleMax = roleMax;
					this.loading = false;
				}
			},
			async fetchData() {

				console.log(this.datasets)
			},
			switchTheme(themeName) {
				this.theme = themeName;
			},
			setMonochromeColor(event) {
				this.monochrome = {
					enabled: true,
					color: event.target.value,
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.theme-swatches {
		display: flex;
		justify-content: space-between;
		align-content: center;
		padding: 0;
	}

	.theme-swatches-item {
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 5px;
		text-align: center;
		transition: transform .2s cubic-bezier(.4, 0, .2, 1);

		&:hover {
			box-shadow: 0 2px 16px rgb(0 0 0 / 15%);
			transform: scale(1.05);
		}

		.theme-swatches-label {
			position: relative;
			display: block;
			width: 100%;
			height: 100%;
			padding: 10px 15px;
			cursor: pointer;
		}

		.theme-swatches-checkbox {
			display: none;
		}

		.theme-swatches-name {
			display: block;
			color: #232323;
			font-size: 14px;
		}

		.hue {
			display: inline-block;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			box-shadow: 0 0 0 2px #fff;
			vertical-align: middle;

			// TODO: 테마별 색상으로 바인딩하기
			&.primary {
				background: #5975fe;
			}

			&.secondary {
				background: #54d2d2;
			}

			&.third {
				background: #ffcb00;
			}

			&.fourth {
				background: #ff6150;
			}

			&.fifth {
				background: #1360bf;
			}

			&+.hue {
				margin-left: -6px;
			}
		}
	}

	.editBtn {
		padding: 7px;
		border: 1px solid #fff;
		border-radius: 5px;
		background: #fff;
		cursor: pointer;
	}
</style>
