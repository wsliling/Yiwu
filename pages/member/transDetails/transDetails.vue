<template>
	<view>
		<view class="bg_fff tabList flex p_re">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		<view style="height: 80upx;"></view>
		<view class="time-box flex-between">
			<view class="time flex-between" @tap="choseTime">
				<span>{{setUpDate}}</span>
				<img src="http://jyy.wtvxin.com/static/images/icons/sj.png" alt="" style="margin:0">
			</view>
			<view class="time_r">
				<span>最近交易</span>
				￥{{RechargeNumber}}
			</view>
		</view>
		<view v-if="hasData">
			<view class="list bp-box jus-b ali-c" v-for="(item, index) in datalist" :key="index">
				<view>
					<span>{{item.Title}}</span>
					<p>{{item.AddTime}}</p>
				</view>
				<p>{{item.Change}}</p>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<!--时间组件-->
		<pickerTime @success="success" :show.sync="showDate"></pickerTime>
	</view>
</template>

<script>
	import {
		post
	} from '@/common/util.js'
	import noData from "@/components/noData"; //没有数据的通用提示
	import pickerTime from '@/components/pickerTime.vue'
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		data() {
			return {
				tabList:[{id:0,name:'全部'},{id:1,name:'消费记录'},{id:2,name:'充值记录'},{id:3,name:'提现记录'}],
				tabIndex:0,
				showDate: false,
				minDate: new Date().setFullYear(2019, 0, 1),
				currentDate: new Date().getTime(),
				setUpDate: "", //时间
				RechargeNumber: 0, //总数
				userId: "",
				token: "",
				hasData: false,
				noDataIsShow: false, //没有数据的提示是否显示
				page: 1,
				pageSize: 10,
				isLoad: false,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				datalist: [],
			}
		},
		components: {
			noData,
			pickerTime,
			uniLoadMore
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-80)/2)
		   }
		 },
		onLoad(e) {

		},
		onShow() {
			//设置当前时间
			this.setDate()
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.queryRecord()
		},
		methods: {
			cliTab(id) {
				this.tabIndex = id;
				this.datalist = [];
				this.setDate() //重置月份
				this.queryRecord()
				// console.log(this.tabIndex)
			},
			choseTime() {
				this.showDate = true
				// console.log("*****************")
			},
			setDate() {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1;
				month = month < 10 ? '0' + month : month;
				this.setUpDate = year + "-" + month
			},
			//查询充值提现
			queryRecord() {
				post('Recharge/GetRechargeList', {
					UserId: this.userId,
					Token: this.token,
					Date: this.setUpDate,
					Page: this.page,
					PageSize: this.pageSize,
					Type: this.tabIndex
				}).then(res => {
					if (res.code == 0) {
						this.RechargeNumber = res.data.AmountMon_hz;
						let _this = this;
						let len = res.data.list.length;
						if (len > 0) {
							this.hasData = true;
							this.noDataIsShow = false;
						}
						if (len == 0 && this.page == 1) {
							this.noDataIsShow = true;
							this.hasData = false;
						}
						if (this.page === 1) {
							this.datalist = res.data.list;
						}
						if (this.page > 1) {
							this.datalist = this.datalist.concat(
								res.data
							);
						}
						if (len < this.pageSize) {
							this.isLoad = false;
							this.loadingType = 2;
						} else {
							this.isLoad = true;
							this.loadingType = 0
						}
					}
				})
			},
			success(value) {
				this.setUpDate = value
				this.datalist = []
				this.page = 1;
				this.queryRecord()
			},
		},
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.isOved = false;
				this.page++;
				this.queryRecord();
			} else {
				this.loadingType = 2;
				if (this.page > 1) {
					this.isOved = true;
				} else {
					this.isOved = false;
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.tabList{
		position: fixed;
		width: 100%;
		left: 0;
		height: 80upx;
		z-index: 9;
		.item{
			width:25%;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #eee;
			&.active{
				color:$primary;
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
	.list {
		height: 120rpx;
		border-bottom: 1rpx solid #ededed;

		view {
			span {
				font-size: 28rpx;
				color: #333;
			}

			p {
				margin-top: 15rpx;
				font-size: 20rpx !important;
				color: #999 !important
			}
		}

		p {
			font-size: 28rpx;
			color: #333;
		}
	}

	.time-box {
		height: 88rpx;
		font-size: 24rpx;
		color: #333;
		padding: 0 30rpx;

		.time {
			width: 170rpx;
			height: 44rpx;
			background-color: #ffffff;
			border-radius: 22rpx;

			img {
				width: 16rpx;
				height: 10rpx;
				margin-left: 10rpx
			}
		}
	}

	.active {
		color: #FF3333;
	}

	.order_title p {
		position: relative;
		width: 50%;
		text-align: center;
		padding: 10rpx;
	}

	.order_title p.active::after {
		position: absolute;
		content: "";
		height: 2px;
		width: 80rpx;
		background: #FF3333;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
	}
</style>
