<template>
	<view>
		<view class="line-list">
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/wallet/wallet')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/money.png" mode="widthFix"></image>
					<text class="txt">我的零钱</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/myIncome/myIncome')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/icon1.png" mode="widthFix"></image>
					<text class="txt">我的收入</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/myIntegral/myIntegral')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/icon2.png" mode="widthFix"></image>
					<text class="txt">我的积分</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/livebi/livebi')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/icon3.png" mode="widthFix"></image>
					<text class="txt">直播币</text>
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
