<template>
	<!-- 我的积分 -->
	<view class="Integral">
		<view class="Integralbox uni-bg-white">
			<view class="reveal">
				<view class="jf">我的直播币</view>
				<view class="flex-start">
					<view class="item">
						<view class="symbol">{{LiveStreamMoney || 0}}</view>
					</view>
					<view class="item">
						<view class="btn flex-column" @click="tolink('/pages/member/recharge/recharge?type=2')">充值</view>
					</view>
				</view>
			</view>
		</view>
		<view class="jf_hd pd15">直播币明细</view>
		<view class="line-list">
			<block v-for="(item,index) in liveList" :key="index">
			<view class="line-item">
				<view class="line-item-l">
					<view class="txt">{{item.Remark}}</view>
					<view class="c_999 fz12">{{item.AddTime}}</view>
				</view>
				<view class="item_r">{{item.Change}}</view>
			</view>
			</block>
		</view>
		
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default {
		data(){
			return{
				UserId: "",
				Token: "",
				liveList:[],
				LiveStreamMoney:'',
			}
		},
		onShow() {
			this.UserId = uni.getStorageSync("userId");
			this.Token = uni.getStorageSync("token");
			this.getLiveStreamingList()
			this.getMyIncome()
		},
		methods:{
			tolink(url){
				uni.navigateTo({
					url:url
				})
			},
			getLiveStreamingList(){
				post('Recharge/GetLiveStreamingList',{
					UserId : this.UserId,
					Token : this.Token,
				}).then( res=> {
					if(res.code === 0){
						this.liveList = res.data.list
					}
				})
			},
			// 获取直播币
			async getMyIncome() {
				let result = await post("User/GetMyIncome", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				});
				if (result.code === 0) {
					this.LiveStreamMoney = result.data.LiveStreamMoney;
				} 
			},
		}
	}
</script>

<style lang="scss" scoped>
	.Integralbox{
		padding: 30upx;
		.reveal{
			width: 100%;
			height: 300upx;
			border-radius:30upx;
			background:url(/static/my/bg4.png);
			background-size: cover;
			font-family:PingFang;
			color:#fff;
			.jf{
				color: #fff;
				padding: 50upx 50upx 0;
				line-height: 1;
			}
			.item{
				padding: 50upx;
				.btn{
					height: 90upx;
					width: 240upx;
					border-radius: 12upx;
					text-align: center;
					font-size: 32upx;
					color: $primary;
					background: rgba(255,255,255,.72);
				}
			}
			.symbol{
				font-size:60upx;
				font-weight:bold;
				line-height: 1.2;
				min-width: 180upx;
			}
		}
	}
	.Integral{
		.jf_hd{
			font-size: 32upx;
			margin-bottom: 20upx;
			display: flex;
			align-items: center;
			&::before{
				display: block;
				content: "";
				height: 36upx;
				width: 8upx;
				background: $primary;
				margin-right: 20upx;
			}
		}
		.item_r{
			font-size: 36upx;
			color: $primary;
		}
	}
	
	
</style>
