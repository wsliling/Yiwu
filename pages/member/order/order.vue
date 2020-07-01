<template>
	<view>
		<view class="bg_fff tabList flex p_re">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		<view style="height: 80upx;"></view>
		<view class="list pp3">
			<view class="order_item bg_fff" v-for="(item,index) in list" :key="index" @click="goUrl('/pages/member/orderDetail/orderDetail?id='+item.OrderNumber)">
				<view class="flex-between">
					<view class="shopbox flex-start">
						<view class="iconfont icon-dianpu"></view>
						<text class="shopName uni-ellipsis">{{item.ShopName}}</text>
						<view class="iconfont icon-arrow_r"></view>
					</view>
					<view class="color_red font26">{{item.StatusName}}</view>
				</view>
				<view class="flex-between mt2" v-for="(ite, ind) in item.OrderDetails" :key="ind">
					<image :src="ite.PicNo" mode="aspectFit" class="img mr2"></image>
					<view class="flex1 order_info">
						<view class="proname uni-ellipsis2">{{ite.ProductName}}</view> 
						<view class="c_999 font18">{{ite.SpecText}}</view> 
						<view class="flex-between mt1">
							<text class="c_999">x{{ite.Number}}</text>
							<text>¥{{ite.ActualPay}}</text>
						</view>
					</view>
				</view>
				<view class="text_right mt2">总计：¥<span class="font32 uni-bold">{{item.Total}}</span></view>
				<view class="btns flex-end">
					<view class="btn" v-if="item.IsCancel==1" @click.stop="chooseOrders(item.OrderNumber,1)">取消订单</view>
					<view class="btn" v-if="item.IsDel==1" @click.stop="chooseOrders(item.OrderNumber,2)">删除</view>
					<view class="btn bg_red" v-if="item.Ispay==1" @click.stop="goUrl('/pages/member/orderDetail/orderDetail?id='+item.OrderNumber)">立即支付</view>
					<view class="btn bg_red" v-if="item.IsComment==1" @click.stop="goPinJia(item.OrderDetails,item.OrderNumber)">去评价</view>
					<view class="btn bg_red" v-if="item.IsConfirmReceipt==1" @click.stop="chooseOrders(item.OrderNumber,3)">确认收货</view>
					<view class="btn bg_red" v-if="item.GroupRecordId>0" @click.stop="goUrl('/pages/pintuanOrder/pintuanOrder?id='+item.GroupRecordId)">拼团详情</view>
				</view>
			</view>
		</view>
		<noData v-if="list.length<1"></noData>
		<uni-load-more :loadingType="loadingType" v-else></uni-load-more>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/notData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				tabList:[{id:0,name:'全部'},{id:1,name:'待付款'},{id:2,name:'待发货'},{id:3,name:'待收货'},{id:4,name:'待评价'}],
				tabIndex:0,
				page:1,
				pagesize:8,
				list:[],
				loadingType: 0, //0加载前，1加载中，2没有更多了
				hasData: false,
				noDataIsShow:false,
				isLoad: false,
				// isOver:false,
				needChangeGoods:[],
				showChange:false,
				changeNumId:'',//评价多商品订单时选中的订单no
			}
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-80)/2)
		   }
		 },
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.list = []
			this.page = 1
			this.noDataIsShow = false;
			this.hasData = false;
			if (toLogin()) {
			    this.getList();
			}
		},
		methods: {
			//跳转
			goUrl(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			cliTab(index){
			  this.tabIndex = index
			  this.page=1;
			  this.list=[];
			  this.noDataIsShow = false;
			  this.hasData = false;
			  this.getList()
			},
			getList(){
			  post('Order/OrderList',{
				UserId:uni.getStorageSync("userId"),
				Token:uni.getStorageSync("token"),
				Page:this.page,
				PageSize:this.pagesize,
				Status:this.tabIndex,
				// Type:0,
			  }).then(res=>{
				if(res.code===0){
				  let _this=this;
				  if (res.data.length > 0) {
				  	this.hasData = true;
					this.noDataIsShow = false;
				  }
				  if (res.data.length == 0&&this.page==1) {
				  	this.noDataIsShow = true;
					this.hasData = false;
				  }
				  if (this.page === 1) {
				  	this.list = res.data;
				  }
				  if (this.page > 1) {
				  	this.list.push(...res.data)
				  }
				  if (res.data.length <this.pagesize) {
				  	this.isLoad = false;
				  	this.loadingType = 2;
				  } else {
				  	this.isLoad = true;
				  	this.loadingType = 0
				  }
				}
			  })
			},
			chooseOrders(OrderNo,type){//确认取消
				let _this=this;
			  if(type==1){
				var content="您确定要取消此订单吗？"
				var url="Order/CancelOrders"
			  }else if(type==2){
				var content="您确定要删除此订单吗？"
				var url="Order/DeleteOrders"
			  }else{
				var content="您确定收货成功吗？"
				var url="Order/ConfirmReceipt"
			  }
			  uni.showModal({
				title: '提示',
				cancelText:"再想想",
				content: content,
				success (res) {
				  if (res.confirm) {
					post(url,{
					  UserId:uni.getStorageSync("userId"),
					  Token:uni.getStorageSync("token"),
					  OrderNo:OrderNo,
					}).then(res=>{
					  _this.showCancel = false;
					  _this.list = [];
					  _this.noDataIsShow = false;
					  _this.getList();
					  uni.showToast({
						icon:'none',
						title:res.msg
					  })
					  console.log( _this.list)
					})
				  } else if (res.cancel) {
					console.log('用户点击取消')
				  }
				}
			  })
			},
			goPinJia(goods,id){console.log(goods.length==1)
			  if(goods.length==1){
				this.goUrl('/pages/member/addComment/addComment?id='+id+'&detailId='+goods[0].Id)
			  }else{
				this.showChange = true
				this.needChangeGoods = goods
				this.changeNumId = id
			  }
			},
			changeGoods(detailId){
			  this.goUrl('/pages/member/addComment/addComment?id='+this.changeNumId+'&detailId='+detailId)
			},
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.getList();
			// 停止下拉动画
			uni.stopPullDownRefresh()
		},
		onReachBottom: function() {
			if (this.loadingType !== 2) {
				this.page++;
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	 @import './style'
</style>
