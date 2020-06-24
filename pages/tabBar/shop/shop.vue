<template>
	<view class="bg">
		<view class="search">
			<view class="seachbox" @click="navigate('shopSon/mywu/wu')">
				<text class="uni-icon uni-icon-search">请输入搜索关键字</text>
			</view>
		</view>
		<!--轮播图-->
		<view class="index_swiper ptb20">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item,index) in banner" :key="index">
					<view class="swiper-item pd15">
						<image class="img" :src="item.Pic" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 18px;">
				<view v-for="(item,index) in 3" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
			</view>
		</view>
		<!-- 快捷导航 -->
		<view class="icon-menu">
			<view class="item" @click="navigate('shopSon/mywu/wu',{classId:item.Id,title:item.Name})"
				v-for="(item,index) in classify" :key="index">
				<image class="icon" :src="item.Pic"></image>
				<text class="txt">{{item.Name}}</text>
			</view>
			<!-- <view class="item" @click="tolink('/pages/shopSon/mywu/wu?type=1')">
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
			</view>-->
			<view class="item" @click="navigate('shopSon/mywu/wu',{title:'商品列表'})">
				<image class="icon" src="@/static/fenlei5.png"></image>
				<text class="txt">全部</text>
			</view> 
		</view>
		<!-- 品牌 -->
		<view class="brand">
			<view class="brand-img" v-for="(item,index) in shopList" :key="index" 
				 @click="navigate('shopSon/mywu/wu',{brandId:item.Id,title:item.Name})">
				<image class="icon" :src="item.Logo" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 热卖推荐 -->
		<view class="best">
			<view :class="['letter',{'active':item.id===indexs}]" 
				v-for="(item,index) in navlist" :key="index"
				@click="tapTab(item.id)">
				<view class="txt30">{{item.title}}</view>
				<view class="txt22">{{item.desc}}</view>
				<view class="pole"></view>
			</view>
		</view>
		<!-- 正在直播 -->
		<view class="live" v-for="(val,key) in proList" :key="key">
			<view class="live-img">
				<image :src="val.BannerPicNo" mode=""></image>
				<view class="islive">
					<view class="line line1"></view>
					<view class="line line2"></view>
					<view class="line line3"></view>
					<view class="txt">正在直播</view>
				</view>
			</view>
			<view class="live-item">
				<view class="live-box"  v-for="(item,index) in val.ProductList" :key="index"
					 @click="navigate('shopSon/product/productDetails',{proId:item.Id})">
					<image :src="item.PicNo" mode=""></image>
					<view class="live-day" v-if="item.IsExplosive||item.IsRecommend||item.IsNewProduct">
						{{item.IsExplosive?'今日爆款':item.IsRecommend?'推荐':item.IsNewProduct?'新品':''}}
					</view>
					<view class="live-int">
						<view class="live-tit">{{item.Name}}</view>
						<view class="live-ef" v-if="item.IsPlatform||item.IsHot||item.IsRecommend">
							{{item.IsPlatform?'自营':item.IsHot?'超级好物':item.IsRecommend?'推荐好物':''}}
						</view>
						<view class="live-price"><span>￥</span>{{item.Price}}</view>
					</view>
				</view>
			</view>
			
		</view>
		<uni-load-more :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				navigate,
				userId: "",
				token: "",
				currentSwiper :0,
				navlist:[{id:1,title:'热卖推荐',desc:"本周销量TOP"},{id:2,title:'猜你喜欢',desc:"最懂你的"},{id:3,title:'便宜好货',desc:"好货不贵"}],
				indexs:1,
				banner:[],
				classify:[],
				shopList:[],
				proList:[],
				page:1,
				pageSize:5,
				loadingType:0,//0-loading前；1-loading中；2-没有更多了
			}
		},
		onLoad() {
			this.getBanner();
			this.getClassify();
			this.getShopList();
			this.getProList();
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			async getBanner(){
				const res = await post('Banner/BannerList',{Cid:1})
				if(res.code)return;
				this.banner = res.data;
			},
			async getClassify(){
				const res = await post('Goods/TypeList',{Type:0});
				if(res.code)return;
				this.classify = res.data;
			},
			async getShopList(){
				const res = await post('Goods/BrandList',{Type:0});
				if(res.code)return;
				this.shopList = res.data;
			},
			//切换
			tapTab(index) {
				this.indexs = index;
				this.page = 1
				this.getProList();
			},
			async getProList(){
				this.loadingType =1;
				const res = await post('Goods/YWHomeGoodsList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.page,
					PageSize:this.pageSize,
					IsHits:this.indexs==1?1:'',
					IsGuesLike:this.indexs==2?1:'',
					IsExplosive:this.indexs==3?1:'',
					});
				if(res.code)return;
				const data = res.data;
				if(this.page===1){
					this.proList=[];
				}
				this.proList.push(...data);

				this.loadingType = 0;
				if(data.length<this.pageSize){
					this.loadingType=2;
				}
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.getBanner();
			this.getClassify();
			this.getShopList();
			this.getProList();
			// 停止下拉动画
			uni.stopPullDownRefresh()
		},
		// 上拉加载更多
		onReachBottom(){
			if(this.loadMore===2)return;
			this.page+=1;
			this.getProList()
		},
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff;
	}
</style>
