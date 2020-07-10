<template>
	<!-- 购物车支付成功 -->
	<view>
		<view class="payinfo">
		  <view class="p1 flex-center"><view class="iconfont icon-gou2"></view>{{status==='success'?'支付成功':'支付失败'}}</view>
		  <view class="p2"><span class="yuan">￥</span>{{TotalPrice}}</view>
		  <view class="btns">
			<view class="btn toindex" @click="tolink('/pages/tabBar/index/index',true)">返回首页</view>
			<view class="btn todetail" @click="toOrder">查看订单</view>
		  </view>
		</view>
		<view class="foryouCon">
		  <view class="for_hd">
			<view class="icon icon_l"></view><view class="txt">为你推荐</view><view class="icon icon_r"></view>
		  </view>
		  <view class="for_bd">
			<view class="proList flex flexWrap justifyContentBetween">
				<view class="item" v-for="(item,index) in list" :key="index" @click="navigate('shopSon/product/productDetails',{proId:item.Id})">
					<image :src="item.PicNo" class="item_img" mode="aspectFill"></image>
					<view class="item_info">
						<view class="item_title uni-ellipsis">{{item.Name}}</view>
						<view class="flex flexAlignEnd justifyContentBetween item_total">
							<view class="flex flexAlignEnd">
								<span class="item_price">￥{{item.Price}}</span>
							</view>
							<view class="item_market">{{item.SalesVolume}}人付款</view>
						</view>
					</view>
				</view>
				<!-- <shopItem  v-for="(val,key) in list" :key="key" :item="val"></shopItem> -->
			</view>
		  </view>
		</view>
		<noData v-if="list.length<1"></noData>
		<uni-load-more :loadingType="loadMore" v-else></uni-load-more>
	</view>
</template>

<script>
	import {post,get,navigate} from '@/common/util.js';
	import noData from '@/components/notData.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import shopItem from '@/components/shop/shopItem.vue';
	export default {
		components:{noData,uniLoadMore,shopItem},
		data() {
			return {
				userId: "",
				token: "",
				navigate,
				orderNo:"",
				Noarr:[],
				GroupId:0,//大于0 是拼团
				TotalPrice:'',
				status:'fail',//fail--失败；success--成功
				page:1,
				pageSize:10,
				list:[],
				loadMore:0,//0-loading前；1-loading中；2-没有更多了
			}
		},
		onLoad(e) {
			console.log(e)
			// #ifdef APP-PLUS
			this.GroupId=e.GroupId||0;
			// #endif
			this.status = e.status;
			this.orderNo=e.orderNo;
			this.TotalPrice = e.allprice
			this.Noarr=this.orderNo.split(",");
			console.log(e.allprice)
			this.getList()
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifndef APP-PLUS
			// this.orderNo=this.$root.$mp.query.orderNo;
			// this.GroupId=this.$root.$mp.query.GroupId;
			// #endif
		},
		methods: {
			//跳转
			tolink(Url,tabBar) {
				if(tabBar){
					console.log(Url,tabBar)
					uni.switchTab({
						url: Url
					})
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			//跳转订单详情
			toOrder() {
				if(this.Noarr.length>1){
					uni.navigateTo({
						url: '/pages/member/order/order'
					})
				}else{
					uni.navigateTo({
						url: '/pages/member/orderDetail/orderDetail?id='+this.orderNo
					})
				}
			},
			async getList(){
				this.loadMore =1;
				const res = await post('Goods/GoodsList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.page,
					PageSize:this.pageSize,
					IsHits:1,
					});
				if(res.code)return;
				const data = res.data;
				if(this.page===1){
					this.list=[];
				}
				this.list.push(...data);

				this.loadMore = 0;
				if(data.length<this.pageSize){
					this.loadMore=2;
				}
			},
		},
		onReachBottom: function() {
			if (this.loadMore !== 2) {
				this.page++;
				this.getList();
			}
		}
	}
</script>

<style scoped lang="scss">
  .payinfo{background: $primary; text-align: center; color: #fff; padding: 20upx 0 40upx;}
  .payinfo .p1{font-size: 42upx;justify-content: center;}
  .payinfo .p1 .iconfont{ margin-right: 20upx;}
  .payinfo .icon-gou2,.payinfo .icon-cha{ font-size: 56upx; line-height:1; }
  .payinfo .p2{ font-size: 60upx; line-height: 1.5}
  .payinfo .p2 .yuan{ font-size: 32upx}
  .payinfo .btns{ display:flex;align-items:center;justify-content:center;}
  .payinfo .btns .btn{ width: 200upx; padding: 6upx 0; margin: 0 20upx; border-radius: 100px; border: 1px solid #fff;}
  .for_hd{ padding: 40upx 20upx;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;}
  .for_hd .txt{ line-height: 1;font-size: 32upx; font-weight: 600; padding: 0 20upx}
  .for_hd .icon{ height: 32upx; width: 32upx;}
  .for_hd .icon_l {
      background: url(http://shop.dadanyipin.com/static/icons/tit_l.png) center center no-repeat;
      background-size: cover;
  }
  .for_hd .icon_r {
      background: url(http://shop.dadanyipin.com/static/icons/tit_r.png) center center no-repeat;
      background-size: cover;
  }
  .proList{
  	padding:0 30upx;
  	.item{
  		width:49%;margin-bottom:20upx;
  		background: #ffffff;
		border-radius: 12upx;
		overflow: hidden;
  		.item_info{
  			padding:20upx 10upx;
  		}
  		.item_total{
  			width:100%;
  		}
  		.item_img{
  			width:100%;height:335upx;
  		}
  		.item_title{
  			font-size:30upx;font-weight:600;
  		}
  		.item_price{
  			color:$primary;font-size:35upx;
  		}
  		.item_market{
  			color:#999;font-size:24upx;
  		}
  		
  	}
  	
  }
</style>
