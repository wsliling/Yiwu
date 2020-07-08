<template>
	<!-- 我的积分 -->
	<view class="Integral">
		<view class="Integralbox uni-bg-white">
			<image class="In-image" src="../../../static/my/bg4.png" mode=""></image>
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
					<view class="txt">{{item.Title}}</view>
					<view class="c_999 fz12">{{item.AddTime}}</view>
				</view>
				<view class="item_r">{{item.Change}}</view>
			</view>
			</block>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType" v-if="noDataIsShow == false"></uni-load-more></view>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data(){
			return{
				UserId: "",
				Token: "",
				Page:1,
				PageSize:8,
				liveList:[], //直播币明细
				LiveStreamMoney:'', //直播币
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		components: {
			uniLoadMore,
			noData
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
					PageSize: this.PageSize,
					Page:this.Page,
					Type: this.Type,
				}).then( result=> {
					if (result.code === 0) {
						if (result.data.list.length == 0 && this.Page == 1) {
							this.noDataIsShow = true;
							this.hasData = false;
						}
						if (this.Page === 1) {
							this.liveList = result.data.list;
						}
						if (this.Page > 1) {
							this.liveList = this.liveList.concat(
								result.data.list
							);
						}
						if (result.data.list.length <this.PageSize) {
							this.isLoad = false;
							this.loadingType = 2;
						} else {
							this.isLoad = true;
							this.loadingType = 0
						}
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
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.Page++;
				this.getLiveStreamingList();
			} else {
				this.loadingType = 2;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.Integralbox{
		padding: 30upx;
		.In-image{
			width: 100%;
			height: 300upx;
			position: relative;
		}
		.reveal{
			position: absolute;
			top: 0;
			background-size: cover;
			font-family:PingFang;
			color:#fff;
			.jf{
				color: #fff;
				padding: 50upx 50upx 0;
				line-height: 1;
				margin-top: 30upx;
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
