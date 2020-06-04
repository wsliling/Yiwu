<template>
	<view>
		<view class="search">
			<view class="seachbox">
				<text class="uni-icon uni-icon-search">请输入搜索关键字</text>
			</view>
		</view>
		<!--轮播图-->
		<view class="index_swiper">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item,index) in 3" :key="index">
					<view class="swiper-item pd15">
						<image class="img" src="@/static/of/banner.jpg" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots">
				<view v-for="(item,index) in 3" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
			</view>
		</view>
		<!-- 快捷导航 -->
		<view class="icon-menu">
			<view class="item">
				<image class="icon" src="@/static/fenlei1.png"></image>
				<text class="txt">舞衣</text>
			</view>
			<view class="item">
				<image class="icon" src="@/static/fenlei2.png"></image>
				<text class="txt">舞裙</text>
			</view>
			<view class="item">
				<image class="icon" src="@/static/fenlei3.png"></image>
				<text class="txt">舞裤</text>
			</view>
			<view class="item">
				<image class="icon" src="@/static/fenlei4.png"></image>
				<text class="txt">舞鞋</text>
			</view>
			<view class="item">
				<image class="icon" src="@/static/fenlei5.png"></image>
				<text class="txt">全部</text>
			</view>
		</view>
		<!-- 定制 -->
		<image class="gg_dz" src="@/static/gg_1.png" mode="widthFix"></image>
		<!-- 营销 -->
		<view class="Yi-marketing pd15 flex">
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
		</view>
		<!-- 每日分享 -->
		<view class="Yi-Day uni-mb10">
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
		</view>
		<!-- 商品列表 -->
		<view class="goods">
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
						<view class="item_title uni-ellipsis">一舞拉丁黑色舞蹈现身材连衣裙</view>
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
		</view>
		
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
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff;
	}
</style>
