<template>
	<view class="content">
		<view class="Yi-media" style="background: #fff;">
			<view class="media-hd flex-between">
				<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id='+NewsInfo.MemberId)">
					<view class="tx" style="border: none;padding: 0;"><image :src="NewsInfo.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image></view>
					<view class="name uni-ellipsis">{{NewsInfo.NickName}}</view>
					<view class="tochat" @click.stop="tolink('/pages/chat/chat?id='+NewsInfo.MemberId,'login')"><image src="http://m.dance-one.com/static/chat.png"></image></view>
				</view>
				<view v-if="NewsInfo.IsMy==0" @click="flow(NewsInfo.MemberId,index,1)" :class="['flow',NewsInfo.IsFollow==1?'active':'']">{{NewsInfo.IsFollow==1?'已关注':'关注'}}</view>
			</view>
			<view class="media-bd">
				<view class="desc">
					{{NewsInfo.Title}}
				</view>
				<view :class="['maxpic mv',NewsInfo.fixed?'dis':'']" v-if="NewsInfo.Type==1" id="boxVideo">
					<view v-if="!NewsInfo.play||NewsInfo.fixed" class="isplay" @click="playBtn"></view>
					<video v-if="NewsInfo.play" :src="NewsInfo.VideoUrl" :controls="isControls" autoplay @play="playVideo" @pause="pauseVideo" id="video" :show-mute-btn="true" object-fit="cover" @tap="ControlsFn"></video>
					<image class="postpic" :src="NewsInfo.PicImg" mode="aspectFill"></image>
				</view>
				<!-- <view class="maxpic maxh" v-if="NewsInfo.Type==0&&NewsInfo.PicImg">
					<image :src="NewsInfo.PicImg" mode="widthFix"></image>
				</view> -->
				<view v-if="NewsInfo.Type==0&&imgArr.length" :class="['image-section Grid3',imgArr.length==1?'image-section-one':'']">
					<view class="image-list" v-if="imgArr&&i<3" v-for="(source, i) in imgArr" :key="i" >
						<image class="img" :src="source" v-if="imgArr.length==1" mode="widthFix" @click="previewImg(imgArr,i)" />
						<image class="img" :src="source" v-else mode="aspectFill" @click="previewImg(imgArr,i)" />
					</view>
					<view v-if="imgArr.length>3" class="count">{{imgArr.length}}</view>
				</view>
				<view class="media-song" v-if="NewsInfo.MusicData" @click.stop="toRec(NewsInfo.MusicData.Id)">
					<view class="box flex">
						<view class="songpic">
							<view class="isaudio">
								<image src="http://m.dance-one.com/static/play2.png" mode="widthFix"></image>
							</view>
							<image :src="NewsInfo.MusicData.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
						</view>
						<text class="uni-ellipsis2">{{NewsInfo.MusicData.Name}}</text>
					</view>
				</view>
				<view class="media-ft flex-between">
					<view class="ft_l flex-start">
						<view @click="likeBtn(NewsInfo.Id,index)" :class="['txt_info like',NewsInfo.IsLike==1?'active':'']">{{NewsInfo.LikeNum>0?NewsInfo.LikeNum:'点赞'}}</view>
						<share :url="'/pages/replylist/replylist?id='+Findid">
							<view class="txt_info share"></view>
						</share>
						<view class="txt_info inwith" v-if="NewsInfo.Source">来源{{NewsInfo.Source}}</view>
					</view>
					
					<view class="ft_r"  v-if="NewsInfo.Type!=0">
						<view @click="CollectBtn(NewsInfo.Id,index)" :class="['txt_info sign',NewsInfo.IsCollect==1?'active':'']"></view>
					</view>
				</view>
				<view class="likenum" v-if="NewsInfo.LikeNum>0">被{{NewsInfo.LikeNum}}人赞过</view>
			</view>
		</view>
		<!-- 评价列表 -->
		<view class="comment-list uni-bg-white" v-if="hasData">
			<view class="listname">评价列表 
			<text style="font-weight: normal; margin-left: 10upx;" v-if="commenNum">({{commenNum}})</text>
			</view>
			<block v-for="(item,index) in datalist" :key="index">
				<reply-item :itemData='item' @Sendreplay="Sendreplay"></reply-item>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow" :tips="'暂无评论'"></noData>
		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" cursor-spacing="10" v-model="Comment" @click="showReplyBox" :placeholder="placeholder"/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
				</view>
			</view>
		</view>
		<playerMin></playerMin>
	</view>
</template>

