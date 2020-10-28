<template>
	<view class="list-cell" v-if="isdata">
		<view class="media-list">
			<view class="media-hd" v-if="dataitem.FindType!=2">
				<view class="media-author" @click="gotoPensonal">
					<image class="img" v-if="dataitem.Avatar" :src="dataitem.Avatar" mode="aspectFill"></image>
					<image class="img" v-else-if="dataitem.FindType==2" src="http://m.dance-one.com/static/logo.png" mode="aspectFill"></image>
					<image class="img" v-else src="http://m.dance-one.com/static/default.png"></image>
				</view>
				<view class="author-name uni-ellipsis" @click="gotoPensonal">
					<block v-if="dataitem.NickName">{{dataitem.NickName}}</block>
					<block v-else-if="dataitem.FindType==1">店铺动态</block>
					<block v-else-if="dataitem.FindType==2">壹舞</block>
				</view>
				<block v-if="dataitem.IsMy==0&&dataitem.FindType!=2&&isBtn==true">
					<view :class="['flow-btn',dataitem.IsFollow==0?'':'flowed']" @click="flow(dataitem.FindType,dataitem.ShopId,dataitem.MemberId)">{{dataitem.IsFollow==0?'关注':'已关注'}}</view>
				</block>
				<view v-if="dataitem.IsMy==1&&isdel==true" class="delbtn iconfont icon-ziyuanxhdpi fr" @click="Del(dataitem.Id)"></view>
			</view>
			<view @click="bindClick(dataitem.FindType,dataitem.Id)">
				<view class="media-title" v-if="dataitem.Title">{{dataitem.Title}}</view>
				<view class="media-title" v-else-if="dataitem.ContentDetails">{{dataitem.ContentDetails}}</view>
				<!-- 一排两列 -->
				<block v-if="Grid==='2'">
					<view v-if="imgArr" :class="['image-section',imgArr.length==1?'image-section-one':'',imgArr.length==2?'image-section-two':'',imgArr.length==3?'image-section-three':'',imgArr.length>3?'image-section-four':'']">
						<view class="image-list" v-if="imgArr&&i<4" v-for="(source, i) in imgArr" :key="i" >
							<image class="img" :src="source" :mode="imgArr.length==1?'widthFix':'aspectFill'" @click.stop="previewImg(imgArr,i)"/>
						</view>
						<view v-if="imgArr.length>4" class="count">{{imgArr.length}}</view>
					</view>
				</block>
				<!-- 一排3列 -->
				<block v-else>
					<view v-if="imgArr" :class="['image-section Grid3',imgArr.length==1?'image-section-one':'']">
						<view class="image-list" v-if="imgArr&&i<3" v-for="(source, i) in imgArr" :key="i" >
							<image class="img" :src="source" :mode="imgArr.length==1?'widthFix':'aspectFill'" @click.stop="previewImg(imgArr,i)"/>
						</view>
						<view v-if="imgArr.length>3" class="count">{{imgArr.length}}</view>
					</view>
				</block>
			
			<view :class="['media-song',playdetail.id==dataitem.MusicData.Id&&isplayactive?'active':'']" v-if="dataitem.MusicData" @click.stop="toRec(dataitem.MusicData.Id)">
				<view class="box flex">
					<view class="songpic">
						<view class="isaudio">
							<image src="http://m.dance-one.com/static/play2.png" mode="widthFix"></image>
						</view>
						<image :src="dataitem.MusicData.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
					</view>
					<text class="uni-ellipsis2">{{dataitem.MusicData.Name}}</text>
				</view>
			</view>
			<view class="media-location" v-if="dataitem.Location">
				<text class="info-text iconfont icon-shouhuodizhi">{{dataitem.Location}}</text>
			</view>
			<view class="media-foot">
				<view class="media-info">
					<text class="info-text">{{dataitem.AddtimeStr}}</text>
				</view>
				<view class="media-info-r">
					<text class="info-text"><text class="iconfont icon-eye"></text>{{dataitem.BrowseNum}}</text>
					<text class="info-text"><text class="iconfont icon-pinglun1"></text>{{dataitem.CommentNum}}</text>
					<text class="info-text" @click.stop="like(dataitem.Id)"><text :class="['iconfont',dataitem.IsLike==1?'icon-zan1':'icon-zan']"></text>{{dataitem.LikeNum}}</text>
				</view>
			</view>
			</view>
		</view>
	</view>
