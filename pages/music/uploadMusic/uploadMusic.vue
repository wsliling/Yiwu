<template>
	<view>
		<view class="line-list">
			<view class="line-item">
				<view class="lab">曲名</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请输入曲名" class="flex1">
				</view>
			</view>
			<view class="line-item">
				<view class="lab">价格</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请输入价格" class="flex1">
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="ShowSelect(0)">
				<view class="lab">关联曲单</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请选择" class="flex1" v-model="musicmenu">
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="ShowSelect(1)">
				<view class="lab">类型选择</view>
				<view class="item_r flex1">
				  <input type="text" placeholder="请选择" class="flex1" v-model="musictype">
				</view>
			</view>
			<view class="line-item" style="flex-wrap: wrap;">
				<view class="lab" style="width: 100%;">请选择封面</view>
				<view class="picbox flex-column uni-mt10" @click="uplLoadImg">
				    <image class="img" v-if="picStr" :src="picStr" mode="aspectFill"></image>
					<text class="c_999" v-else>上传封面</text>
				</view>
			</view>
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #fff;">
			<view class="btn">确定</view>
		</view>
		<!-- 选择曲单	 -->
		<uni-popup mode="fixed" :show="isShowSelect" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">{{selectTab==0?'选择曲单':'选择类型'}}</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item,index) in 12" :key="index" @click="SelectMenu(index,'默认曲单')">
							<view class="line-item-l text_left">
								<text class="txt">默认曲单</text>
							</view>
						</view>
					</view>
					<view class="btns flex-between">
						<view class="btn c_theme"  @click="hidePopup">关闭</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {post} from '@/common/util'
	import { pathToBase64} from '@/common/image-tools.js';
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		data() {
			return {
				userId:"",
				token:"",
				picStr:"",
				isShowSelect:false,
				musicmenu:"",
				musictype:"",
				selectTab:0,//0弹出曲单，,1弹出类型
			}
		},
		components: {
			uniPopup
		},
		onLoad(){
		  this.userId = uni.getStorageSync("userId")
		  this.token = uni.getStorageSync("token")
		},
		onShow(){
		
		},
		methods: {
			//弹出选择歌单
			ShowSelect(index){
				this.isShowSelect=true;
				this.selectTab=index;
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowSelect=false;
			},
			SelectMenu(index,txt){
				if(this.selectTab==0){
					this.musicmenu=txt;
				}else{
					this.musictype=txt;
				}
				this.isShowSelect=false;
			},
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
		width: 240upx;
		height: 240upx;
		background: #f2f2f2;
		border-radius: 12upx;
		overflow: hidden;
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