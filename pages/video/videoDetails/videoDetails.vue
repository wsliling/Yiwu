<template>
	<view>
		<view class="videobox">
			<video v-if="CourseInfo.IsShowBuy==0" :src="CourseInfo.Video" :poster="CourseInfo.PicImg" controls></video>
			<view class="tipbox" v-if="CourseInfo.IsShowBuy==1">
				<image :src="CourseInfo.PicImg" mode="aspectFill"></image>
				<view class="txt flex-column">
					该视频为付费视频，请点击下方购买按钮进行购买，谢谢合作！
				</view>
			</view>
		</view>
		<view class="videoinfo pp3">
			<view class="title uni-mb10">
				{{CourseInfo.Name}}
			</view>
			<view class="desc uni-mb10" v-if="CourseInfo.Intro">
				<view>简介：</view>
				<rich-text :nodes="CourseInfo.Intro"></rich-text>
			</view>
			<view class="flex-between">
				<view class="left">
					<text class="price color_red">{{CourseInfo.IsCharge==1?'￥'+CourseInfo.Price:'免费'}}</text>
					<text class="fz12 c_999">时长{{CourseInfo.VDuration}}</text>
					<text class="fz12 c_999">{{CourseInfo.Is_Charge==0?CourseInfo.SalesNum:CourseInfo.Hits}}人已学</text>
				</view>
				<view class="buybtn" @click="tobuy" v-if="CourseInfo.IsShowBuy==1">购买</view>
			</view>
			<view class="media-ft flex-between">
				<view class="ft_l flex-start">
					<view @click="likeBtn" :class="['txt_info like',CourseInfo.IsLike==1?'active':'']">{{CourseInfo.LikeNum}}</view>
					<view class="txt_info reply">{{CourseInfo.CommentNum}}</view>
					<share :wxUrl="'/pages/video/videoDetails/videoDetails?id='+Courseid">
						<view class="txt_info share"></view>
					</share>
				</view>
				<view class="ft_r flex-end">
					<view :class="['txt_info download',CourseInfo.IsShowBuy==1?'dis':'']" @click="DownloadCourse(CourseInfo.IsShowBuy)"></view>
					<view @click="CollectBtn" :class="['txt_info sign',CourseInfo.IsCollet==1?'active':'']"></view>
				</view>
			</view>
		</view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
			<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)" style="width: 50%;">{{tab.TypeName}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</scroll-view>
		<view class="Yi-courselist flexWrap flex-between" v-if="tabIndex==0&&hasData">
			<view class="item" v-for="(item,index) in otherlist" :key="index" @click="tolink('/pages/video/videoDetails/videoDetails?id='+item.Id)">
				<view class="maxpic">
					<image :src="item.PicImg" mode="widthFix"></image>
					<view class="isplay"></view>
				</view>
				<view class="item_info">
					<view class="item_title uni-ellipsis">{{item.Title}}</view>
					<view class="item_total">
						<view class="item_market">{{item.Is_Charge==0?item.SalesNum+'人付款':item.Hits+'人点击'}}</view>
						<span class="item_price">{{item.Is_Charge==1?'￥'+item.Price:'免费'}}</span>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-list" v-if="tabIndex==1&&hasData">
			<block v-for="(item,index) in datalist" :key="index">
				<reply-item :itemData='item' @Sendreplay="Sendreplay"></reply-item>
			</block>	
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" @click="showReplyBox" :placeholder="placeholder"/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
				</view>
			</view>
		</view>
		<uni-popup mode="fixed" :show="isShowDowninfo" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-Down">
				<view class="uni-modal__hd pd15">下载</view>
				<view class="uni-modal__bd text_left pd15">
					<view class="name">
						文件名：
					</view>
					<view class="name">
						大小：{{dsize}}kb
					</view>
				</view>
				<view class="btns flex-between">
					<view class="btn" @click="hidePopup">取消</view>
					<view class="btn active" @click="Downloadfun">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {post,get,dateUtils,toLogin} from '@/common/util.js';
	import replyItem from '@/components/reply-item.vue'; //评论组件
	import noData from '@/components/noData.vue'; //暂无数据
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components: {
			replyItem,
			noData,
			uniPopup
		},
		data() {
			return {
				userId: "",
				token: "",
				tabIndex:0,
				Courseid:"",//课程id
				tabnav:[
					{
						Id:1,
						TypeName:"其他课程"
					},
					{
						Id:2,
						TypeName:"评论"
					}
				],
				CourseInfo:{},
				otherlist:[],//其他课程
				page:1,
				pageSize:10,
				hasData:false,
				noDataIsShow: false,
				datalist:[],
				IsShowReplyBox:false,//是否显示评论按钮
				placeholder:"写评论~",
				PCommentId:0,//上级评论id
				Comment:"",//评论内容
				PCommentname:"",//上级评论名
				isShowDowninfo:false,
				luj:"",//保存的路径
				dsize:"",//下载文件大小
				durl:"",//下载的路径
			}
		},
		onLoad(e) {
			this.Courseid=e.id;
			
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.GetCoursexq();
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		 },
		methods: {
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
					this.noDataIsShow = false;
					this.hasData = false;
					if(index==0){
						this.GetUserOtherCourse();
					}else{
						this.CommnetList();
					}
				}
			},
			//课程详情
			async GetCoursexq(){
				let result = await post("Course/GetCourse_Outline_xq", {
					"UserId": this.userId,
					"Token": this.token,
					"OutlineId": this.Courseid,
				});
				if(result.code==0){
					this.CourseInfo=result.data;
					this.GetUserOtherCourse();
				}
			},
			tobuy(){
				if(toLogin()){
					let buyInfo={
						PicImg:this.CourseInfo.PicImg,
						name:this.CourseInfo.Name,
						price:this.CourseInfo.Price
					}
					uni.setStorageSync('buyInfo', buyInfo);
					uni.navigateTo({
						url:'/pages/pay2/pay2?type=0&id='+this.Courseid
					})
				}
			},
			//其他课程
			async GetUserOtherCourse(){
				let result = await post("Course/GetUserOtherCourse", {
					"UserId": this.userId,
					"Token": this.token,
					"MemberId":this.CourseInfo.MemberId,
				});
				if(result.code==0){
					if (result.data.length > 0){
						this.hasData = true;
						this.noDataIsShow = false;
						this.otherlist=result.data;
					}else{
						this.noDataIsShow = true;
						this.hasData = false;
					}
					
				}
			},
			//课程点赞/取消
			async likeBtn(){
				let result = await post("Course/CourseOutlineLikes", {
					"UserId": this.userId,
					"Token": this.token,
					"CourseId":this.Courseid
				});
				if(result.code==0){
					let _this=this;
					let num=0;
					uni.showToast({
						title: result.msg
					})
					if(this.CourseInfo.IsLike==0){
						this.CourseInfo.IsLike=1;
						this.CourseInfo.LikeNum++
					}else{
						this.CourseInfo.IsLike=0;
						this.CourseInfo.LikeNum--
					}
				}else if(result.code==2){
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
				}
			},
			//课程收藏和取消收藏
			async CollectBtn(){
				let result = await post("Course/CourseCollection", {
					"UserId": this.userId,
					"Token": this.token,
					"OutlineId":this.Courseid
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(this.CourseInfo.IsCollet==0){
						this.$set(this.CourseInfo,"IsCollet",1)
					}else{
						this.$set(this.CourseInfo,"IsCollet",0)
					}
				}else if(result.code==2){
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
				}
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowDowninfo=false;
			},
			//获取下载路径
			async DownloadCourse(type){
				if(type==1){
					uni.showToast({
						title: "购买后才可以下载哦！",
						icon: "none",
						duration: 1500
					});
				}else{
					let result = await post("Course/DownloadCourse", {
						"UserId": this.userId,
						"Token": this.token,
						"CourseId":this.Courseid
					});
					if(result.code==0){
						this.durl=result.data;
						this.isShowDowninfo=true;
					}
				}
			},
			// 下载
			Downloadfun(){
				let that = this;
				const downloadTask = uni.downloadFile({
					url: that.durl, 
					success: (res) => {
						console.log(res)
						if (res.statusCode === 200) {
							uni.showToast({
								title: "下载成功"
							})
							that.AddDownloadRecord();
						}
						uni.saveFile({
							tempFilePath: res.tempFilePath,
								success: function(red) {
									that.luj = red.savedFilePath
									console.log(red)
								}
							});
						}
					});
								
				downloadTask.onProgressUpdate((res) => {
					this.dsize=res.totalBytesExpectedToWrite;
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			},	
			//添加下载记录
			async AddDownloadRecord(){
				let result = await post("User/AddDownloadRecord", {
					"UserId": this.userId,
					"Token": this.token,
					"TypeInt":1,
					"VoiceId":this.Courseid,
				});
			},
			//显示评论按钮
			showReplyBox(){
				this.IsShowReplyBox=true;
			},
			//取消评论
			CancelReply(){
				this.placeholder="写评论~";
				this.IsShowReplyBox=false;
				this.PCommentId=0;
			},
			async CommnetList(){
				let result = await post("Find/CommnetList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"FkId": this.Courseid,
					"TypeInt":2
				});
				if(result.code==0){
					if (result.data.length > 0) {
						let _this=this;
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.AddTime=dateUtils.format(item.AddTime);
							_this.$set(item, "imgArr",item.ImgList.split(","));
							_this.$set(item, "isSHOW",false);
							item.MyCommnetList.forEach(function(item2) {
								item2.AddTime=dateUtils.format(item2.AddTime);
								let txt =item2.Comment.split("#$#");
								if(txt.length==2){
									_this.$set(item2, "Comment",txt[1]);
									_this.$set(item2, "pname",txt[0]);
								}else{
									_this.$set(item2, "Comment",txt[0]);
									_this.$set(item2, "pname","");
								}
							})
						})
						this.datalist = result.data;
					}else{
						this.noDataIsShow = true;
						this.hasData = false;
					}
				}
				
			},
			// 发表评论
			async CommentOperation(){
				let result = await post("Find/CommentOperation",{
					"UserId": this.userId,
					"Token": this.token,
					"FkId":this.Courseid,
					"TypeInt":2,
					"ParentCommentId":this.PCommentId,
					"Comment":this.Comment,
					"PicList":'',
					"PicNo":''
				});
				if(result.code===0){
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
					//更新评论列表，并清空评论内容
					this.page=1;
					this.CommnetList();
					this.placeholder="写评论~";
					this.PCommentname="";
					this.PCommentId=0,
					this.Comment="";
				}else if (result.code === 2) {
					let _this =this;
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
				}
			},
			Send(){
				if(this.Comment!=""){
					if(this.PCommentname!=""){
						this.Comment=this.PCommentname+this.Comment;
					}
					this.CommentOperation();
				}else{
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
						duration: 2000
					});
				}
			},
			Sendreplay(e){
				console.log(e)
				if(e[1]==""){
					this.placeholder="回复匿名";
					if(e[2]==true){
						this.PCommentname="@匿名"+"#$#"
					}
				}else{
					this.placeholder="回复"+e[1];
					if(e[2]==true){
						this.PCommentname="@"+e[1]+"#$#";
					}
				}
				this.PCommentId=e[0];
				this.IsShowReplyBox=true;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{ 
		background: #fff;
	}
</style>
