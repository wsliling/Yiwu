<template>
	<view>
		<view class="upbox">
			<textarea placeholder="请填写视频/课程的标题" v-model="Title"/>
			<view class="videobox" @click="choosevideo">
				<image v-if="videofile" :src="videoShowImg" mode="aspectFill"></image>
				<image src="http://yw.wtvxin.com/static/videoUp.png" v-else></image>
			</view>
		</view>
		<view class="pricebox" v-if="type==1">
			<text>价格</text>
			<input type="number" placeholder="请输入价格" v-model="Price" :disabled="hascheck"/>
			<label @click="hascheck=!hascheck">
				<radio class="radio" :color="hascheck?'#de1b6e':'#999'" checked="true"></radio><text>免费</text>
			</label>
		</view>
		<view class="listbox" @click="isShowSource = true">
			<view class="">视频/课程的来源</view>
			<view class="listdis">
				<input type="text" disabled placeholder="请选择" class="flex1" v-model="sourcetype" />
				<image src="http://yw.wtvxin.com/static/my/icon-right.png" mode=""></image>
			</view>
		</view>
		<!-- 选择来源 -->
		<uni-popup mode="fixed" :show="isShowSource" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">选择来源</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item, index) in Sourcelist" :key="index" @click="SelectSource(item.Id, item.Name)">
							<view class="line-item-l text_left">
								<text class="txt" v-if="item.TypeInt == 0">{{ item.Name }}</text>
							</view>
						</view>
					</view>
					<view class="btns flex-between"><view class="btn c_theme" @click="hidePopup">关闭</view></view>
				</view>
			</view>
		</uni-popup>
		<view class="btnbox" @click="uplLoadBtn">确定</view>
	</view>
</template>

<script>
	import {post,webUrl,host} from '@/common/util';
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		data() {
			return {
				type:0,//0：拍视频 1：课程
				hascheck:false,//是否选中免费
				videofile:"",//视频文件
				fileName:"",//视频地址
				Title:"",
				Price:"",
				videoImg:"",
				videoShowImg:"",
				Sourcelist:[], // 视频课程来源列表
				isShowSource:false, //来源
				sourcetype: '', //选中来源
			};
		},
		components: { uniPopup },
		onLoad(e){
			this.type=e.type;
			if(this.type==0){
				this.hascheck=true;
			}
			if (this.type == 1) {
				uni.setNavigationBarTitle({
					title: '上传课程'
				});
			}
			this.getSource()
		},
		onShow() {
			this.userId = uni.getStorageSync("userId")
			this.token = uni.getStorageSync("token")
			//this.videoImg = uni.getStorageSync("VfileName")
			// const that=this
			// setTimeout(()=>{
			// 	that.videoShowImg=webUrl+that.videoImg
			// },500)
			//this.videofile = uni.getStorageSync("VfilePath")
		},
		methods: {
			choosevideo(){
				let _this=this;
				
				// uni.navigateTo({
				// 	url:"/pages/uploadFile/uploadFile?type=1"
				// })
				
				uni.chooseVideo({
					count:1,
					sourceType:['camera','album'],
					success(res) {
						console.log(res)
						let tempFilePaths = res.tempFilePath;
						uni.showLoading({
						  title: '上传中' //数据请求前loading
						})
						uni.uploadFile({
							url:host+'System/UploadMultiFile',
							filePath:tempFilePaths,
							name:'file',
							// #ifndef H5
							header:{"Content-Type":"multipart/form-data"},
							// #endif
							formData:{
								'UserId':_this.userId,
								'Token':_this.token,
								'SignKey':'video'
							},
							success: (_res) => {   
								uni.showToast({
									title:"视频上传成功",
								})
								console.log(_res)
								let data=JSON.parse(_res.data);
								_this.videofile=data.data[0].Video;
								setTimeout(()=>{
									_this.videoShowImg=data.data[0].Img;
								},500)
								console.log(_this.videoShowImg)
							},
							fail(err) {
								uni.showToast({
									title:"视频上传失败，请重试",
								})
							},
							complete() {
								uni.hideLoading();
							}
						})
					},
					fail(err) {
						console.log(err)
					}
				})
				
			},
			//发布视频
			async pushVideo(){
				if(this.hascheck){
					var IsCharge=0
				}else{
					var IsCharge=1
				}
				let res = await post("Find/UserPublishVideo", {
					UserId: this.userId,
					Token: this.token,
					Type: this.type,
					Video:this.videofile,
					Logo: this.videoShowImg,
					Title:this.Title,
					IsCharge:IsCharge,
					Price:this.Price,
					Source:this.sourcetype
				});
				if(res.code==0){
					uni.showToast({
						title:"发布成功",
					})
					// uni.setStorageSync("fileName","");//清空缓存
					// uni.setStorageSync("filePath","");
					// uni.setStorageSync("VfilePath","");
					// uni.setStorageSync("VfileName","");
					setTimeout(()=>{
						uni.navigateBack({
						    delta: 1
						});
					},1000)
				}else{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			},
			uplLoadBtn(){
				if(this.yanzheng()){
					this.pushVideo()
				}
			},
			yanzheng(){
				if(this.Title==""){
					uni.showToast({title:"请输入视频/课程的标题！",icon:"none"})
					return false
				}
				if(!this.videofile){
					uni.showToast({title:"请选择要上传的视频！",icon:"none"})
					return false
				}
				if(this.sourcetype==""){
					uni.showToast({title:"请选择视频/课程的来源！",icon:"none"})
					return false
				}
				if(this.type==1&&!this.hascheck&&(this.Price==0||this.Price=="")){
					uni.showToast({title:"请输入价格！",icon:"none"})
					return false
				}
				return true
			},
			//取消（统一关闭弹窗）
			hidePopup() {
				this.isShowSource = false;
			},
			// 来源选中
			SelectSource(id, name) {
				this.sourcetype = name;
				this.ClassId = id;
				this.isShowSource = false;
			},
			//视频课程获取来源
			getSource() {
				post('DanceMusic/GetSource', {
					Type: 0
				}).then(res => {
					if (res.code === 0) {
						this.Sourcelist = res.data;
					}
				});
			},
		}
	}
</script>

<style lang="scss">
.upbox{
	display: flex;
	padding: 70upx 30upx 40upx 30upx;
	background-color: #fff;
	textarea{
		width: 430upx;
		height: 245upx;
		margin-right: 30upx;
	}
	.videobox{
		width: 230upx;
		height: 230upx;
		image{
			width: 230upx;
			height: 230upx;
			border-radius: 6upx;
			border:1px solid #E6E6E6;
		}
		video{
			width: 230upx;
			height: 230upx;
		}
	}
}
.pricebox{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30upx;
	height: 90upx;
	border-top: 1px #ececec solid;
	border-bottom: 1px #ececec solid;
	background-color: #fff;
	.radio{
		transform:scale(0.76)
	}
}
.btnbox{
	width: 690upx;
	height: 88upx;
	line-height: 88upx;
	border-radius: 44upx;
	text-align: center;
	font-size: 32upx;
	color: #fff;
	background-color: #de1b6e;
	position: fixed;
	left: 30upx;
	bottom: 60upx;
}
.listbox{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30upx;
	height: 90upx;
	border-bottom: 1px #ececec solid;
	background-color: #fff;
	.listdis{
		display: flex;
		width: 65%;
		input{
			margin-left: 10upx;
			font-size: 28upx;
		}
		image{
			width: 15upx;
			height: 20upx;
			margin-top: 10upx;
		}
	}
}
</style>
