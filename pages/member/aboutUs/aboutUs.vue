<template>
	<!-- 关于我们 -->
	<view class="">
		<view class="">
			<view class="auoutimg"><image src="../../../static/jiaol.png" mode=""></image></view>
			<view class="txt">{{ Content }}</view>
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
					this.Content = res.data.Content;
				}
			});
		}
	}
};
</script>
<style scoped>
.auoutimg {
	text-align: center;
	padding: 100upx 0 50upx;
}
image {
	width: 200upx;
	height: 200upx;
}
.txt {
	background: #fff;
	padding: 40upx 30upx 100upx;
	font-size: 32upx;
}
</style>
