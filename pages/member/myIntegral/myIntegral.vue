<template>
	<!-- 我的积分 -->
	<view class="Integral">
		<view class="Integralbox uni-bg-white">
			<view class="reveal">
				<view class="jf">我的积分（8386）</view>
				<view class="flex-between">
					<view class="item flex-column">
						<view class="symbol">426</view>
						<view class="balance">普通积分</view>
					</view>
					<view class="item flex-column">
						<view class="symbol">7860</view>
						<view class="balance">返佣积分</view>
					</view>
				</view>
			</view>
		</view>
		<view class="jf_hd pd15">积分明细</view>
		<view class="tabList flex p_re">
			<view class="item" :class="{'active':tabIndex==0}"  @click="cliTab(0)">普通积分</view>
			<view class="item" :class="{'active':tabIndex==1}"  @click="cliTab(1)">返佣积分</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		<view class="line-list">
			<block v-for="(item,index) in 5" :key="index">
			<view class="line-item">
				<view class="line-item-l">
					<view class="txt">直播兑换礼物</view>
					<view class="c_999 fz12">2020-05-31 15:22</view>
				</view>
				<view class="item_r">
					-1000
				</view>
			</view>
			<view class="line-item">
				<view class="line-item-l">
					<view class="txt">登录获得积分</view>
					<view class="c_999 fz12">2020-05-26 15:22</view>
				</view>
				<view class="item_r" style="color: #ff9638;">
					+1000
				</view>
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
				userId: "",
				token: "",
				tabIndex:0,
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");

		},
		computed: {
		   tabStyle(){
		     return ((750/2)*this.tabIndex)+(((750/2)-80)/2)
		   }
		 },
		methods:{
			tolink(url){
				if(toLogin()){
					uni.navigateTo({
						url:url
					})
				}
			},
			cliTab(index){
			  this.tabIndex = index
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
			background:url(/static/my/bg3.png);
			background-size: cover;
			font-family:PingFang;
			color:#fff;
			.jf{
				color: #fff;
				padding: 50upx 50upx 0;
				line-height: 1;
			}
			.item{
				text-align: center;
				width: 50%;
				height: 200upx;
			}
			.symbol{
				font-size:60upx;
				font-weight:bold;
				line-height: 1.2;
				span{
					font-size:40upx;
				}
			}
			.balance{
				font-size:24upx;
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
		.tabList{
			width: 100%;
			height: 80upx;
			.item{
				width:50%;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				border-bottom: 1px solid #eee;
				&.active{
					color:$primary;
					font-size: 16px;
				}
			}
			.bb_line{
				position: absolute;
				bottom: 0;
				transition: all .2s;
				height: 4upx;
				width:80upx;
				background-color: $primary
			}
		}
		.item_r{
			font-size: 36upx;
			color: $primary;
		}
	}
	
	
</style>
