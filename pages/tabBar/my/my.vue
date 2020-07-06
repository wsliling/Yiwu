<template>
	<view class="pd15">
		<view class="header">
			<view class="editor" @click="tolink('/pages/member/editinfo/editinfo')">
				<image class="img30" src="@/static/my/editor.png"></image>
			</view>
			<view class="user">
				<view class="user-left" @click="tolink('/pages/member/editinfo/editinfo')">
					<view class="user-img">
						<view>
							<image v-if="memberInfo.Avatar" :src="memberInfo.Avatar" mode="aspectFill"></image>
							<image v-else src="@/static/my/user.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="user-name">
						<view class="name">{{memberInfo.NickName||'您未登录，请先登录'}}<image class="vip" src="@/static/V.png" v-if="memberInfo.IsPlus"></image></view>
						<view class="text">简介：{{memberInfo.Introduction||'您还未编辑简介，快去编辑吧！'}}</view>
					</view>
				</view>
				<view class="user-right">
					<image src="@/static/my/sign.png" mode="" v-if="memberInfo.IsShowV" @click="tolink('/pages/member/openVip/openVip')"></image>
				</view>
			</view>
		</view>
		<view class="info uni-mb10">
			<view class="item" @click="tolink('/pages/member/wallet/wallet')">
				<view>
					{{wallet[0]||0}}. <span>{{wallet[1]||0}}</span>
				</view>
				<span class="text">
					零钱(元)
				</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=0')">
				<view>{{memberInfo.FansNum||0}}</view>
				<span class="text">粉丝</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=1')">
				<view>{{memberInfo.LikeNum||0}}</view>
				<span class="text">被赞</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=2')">
				<view>{{memberInfo.FollowNum||0}}</view>
				<span class="text">关注</span>
			</view>
		</view>
		<view class="info1 uni-mb10">
			<view class="item" @click="tolink('/pages/member/myIncome/myIncome')">
				<image src="@/static/my/icon1.png" mode="aspectFit"></image>
				<view>我的收入<span>{{memberInfo.SumIncome||0}}</span></view>
				
			</view>
			<view class="item" @click="tolink('/pages/member/myIntegral/myIntegral')">
				<image src="@/static/my/icon2.png" mode="aspectFit"></image>
				<view>我的积分<span>{{memberInfo.SumScore||0}}</span></view>
				
			</view>
			<view class="item" @click="tolink('/pages/member/livebi/livebi')">
				<image src="@/static/my/icon3.png" mode="aspectFit"></image>
				<view>
					直播币
					<span>{{memberInfo.LiveStreamMoney||0}}</span>
				</view>
			</view>
			<view class="item" @click="tolink('/pages/member/order/order')">
				<image src="@/static/my/icon4.png" mode="aspectFit"></image>
				<view>我的订单
				<span>{{memberInfo.orderNum||0}}</span>
				</view>
			</view>
		</view>
		<view class="sevice">
			<view class="item" @click="tolink('/pages/member/cart/cart')">
				<view class="item-left">
					<image  src="@/static/my/icon5.png" mode="aspectFit"></image>
					<view>购物车</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="openAttestation">
				<view class="item-left">
					<image  src="@/static/my/icon6.png" mode="aspectFit"></image>
					<view>认证中心</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/myWorks/myWorks')">
				<view class="item-left">
					<image  src="@/static/my/icon7.png" mode="aspectFit"></image>
					<view>我的作品</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/myMusic/myMusic')">
				<view class="item-left">
					<image  src="@/static/my/icon8.png" mode="aspectFit"></image>
					<view>我的舞曲</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/collect/collect')">
				<view class="item-left">
					<image  src="@/static/my/icon9.png" mode="aspectFit"></image>
					<view>我的收藏</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/myBuy/myBuy')">
				<view class="item-left">
					<image  src="@/static/my/icon10.png" mode="aspectFit"></image>
					<view>我购买的</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/message/messageClass/messageClass')">
				<view class="item-left">
					<image  src="@/static/my/icon15.png" mode="aspectFit"></image>
					<view>我的消息</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"><span v-if="newscount>0" class="rag">{{newscount}}</span></view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon16.png" mode="aspectFit"></image>
					<view>分享app</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<!-- #endif -->
			<view class="item" @click="tolink('/pages/member/myDownload/myDownload')">
				<view class="item-left">
					<image  src="@/static/my/icon18.png" mode="aspectFit"></image>
					<view>我的下载</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/interflow/interflow')">
				<view class="item-left">
					<image  src="@/static/my/icon11.png" mode="aspectFit"></image>
					<view>加入官方交流</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/kefu/kefu')">
				<view class="item-left">
					<image  src="@/static/my/icon12.png" mode="aspectFit"></image>
					<view>客服服务</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/aboutUs/aboutUs')">
				<view class="item-left">
					<image  src="@/static/my/icon13.png" mode="aspectFit"></image>
					<view>关于我们</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/set/set')">
				<view class="item-left">
					<image  src="@/static/my/icon14.png" mode="aspectFit"></image>
					<view>设置</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				memberInfo:{},//用户信息
				wallet:[],
				newscount:0,
				myIncome:{},
			}
		},
		onLoad() {
			
		},
		onShow(){
			this.getMemberInfo();
			this.getMyIncome();
		},
		methods: {
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				})
				if (result.code === 0) {
					this.memberInfo = result.data;
					uni.setStorageSync("MemberId",result.data.Id)
					this.wallet=result.data.Wallet.split('.');
					this.$store.commit("update", {
					  Wallet:result.data.Wallet
					}); 
					 this.NewsCount();
				} else if (result.code === 2) {
					let _this = this;
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
			//跳转
			tolink(Url) {
				if(toLogin()){
					uni.navigateTo({
						url: Url
					})
				}
			},
			openAttestation(){
				let urlstr="";
				uni.showActionSheet({
					itemList: ['舞者认证', '机构认证', '店铺认证'],
					success: (e) => {
						console.log(e.tapIndex);
						if(e.tapIndex==0){
							urlstr="/pages/member/regDancer/regDancer";
						}else if(e.tapIndex==1){
							urlstr="/pages/member/regMechanism/regMechanism";
						}else if(e.tapIndex==2){
							urlstr="/pages/member/regShop/regShop";
						}
						uni.navigateTo({
							url: urlstr
						})
					}
				})
			},
			async NewsCount() {
				let result = await post("News/NewsCount", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				});
				if (result.code === 0) {
					this.newscount = result.count;
				} 
			},
			// 获取直播币
			async getMyIncome() {
				let result = await post("User/GetMyIncome", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				});
				if (result.code === 0) {
					this.myIncome = result.data;
				} 
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
