<template>
	<!-- 近视详情 -->
	<view class="details">
		<!-- 首图展示 -->
		<view class="detailsmap">
			<swiper indicator-dots indicator-active-color="#de1a6e" autoplay class="swiper">
				<swiper-item v-for="(item,index) in data.PicData" :key="index">
					<image :src="item.PicUrl" mode=""></image>
				</swiper-item>
			</swiper>
			<!-- <view class="pagination">1/6</view> -->
		</view>
		<!-- 价格 -->
		<view class="listpt">
			<view class="price">
				<span>¥</span>
				{{data.Price}}
			</view>
			<view class="brandname">
				<span v-if="data.IsPlatform">自营</span>{{data.Name}}
			</view>
		</view>
		<!-- 货品规格 -->
		<view class="shipments">
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">规格</view>
						<view class="txt26">1件</view>
					</view>
					<image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="pick">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">发货</view>
						<view class="txt26">{{data.Area}}</view>
					</view>
					<view class="flex">
						<view class="">{{data.IsPinkage?'':'不'}}包邮</view>
						<!-- <image class="exemption" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image> -->
					</view>
				</view>
			</view>
			<view class="pick" v-if="data.ServiceInfo.length">
				<view class="shipmentsbox">
					<view class="flex">
						<view class="">服务</view>
					</view>
					<view class="flex" v-for="(item,index) in data.ServiceInfo" :key="index">
						<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
						<view class="">{{item.Name}}</view>
					</view>
					<!-- <view class="flex">
						<image class="drawimg" src="http://shop.dadanyipin.com/static/hpicons/draw.svg" mode=""></image>
						<view class="">及时发货</view>
					</view> -->
				</view>
			</view>
		</view>

		<!-- 商品评价 -->
		<view class="merchandise">
			<view class="evaluate">
				<view class="quiz">问大家<span>(3)</span>
				</view>
				<view class="flex" >
					<view class="">查看全部</view>
					<image class="arrows" src="http://shop.dadanyipin.com/static/hpicons/arrows.svg" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="question">
					<view class="dot"><span>问</span>衣服质量怎么样</view>
					<view class="">3个回答</view>
				</view>
				<view class="question">
					<view class="dot"><span>问</span>衣服质量怎么样</view>
					<view class="">3个回答</view>
				</view>
			</view>
		</view>
		<!-- 店铺 -->
		<view class="store" v-if="data.ShopData">
			<view class="flex">
				<image class="storeimg" :src="data.ShopData.Logo" mode=""></image>
				<view class="">
					<view class="storename">{{data.ShopData.ShopNick}}</view>
					<view class="flex exp">
						<view class="">综合体验</view>
						<image class="star" src="http://shop.dadanyipin.com/static/hpicons/collect.svg" mode="" v-for="(item,index) in data.ShopData.ServiceScore/20" :key="index"></image>
					</view>
				</view>
			</view>
			<view class="flex">
				<!-- <view class="plan">全部宝贝</view> -->
				<view class="plan" @click="navigate('shopSon/shopHome/shopHome',{shopId:data.ShopData.ShopId})">进店逛逛</view>
			</view>
		</view>
		<!-- <view class="">
			<view class="plan">描述相符 4.8 <span>低</span></view>
			<view class="plan">卖家服务 4.7 <span>低</span></view>
			<view class="plan">物流服务 4.8 <span>低</span></view>
		</view> -->
		<div class="contentDetail" v-html="data.ContentDetail"></div>
		
		<div class="foot ali-c jus-b">
			<div class="left ali-c">
				<div @click="gokefu">
					<img src="http://jd.wtvxin.com/images/images/index/ans.png" alt="" />
					<p>客服</p>
				</div>
				<div @click="collect">
					<img v-if="data.IsCollection" src="http://jd.wtvxin.com/images/images/index/collect_y.png" alt="" />
					<img v-else src="http://jd.wtvxin.com/images/images/index/collect_n.png" alt="" />
					<p>收藏</p>
				</div>
				<div @click="goCart">
					<img src="http://jd.wtvxin.com/images/images/index/cart.png" alt="" />
					<p>购物车</p>
					<!-- <span class="num flexc" v-if="CartNumber > 0">{{ CartNumber }}</span> -->
				</div>
			</div>
			<div class="right flex">
				<p :class="['flex1 flexc']" @click="showSku(1)">加入购物车</p>
				<!-- <p :class="['flex1 flexc', starTimetype != 1 ? 'dis' : '']" @click="showSku(2)">立即购买</p> -->
				<p :class="['flex1 flexc']" @click="showSku(2)">立即购买</p>
			</div>
		</div>
	</view>
