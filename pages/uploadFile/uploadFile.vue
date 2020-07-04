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
			if(this.type==0){
				this.webSrc="http://yw.wtvxin.com/hybrid/html/index.html?type="+this.type+"&userId="+this.userId+"&token="+this.token
			}else if(this.type==1){
				this.webSrc="http://yw.wtvxin.com/hybrid/html/index.html?type="+this.type+"&userId="+this.userId+"&token="+this.token
			}
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