<script>
	import {post,get,dateUtils,toLogin} from '@/common/util.js';
	import replyItem from '@/components/reply-item.vue'; //评论组件
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import share from '@/components/share/share.vue';
	import {editShareUrl} from '@/common/common'
	export default {
		components: {
			replyItem,
			noData,
			uniLoadMore,
			share
		},
		data() {
			return {
				userId: "",
				token: "",
				Findid:"",
				page:1,
				pageSize:10,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist:[],
				commenNum:0,
				IsShowReplyBox:false,//是否显示评论按钮
				placeholder:"写评论~",
				PCommentId:0,//上级评论id
				Comment:"",//评论内容
				PCommentname:"",//上级评论名
				NewsInfo:{},
				imgArr:[],
				videoContext:null,
				onplayHeight:0,//当前播放视频距离顶部的高度
				// #ifdef APP-PLUS
					isControls:true
				// #endif
				// #ifndef APP-PLUS
				isControls:false
				// #endif
				
			}
		},
		onLoad(e){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Findid=e.id;
			this.CommnetList();
			this.FindNewsInfo()
		},
		methods: {
			toRec(id){
				uni.navigateTo({
					url: '/pages/music/playMusic/playMusic?type=share&id='+id
				})
			},
			ControlsFn(){
				this.isControls=true;
			},
			pauseVideo(){
				this.$set(this.NewsInfo,'fixed',true);
			},
			playVideo(){
				let _this = this;
				this.$set(this.NewsInfo,'fixed',false);
			},
			playBtn(){
				let _this = this;
				_this.$set(_this.NewsInfo,'play',true);
				_this.$set(_this.NewsInfo,'fixed',false);
				setTimeout(()=>{
					_this.videoContext=uni.createVideoContext('video');
					_this.videoContext.play();
				},500)
			},
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
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
					"FkId": this.Findid
				});
				if(result.code==0){
					this.commenNum=result.count;
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
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					} 
				}
			},
			// 发表评论
			async CommentOperation(){
				let result = await post("Find/CommentOperation",{
					"UserId": this.userId,
					"Token": this.token,
					"FkId":this.Findid,
					"TypeInt":0,
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
					this.datalist=[];
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
			//推荐视频
			async FindNewsInfo(){
				let result = await post("Find/FindNewsInfo", {
					UserId:this.userId,
					Token:this.token,
					FindId: this.Findid
				});
				if (result.code === 0) {
					this.$set(result.data,'play',false);
					this.$set(result.data,'fixed',false);
					this.imgArr=result.data.ImgList.split(",");
					this.NewsInfo = result.data;
				}
			},
			//预览图片
			previewImg(imgurls,index){
				uni.previewImage({
					current:imgurls[index],
					urls: imgurls,
					indicator:imgurls.length
				});
			},
			//关注取消关注 followtype 1推荐视频用户
			async flow(id,index,followtype){
				let result = await post("Find/FollowOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId":id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(followtype==1){
						let isf=0;
						if(this.NewsInfo.IsFollow==0){
							_this.$set(this.NewsInfo,"IsFollow",1)
						}else{
							_this.$set(this.NewsInfo,"IsFollow",0)
						}
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
			//发现点赞
			async likeBtn(id,index){
				let result = await post("Find/FindlikeOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId":id
				});
				if(result.code==0){
					let _this=this;
					let num=0;
					uni.showToast({
						title: result.msg
					})
					if(this.NewsInfo.IsLike==0){
						this.$set(this.NewsInfo,"IsLike",1)
						this.$set(this.NewsInfo,"LikeNum",_this.NewsInfo.LikeNum++)
					}else{
						this.$set(this.NewsInfo,"IsLike",0)
						this.$set(this.NewsInfo,"LikeNum",_this.NewsInfo.LikeNum--)
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
			//发现收藏和取消收藏
			async CollectBtn(id,index){
				let result = await post("Find/CollectOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId":id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(this.NewsInfo.IsCollect==0){
						this.$set(this.NewsInfo,"IsCollect",1)
					}else{
						this.$set(this.NewsInfo,"IsCollect",0)
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
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.CommnetList();
			} else {
				this.loadingType = 2;
			}
		},
		onShareAppMessage: function(res) {
			if (res.from === 'button') {}
			return {
				title: '壹舞',
				path: editShareUrl('/pages/replylist/replylist?id='+this.Findid),
				success: function(res) {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../tabBar/index/style';
	// .maxpic video{
	// 	width: 100%;
	// 	height: 375px;
	// 	display: block;
	// 	position: absolute;
	// 	left: 0;
	// 	top: 0;
	// 	z-index: 2;
	// }
	.listname{
		font-size: 30upx;
		padding: 30upx 30upx 0;
		font-weight: bold;
	}
	.inwith{
		width: 350upx;
		overflow: hidden;
	}
	.image-section {
		margin-top: 20upx;
		margin-right: -12upx;
		margin-bottom: -12upx;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
		overflow: hidden;
	}
	
	.image-section .image-list {
		height: 230upx;
		width: 33.3%;
		float: left;
		padding-right: 12upx;
		margin-bottom: 12upx;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.image-section .image-list .img {
		width: 100%;
		height: 100%;
		border-radius: 6px;
	}
	
	.image-section .count {
		position: absolute;
		right: 30upx;
		bottom: 16upx;
		font-size: 40upx;
		color: #fff;
	}
	/*3列样式*/
	.Grid3.image-section {
		margin-top: 20upx;
		margin-right: -12upx;
		margin-bottom: -12upx;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
		overflow: hidden;
	}
	
	.Grid3.image-section .image-list {
		height: 230upx;
		width: 33.3%;
		float: left;
		padding-right: 12upx;
		margin-bottom: 12upx;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.Grid3.image-section.image-section-one {
		display: block;
	}
	
	.Grid3.image-section.image-section-one .image-list {
		width: 100%;
		height: auto;
		display: block;
	}
	
	.Grid3.image-section.image-section-one .image-list .img {
		display: block;
		height: auto;
	}
	.media-song{
		margin-top: 20upx;
		background: #f5f5f5;
		border-radius: 12upx;
		padding: 24upx;
		overflow: hidden;
		.box{
			align-items: center;
			text{padding-left: 20upx; 
			font-size: 30upx;}
			.songpic{
				position: relative;
				height: 120upx; width: 120upx;
				image{
					height: 100%; width: 100%;border-radius: 8upx;
					display: block;
				}
			}
			.isaudio{
					position: absolute;
					left: 50%;
					top: 50%;
					margin-top: -30upx;
					margin-left: -30upx;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 60upx;
					border-radius: 50%;
					height: 60upx;
					// background: rgba(221,25,109,.7);
					background: rgba(255,255,255,.6);
					color: #fff;
					z-index: 3;
					image{
						height: 80%; width: 800%;
					}
				}
		}
	}
</style>
