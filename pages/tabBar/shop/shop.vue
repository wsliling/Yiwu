<template>
	<view>
		<view class="search" v-if="pageCon==1">
			<view class="seachbox" @click="navigate('shopSon/mywu/wu',{title:'商品列表'})">
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
		<block v-if="pageCon==1">
		<!-- 快捷导航 -->
		<view class="showMenuBtn" @click="isshowMenu=!isshowMenu">
			分类<text :class="['iconfont icon-arrow_down-copy',isshowMenu?'up':'']"></text>
		</view>
		<view class="icon-menu" v-if="isshowMenu">
			<block v-for="(item,index) in classify" :key="index">
				<view class="item" v-if="index<4" @click="navigate('shopSon/mywu/wu',{classId:item.Id,title:item.Name})"
					>
					<image class="icon" :src="item.Pic"></image>
					<text class="txt">{{item.Name}}</text>
				</view>
			</block>
			<view class="item" @click="navigate('shopSon/mywu/wu',{title:'商品列表'})">
				<image class="icon" src="http://m.dance-one.com/static/fenlei5.png"></image>
				<text class="txt">全部</text>
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
		<block v-for="(val,key) in proList" :key="key" >		
			<shopItem v-if="val.ProductList.length" :item="val"></shopItem>
			<!-- 品牌 -->
			<view class="brand" v-if="key==2">
				<view class="brand-img flex-column" v-for="(item,index) in shopList" :key="index" 
					 @click="navigate('shopSon/mywu/wu',{brandId:item.Id,title:item.Name})" v-if="index<4">
					<image class="icon" :src="item.Logo" mode="aspectFill"></image>
				</view>
			</view>
			<view class="brand" v-if="key==5">
				<view class="brand-img flex-column" v-for="(item,index) in shopList" :key="index" 
					 @click="navigate('shopSon/mywu/wu',{brandId:item.Id,title:item.Name})" v-if="index>=4">
					<image class="icon" :src="item.Logo" mode="aspectFill"></image>
				</view>
			</view>
		</block>
		<uni-load-more :loadingType="loadingType"></uni-load-more>
		</block>
		<block v-if="pageCon==2">
			<view class="staticPage">
				<view class="Yi-newslist" >
					<view class="Yi-media uni-bg-white" v-for="(item,index) in NewsList" :key="index" @click="tolink('/pages/msgDetail/msgDetail?id='+item.Id)">
						<view class="media-bd">
							<view class="desc">
								{{item.Title}}
							</view>
							<view class="maxpic maxh" v-if="item.Logo">
								<image :src="item.Logo" mode="widthFix"></image>
							</view>
							<view class="media-ft flex-between">
								<view class="ft_l flex-start">
									<view class="txt_info">{{item.Source}}</view>
									<view class="txt_info">{{item.AddTime}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import shopItem from '@/components/shop/shopItem.vue';
	export default {
		components: {
			uniLoadMore,shopItem
		},
		data() {
			return {
				pageCon:0,
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
				isshowMenu:false,
				NewsList:[]
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			this.getBanner();
			if(this.pageCon==1){
				this.getClassify();
				this.getShopList();
				this.getProList();
			}else{
				this.YWNewsList()
			}
		},
		onShow() {
			this.pageCon=uni.getStorageSync("pageCon");
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
				console.log(this.loadingType)
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			async YWNewsList(){
				let result = await post("News/YWNewsList", {
					UserId:this.userId,
					Token:this.token,
					page:1,
					pageSize:20
				});
				if (result.code === 0) {
					this.NewsList = result.data;
				}
			},
		},
		// 下拉刷新
		onPullDownRefresh() {
			if(this.pageCon==2) return
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
			if(this.pageCon==2) return
			if(this.loadMore===2)return;
			this.page+=1;
			this.getProList()
		},
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.showMenuBtn{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 30upx;
		font-size: 30upx;
		.iconfont{
			margin-left: 4upx;
			font-size: 26upx;
			font-weight: bold;
			line-height: 1;
			display: block;
			margin-top: 6upx;
			&.up{
				transform:rotate(180deg);
				margin-top: -6upx;
			}
		}
	}
	.Yi-media{
		padding: 30upx;
		.media-bd{
			.desc{ line-height: 1.5;font-size: 32upx; font-weight: 600;}
			.maxpic{
				margin-top: 20upx;
				//border-radius: 12upx;
				overflow: hidden;
				position: relative;
				// background-color: #e0e0e0;
				background-color: #000;
				margin-left: -30upx;
				margin-right: -30upx;
				&.maxh{
					max-height: 1000upx;
				}
				
			}
		}
		.media-ft{
			margin-top: 24upx;
			.txt_info{
				font-size: 24upx;
				color: #999;
				height: 44upx;
				line-height: 44upx;
			}
			.ft_l .txt_info{
				margin-right: 40upx;
			}
			
		}

	}
</style>
