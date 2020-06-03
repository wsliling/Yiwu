<template>
	<view class="content">
		<view class="head">
			<view class="index_head flex-between">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search">请输入搜索关键字</text>
				</view>
				<view class="head_r">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view style="height: 80px;"></view>
		<!-- 机构 -->
		<view class="Yi-mechanism">
			<scroll-view class="Daren-swiper-tab" scroll-x>
				<block v-for="(item,index) in 4" :key="index">
				<view class="item">
					<view class="tx">
						<image src="@/static/of/1.png" mode="aspectFill"></image>
					</view>
					<view class="name uni-ellipsis">
						cammile
					</view>
				</view>
				<view class="item">
					<view class="tx">
						<image src="@/static/of/2.png" mode="aspectFill"></image>
					</view>
					<view class="name uni-ellipsis">
						拉丁舞社
					</view>
				</view>
				</block>
			</scroll-view>
		</view>
		<!-- 图文 -->
		<view class="Yi-media">
			<view class="media-hd flex-between">
				<view class="author flex-start">
					<view class="tx"><image src="@/static/default.png" mode="aspectFill"></image></view>
					<view class="name uni-ellipsis">kastyle</view>
					<view class="tochat"><image src="@/static/chat.png"></image></view>
				</view>
				<view class="flow">关注</view>
			</view>
			<view class="media-bd">
				<view class="desc">
					Michael Malitowski &Joanna Leunis，Rumba WSSDF 2016
				</view>
				<view class="maxpic">
					<image src="@/static/of/p1.jpg" mode="widthFix"></image>
					<view class="isplay"></view>
				</view>
				<view class="media-ft flex-between">
					<view class="ft_l flex-start">
						<view class="txt_info like active">124</view>
						<view class="txt_info reply">678</view>
						<view class="txt_info share"></view>
					</view>
					<view class="ft_r">
						<view class="txt_info sign active"></view>
					</view>
				</view>
			</view>
			<view class="media-comment">
				<view class="comment-item">
					<text class="name">不开心的小屋：</text>
					<text class="con">
						跳的真的太棒了，我喜欢，你们喜欢吗
					</text>
				</view>
				<view class="comment-item">
					<text class="name">lampopo：</text>
					<text class="con">
						nice
					</text>
				</view>
				<view class="comment-item">
					<text class="name">不开心的小屋：</text>
					<text class="con">
						跳的真的太棒了，我喜欢，你们喜欢吗
					</text>
				</view>
				<view class="more c_999">
					查看全部评论
				</view>
			</view>
		</view>
		<view class="Yi-media">
			<view class="media-hd flex-between">
				<view class="author flex-start">
					<view class="tx"><image src="@/static/default.png" mode="aspectFill"></image></view>
					<view class="name uni-ellipsis">kastyle</view>
					<view class="tochat"><image src="@/static/chat.png"></image></view>
				</view>
				<view class="flow active">已关注</view>
			</view>
			<view class="media-bd">
				<view class="desc">
					Michael Malitowski &Joanna Leunis，Rumba WSSDF 2016
				</view>
				<view class="maxpic">
					<image src="@/static/of/p1.jpg" mode="widthFix"></image>
				</view>
				<view class="media-ft flex-between">
					<view class="ft_l flex-start">
						<view class="txt_info like">124</view>
						<view class="txt_info reply">678</view>
						<view class="txt_info share"></view>
					</view>
					<view class="ft_r">
						<view class="txt_info sign"></view>
					</view>
				</view>
			</view>
			<view class="media-comment">
				<view class="comment-item">
					<text class="name">不开心的小屋：</text>
					<text class="con">
						跳的真的太棒了，我喜欢，你们喜欢吗
					</text>
				</view>
				<view class="comment-item">
					<text class="name">lampopo：</text>
					<text class="con">
						nice
					</text>
				</view>
				<view class="comment-item">
					<text class="name">不开心的小屋：</text>
					<text class="con">
						跳的真的太棒了，我喜欢，你们喜欢吗跳的真的太棒了，我喜欢，
					</text>
				</view>
				<view class="more c_999">
					查看全部评论
				</view>
			</view>
		</view>
		<!-- 推荐用户 -->
		<view class="Yi-recomUser uni-mb10">
			<view class="Yi-hd flex-between">
				<view class="title">推荐用户</view>
				<view class="more">查看全部</view>
			</view>
			<view class="Yi-bd">
				<scroll-view class="User-swiper-tab" scroll-x>
					<view class="item" v-for="(item,index) in 4" :key="index">
						<view class="uni-icon uni-icon-closeempty close"></view>
						<view class="tx">
							<image src="@/static/of/1.png" mode="aspectFill"></image>
						</view>
						<view class="name uni-ellipsis">
							cammile
						</view>
						<view class="flow">
							关注
						</view>
					</view>
				</scroll-view>
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
						TypeName:"资讯"
					},
					{
						Id:3,
						TypeName:"达人"
					},
					{
						Id:4,
						TypeName:"机构"
					},
					{
						Id:5,
						TypeName:"课程"
					}
				]
			}
		},
		components: {
			
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
</style>
