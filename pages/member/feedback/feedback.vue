<template>
	<view class="content">
		<view class="bg_fff">
			<view class="feedbackType pp3">
				<view class="fType_title">反馈问题类型</view>
				<view class="fType__bd">
					<view class="tagList">
						<block v-for="(item,index) in feedtypelist" :key="index">
						<view :class="['tag',feedtype==index?'active':'']" @click="selectType(item.code)">{{item.message}}</view>
						</block>
					</view>
				</view>
			</view>
			<view class="areBox pp3">
				<textarea style="height: 200upx; width: 100%;" maxlength="255" @input="limitInput()" class="weui-Area" v-model="Comment" placeholder="选择反馈类型能帮助我们更快处理您的反馈" />
				<view class="text_r fz12 c_999"><text>{{inputTxtLength}}</text>/255</view>
			</view>
		</view>
		<!-- 上传图片 联系方式-->
		<view class="uni-list list-pd">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file">
									<view class="iconfont icon-cha delbtn" @click="delImg(index)">
										
									</view>
									<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="isShowBtnUpload">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
					<view class="uni-uploader-head">
						<view class="uni-uploader-title"></view>
						<view class="uni-uploader-info">{{imageList.length}}/5</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell pp3">
				<view>联系方式</view>
				<input type="number" placeholder="请输入联系方式" class="flex1 text_right" v-model="Tel">
			</view>
		</view>
		<view class="fixedbtn" style="background: #f7f7f7;">
			<view class="btn" @click="Submit">确定</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin,valPhone} from '@/common/util.js';
	import { pathToBase64, base64ToPath} from '@/common/image-tools.js';
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onShow(){
			this.FeedBackType();
			this.sourceTypeIndex = 2;
			this.sourceType = ['拍照', '相册', '拍照或相册'];
			this.sizeTypeIndex = 2;
			this.sizeType = ['压缩', '原图', '压缩或原图'];
			this.countIndex = 4;
		},
		onUnload() {
			
		},
		data() {
			return {
				userId: "",
				token: "",
				isShowBtnUpload:true,
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 4,
				count: [1, 2, 3, 4, 5],
				inputTxtLength:0,//当前输入字数
				Tel:"",
				feedtypelist:{},//反馈类型
				feedtype:0,//已选择反馈类型0网站，1产品，2服务，3建议，4其他
				Comment:"",//反馈内容
				imgs:[],
				imgsStr:""
			};
		},
		methods: {
			chooseImage: async function() {
				if (this.imageList.length >= 5) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 5 ? 5 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						if (this.imageList.length >= 5) {
						  this.isShowBtnUpload = false;
						  this.imageList.splice(5);
						}
					}
				})
			},
			async base64Img(arr) {
				let base64Arr = [];
				for (let i = 0; i < arr.length; i += 1) {
				const res = await pathToBase64(arr[i]);
				base64Arr.push({
				  PicUrl: res
				});
			  }
			  return base64Arr;
			},
			isFullImg: function() {
				return new Promise((res) => {
					//#ifndef APP-PLUS
					uni.showModal({
						content: "已经有5张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
					//#endif
					//#ifdef APP-PLUS
					this.$showModal({
						content: "已经有5张图片了,是否清空现有图片？",
					}).then(_res=>{
						this.imageList = [];
						res(true);
						//确认
					  }).catch(_res=>{
						  res(false)
						//取消
					  })
					//#endif
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			//删除图片
			delImg(index){  
				  this.imageList.splice(index,1);
				  this.imgs.splice(index,1);
				  if(this.imageList.length<6){
					this.isShowBtnUpload = true;
				  }
			},
			limitInput() {
			    this.inputTxtLength = this.Comment.length;
			},
			//提交反馈
			async MemberFeedBack(base64img){
				console.log("base64img:"+base64img)
				let result = await post("User/MemberFeedBack",{
					"UserId": this.userId,
					"Token": this.token,
					"Mobile":this.Tel,
					"Type":this.feedtype,
					"PicList":base64img,
					"Content":this.Comment
				});
				if(result.code===0){
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
					setTimeout(function() {
						_this.imageList = [];
						_this.Comment="";
						_this.isShowBtnUpload = true;
						uni.navigateBack()
					}, 2000);
					
				} else if (result.code === 2) {
					let _this =this;
					uni.hideToast();
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			//反馈类型
			async FeedBackType(){
				let result = await get("User/FeedBackType",{
					
				});
				if(result.code===0){
					this.feedtypelist=result.data;
				}else if (result.code === 2) {
					let _this =this;
					uni.hideToast();
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			//选择反馈类型
			selectType(code){
				this.feedtype=code;
			},
			//提交
		    async Submit(){
				let imgArr = await this.base64Img(this.imageList);
				if(this.Comment!=""||this.imgs.length!=0){
					if(valPhone(this.Tel)){
						this.MemberFeedBack(JSON.stringify(imgArr));
					}
				}else{
					uni.showToast({
						title: "反馈内容不能为空",
						icon: "none",
						duration: 2000
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tagList{
		.tag{
			display: inline-block;
			vertical-align: middle;
			line-height: 56upx;
			border: 1px solid #e6e6e6;
			padding: 0 20upx;
			color: #888;
			margin-right: 20upx;
			margin-bottom: 20upx;
			min-width: 120upx;
			text-align: center;
			border-radius: 100px;
			&.active{
				color: $primary;
				border-color: $primary;
			}
		}
		
	}
	.tag:last-child{
		margin-right: 0;
	}
	.feedbackType{
		border-bottom:1px solid #F2F2F2;
		padding-bottom: 6upx;
	}
	.fType_title{
		font-size: 32upx;
		margin-bottom: 10upx;
	}
	.uni-uploader-body{padding: 14upx;}
	.uni-uploader__input-box{ width: 220upx; height: 220upx;}
	.uni-uploader__file{ position: relative; }
	.delbtn{ height: 40upx; width: 40upx; font-size: 40upx; text-align: center; line-height: 40upx; position: absolute; right: -10upx; top: -10upx; color: #999;z-index: 99;}
	.uni-uploader-head{padding: 0 20upx 20upx;}
	.uni-uploader-info{font-size: 26upx; color: #999;}
</style>
