<template>
	<div :id="GetIdRoot" :ref="GetIdRoot">
		<div data-v-4224c31a class="player-active">
			<div data-v-4224c31a class="wasm-box">
				<div data-v-4224c31a class="wasm-player" :style="GetWasmPlayerStyle">
					<div :id='Gettxtelem' :style="GettxtStyle">
						<span>{{GetTxt}}</span>
					</div>
					<div :id="GetId" :ref="GetId">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	let browserRejectionHandler = ''
	import {
		Player
	} from '../commonjs/player.js'
	export default {
		name: 'easyPlayer',
		props: {
			uniqueId: {
				type: String,
				required: true
			},
			channel_id: {
				type: String,
				required: false
			},
			org_id: {
				type: String,
				required: false,
			},
			room_name: {
				type: String,
				required: false,
			},
			screen_type: {
				type: Number,
				required: true,
			},
			load_type: {
				type: Number,
				required: true
			},
			auto_play: {
				type: Boolean,
				required: false,
				default: true
			},
			isRemoveTxt: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		components: {

		},
		computed: {
			GetIdRoot() {
				return this.GetId + 'root'
				//return 'newWasm' + this.uniqueId + 'root'
			},
			GetId() {
				return 'newWasm' + this.uniqueId
			},
			Gettxtelem() {
				return 'newWasm-txt' + this.uniqueId
			},
			GettxtStyle() {
				if (this.player) {
					return this.player.playerTxtStyle
				}
				return ''
			},
			GetTxt() {
				if (this.player) {
					return this.player.playerTxt
				}
				return ''
			},
			GetWasmPlayerStyle() {
				if (this.player) {
					return this.player.wasmPlayerStyle
				}
				return ''
			},
			GetIsAutoPlay() {
				if (this.auto_play) {
					return 1
				}
				return 0
			}
		},
		watch: {
			isRemoveTxt(newVal, oldVal) {
				if (newVal) {
					this.remove_txt()
				}

			}
		},
		data() {
			return {
				player: '',
				loadStatus: false,
			}
		},
		created() {
			this.errror()
			this.init()

		},
		beforeDestroy() {
			this.player.destroy()
		},
		mounted() {},
		methods: {
			init() {

				this.iniPlay()
				this.isOnline();
			},
			iniPlay() {
				let that = this
				let org_id = this.org_id //'101120101'
				let play = new Player(this.channel_id, org_id, this.room_name, this.uniqueId, this.screen_type, this
					.load_type, this
					.GetIsAutoPlay);
				play.Autotemplate(this.screen_type, this.uniqueId);
				this.player = play;
				let index = setInterval(() => {
					if (that && that.$refs[that.GetId]) {
						//console.log('iniPlay', that.$refs[that.GetId])
						clearInterval(index);
						that.player.mian();
					}
				})
			},
			isOnline() {
				let that = this
				let index = setInterval(() => {
					if (that.player && typeof that.player.isOnline != 'undefined') {
						clearInterval(index)
						that.loadStatus = true
						console.log('加载完毕', that.uniqueId)
						that.$emit('loadComplete', that.uniqueId);
						that.remove_txt()
					}
				})
			},
			remove_txt() {
				if (this.isRemoveTxt) {
					this.player.remove_txt()
				}

			},
			errror() {
				console.log('errror', browserRejectionHandler)
				if (!browserRejectionHandler) {
					browserRejectionHandler = function(event) {
						try {
							console.log('unhandledrejection', event)
							if (event && event.promise) {
								event.promise.then((e) => {
									console.log('promise then', e)
								}).catch((e) => {
									console.log('promise catch', e)
								})
							}
							if (event && event.preventDefault) {
								event && event.preventDefault()
							}

						} catch (e) {
							alert(e)
						}
					}
				} else {
					try {
						window.removeEventListener('unhandledrejection', browserRejectionHandler)
					} catch (e) {
						console.log(e)
					}
				}
				window.addEventListener('onunhandledrejection', browserRejectionHandler)
				window.onerror = browserRejectionHandler
			}
		},
	}
</script>
