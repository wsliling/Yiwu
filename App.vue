<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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
		background-color: #f8f8f8;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}
</style>
