<template>
	<!-- 关于我们 -->
	<view class="">
		<view class="">
			<view class="auoutimg"><image src="/static/logo.png" mode=""></image></view>
			<view class="txt"><view v-html="Content"></view></view>
		</view>
	</view>
</template>
<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			Content: ''
		};
	},
	onLoad() {
		this.getAboutUs();
	},
	methods: {
		getAboutUs() {
			post('System/GetAboutUs').then(res => {
				if (res.code === 0) {
					this.Content = res.data.Content.replace(/(\r\n|\n|\r)/gm, "<br />");
				}
			});
		}
	}
};
</script>
<style scoped>
	/* #ifdef APP-PLUS */
	page{
		background: #fff;
	}	
	/* #endif */
.auoutimg {
	text-align: center;
	padding: 100upx 0 50upx;
}
image {
	width: 200upx;
	height: 200upx;
	border-radius: 46upx;
}
.txt {
	background: #fff;
	padding: 40upx 30upx 100upx;
	font-size: 32upx;
	word-break: break-all;
}
</style>