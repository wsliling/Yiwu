<template>
	<view>
		<web-view :src="webSrc" @message="message"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webSrc:"",
			}
		},
		onLoad(e) {
			
		},
		onShow() {
			this.userId = uni.getStorageSync("userId")
			this.token = uni.getStorageSync("token")
			// #ifdef MP-WEIXIN
			this.webSrc="http://m.dance-one.com/hybrid/html/index.html?userId="+this.userId+"&token="+this.token
			// #endif
			// #ifndef MP-WEIXIN
			this.webSrc="/hybrid/html/index.html?userId="+this.userId+"&token="+this.token
			// #endif
		},
		methods: {
			message(event){
				let data=event.detail.data;console.log(data[0])
				if(data.length>0){
					//uni.setStorageSync("fileName",data[0].filePath)
					uni.setStorageSync("fileName",data[0].fileName)
					uni.setStorageSync("filePath",data[0].filePath)
				}
			}
		}
	}
</script>

<style>

</style>
