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
		},
		methods: {
			message(event){
				let data=event.detail.data;console.log(data[0])
				if(data.length>0){
					if(this.type==0){
						uni.setStorageSync("fileName",data[0].fileName)
						uni.setStorageSync("filePath",data[0].filePath)
					}else{
						uni.setStorageSync("VfileName",data[0].fileName)
						uni.setStorageSync("VfilePath",data[0].filePath)
					}
				}
			}
		}
	}
</script>

<style>

</style>
