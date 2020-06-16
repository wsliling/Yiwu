<template>
	<view>
		<view class="line-list">
			<view class="line-item">
				<view class="lab">真实姓名</view>
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
			<view class="line-item" style="flex-wrap: wrap;">
				<view class="lab" style="width: 100%;">认证说明</view>
				<view class="item_r" style="width: 100%;">
				  <textarea value="" maxlength="300" placeholder="请填写院校/培训机构、相关头衔和简介" />
				</view>
			</view>
			<view class="line-item">
				<view class="picbox flex-column" @click="uplLoadImg">
				    <image class="img" v-if="picStr" :src="picStr" mode="aspectFill"></image>
					<text class="c_999" v-else>头衔相关证明</text>
				</view>
			</view>
		</view>
		<view class="tips flex-start pp3">
			<text class="red">*</text>全部为必填信息，务必认真填写
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #fff;">
			<view class="btn">提交</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util'
	import { pathToBase64} from '@/common/image-tools.js';
	export default {
		data() {
			return {
				userId:"",
				token:"",
				picStr:""
			}
		},
		onLoad(){
		  this.userId = uni.getStorageSync("userId")
		  this.token = uni.getStorageSync("token")
		},
		onShow(){

		},
		methods: {
			//上传
			uplLoadImg(){
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) =>{
						// tempFilePath可以作为img标签的src属性显示图片
						this.picStr=res.tempFilePaths[0];
						this.UploadPhoto()
					} 
				})
			},
			async base64Img(arr) {
				const res = await pathToBase64(arr);
				return res;
			},
			async UploadPhoto(){
				let picStrbase64=await this.base64Img(this.picStr);console.log(this.picStr)
				// post('User/UploadPhoto',{
				// 	UserId:this.userId,
				// 	Token:this.token,
				// 	Avatar:picStrbase64
				// }).then(res=>{
				// 	this.picStr=res.data;
				// 	uni.showToast({
				// 	  title: res.msg,
				// 	})
				// })
			},
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
	.picbox{
		width: 100%;
		background: #f2f2f2;
		border-radius: 12upx;
		overflow: hidden;
		height: 360upx;
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
	.line-item textarea{ 
		width: 100%;
	}
</style>
