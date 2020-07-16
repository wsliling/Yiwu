<template>
	<view>
		<view class="line-list">
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/order/order')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/icon4.png" mode="widthFix"></image>
					<text class="txt">我的订单</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/myBuy/myBuy')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/mybuy.png" mode="widthFix"></image>
					<text class="txt">我购买的</text>
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
				userId: "",
				token: "",
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			tolink(url){
				uni.navigateTo({
					url:url
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.line-item-l{
		width: 100%;
		.iconimg{
			display: block;
			width: 44upx; 
			height: 44upx;
			margin-right: 20upx;
		}
		.txt{font-size: 28upx;}
	}
</style>
