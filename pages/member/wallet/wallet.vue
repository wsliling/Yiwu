<template>
	<!-- 我的钱包 -->
	<view class="wallet">
		<view class="walletbox uni-bg-white">
			<view class="reveal">
				<view class="symbol"><span>￥</span>{{wallet}}</view>
				<view class="balance">钱包余额(元)</view>
			</view>
		</view>
		<view class="line-list">
			<view class="line-item line-arrow-r" @click="tolink('/pages/member/transDetails/transDetails')">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="/static/my/mx.png" mode="widthFix"></image>
					<text class="txt">交易明细</text>
				</view>
			</view>
			<view class="line-item line-arrow-r">
				<view class="line-item-l flex-start">
					<image class="iconimg" src="/static/my/yhk.png" mode="widthFix"></image>
					<text class="txt">银行卡管理</text>
				</view>
			</view>
		</view>
		<view class="present">
			<view class="btn" @click="tolink('/pages/member/withdraw/withdraw')">提现</view>
			<view class="btn active" @click="tolink('/pages/member/recharge/recharge?type=1')">充值</view>
		</view>
		
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default {
		data(){
			return{
				wallet:0,//余额
				userId: "",
				token: "",
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.wallet=this.$store.state.Wallet;
			// this.wallet=this.wallet.toFixed(2)
			this.getMemberInfo()
			this.wallet=Math.round(this.wallet*Math.pow(10, 2))/Math.pow(10, 2);
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
					this.wallet = result.data.Wallet;
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
			background:url(/static/my/bg1.png);
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
			border: 1px solid $primary;
			color: $primary;
			border-radius:40upx;
			font-size:32upx;
			display: flex;
			align-items: center;
			justify-content: center;
			&.active{
				background: $primary;
				color: #fff;
			}
		}
	}
</style>
