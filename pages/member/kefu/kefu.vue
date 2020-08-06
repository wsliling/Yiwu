<template>
	<!-- 在线客服 -->
	<view>
		<view class="kefu_top">
			<!-- <view class="kefu_img">
				<image src="http://xqk.wtvxin.com/images/wxapp/qq.png"></image>
			</view> -->
			<view class="kefu_detail">在线客服<view>(09:00~22:00)</view></view>
		</view>
		<view class="kefu_desc">所有常见问题都有相应的解决方案，请参考常见问题自主解决，如 果常见问题无法解决您的问题在咨询客服，由于客服咨询量较大， 请尽可能的描述清楚您的问题，以便快速解决</view>
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="contact" bindcontact="handleContact">在线客服</button>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="kefu_btn" @click="call">在线客服</view>
		<!-- #endif -->
	
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				info:{},
				
			}
		},
		
		    handleContact (e) {
		        console.log(e.detail.path)
		        console.log(e.detail.query)
		    },
			
		onLoad(e){
			// #ifdef APP-PLUS
			// this.qqnum = e.qqnum
			// #endif
		},
		onShow() {
			this.getinfo() 
		},
		methods: {	
			async getinfo(){
				let res=await get('system/GetWebConfiguration',{})
				console.log(res)
					if(res.code==0){
						this.info=res.data
					}	
			},
			call(){
				let tel=this.info.WebTel;
				uni.showModal({
					content: tel,
					confirmText: "呼叫",
					confirmColor: "#dd196d",
					success: function(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: tel
							});
						} else if (res.cancel) {}
					}
				});
			}
		}
	}
</script>

<style>
.kefu_top{
	display: flex;justify-content: flex-start;align-items: center;
	padding:30upx;
	background: #ffffff;
}
.kefu_detail{
	display: flex;justify-content: flex-start;align-items: center;
}
.kefu_img{
	width:60upx;height:60upx;margin-right:10upx;
}
.kefu_img image{
	width:100%;height:100%;
}
.kefu_desc{
	background: #ffffff;padding:30upx;font-size:24upx;color:#999999
}
.kefu_btn{
	width:90%;
	background: #dd196d;
	margin:80upx auto;
	border-radius:15upx;
	/* padding:10upx 0; */
	text-align: center;
	color:#ffffff;
	text-decoration: none;
	height: 80rpx;
	line-height: 40px;
}
button, input[type='number'], input[type='text'], input[type='password'], input[type='email'], input[type='search'], ._select, textarea {
	margin: 80upx auto;
	font-family: inherit;
	-webkit-appearance: none;
	width: 90%;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 10rpx;
}
button[type=primary] {
	color: #fff;
	background-color: #dd196d;
}
button::after {
	border: none;
}
</style>
