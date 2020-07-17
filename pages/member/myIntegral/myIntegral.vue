<template>
	<!-- 我的积分 -->
	<view class="Integral">
		<view class="Integralbox uni-bg-white">
			<view class="reveal">
				<image class="bg" src="http://yw.wtvxin.com/static/my/bg3.png" alt="" />
				<view class="jf">我的积分{{SumScore}}</view>
				<view class="flex-between">
					<view class="item flex-column">
						<view class="symbol">{{Score}}</view>
						<view class="balance">普通积分</view>
					</view>
					<view class="item flex-column">
						<view class="symbol">{{Amount}}</view>
						<view class="balance">返佣积分</view>
					</view>
				</view>
			</view>
		</view>
		<view class="jf_hd pd15 uni-bg-white">积分明细</view>
		<view class="tabList flex p_re uni-bg-white">
			<view class="item" :class="{'active':tabIndex==0}"  @click="cliTab(0)">普通积分</view>
			<view class="item" :class="{'active':tabIndex==1}"  @click="cliTab(1)">返佣积分</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		<view class="line-list">
			<block v-for="(item,index) in integralList" :key="index">
			<view class="line-item">
				<view class="line-item-l">
					<view class="txt">{{item.Title}}</view>
					<view class="c_999 fz12">{{item.AddTime}}</view>
				</view>
				<view class="item_r">
					{{item.Change}}
				</view>
			</view>
			</block>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
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
				tabIndex:0,
				Page:1,
				PageSize:8,
				Type:5,  //5:普通积分 6:返佣积分
				integralList:[],
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				Amount:'',
				Score:'',
				SumScore:'',
			}
		},
		components: {
			uniLoadMore,
			noData
		},
		onShow() {
			this.UserId = uni.getStorageSync("userId");
			this.Token = uni.getStorageSync("token");
			this.getIntegral()

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
			  if(index == 1) {
				  this.Type = 6
				  this.Page = 1
			  }else{
				  this.Type = 5
				  this.noDataIsShow = false;
			  }
			  this.getIntegral()
			},
			// 普通积分、返佣积分
			getIntegral(){
				post("Recharge/GetIncomeScoreDetail",{
					UserId: this.UserId,
					Token: this.Token,
					Page: this.Page,
					PageSize: this.PageSize,
					Type: this.Type,
				}).then( result =>{
					if (result.code === 0) {
						this.Amount = result.data.Amount
						this.Score = result.data.Score
						this.SumScore = result.data.SumScore
						let len = result.data.list.length;
						if (len > 0) {
							this.hasData = true;
							this.noDataIsShow = false;
						}
						if (len == 0 && this.Page == 1) {
							this.noDataIsShow = true;
							this.hasData = false;
						}
						if (this.Page === 1) {
							this.integralList = result.data.list;
						}
						if (this.Page > 1) {
							this.integralList = this.integralList.concat(
								result.data.list
							);
						}
						if (len < this.PageSize) {
							this.isLoad = false;
							this.loadingType = 2;
						} else {
							this.isLoad = true;
							this.loadingType = 0
						}
					}
				})
			},
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.Page++;
				this.getIntegral();
			} else {
				this.loadingType = 2;
			}
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
			background-size: cover;
			font-family:PingFang;
			color:#fff;
			position:relative;
			z-index:1;
			.bg{
				position:absolute;
				top:0;left:0;
				width:100%;height:100%;
				z-index:-1;
			}
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
			padding-bottom: 20upx;
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
