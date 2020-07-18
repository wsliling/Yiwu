<template>
	<view class="pd15">
		<!-- #ifdef APP-PLUS -->
		<view class="head" v-if="showHead" :style="{'padding-top':barHeight+'px'}">
			<view class="flex-between" style="height: 44px;">
				<view class="head_l" style="width: 44px; height: 44px;"></view>
				<view class="title" style="font-size: 16px; font-weight: bold;">我的</view>
				<view class="head_r editor pd15">
				</view>
			</view>
		</view>
		<!-- #endif -->
		<view class="header" :style="{'padding-top':barHeight+'px'}">
			<view class="user">
				<view class="user-left">
					<view class="user-img" @click="tolink('/pages/homepage/homepage?id='+memberInfo.Id)">
						<view>
							<image :src="memberInfo.Avatar||'http://yw.wtvxin.com/static/my/user.png'" mode="aspectFill"></image>
						</view>
					</view>
					<view class="user-name">
						<view class="name" v-if="memberInfo.NickName">
						    <view class="uni-ellipsis">{{memberInfo.NickName}}</view>
							<image class="vip" src="http://yw.wtvxin.com/static/V.png" v-if="memberInfo.IsPlus" 
								@click.stop="navigate('member/openVip/openVip',{
									avatar:memberInfo.Avatar,
									name:memberInfo.NickName,
									endTime:memberInfo.PlusEndTime,
									isVIP:memberInfo.IsPlus
								},true)">
							</image>
						</view>
						<view class="name" v-else style="margin-top: 28upx;">您未登录，请先登录</view>
						<block v-if="isLogin">
							<view class="btns clear uni-mt10">
								<view class="btn" @click="tolink('/pages/member/editinfo/editinfo')"><image class="img30" src="http://yw.wtvxin.com/static/my/editor.png"></image>编辑资料</view>
								<view class="btn" @click="tolink('/pages/member/addUser/addUser')"><image class="img30" src="http://yw.wtvxin.com/static/my/add_min.png"></image>关注</view>
							</view>
							<view class="text uni-mt10"><label v-if="!memberInfo.Introduction">简介：</label>{{memberInfo.Introduction||'您还未编辑简介，快去编辑吧！'}}</view>
							<view class="icos flex-center-start uni-mt10">
								<text class="ico" v-if="memberInfo.Age"><text class="iconfont icon-zh1" style="font-size: 24upx; margin-right: 4upx;"></text>{{memberInfo.Age}}</text>
								<text class="ico" v-if="memberInfo.Area">{{memberInfo.Area}}</text>
								<text class="ico" v-if="memberInfo.UserDefined">{{memberInfo.UserDefined}}</text>
								<text class="ico" @click="tolink('/pages/member/editinfo/editinfo')">+自定义</text>
							</view>
						</block>
					</view>
				</view>
				<view class="user-right">
					<image src="http://yw.wtvxin.com/static/my/sign.png" mode="" v-if="memberInfo.IsShowV" @click.stop="navigate('member/openVip/openVip',{
							avatar:memberInfo.Avatar,
							name:memberInfo.NickName,
							endTime:memberInfo.PlusEndTime
						},true)">
					</image>
				</view>
			</view>
		</view>
		<view class="info uni-mb10">
			<view class="item" @click="tolink('/pages/member/myAssets/myAssets')">
				<view>
					{{wallet[0]||0}}. <span>{{wallet[1]||0}}</span>
				</view>
				<span class="text">
					钱包(元)
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
		<view class="sevice">
			<view class="item" @click="tolink('/pages/member/cart/cart')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon5.png" mode="aspectFit"></image>
					<view>购物车</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="openAttestation">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon6.png" mode="aspectFit"></image>
					<view>认证中心</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<uni-popup type="bottom" ref="ac">
				<div class="ac">
					<div class="list1" @click="$refs.ac.close()">
						<div class="item1" @click="navigate('member/regDancer/regDancer')">舞者认证</div>
						<div class="item1" @click="navigate('member/regMechanism/regMechanism')">机构认证</div>
						<div class="item1" @click="navigate('member/regShop/regShop')">店铺认证</div>
					</div>
					<div class="cancel" @click="$refs.ac.close()">取消</div>
				</div>
			</uni-popup>
			<view class="item" @click="tolink('/pages/member/myWorks/myWorks')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon7.png" mode="aspectFit"></image>
					<view>我的作品</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/myMusic/myMusic')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon8.png" mode="aspectFit"></image>
					<view>我的舞曲</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/collect/collect')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon9.png" mode="aspectFit"></image>
					<view>我的收藏</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/ordertype/ordertype')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon10.png" mode="aspectFit"></image>
					<view>订单列表</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/message/messageClass/messageClass')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon15.png" mode="aspectFit"></image>
					<view>我的消息</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"><span v-if="newscount>0" class="rag">{{newscount}}</span></view>
			</view>
			<view class="item" @click="tolink('/pages/member/team/team')">
				<view class="item-left">
					<image  src="/static/icons/team.png" mode="aspectFit"></image>
					<view>我的团队</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/share/share')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon16.png" mode="aspectFit"></image>
					<view>分享</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<!-- 我的下载先不做，苹果的下载和多端下载很难实现 -->
			<view class="item" @click="tolink('/pages/member/myDownload/myDownload')" v-if="false">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon18.png" mode="aspectFit"></image>
					<view>我的下载</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/interflow/interflow')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon11.png" mode="aspectFit"></image>
					<view>加入官方交流</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/kefu/kefu')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon12.png" mode="aspectFit"></image>
					<view>客服服务</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/aboutUs/aboutUs')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon13.png" mode="aspectFit"></image>
					<view>关于我们</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item" @click="tolink('/pages/member/set/set')">
				<view class="item-left">
					<image  src="http://yw.wtvxin.com/static/my/icon14.png" mode="aspectFit"></image>
					<view>设置</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	export default {
		data() {
			return {
				barHeight:0,
				navigate,
				memberInfo:{},//用户信息
				wallet:[],
				newscount:0,
				myIncome:{},
				showHead:false,
				isLogin:false
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
		},
		onShow(){
			this.getMemberInfo();
			//this.getMyIncome();
		},
		methods: {
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				})
				if (result.code === 0) {
					this.isLogin=true;
					this.memberInfo = result.data;
					uni.setStorageSync("MemberId",result.data.Id)
					this.wallet=result.data.Wallet.split('.');
					this.$store.commit("update", {
					  Wallet:result.data.Wallet
					}); 
					 this.NewsCount();
				} else if (result.code === 2) {
					this.isLogin=false;
					uni.getStorageSync("userId","")
					uni.getStorageSync("token","")
					this.memberInfo={};
					this.newscount=0;
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
				this.$refs.ac.open();
				return;
				// let urlstr="";
				// uni.showActionSheet({
				// 	itemList: ['舞者认证', '机构认证', '店铺认证'],
				// 	success: (e) => {
				// 		console.log(e.tapIndex);
				// 		if(e.tapIndex==0){
				// 			urlstr="/pages/member/regDancer/regDancer";
				// 		}else if(e.tapIndex==1){
				// 			urlstr="/pages/member/regMechanism/regMechanism";
				// 		}else if(e.tapIndex==2){
				// 			urlstr="/pages/member/regShop/regShop";
				// 		}
				// 		uni.navigateTo({
				// 			url: urlstr
				// 		})
				// 	}
				// })
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
		},
		onPageScroll(e){
			if(e.scrollTop>100){
				this.showHead=true;
			}else{
				this.showHead=false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
