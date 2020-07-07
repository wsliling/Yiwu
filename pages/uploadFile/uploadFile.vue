<template>
	<view>
		<web-view :src="webSrc" @message="message"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,//0:上传音频，1:上传视频
				webSrc:"",
			}
		},
		onLoad(e) {
			this.type=e.type
		},
		onShow() {
			this.userId = uni.getStorageSync("userId")
			this.token = uni.getStorageSync("token")
			// #ifdef MP-WEIXIN
			this.webSrc="http://yw.wtvxin.com/hybrid/html/index.html?type="+this.type+"&userId="+this.userId+"&token="+this.token
			// #endif
			// #ifndef MP-WEIXIN
			this.webSrc="/hybrid/html/index.html?type="+this.type+"&userId="+this.userId+"&token="+this.token
			// #endif
			console.log(uni.getStorageSync("fileAddress"));
		},
		methods: {
			message(event){
				console.log(event.detail.data);
			}
		}
	}
</script>

<style>

</style>
