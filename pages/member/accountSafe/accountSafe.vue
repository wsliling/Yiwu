<template>
	<view>
		<view class="line-list">
			<view class="line-item line-arrow-r">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="/static/share_weixin.png" mode="widthFix"></image>
					<text class="txt">绑定微信</text>
				</view>
				<view class="item_r text_right">
				  已绑定
				</view>
			</view>
			<view class="line-item line-arrow-r">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="/static/phone.png" mode="widthFix"></image>
					<text class="txt">手机号更换</text>
				</view>
				<view class="item_r text_right">
				  13556369887
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId:"",
				token:"",
			}
		},
		onLoad(){
		  this.userId = uni.getStorageSync("userId")
		  this.token = uni.getStorageSync("token")
		},
		onShow(){
		 
		},
		methods: {
			tolink(url){
			  uni.navigateTo({
			    url
			  })
			},
		}
	}
</script>

<style lang="scss">
	.line-item-l{ 
		.iconimg{
			display: block;
			width: 56upx; 
			height: 56upx;
			margin-right: 20upx;
		}
		.txt{font-size: 30upx;}
	}
	.item_r{ color: #999;}
</style>