</template>
<script>
    import {host,post,toLogin} from '@/common/util.js';
	import {mapGetters} from 'vuex'
	export default {
		props: {
			Grid:{
				type:String,
				default:'2'
			},
			isBtn:{
				type:Boolean,
				default:true
			},
			isdel:{
				type:Boolean,
				default:false
			},
			datajson: {
				type: Object,
				default: function(e) {
					return {
						
					}
				}
			}
		},
		created(){
			// this.userId = uni.getStorageSync("userId");
			// this.token = uni.getStorageSync("token");
			this.dataitem=this.datajson;
			
		},
		data(){
			return{
				// userId: "",
				// token: "",
				dataitem:{},
				isdata:true,
			}
		},
		computed: {
			...mapGetters(['isplayingmusic','playdetail','isplayactive']),
			imgArr() {
				if(this.dataitem.ImgList){
					return this.dataitem.ImgList.split(",");
				}
			}
		},
		onLoad(){
		},
		methods: {
			toRec(id){
				uni.navigateTo({
					url: '/pages/music/playMusic/playMusic?type=share&id='+id
				})
			},
			bindClick(artType,id) {
				this.$emit('click',{artType,id});
			},
			Del(id){
				//this.$emit('Del',id);
				let _this=this;
				//#ifndef APP-PLUS
				uni.showModal({
					content: "确定删除该条动态？",
					confirmColor:"#DD196D",
					success(res) {
						if (res.confirm) {
							_this.DelFind(id);
						} else if (res.cancel) {
						}
					}
				});
				// #endif
				// #ifdef APP-PLUS
				this.$showModal({
					content: "确定删除该条动态？",
				}).then(res=>{
					_this.DelFind(id);
					//确认
				  }).catch(res=>{
					//取消
				  })
				// #endif
				
			},
			async DelFind(id){
				let result = await post("Find/DelFind", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token"),
					"FindId": id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					this.isdata=false;
				}else{
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			gotoPensonal() {
				if(this.dataitem.FindType==0){//指定用户个人主页
					uni.navigateTo({
						url: '/pages/homepage/homepage?id='+this.dataitem.MemberId
					})	
				}
				if(this.dataitem.FindType==1){//指定店铺主页
					uni.navigateTo({
						url: '/pages/store/storeIndex/storeIndex?shopId='+this.dataitem.ShopId
					})	
				}
			},
			//全部评论
			gotocommentlist(){
				uni.navigateTo({
					url:'/pages/Article/replylist/replylist?id='+this.dataitem.Id
				})
			},
			//预览图片
			previewImg(imgurls,index){
				this.$emit('previewImg',{imgurls,index});
			},
			//点赞/取消点赞
			async like(id){
				let result = await post("Find/FindlikeOperation", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token"),
					"FindId": id,
					"TypeStatu":0
				});
				if (result.code === 0) {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					if(this.dataitem.IsLike==1){
						this.dataitem.IsLike=0;
						this.dataitem.LikeNum--;
					}else{
						this.dataitem.IsLike=1;
						this.dataitem.LikeNum++;
					}
				}else if (result.code === 2) {
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
			async flow(FindType,ShopId,MemberId){
				let result;
				if(FindType==0){
					result = await post("Find/FollowOperation", {
						"UserId": uni.getStorageSync("userId"),
						"Token": uni.getStorageSync("token"),
						"ToMemberId":MemberId
					});
				}else if(FindType==1){
					result = await post("Goods/ShopCollection", {
						"UserId": uni.getStorageSync("userId"),
						"Token": uni.getStorageSync("token"),
						"ShopId":ShopId
					});
				}
				if (result.code === 0){
					uni.showToast({
						title: result.msg
					})
					if(this.dataitem.IsFollow==0){
						this.dataitem.IsFollow=1;
					}else{
						this.dataitem.IsFollow=0;
					}
				}else if(result.code===2){
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
				}else{
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
				
			},
			
		}
	}
</script>

<style scoped lang="scss">
	view {
		box-sizing: border-box;
	}
	.delbtn{
		height: 80upx;
		line-height: 80upx;
		padding: 0 10upx;
	}
	.list-cell {
		width: 750upx;
		padding: 0 20upx;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-list {
		flex: 1;
		flex-direction: column;
		border-bottom-width: 1upx;
		border-bottom-style: solid;
		border-bottom-color: #eee;
		padding: 20upx 0;
	}
	/* #ifndef MP-WEIXIN */
	.list-cell:last-child .media-list {
		border-bottom: none;
	}
	/* #endif */
	media-list:last-child .media-list{
		border-bottom: none;
	}
	.media-hd {
		height: 80upx;
		margin-bottom: 10upx;
	}

	.media-hd .media-author {
		float: left;
		height: 80upx;
		width: 80upx;
	}

	.media-hd .media-author .img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.media-hd .author-name {
		font-size: 30upx;
		color: #333;
		float: left;
		max-width: 60%;
		margin-left: 20upx;
		line-height: 80upx;
	}

	.media-hd .flow-btn {
		float: right;
		margin-top: 10upx;
		color: #dd196d;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 100px;
		width: 120upx;
		text-align: center;
	}

	.media-hd .flow-btn.flowed {
		background: #fff;
		color: #dd196d;
	}

	.media-title {
		font-size: 32upx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		line-height: 1.5;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.image-section {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
		position: relative;
	}

	.image-section .image-list{
		height: 350upx;
	}
	.image-section .image-list .img{
		width: 100%;
		height: 100%;
		border-radius: 6px;
	}
	.image-section-one {
		display: block;
	}
	.image-section-one .image-list {
		width: 100%;
		height: auto;
		display: block;
		max-height: 70vh;
		overflow-y: hidden;
		border-radius: 6px;
	}
	.image-section-one .image-list .img{display: block; height: auto;
	 
	 }
	.image-section-two,
	.image-section-three,
	.image-section-four {
		margin-right: -12upx;
		margin-bottom: -12upx;
		overflow: hidden;
	}
	.image-section-two .image-list,
	.image-section-four .image-list,
	.image-section-three .image-list {
		width: 50%;
		float: left;
		padding-right: 12upx;
		margin-bottom: 12upx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.image-section-three .image-list:first-child {
		width: 100%;
	}

	.image-section .count {
		position: absolute;
		right: 30upx;
		bottom: 16upx;
		font-size: 40upx;
		color: #fff;
	}
	.media-foot {
		display: flex;
		flex-direction: row;
		margin-top: 20upx;
		justify-content: space-between;
	}
	.media-info {
		display: flex;
		flex-direction: row;
	}

	.info-text {
		display: flex;
		color: #999999;
		font-size: 24upx;
	}
	.media-location{ margin-top: 20upx;}
	.media-location .icon-shouhuodizhi{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.media-location .icon-shouhuodizhi:before{ color: #bbb; font-size: 28upx; line-height: 1; margin-right: 8upx; }
	.media-info-r{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	.media-info-r .info-text{ margin-left: 20upx;
	    display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	.media-info-r .info-text .iconfont{
		margin-right: 8upx;
	}
	.media-info-r .info-text .iconfont.icon-zan1{
		color: #dd196d;
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
	.Grid3.image-section .image-list{
		height: 230upx;
		width: 33.3%;
		float: left;
		padding-right: 12upx;
		margin-bottom: 12upx;
		box-sizing: border-box;
		overflow: hidden;
	}
	.Grid3.image-section.image-section-one{
		display: block;
	}
	.Grid3.image-section.image-section-one .image-list{
		width: 100%;
		height: auto;
		display: block;
	}
	.Grid3.image-section.image-section-one .image-list .img{display: block; height: auto;}
	.media-song{
		margin-top: 20upx;
		background: #f5f5f5;
		border-radius: 12upx;
		padding: 24upx;
		overflow: hidden;
		&.active{
			background-color: #f9e9ee;
			text{
				color: $primary;
			}
		}
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
