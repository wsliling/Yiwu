<template>
	<view>
		<view class="head">
			<view class="search">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search">请输入你想搜索的舞曲</text>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view style="height: 80px;"></view>
		<view class="music-content ">
			<!--轮播图-->
			<view class="index_swiper pd15 uni-mt10">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(item,index) in 3" :key="index">
						<view class="swiper-item">
							<image class="img" src="@/static/of/p1.jpg" mode="aspectFill"></image>
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
					 <image class="icon" src="@/static/music/icon15.png"></image>
					 <text class="txt">每日推荐</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="@/static/music/icon16.png"></image>
					 <text class="txt">最新推荐</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="@/static/music/icon17.png"></image>
					 <text class="txt">最热</text>
				 </view>
				 <view class="item">
					 <image class="icon" src="@/static/music/icon18.png"></image>
					 <text class="txt">最近播放</text>
				 </view>
			 </view>
			 <view class="music-list pd15">
				 <view class="item" v-for="(item,index) in 9 " :key="index">
					 <view class="img">
						 <image src="@/static/music/music-item.png"></image>
						<view class="img-top">
							<image class="icon" src="@/static/music/listen.png" mode=""></image>
							<span>2367</span>
						</view>
						<view class="img-bottom">
							<image class="play" src="@/static/music/play.png" mode=""></image>
						</view>
					 </view>
					 <view class="uni-ellipsis">桑巴舞曲精选</view>
				 </view>
				
				 
			 </view>
		</view>
		
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				currentSwiper :0,
				scrollLeft: 0,
				tabIndex:0,
				tabnav:[
					{
						Id:1,
						TypeName:"舞曲分类"
					},
					{
						Id:2,
						TypeName:"动态"
					},
					{
						Id:3,
						TypeName:"上传舞曲"
					}
				]
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		 computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		  },
		methods: {
			tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
				}
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.index-swiper-tab .item{
		width: 33.3333%;
	}
</style>