</template>

<script>
import {post,get,toLogin,navigate} from '@/common/util.js';
export default {
	data() {
		return {
			navigate,
			userId: "",
			token: "",
			proId:'',
			data:{}
		};
	},
	onLoad(e) {
		e.proId &&(this.proId = e.proId);
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.getData();
	},
	onShow() {
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
	},
	methods: {
		async getData(){
			const res = await post('Goods/Goodsxq',{
					UserId:this.userId,
					Token:this.token,
					Id:this.proId
			})
			const data = res.data;
			// data.ServiceKeyss = data.ServiceKeys.split('，');
			data.ContentDetail = data.ContentDetail.replace(/<img/g,'<img style="max-width:100%;"')
			this.data = data;
		},
		
		//添加取消收藏
		async collect() {
			let res = await post('User/AddCollections', {
				UserId: this.userId,
				Token: this.token,
				Type: 0,
				Id: this.proId
			});
			if (res.code == 0) {
				if (this.data.IsCollection) {
					uni.showToast({
						title: '已取消收藏！',
						icon: 'none',
						duration: 1500
					});
					this.data.IsCollection = false;
				} else {
					uni.showToast({
						title: '添加收藏成功！',
						icon: 'none',
						duration: 1500
					});
					this.data.IsCollection = true;
				}
			}
		},
		toindex() {
			uni.navigateBack({
				delta: 2
			});
		},
		//
		toevaluation(Url) {
			uni.navigateTo({
				url: Url
			});
		}
	}
};
</script>

