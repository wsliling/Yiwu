<template>
	<view>
		<view class="upbox">
			<textarea placeholder="请填写视频/课程的标题" v-model="Title"/>
			<view class="videobox" @click="choosevideo">
				<video :src="videofile"  v-if="videofile"></video>
				<image src="/static/videoUp.png" v-else></image>
			</view>
		</view>
		<view class="pricebox" v-if="type==1">
			<text>价格</text>
			<input type="number" placeholder="请输入价格" v-model="Price" :disabled="hascheck"/>
			<label @click="hascheck=!hascheck">
				<radio class="radio" :color="hascheck?'#de1b6e':'#999'" checked="true"></radio><text>免费</text>
			</label>
		</view>
		<view class="btnbox" @click="uplLoadBtn">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,//0：拍视频 1：课程
				hascheck:false,//是否选中免费
				videofile:"",//视频文件
				videosrc:"",//视频地址
				Title:"",
				Price:"",
				videoImg:"",
			};
		},
		onLoad(e){
			this.type=e.type
		},
		methods: {
			choosevideo(){
				var that =this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function (res) {
						that.videofile = res.tempFilePath;
					}
				})
			},
			//上传视频
			async uplLoadVideo(){
				let res = await post("Find/UploadVideo", {
					UserId: this.userId,
					Token: this.token,
					Type: this.type,
					Video:this.videofile
				});
				if(res.code==0){
					
				}
			},
			//发布视频
			async pushVideo(){
				if(hascheck){
					var IsCharge=0
				}else{
					var IsCharge=1
				}
				let res = await post("Find/UserPublishVideo", {
					UserId: this.userId,
					Token: this.token,
					Type: this.type,
					Video:this.videosrc,
					Logo: this.videoImg,
					Title:this.videoTitle,
					IsCharge:IsCharge,
					Price:this.Price
				});
				if(res.code==0){
					
				}
			},
			uplLoadBtn(){
				if(this.yanzheng()){
					
				}
			},
			yanzheng(){
				if(this.Title==""){
					uni.showToast({title:"请输入视频/课程的标题！",icon:"none"})
					return false
				}
				if(this.videofile==""){
					uni.showToast({title:"请选择要上传的视频！",icon:"none"})
					return false
				}
				if(this.type==1&&!this.hascheck&&(this.Price==0||this.Price=="")){
					uni.showToast({title:"请输入价格！",icon:"none"})
					return false
				}
				return true
			}
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
		height: 245upx;
		image{
			width: 230upx;
			height: 245upx;
			border-radius: 6upx;
		}
		video{
			width: 230upx;
			height: 245upx;
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
	bottom: 20upx;
}
</style>
