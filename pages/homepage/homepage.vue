<template>
	<view>
		<view class="pd15 heade">
			<view class="user">
				<image class="left" :src="PersonInfo.Avatar||'/static/default.png'"></image>
				<view class="right">
					<view class="name">
						<view>{{PersonInfo.NickName}}</view>
						<image v-if="PersonInfo.IsPlus==1" src="@/static/V.png" mode="widthFix"></image>
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
			<view :style="'width:'+tabWidth+'%'" v-for="(tab,index) in tab" :key="index" :class="['item',tabId==tab.id ? 'active' : '']" @click="tapTab(tab.id,index)">{{tab.taptitle}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'upx'"></view>
		</scroll-view>
		<view class="tabCon">
			<view class="profile item-box"  v-if="tabId==0">
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
			<view class="play-box item-box"  v-if="tabId==1">
				<view class="item" v-for="(item,index1) in 9 " :key="index1">
					<image src="@/static/music/music-item.png" ></image>
				</view>
			</view>
			<view class="music-box item-box"  v-if="tabId==2">
				<view class="item" v-for="(item,index1) in 9 " :key="index1">
					<image src="@/static/music/music-item.png" ></image>
				</view>
			</view>
			<view class="pic-box" v-if="tabId==3">
				<block v-for="(item,index) in PersonInfo.PicList" :key="index">
					
				</block>
			</view>
			<view class="product-box item-box"  v-if="tabId==4">
				<view class="item" v-for="(item,index4) in 2" :key="index4">
					<image class="img" src="@/static/of/banner.jpg"></image>
					<view class="product">
						<view class="list" v-for="(item1,index41) in 3" :key="index41">
							<image src="@/static/of/pro1.jpg" mode="widthFix"></image>
							<view>一舞拉丁黑色4654646546</view>
							<span>￥79.99</span>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 100upx;"></view>
		<view class="bottom-box" v-if="PersonInfo.IsMy==0">
			<view class="box flex-between">
				<view @click="flow">
					<image src="@/static/attention.png"></image>
					<span>{{PersonInfo.IsFollow==1?'已关注':'关注'}}</span>
				</view>
				<view @click="tolink('/pages/chat/chat?id='+memberId,'login')">
					<image src="@/static/chat1.png"></image>
					<span>极速联系</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {post,get,toLogin} from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: "",
			token: "",
			scrollLeft: 0,
			tabIndex:0,
			tabId:0,
			memberId:"",
			PersonInfo:{},
			tabWidth:0,
			tabStyle:0,
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
			]
		};
	},
	 onLoad(){
		 this.userId = uni.getStorageSync("userId");
		 this.token = uni.getStorageSync("token");
		 this.tabWidth=(100/this.tab.length);
		 this.leftscoll();
	 },
	 onShow() {
	 	this.memberId=this.$mp.query.id;
		this.GetPersonInfo();
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
		 tapTab(id,index) { //点击tab-bar
		 	if (this.tabId === id) {
		 		return false;
		 	} else {
		 		this.tabIndex = index;
				this.tabId=id;
				this.leftscoll();
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
				if(!result.data.JiGou){
					this.tab.map((item,i)=>{
						if(item.id==0){
							this.tab.splice(i,1)
						}
					})
				}
				if(result.data.ProductList.length==0){
					this.tab.map((item,i)=>{
						if(item.id==4){
							this.tab.splice(i,1)
						}
					})
				}
				this.tabWidth=(100/this.tab.length);
				this.leftscoll();
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
		 //链接详情页
		 goDetail(e) {
		 	if(e.artType==0){//用户发布详情
		 		// uni.navigateTo({
		 		// 	url: '/pages/Article/artDetail/artDetail?id='+e.id
		 		// })
		 	}else{//资讯详情、店铺
		 		// uni.navigateTo({
		 		// 	url: '/pages/Article/NewsDetail/NewsDetail?id='+e.id
		 		// })
		 	}
		 },
		 //预览图片
		 previewImg(obj){
		 	uni.previewImage({
		 		current:obj.imgurls[obj.index],
		 		urls: obj.imgurls,
		 		indicator:obj.imgurls.length
		 	});
		 },
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
