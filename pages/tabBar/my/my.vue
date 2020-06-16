<template>
	<view class="pd15">
		<view class="header">
			<view class="editor" @click="tolink('/pages/member/editinfo/editinfo')">
				<image class="img30" src="@/static/my/editor.png"></image>
			</view>
			<view class="user">
				<view class="user-left">
					<view class="user-img">
						<view>
							<image src="@/static/my/user.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="user-name">
						<view class="name">ladingwu</view>
						<view class="text">简介：一个热爱拉丁舞的爱好...</view>
					</view>
				</view>
				<view class="user-right" @click="tolink('/pages/member/openVip/openVip')">
					<image src="@/static/my/sign.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="info uni-mb10">
			<view class="item" @click="tolink('/pages/member/wallet/wallet')">
				<view>
					896. <span>26</span>
				</view>
				<span class="text">
					零钱(元)
				</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=0')">
				<view>25</view>
				<span class="text">粉丝</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=1')">
				<view>628</view>
				<span class="text">被赞</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=2')">
				<view>221</view>
				<span class="text">关注</span>
			</view>
		</view>
		<view class="info1 uni-mb10">
			<view class="item" @click="tolink('/pages/member/myIncome/myIncome')">
				<image src="@/static/my/icon1.png" mode="aspectFit"></image>
				<view>我的收入<span>24.6w</span></view>
				
			</view>
			<view class="item" @click="tolink('/pages/member/myIntegral/myIntegral')">
				<image src="@/static/my/icon2.png" mode="aspectFit"></image>
				<view>我的积分<span>890</span></view>
				
			</view>
			<view class="item" @click="tolink('/pages/member/livebi/livebi')">
				<image src="@/static/my/icon3.png" mode="aspectFit"></image>
				<view>
					直播币
					<span>4567</span>
				</view>
			</view>
			<view class="item" @click="tolink('/pages/member/order/order')">
				<image src="@/static/my/icon4.png" mode="aspectFit"></image>
				<view>我的订单
				<span>12</span>
				</view>
			</view>
		</view>
		<view class="sevice">
			<view class="item" @click="tolink('/pages/cart/cart')">
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
					<view>我上传的舞曲</view>
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
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon15.png" mode="aspectFit"></image>
					<view>我的消息</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon16.png" mode="aspectFit"></image>
					<view>分享app</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon17.png" mode="aspectFit"></image>
					<view>产品评价</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon11.png" mode="aspectFit"></image>
					<view>加入官方交流</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item">
				<view class="item-left">
					<image  src="@/static/my/icon12.png" mode="aspectFit"></image>
					<view>客服服务</view>
				</view>
				<view class="arrowr uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item">
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
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onShow(){
			
		},
		methods: {
			//跳转
			tolink(Url) {
				//if(toLogin()){
					uni.navigateTo({
						url: Url
					})
				//}
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
