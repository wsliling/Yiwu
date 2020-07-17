<template>
	<view>
		<view class="pd15 heade">
			<view class="user">
				<view class="left">
					<image  :src="PersonInfo.Avatar||'http://yw.wtvxin.com/static/default.png'"></image>
					<view class="islive" v-if="PersonInfo.Flag" @click="navigate('liveplay/live',{id:memberId})">
						<view class="line line1"></view>
						<view class="line line2"></view>
						<view class="line line3"></view>
						<view class="txt">直播</view>
					</view>
				</view>
				<view class="right">
					<view class="name">
						<view>{{PersonInfo.NickName}}</view>
						<image v-if="PersonInfo.IsPlus==1" src="http://yw.wtvxin.com/static/V.png" mode="widthFix"></image>
					</view>
					<view class="list">
						<view class="item">
							<view>{{PersonInfo.FansNum}}</view>
							<span>粉丝</span>
						</view>
						<view class="item">
							<view>{{PersonInfo.LikeNum}}</view>
							<span>被赞</span>
						</view>
						<view class="item">
							<view>{{PersonInfo.AttentionNum}}</view>
							<span>关注</span>
						</view>
					</view>
				</view>
			</view>
			<view class="text">{{PersonInfo.Introduction}}</view>
		</view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<block v-for="(tab,index) in tab" :key="index" >
				<view :style="'width:'+tabWidth+'%'" :class="['item',tabId==tab.id ? 'active' : '']" @click="tapTab(tab.id,index)">{{tab.taptitle}}
				</view>
			</block>
			<!-- <view class="bb_line" :style="'left:'+tabStyle+'upx'"></view> -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="bb_line" :style="{'left':tabStyle+'upx'}"></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="bb_line" :style="{'left':tabStyle+'rpx'}"></view>
			<!-- #endif -->
		</scroll-view>
		<view class="tabCon">
			<view class="profile item-box"  v-if="tabId==0&&PersonInfo.IsJiGou==1">
				<view class="profile-center">
					<image v-if="PersonInfo.JiGou.PicImg" :src="PersonInfo.JiGou.PicImg"></image>
					<view class="remark uni-mb10">
						{{PersonInfo.JiGou.Remark}}
					</view>
					<view class="profile-txt">
						<view>机构名称：</view>
						<span>{{PersonInfo.JiGou.JiGouName}}</span>
					</view>
					<view class="profile-txt">
						<view>地址：</view>
						<span>{{PersonInfo.JiGou.Address}}</span>
					</view>
					<view class="profile-txt">
						<view>联系方式：</view>
						<span>{{PersonInfo.JiGou.Mobile}}</span>
					</view>
				</view>
			</view>
			<view class="play-box item-box"  v-if="tabId==1&&hasData">
				<view class="item" v-for="(item,index) in datalist" :key="index" @click="tovideo(item.Type,item.Id)">
					<image :src="item.Logo" mode="aspectFill"></image>
					<view class="playbtn"></view>
					<view class="tag" v-if="item.Type==1">课程</view>
				</view>
			</view>
			<view class="music-box item-box"  v-if="tabId==2&&hasData">
				<view class="item audiobox" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
					<view :class="['islive',playID==item.Id&&playIDtype==1?'active':'']" @click.stop="playBtn(index,item.Id,item.IsShowBuy)">
						<image :src="(playID==item.Id&&playIDtype==1)?'http://yw.wtvxin.com/static/play3.png':'http://yw.wtvxin.com/static/play2.png'" mode="widthFix"></image>
					</view>
					<image :src="item.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image>
				</view>
			</view>
			<view class="play-box" v-if="tabId==3&&hasData">
				<view class="item" v-for="(item,index) in datalist" :key="index">
					<image :src="item.Logo" @click="previewImg(index)"></image>
				</view>
			</view>
			<view class="product-box item-box"  v-if="tabId==4&&hasData">
				<view class="product">
					<view class="wu-item" v-for="(val,key) in datalist" :key="key" @click="navigate('shopSon/product/productDetails',{proId:val.Id})">
						<image :src="val.PicImg" mode="aspectFill"></image>
						<view class="wu-tet">
							<view class="wu-name">{{val.Name}}</view>
							<view class="wu-price">￥{{val.Price}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData">
				<uni-load-more :loadingType="loadingType"></uni-load-more>
			</view>
			<noData :isShow="noDataIsShow"></noData>
		</view>
		<view style="height: 100upx;"></view>
		<view class="bottom-box" v-if="PersonInfo.IsMy==0">
			<view class="box flex-between">
				<view @click="flow">
					<image src="http://yw.wtvxin.com/static/attention.png"></image>
					<span>{{PersonInfo.IsFollow==1?'已关注':'关注'}}</span>
				</view>
				<view @click="tolink('/pages/chat/chat?id='+memberId,'login')">
					<image src="http://yw.wtvxin.com/static/chat1.png"></image>
					<span>极速联系</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {post,get,toLogin,navigate,audio,playMusic} from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			navigate,
			userId: "",
			token: "",
			scrollLeft: 0,
			tabIndex:0,
			tabId:0,
			memberId:"",
			PersonInfo:{},
			tabWidth:0,
			tabStyle:0,
			page:1,
			pageSize:12,
			noDataIsShow: false,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			datalist:[],
			imgurls:[],
			tab: [
				{
					id: 0,
					taptitle: '简介'
				},
				{
					id: 1,
					taptitle: '视频'
				},
				{
					id: 2,
					taptitle: '舞曲'
				},
				{
					id: 3,
					taptitle: '图片'
				},
				{
					id: 4,
					taptitle: '产品'
				}
			],
			playID:"",//当前播放
			playIDtype:0,//当前播放舞曲的状态0：暂停 1：播放中
		};
	},
	 onLoad(e){
		 this.userId = uni.getStorageSync("userId");
		 this.token = uni.getStorageSync("token");
		 this.tabWidth=(100/this.tab.length);
		 this.leftscoll(); 
	 	this.memberId=e.id;
		this.GetPersonInfo();
	 },
	 onShow() {
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.playID=uni.getStorageSync("playID");
		this.playIDtype=uni.getStorageSync("playIDtype");
	 },
	 methods:{
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
		tovideo(type,id){
			if(type==1){
				uni.navigateTo({
					url: '/pages/video/videoDetails/videoDetails?id='+id
				})
			}else{
				uni.navigateTo({
					url: '/pages/replylist/replylist?id='+id
				})
			}
		},
		tapTab(id,index) { //点击tab-bar
		 	if (this.tabId === id) {
		 		return false;
		 	} else {
		 		this.tabIndex = index;
				this.tabId=id;
				this.hasData=false;
				this.noDataIsShow=false;
				this.page=1;
				this.leftscoll();
				if(this.tabId!=0){
					this.GetUserData();
				}
		 	}
		},
		leftscoll(){
			this.tabStyle=((750/this.tab.length)*this.tabIndex)+(((750/this.tab.length)-68)/2); 
		},
		 //获取个人主页
		 async GetPersonInfo(){
			 let result = await post("User/GetPersonInfo", {
			 	UserId:this.userId,
			 	Token:this.token,
			 	MemberId:this.memberId
			 });
			 if(result.code==0){
			 	this.PersonInfo=result.data;
				uni.setNavigationBarTitle({
					title: result.data.IsMy==1?'我的主页':'TA的主页'
				})
				if(result.data.IsJiGou==0){
					this.tab.map((item,i)=>{
						if(item.id==0){
							this.tab.splice(i,1)
						}
					})
				}
				if(result.data.IsShop==0){
					this.tab.map((item,i)=>{
						if(item.id==4){
							this.tab.splice(i,1)
						}
					})
				}
				this.tabWidth=(100/this.tab.length);
				this.leftscoll();
				this.tabId=this.tab[0].id;
				if(this.tabId!=0){
					this.GetUserData();
				}
				
			 }
		 },
		 //关注取消关注 
		async flow(){
		 	let result = await post("Find/FollowOperation", {
		 		"UserId": this.userId,
		 		"Token": this.token,
		 		"ToMemberId":this.memberId
		 	});
		 	if(result.code==0){
		 		let _this=this;
		 		uni.showToast({
		 			title: result.msg
		 		})
		 		if(this.PersonInfo.IsFollow==0){
		 			this.$set(this.PersonInfo,"IsFollow",1)
		 		}else{
		 			this.$set(this.PersonInfo,"IsFollow",0)
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
		 //获取用户关联数据
		 async GetUserData(){
			 let url="";
			 if(this.tabId==1){
				url= "User/GetUserVideo";
			 }else if(this.tabId==2){
				url= "User/GetUserDancermusic";
			 }else if(this.tabId==3){
				url= "User/GetUserPic"; 
			 }else if(this.tabId==4){
				url= "User/GetUserProduct";  
			 }
			 let result =await post(url,{
				 "UserId": this.userId,
				 "Token": this.token,
				 "MemberId":this.memberId,
				 "page": this.page,
				 "pageSize": this.pageSize
			 });
			 if(result.code==0){
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					if(this.tabId==3){
						let picArr=[];
						result.data.forEach(function(item){
							picArr.push(item.Logo)
						})
						this.imgurls=picArr;
					}
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
		toplaylist(id,index){
			uni.setStorageSync("musicList",this.datalist)
			uni.navigateTo({
				url:'/pages/music/playMusic/playMusic?nowIndex='+index+'&id='+id
			})	
		},
		playBtn(index,id,isbuy){
			if(isbuy==0){
				uni.setStorageSync("musicList",this.datalist)
				if(this.playID==id){
					this.playID="";
				}else{
					this.playID=id;
				}
				playMusic(index,id)
				this.playID=uni.getStorageSync("playID")
				this.playIDtype=uni.getStorageSync("playIDtype")
			}else{
				uni.showModal({
					content: "该舞曲需付费,去付费？",
					success(res) {
						if (res.confirm) {
							if(toLogin()){
								let buyInfo={
									PicImg:_this.datalist[index].PicImg,
									name:_this.datalist[index].Name,
									price:_this.datalist[index].Price
								}
								uni.setStorageSync('buyInfo', buyInfo);
								uni.navigateTo({
									url:'/pages/pay2/pay2?type=1&id='+id
								})
							}
						} else if (res.cancel) {
						}
					}
				});
			}
		},
		//预览图片
		previewImg(index){
			let _this=this;
		 	uni.previewImage({
		 		current:_this.imgurls[index],
		 		urls: _this.imgurls,
		 		indicator:_this.imgurls.length
		 	});
		},
	 },
	 // 上拉加载
	 onReachBottom: function() {
	 	if (this.isLoad) {
	 		this.loadingType = 1;
	 		this.page++;
	 		this.GetUserData();
	 	} else {
	 		this.loadingType = 2;
	 	}
	 }
};
</script>

<style lang="scss">
@import './style.scss';

.index-swiper-tab{
	border-bottom: 1upx solid #ededed;
}
swiper{
	/* #ifdef MP-WEIXIN||APP-PLUS */
	height: calc(100vh - 80px);
	/* #endif */
	/* #ifdef H5 */
	height: calc(100vh - 130px);
	/* #endif */
}
</style>
