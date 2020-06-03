<template>
	<view class="content">
		<view class="head">
			<view class="index_head flex-between">
				<view class="head_l">
					<image src="@/static/live.png" class="iconimg"></image>
				</view>
				<view class="title">视频</view>
				<view class="head_r">
					<image src="@/static/video.png" class="iconimg"></image>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view style="height: 80px;"></view>
		<view class="search">
			<view class="seachbox">
				<text class="uni-icon uni-icon-search">请输入搜索关键字</text>
			</view>
		</view>
		<view class="videolist">
			<view class="Yi-media" v-for="(item,index) in 5" :key="index">
				<view class="media-bd">
					<view class="maxpic p_re">
						<image src="@/static/of/p1.jpg" mode="widthFix"></image>
						<view class="isplay"></view>
						<view class="desc">
							Michael Malitowski &Joanna Leunis，Rumba WSSDF 2016
						</view>
					</view>
					<view class="media-ft flex-between">
						<view class="ft_l flex-start">
							<view class="author flex-start">
								<view class="tx">
									<image src="@/static/default.png" mode="aspectFill"></image>
									<view class="islive">
										<view class="line line1"></view>
										<view class="line line2"></view>
										<view class="line line3"></view>
										<view class="txt">直播</view>
									</view>
								</view>
								<view class="name uni-ellipsis">kastyle</view>
							</view>
						</view>
						<view class="ft_r flex-end">
							<view class="txt_info like active">124</view>
							<view class="txt_info reply">678</view>
							<view class="txt_info share"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- #ifndef MP-WEIXIN -->
		<view style="height: 100upx;"></view>
		<!-- #endif -->
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
				scrollLeft: 0,
				tabIndex:0,
				tabnav:[
					{
						Id:1,
						TypeName:"推荐"
					},
					{
						Id:2,
						TypeName:"最新"
					},
					{
						Id:3,
						TypeName:"教学"
					},
					{
						Id:4,
						TypeName:"比赛"
					},
					{
						Id:5,
						TypeName:"练习"
					},
					{
						Id:6,
						TypeName:"全部"
					}
				]
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			
		},
		onShow(){
			
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		 },
		methods: {
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
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
	page{
		background: #fff;
	}
	.index-swiper-tab .item{
		width: 16.66%;
	}
</style>