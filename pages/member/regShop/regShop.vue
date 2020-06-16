<template>
	<view>
		<view class="line-list">
			<view class="line-item">
				<view class="lab">姓名</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请输入姓名" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">联系方式</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请输入联系方式" class="flex1">
				</view>
			</view>
		</view>
		<view class="tips flex-start pp3">
			<text class="red">*</text>请留下您的联系方式，我们会和您联系
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #fff;">
			<view class="btn">提交</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util'
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
			
		}
	}
</script>

<style lang="scss">
	page{ 
		background: #fff;
	}
	.lab{
		width: 160upx;
	}
	.tips {
		font-size: 24upx; color:#666;
		text{
			font-size: 40upx;
			font-weight: bold;
			line-height: 1;
			margin-right: 10upx;
		}
	}
</style>
