<template>
	<view class="bg">
		<view class="search">
			<view class="seachbox">
				<text class="uni-icon uni-icon-search">请输入搜索关键字</text>
			</view>
		</view>
		<!--轮播图-->
		<view class="index_swiper ptb20">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item,index) in 3" :key="index">
					<view class="swiper-item pd15">
						<image class="img" src="@/static/of/banner.jpg" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 18px;">
				<view v-for="(item,index) in 3" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
			</view>
		</view>
		<!-- 快捷导航 -->
		<view class="icon-menu">
			<view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=0')">
				<image class="icon" src="@/static/fenlei1.png"></image>
				<text class="txt">舞衣</text>
			</view>
			<view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=1')">
				<image class="icon" src="@/static/fenlei2.png"></image>
				<text class="txt">舞裙</text>
			</view>
			<view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=2')">
				<image class="icon" src="@/static/fenlei3.png"></image>
				<text class="txt">舞裤</text>
			</view>
			<view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=3')">
				<image class="icon" src="@/static/fenlei4.png"></image>
				<text class="txt">舞鞋</text>
			</view>
			<view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=4')">
				<image class="icon" src="@/static/fenlei5.png"></image>
				<text class="txt">全部</text>
			</view>
		</view>
		<!-- 品牌 -->
		<view class="brand">
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop1.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop2.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop3.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop4.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop5.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop6.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop7.png"></image>
			</view>
			<view class="brand-img">
				<image class="icon" src="@/static/shop/shop8.png"></image>
			</view>
		</view>
		<!-- 热卖推荐 -->
		<view class="best">
			<view class="letter active">
				<view class="txt30">热卖推荐</view>
				<view class="txt22">本周销量top</view>
				<view class="pole"></view>
			</view>
			<view class="letter">
				<view class="txt30">猜你喜欢</view>
				<view class="txt22">最懂你的</view>
				<view class="pole1"></view>
			</view>
			<view class="letter">
				<view class="txt30">便宜好货</view>
				<view class="txt22">好货不贵</view>
			</view>
		</view>
		<!-- 正在直播 -->
		<view class="live" v-for="(val,key) in 3" :key="key">
			<view class="live-img">
				<image src="../../../static/of/p3.jpg" mode=""></image>
				<view class="islive">
					<view class="line line1"></view>
					<view class="line line2"></view>
					<view class="line line3"></view>
					<view class="txt">正在直播</view>
				</view>
			</view>
			<view class="live-item">
				<view class="live-box" @click="tolink('/pages/shopSon/product/productDetails')">
					<image src="../../../static/music/music-item.png" mode=""></image>
					<view class="live-day">今日爆款</view>
					<view class="live-int">
						<view class="live-tit">一舞拉丁白色舞 蹈显身材紧身蹈显身蹈显身材紧身蹈显身材紧身蹈显身材紧身材紧身蹈显身材紧身...</view>
						<view class="live-ef">自营</view>
						<view class="live-price"><span>￥</span>79.99</view>
					</view>
				</view>
				<view class="live-box">
					<image src="../../../static/music/music-item.png" mode=""></image>
					<view class="live-day">今日新品</view>
					<view class="live-int">
						<view class="live-tit">一舞拉丁蓝色舞 蹈显身材</view>
						<view class="live-ef">超级好物</view>
						<view class="live-price"><span>￥</span>29.99</view>
					</view>
					
				</view>
				<view class="live-box">
					<image src="../../../static/music/music-item.png" mode=""></image>
					<view class="live-int">
						<view class="live-tit">一舞拉丁紫色舞 蹈</view>
						<view class="live-ef">推荐好物</view>
						<view class="live-price"><span>￥</span>88.89</view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 定制 -->
		<!-- <image class="gg_dz" src="@/static/gg_1.png" mode="widthFix"></image> -->
		<!-- 营销 -->
	<!-- 	<view class="Yi-marketing pd15 flex">
			<view class="item flex-between">
				<view class="item_l">
					<view class="txt_1">畅销榜</view>
					<view class="txt_2">值得购买</view>
				</view>
				<view class="item_r">
					<image src="@/static/z1.png"></image>
				</view>
			</view>
			<view class="item flex-between">
				<view class="item_l">
					<view class="txt_1">每日上新</view>
					<view class="txt_2">日日上新</view>
				</view>
				<view class="item_r">
					<image src="@/static/z2.png"></image>
				</view>
			</view>
		</view> -->
		<!-- 每日分享 -->
		<!-- <view class="Yi-Day uni-mb10">
			<view class="Yi-hd flex-between">
				<view class="title">每日分享</view>
			</view>
			<view class="Yi-bd pd15">
				<scroll-view class="scroll-view_H Hotsell-list" scroll-x="true" scroll-left="0">
					<view class="scroll-view-item_H" v-for="(item,index) in 8" :key="index">
						<view class="itembox">
							<view class="image-view">
								<image class="img" src="@/static/of/pro1.jpg" mode="aspectFill"></image>
							</view>
							<view class="txtbox">
								<view class="uni-product-price">
									<text class="color_red">￥39</text>
									<text class="uni-product-price-favour">￥159</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view> -->
		<!-- 商品列表 -->
	<!-- 	<view class="goods">
			<view class="menu_nav flex-between">
				<view class="menu_item flex flexAlignCenter flexColumn" 
				v-for="(item,index) in navlist" :key="index" :class="{'active':index==indexs}" @click="tapTab(index)">
					<view class="title">{{item.title}}</view>
					<view class="subtitle">{{item.desc}}</view>
				</view>
			</view>
			<view class="list flexWrap flex-between">
				<view class="item" v-for="(item,index) in 6" :key="index">
					<image src="@/static/of/pro1.jpg" class="item_img" mode="aspectFill"></image>
					<view class="item_info">
						<view class="item_title uni-ellipsis">壹舞拉丁黑色舞蹈现身材连衣裙</view>
						<view class="flex-between item_total">
							<view class="flex-start">
								<span class="item_price">￥79</span>
								<span class="item_market line-through">￥88</span>
							</view>
							<view class="item_market">55人付款</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		components: {
		},
		data() {
			return {
				userId: "",
				token: "",
				currentSwiper :0,
				navlist:[{id:1,title:'热卖推荐',desc:"本周销量TOP"},{id:2,title:'猜你喜欢',desc:"最懂你的"},{id:3,title:'便宜好货',desc:"好货不贵"}],
				indexs:0,
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			//切换
			tapTab(index) {
				this.indexs = index;
			},
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff;
	}
</style>
