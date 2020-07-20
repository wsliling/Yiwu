<template>
	<view class="comment">
		<view class="newsInfo" v-html="Content"></view>
	</view>
</template>
  
<script>
	import {post,get} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				Content:""
			}
		},
		onLoad: function(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getinfo()
		},
		onShow(){
		},
		methods: {
			async getinfo(){
				let res=await get('system/GetUserAuth',{})
				if(res.code==0){
					this.Content=res.data.Content.replace(/(\r\n|\n|\r)/gm, "<br />")
				}
			},
		}
	}
</script>

<style scoped>
.comment{ padding: 0; margin: 0 auto; background: #fff; min-height: 100%;}
.newsInfo{ padding: 30upx;}
.comment {
	height: 100%;
	width: 750upx;
	overflow-x: hidden!important;
	position:relative;
	word-break:break-all; 
}
</style>
