<script>
	import {MemberPaly,toLogin2,host,dowmappURLios} from '@/common/util.js';
	import Vue from 'vue'
	import {
		mapMutations
	} from 'vuex'
	export default {
		onLaunch: function(e) {
			console.log('App Launch')
			// #ifdef APP-PLUS
			//检测系统
			const system = uni.getSystemInfoSync().platform;
			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=2226
			if(plus.runtime.appid !== 'HBuilder'){ // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
				uni.request({
				    url: host+'System/GetWebConfiguration', //检查更新的服务器地址
					method: 'POST',
				    success: (e) => {
						let _res=e.data;
						let _this=this;
				        if (_res.code==0) {
							uni.setStorageSync("Copyright",_res.data.Copyright);
							if(_res.data.Copyright!=plus.runtime.version){
								// 提醒用户更新
								_this.$showModal({
									title:'更新提示',
									content: "检测到有新的版本是否选择更新？",
								}).then(res=>{
									//确认
									let version=_res.data.Copyright.split('.').join('');
									const dowmappURL='http://m.dance-one.com/down/android'+version+'.apk';//app下载地址安卓
									plus.runtime.openURL(system=="ios"?dowmappURLios:dowmappURL);
						
								  }).catch(res=>{
									//取消
								}) 
							}
				        }
				    }
				})
			}
			// #endif
			setInterval(function(){
				toLogin2()
			},1000*60*5)
			// 获取分享的邀请码
			e.query.inviteCode&&uni.setStorageSync('inviteCode',e.query.inviteCode)
			// #ifdef H5
			const s2 = document.createElement('script');
			s2.type = 'text/javascript';
			s2.src = "//imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.2.js";
			document.body.appendChild(s2);
			// #endif
			uni.setStorageSync("playID","");
			uni.setStorageSync("fileName","");//舞曲文件名
			uni.setStorageSync("filePath","");//舞曲服务器地址
			uni.setStorageSync("VfileName","");//视频文件名
			uni.setStorageSync("VfilePath","");//视频服务器地址
			let audioPlayer = null;
			let timer = null;
			//#ifdef H5
			audioPlayer = uni.createInnerAudioContext()
			//#endif
			//#ifndef H5
			audioPlayer = uni.getBackgroundAudioManager()
			//#endif
			//注册事件函数写在全局或者写在vuex（不然重复绑定，内存泄露）里都行，这里图方便挂着全局
			Vue.prototype.$au_player = audioPlayer;
			Vue.prototype.$au_player.onPlay(()=>{
				console.log('playing')
				Vue.prototype.cusPlay && Vue.prototype.cusPlay()
				clearInterval(timer)
				timer = setInterval(()=>{ //安卓和ios app 下onTimeUpdate事件在替换资源和seek之后不会触发，这里做手动触发
					//console.log('update')
					Vue.prototype.cusTimeUpdate()
				},240)
				MemberPaly(uni.getStorageSync("playID"))
			})
			Vue.prototype.$au_player.onTimeUpdate(()=>{
				Vue.prototype.cusTimeUpdate && Vue.prototype.cusTimeUpdate()
			})
			Vue.prototype.$au_player.onEnded(()=>{
				Vue.prototype.cusEnded && Vue.prototype.cusEnded()
				clearInterval(timer)
			})
			Vue.prototype.$au_player.onError((err)=>{
				console.log('play err:'+err)
				this.setIsplayactive(false)
				clearInterval(timer)
			})
			Vue.prototype.$au_player.onStop((res)=>{
				console.log('play stop:'+res)
				uni.setStorageSync("playID","");
				this.setIsplayactive(false)
				clearInterval(timer)
			})
			Vue.prototype.$au_player.onWaiting(()=>{
				Vue.prototype.cusWaiting&&Vue.prototype.cusWaiting()
			})
			Vue.prototype.$au_player.onCanplay(()=>{
				Vue.prototype.cusonCanplay&&Vue.prototype.cusonCanplay()
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['setIsplayactive'])
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import './common/iconfont.css';
	@import './common/common.scss';
	@import './components/uParse/src/wxParse.css';
	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #f7f7f7;
		// height: 100%;
		font-size: 28upx;
		line-height: 1.8;
		color: #333;
	}
	uni-swiper .uni-swiper-wrapper{
		border-radius: 10upx;
	}
	
</style>
