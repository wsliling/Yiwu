<template>
	<!-- （店铺收入）（直播收入）（课程收入）（舞曲收入） -->
	<view>
		<view class="bg_fff tabList flex p_re">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
			<!-- <view class="bb_line" :style="'left:'+tabStyle+'upx'"></view> -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="bb_line" :style="{'left':tabStyle+'upx'}"></view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="bb_line" :style="{'left':tabStyle+'rpx'}"></view>
			<!-- #endif -->
		</view>
		<view style="height: 80upx;"></view>
		<view class="time-box flex-between">
			<view class="time flex-between" @tap="choseTime">
				<span>{{setUpDate}}</span>
			</view>
			<view class="time_r" v-if="false">
				<span>最近交易</span>
				￥{{count}}
			</view>
		</view>
		<view class="uni-bg-white pd15" v-if="hasData">
			<view class="list-item flex-between" v-for="(item, index) in datalist" :key="index">
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
				tabList:[{id:0,name:'店铺收入'},{id:1,name:'直播收入'},{id:2,name:'课程收入'},{id:3,name:'舞曲收入'}],
				tabIndex:0,
				showDate: false,
				minDate: new Date().setFullYear(2019, 0, 1),
				currentDate: new Date().getTime(),
				setUpDate: "", //时间
				count: 0, //总数
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
			this.tabIndex =e.type||0
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
				let url = ''
				if(this.tabIndex == 0){
					url = "Recharge/GetShopIncomeDetail"  //店铺收入
				}else{
					url = "Recharge/GetIncomeScoreDetail"  //1.直播收入、2、课程收入、4。舞曲收入、5、普通积分明细、6、返佣积分明细
				}
				post(url, {
					UserId: this.userId,
					Token: this.token,
					Date: this.setUpDate,
					Page: this.page,
					PageSize: this.pageSize,
					Type: this.tabIndex == 3 ? 4 : this.tabIndex
				}).then(res => {
					if (res.code == 0) {
						this.count = res.count;
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
				console.log(value,'value')
				this.setUpDate = value
				this.datalist = []
				this.page = 1;
				this.queryRecord()
			},
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.queryRecord();
			} else {
				this.loadingType = 2;
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
	.list-item {
		height: 120upx;
		border-bottom: 1px solid #f5f5f5;
		view {
			span {
				font-size: 28upx;
				color: #333;
			}

			p {
				margin-top: 15upx;
				font-size: 20upx !important;
				color: #999 !important
			}
		}

		p {
			font-size: 28upx;
			color: #333;
		}
	}

	.time-box {
		height: 88upx;
		font-size: 24upx;
		color: #333;
		padding: 0 30upx;
		.time {
			width: 160upx;
			height: 44upx;
			background-color: #ffffff;
			border-radius: 22upx;
			
			&::after{
				content: "";
				display: block;
				width: 0;
				height: 0;
				border-left: 10upx solid transparent;
				border-right: 10upx solid transparent;
				border-top: 10upx solid #999;
			}
		}
		.time_r{
			font-size: 24upx;
			color: #999;
		}
	}
</style>
