<template>
	<!-- 我的收入 -->
	<view class="wallet">
		<view class="walletbox uni-bg-white">
			<view class="reveal">
				<view class="symbol"><span>￥</span>{{Income}}<span></span></view>
				<view class="balance">收入总额(元)</view>
			</view>
		</view>
		<view class="line-list">
			<view class="line-item line-arrow-r" v-if="IsShop == 1" @click="tolink('/pages/member/incomeDetails/incomeDetails?type=0')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/shop.png" mode="widthFix"></image>
					<text class="txt">店铺收入</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/incomeDetails/incomeDetails?type=1')">
				
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/zb.png" mode="widthFix"></image>
					<text class="txt">直播收入</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/incomeDetails/incomeDetails?type=2')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/kc.png" mode="widthFix"></image>
					<text class="txt">课程收入</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/incomeDetails/incomeDetails?type=3')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/wq.png" mode="widthFix"></image>
					<text class="txt">舞曲收入</text>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/transDetails/transDetails?type=3')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="http://yw.wtvxin.com/static/my/mx.png" mode="widthFix"></image>
					<text class="txt">提现记录</text>
				</view>
			</view>
		</view>
		<view class="present">
			<view class="btn active" style="width: 100%;" @click="tolink('/pages/member/withdraw/withdraw?type=1')">提现</view>
		</view>
		
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default {
		data(){
			return{
				Income:0,//余额
				userId: "",
				token: "",
				IsShop:'', //是否开通店铺 1-是 0-否
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.wallet=this.$store.state.Wallet;
			// this.wallet=this.wallet.toFixed(2)
			this.getMemberInfo()
			// this.wallet=Math.round(this.wallet*Math.pow(10, 2))/Math.pow(10, 2);
			// this.wallet=Number(this.wallet).toFixed(2)
		},
		methods:{
			tolink(url){
				uni.navigateTo({
					url:url
				})
			},
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": this.userId,
					"Token": this.token
				})
				if (result.code === 0) {
					this.Income = result.data.Income;
					this.IsShop = result.data.IsShop;
					uni.setStorageSync('ReferralCode',result.data.ReferralCode)
					this.$store.commit("update", {
					  Wallet:result.data.Wallet
					});  
				}
			},
		}
	
	}
</script>

<style lang="scss" scoped>
	.walletbox{
		padding: 30upx;
		.reveal{
			width: 100%;
			height: 300upx;
			border-radius:30upx;
			background:url(http://yw.wtvxin.com/static/my/bg2.png);
			background-size: cover;
			font-family:PingFang;
			font-weight:bold;
			color:rgba(252,252,252,1);
			text-align: center;
			padding-top: 70upx;
			.symbol{
				font-size:60upx;
				span{
					font-size:40upx;
				}
			}
			.balance{
				font-size:24upx;
			}
		}
	}
	.line-item-l{ 
		width: 100%;
		.iconimg{
			display: block;
			width: 56upx; 
			height: 56upx;
			margin-right: 20upx;
		}
		.txt{font-size: 30upx;}
	}
	.present{
		padding: 100upx 30upx 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family:PingFang;
		font-weight:500;
		color:#fff;
		.btn{
			width:320upx;
			height:80upx;
			border: 1px solid #fe8b5a;
			color: #fe8b5a;
			border-radius:40upx;
			font-size:32upx;
			display: flex;
			align-items: center;
			justify-content: center;
			&.active{
				background: #fe8b5a;
				color: #fff;
			}
		}
	}
</style>
