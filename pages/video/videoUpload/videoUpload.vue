<template>
	<view>
		<view class="upbox">
			<textarea placeholder="请填写视频/课程的标题" v-model="Title"/>
			<view class="videobox" @click="choosevideo">
				<image v-if="videofile" :src="videoShowImg" mode="aspectFill"></image>
				<image src="http://m.dance-one.com/static/videoUp.png" v-else></image>
				<view class="rate" v-if="percent>0">
					<view class="press" :style="{width: percent+'%'}"></view>
				</view>
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
				<image src="http://m.dance-one.com/static/my/icon-right.png" mode=""></image>
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
		<!-- #ifdef APP-PLUS -->
		<view class="advbox" v-if=showmsk>
			<view class="imgbox">
				<view class="textbox">
					<view class="title">壹舞APP平台服务协议（EULA）</view>
					<view class="main">
						<p>用户在接受小舔狗APP平台服务之前，请务必仔细阅读本条款并同意本声明。</p>
						<p>第一条</p>
						　　<p>用户以各种方式使用壹舞平台服务和数据(包括但不限于发表、宣传介绍、转载、浏览及利用拓拼拼平台或拓拼拼平台用户发布内容)的过程中，不得以任何方式利用拓拼拼平台直接或间接从事违反中国法律、以及社会公德的行为，且用户应当恪守下述承诺：</p>
						
						　　<p>1. 发布、转载或提供的内容符合中国法律、社会公德;</p>
						
				    	   <p>2.不允许发布有令人反感的内容或滥用的用户。</p>
						
						　　<p>3. 不得干扰、损害和侵犯壹舞APP的各种合法权利与利益;</p>
						
						　　<p>4. 遵守拓拼拼平台以及与之相关的网络服务的协议、指导原则、管理细则等;</p>
						
						　　<p>5.壹舞APP有权对违反上述承诺的内容予以删除。</p>
						
						<p>第二条</p>
						
						　　<p>1. 用户在壹舞APP发表的内容(包含但不限于壹舞APP目前各产品功能里的内容)仅表明其个人的立场和观点，并不代表壹舞APP的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。壹舞APP不承担任何法律及连带责任。</p>
						
						　　<p>2. 用户在壹舞APP发布侵犯他人知识产权或其他合法权益的内容，壹舞APP有权予以删除，并保留移交司法机关处理的权利。</p>
						
						　　<p>3. 个人或单位如认为壹舞APP上存在侵犯自身合法权益的内容，应准备好具有法律效应的证明材料，及时与壹舞APP取得联系，以便壹舞APP迅速做出处理。</p>
						
						　　附则：对免责声明的解释、修改及更新权均属于壹舞APP所有。
					</view>
					<view class="maskbtnbox">
						<view class="" @click="toback()">暂不使用</view>
						<view class="colorblue" @click="showmsk=false">同意</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {post,webUrl,host} from '@/common/util';
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		data() {
			return {
				showmsk:true,
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
				videoInfo:{},//上传视频的信息
				percent:0,//上传进度
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
			toback(){
				uni.navigateBack()
			},
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
						_this.videoInfo = res;
						let tempFilePaths = res.tempFilePath;
						uni.showLoading({
						  title: '上传中' //数据请求前loading
						})
						const uploadTask =uni.uploadFile({
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
						uploadTask.onProgressUpdate(function (res) {
						   _this.percent = res.progress;
						});
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
					Source:this.sourcetype,
					VideoH:this.videoInfo.height,
					VideoW:this.videoInfo.width,
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
		position: relative;
		image{
			width: 230upx;
			height: 230upx;
			border-radius: 6upx;
			border:1px solid #E6E6E6;
		}
		.rate{ 
			height: 10upx;
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			background: rgba(0,0,0,.5);
			border-radius: 10upx;
			z-index: 2;
			overflow: hidden;
			.press{
				position: absolute;
				border-radius: 10upx;
				bottom: 0;
				left: 0;
				height: 100%;
				background: #8bc34a;
				z-index: 3;
			}
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
