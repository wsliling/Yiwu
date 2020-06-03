<template>
	<view>
		<view class="searchbox">
			<image src="../../../static/tabbar/music/serch.png" mode="aspectFit"></image>
			<input type="text" placeholder="请输入你想搜索的舞曲">
		</view>
		<view class="tab" scroll-x :show-scrollbar="false" style="display: flex;">
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view class="music-content">
			<swiper class="swiper" :indicatorDots="true" indicator-active-color="#fff" indicator-color="rgba(255,255,255,0.5)" :autoplay="true" :circular="true">
				<swiper-item  v-for="(item,index) in 3 " :key="index">
					<image src="@/static/of/p1.jpg" ></image>
				</swiper-item>
				
			 </swiper>
			 <view class="music-fl">
				 <view class="list">
					 <image src="@/static/tabbar/music/icon15.png" mode="aspectFit"></image>
					 <view>每日推荐</view>
				 </view>
				 <view class="list">
					 <image src="@/static/tabbar/music/icon16.png" mode="aspectFit"></image>
					 <view>最新推荐</view>
				 </view>
				 <view class="list">
					 <image src="@/static/tabbar/music/icon17.png" mode="aspectFit"></image>
					 <view>最热</view>
				 </view>
				 <view class="list">
					 <image src="@/static/tabbar/music/icon18.png" mode="aspectFit"></image>
					 <view>最近播放</view>
				 </view>
			 </view>
			 <view class="music-list">
				 <view class="item" v-for="(item,index) in 9 " :key="index">
					 <view class="img">
						 <image src="@/static/tabbar/music/music-item.png"></image>
						<view class="img-top">
							<image class="icon" src="@/static/tabbar/music/listen.png" mode=""></image>
							<span>2367</span>
						</view>
						<view class="img-bottom">
							<image class="play" src="@/static/tabbar/music/play.png" mode=""></image>
						</view>
					 </view>
					 <view>桑巴舞曲精选</view>
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
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
