<template>
	<view>
		<view class="pd15 heade">
			<view class="user">
				<image class="left" src="@/static/of/2.png"></image>
				<view class="right">
					<view class="name">
						<view>KASTYLE</view>
						<image src="@/static/V.png" mode="widthFix"></image>
					</view>
					<view class="list">
						<view class="item">
							<view>25</view>
							<span>粉丝</span>
						</view>
						<view class="item">
							<view>628</view>
							<span>被赞</span>
						</view>
						<view class="item">
							<view>221</view>
							<span>关注</span>
						</view>
					</view>
				</view>
			</view>
			<view class="text">毕业于广东舞蹈艺术学院 毕业于广州体育学院 17年艺术联考校内第一名 广东省深圳体育舞 蹈锦标赛B组冠军</view>
		</view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view :style="'width:'+tabWidth+'%'" v-for="(tab,index) in tab" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.id)">{{tab.taptitle}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</scroll-view>
		<view class="profile" v-if="tabIndex==0">
			<view class="profile-center">
				<image src="@/static/of/p3.jpg"></image>
				<view class="profile-txt">
					<view>机构名称：</view>
					<span>花儿舞蹈机构</span>
				</view>
				<view class="profile-txt">
					<view>地址：</view>
					<span>广东省深圳市龙华区</span>
				</view>
				<view class="profile-txt">
					<view>联系方式：</view>
					<span>1887654321</span>
				</view>
			</view>
			<view class="bottom-box">
				<view class="box">
					<view>
						<image src="@/static/attention.png"></image>
						<span>关注</span>
					</view>
					<view>
						<image src="@/static/chat1.png"></image>
						<span>极速联系</span>
					</view>
				</view>
			</view>
		</view>
		<view class="play-box" v-if="tabIndex==1">
			<view class="item" v-for="(item,index1) in 9 " :key="index1">
				<image src="@/static/music/music-item.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="music-box" v-if="tabIndex==2">
			<view class="item" v-for="(item,index1) in 9 " :key="index1">
				<image src="@/static/music/music-item.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="product-box" v-if="tabIndex==4">
			<view class="item" v-for="(item,index4) in 2" :key="index4">
				<image class="img" src="@/static/of/banner.jpg"></image>
				<view class="product">
					<view class="list" v-for="(item1,index41) in 3" :key="index41">
						<image src="@/static/of/pro1.jpg" mode="widthFix"></image>
						<view>壹舞拉丁黑色4654646546</view>
						<span>￥79.99</span>
					</view>
				</view>
			</view>
			<view class="bottom-box">
				<view class="box">
					<view>
						<image src="@/static/attention.png"></image>
						<span>关注</span>
					</view>
					<view>
						<image src="@/static/chat1.png"></image>
						<span>极速联系</span>
					</view>
				</view>
			</view>
		</view>
		<view class=""></view>
		<view class="intro"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scrollLeft: 0,
			tabIndex:0,
			tab: [
				{
					id: 0,
					taptitle: '简介'
				},
				{
					id: 1,
					taptitle: '视频'
				},
				{
					id: 2,
					taptitle: '舞曲'
				},
				{
					id: 3,
					taptitle: '图片'
				},
				{
					id: 4,
					taptitle: '产品'
				}
			]
		};
	},
	computed: {
	   tabStyle(){
	     return ((750/this.tab.length)*this.tabIndex)+(((750/this.tab.length)-68)/2)
	   },
	   tabWidth(){
		   return (100/this.tab.length)
	   }
	 },
	 methods:{
		 tapTab(index,id) { //点击tab-bar
		 	if (this.tabIndex === index) {
		 		return false;
		 	} else {
		 		this.tabIndex = index;
		 	}
		 },
	 }
};
</script>

<style lang="scss">
@import './style.scss';

.index-swiper-tab{
	border-bottom: 1upx solid #ededed;
}
</style>