<style scoped lang="scss">
.details {
	background: #ffffff;
	padding-bottom:100upx;
	.detailsmap {
		width: 100%;
		height: 750upx;
		background: #c0c0c0;
		image {
			height: 750upx !important;
		}
		.swiper{
			height:750upx;
		}
	}
	.pagination {
		width: 80upx;
		height: 40upx;
		background: rgba(12, 34, 44, 0.2);
		border-radius: 20upx;
		position: absolute;
		top: 650upx;
		right: 31upx;
		line-height: 40upx;
		text-align: center;
		color: #fff;
	}
	// 价格
	.listpt {
		padding: 30upx;
		width: 100%;
		.price {
			font-size: 44upx;
			font-weight: bold;
			color: #de1a6e;
			span {
				font-size: 36upx;
				margin-right: 10upx;
			}
		}
		.brandname {
			font-size: 30upx;
			font-weight: bold;
			color: rgba(52, 52, 52, 1);
			span {
				height: 30upx;
				background: linear-gradient(90deg, rgba(222, 26, 110, 1), rgba(233, 56, 132, 1));
				border-radius: 6upx;
				padding: 0 10upx;
				margin-right: 10upx;
				font-size: 24upx;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
	/* 货品规格 */
	.shipments {
		border-top: 20upx solid #f9f9f9;
		.pick {
			border-bottom: 1upx solid #f9f9f9;
			.shipmentsbox {
				display: flex;
				justify-content: space-between;
				font-size: 26upx;
				font-family: PingFang;
				font-weight: bold;
				color: rgba(13, 34, 44, 0.6);
				margin: 30upx;
				.txt26 {
					color: #343434;
					margin-left: 50upx;
				}
				.exemption {
					width: 20upx;
					height: 20upx;
					margin: 16upx 0 0 16upx;
				}
				.drawimg{
					width:41upx;
					height:41upx;
					margin: 6upx 6upx 0 0;
				}
			}
		}
	}
	// 商品评价
	.merchandise{
		border-top: 20upx solid #f9f9f9;
		padding: 30upx;
		.evaluate{
			display: flex;
			justify-content: space-between;
			color: #DE1C6E;
			padding-bottom: 20upx;
			border-bottom: 1upx solid #f9f9f9;
			.quiz{
				font-size:30upx;
				font-weight:bold;
				color:rgba(52,52,52,1);
				span{
					font-size:22upx;
					color:rgba(154,154,154,1);
					margin-left: 10upx;
				}
			}
			image{
				width:20upx;
				height:20upx;
				margin: 16upx 0 0 10upx;
			}
		}
		.question{
			display: flex;
			justify-content: space-between;
			padding-top: 30upx;
			font-size: 26upx;
			color: #9A9A9A;
			.dot{
				font-size: 29upx;
				color: #343434;
				span{
					height:26upx;
					background:rgba(222,28,110,1);
					border-radius:6upx;
					font-size:20upx;
					color:rgba(255,255,255,1);
					line-height:26upx;
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
		}
	}
	// 店铺
	.store{
		display: flex;
		justify-content: space-between;
		padding: 30upx;
		border-top: 20upx solid #f9f9f9;
		.storeimg{
			width:96upx;
			height:96upx;
			border-radius:4upx;
			margin-right: 20upx;
		}
		.storename{
			font-size:29upx;
			color:rgba(0,0,0,1);
		}
		.exp{
			font-size: 18upx;
			color: #404040;
			height:50upx;
			background:rgba(245,245,245,1);
			border-radius:25upx;
			padding: 0 10upx;
			.star{
				width:16upx;
				height:16upx;
				margin: 16upx 0 0 5upx;
			}
		}
		.plan{
			height:48upx;
			line-height:48upx;
			border:1upx solid rgba(222,28,110,1);
			border-radius:24upx;
			font-size: 24upx;
			margin-left: 20upx;
			color: rgba(222,28,110,1);
			padding: 0 20upx;
		}
	}

	.foot {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 98upx;
		box-sizing: border-box;
		padding: 0 30upx 0 0;
		box-shadow: 0 -3upx 8upx 0upx rgba($color: #000000, $alpha: 0.1);
		display:flex;
		align-items:center;
		justify-content:space-between;
		.left div:nth-child(1) img {
			width: 34upx;
			height: 34upx;
		}
		.left div:nth-child(2) img {
			width: 32upx;
			height: 32upx;
		}
		.left div:nth-child(3) img {
			width: 34upx;
			height: 32upx;
		}
		.right {
			width: 400upx;
			height: 70upx;
			line-height: 70upx;
			border-radius: 35upx;
			color: #fff;
			font-size: 26upx;
			font-weight: bold;
			overflow: hidden;
			text-align:center;
		}
		.right p:nth-child(1) {
			background-color: rgb(254, 203, 104);
		}
		.right p:nth-child(2) {
			background-color: #de1a6e;
		}
		.right p.dis {
			// opacity: 0.5;
		}
		.left {
			display:flex;
			align-items:center;
			justify-content:space-between;
			div {
				width: 105upx;
				text-align: center;
				font-size: 22upx;
				color: #999;
				position: relative;
			}
			p{
				line-height:1.4;
			}
			span {
				position: absolute;
				width: 26upx;
				height: 26upx;
				border-radius: 50%;
				background-color: #de1a6e;
				color: #fff;
				font-size: 20upx;
				top: -10upx;
				right: 23upx;
				p{
					line-height:1;
				}
			}
		}
	}

	
}
</style>
