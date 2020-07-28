<script>
	export default {
		onLaunch: function(e) {
			console.log('App Launch')
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
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
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
