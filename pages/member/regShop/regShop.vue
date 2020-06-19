<template>
	<view>
		<view class="line-list" style="margin-top: 20upx;">
			<view class="line-item">
				<view class="lab">姓名</view>
				<view class="item_r flex1">
				  <input type="text" v-model="Name" placeholder="请输入姓名" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">电话</view>
				<view class="item_r flex1">
				  <input type="text" v-model="Mobile" placeholder="请输入联系方式" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">微信</view>
				<view class="item_r flex1">
				  <input type="text" v-model="WeChat" placeholder="请输入微信" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">QQ</view>
				<view class="item_r flex1">
				  <input type="text" v-model="QQmark" placeholder="请输入QQ" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">品牌</view>
				<view class="item_r flex1">
				  <input type="text"v-model="brand" placeholder="请输入品牌,可不填" class="flex1" placeholder-style="color: #666;">
				</view>
			</view>
			<view class="line-item" style="flex-wrap: wrap;">
				<view class="lab" style="width: 100%;">简述</view>
				<view class="item_r" style="width: 100%;border-bottom: 1upx solid #f2f2f2;">
				  <textarea value="" v-model="sketch" maxlength="300" placeholder="请输入简要说明" />
				</view>
			</view>
		</view>
		<!-- <view class="tips flex-start pp3">
			<text class="red">*</text>请留下您的联系方式，我们会和您联系
		</view> -->
		<view style="height: 110upx;"></view>
		<view class="fixedbtn">
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
				Name:"",   //姓名
				Mobile:"", //电话
				WeChat:"", //微信
				QQmark:"", //QQ
				brand:"",  //品牌
				sketch:"", //简述
			}
		},
		onLoad(){
		  this.userId = uni.getStorageSync("userId")
		  this.token = uni.getStorageSync("token")
		},
		onShow(){
		
		},
		methods: {
			getApplyShop(){
				post('Shop/ApplyShop',{
					userId:this.userId,
					token:this.token,
					Name:this.Name,
					Mobile:this.Mobile,
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page{ 
		// background: #fff;
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
