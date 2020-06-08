<template>
	<view class="content" style="height: 100%;">
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
		<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
			<!-- 首页 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-recom" scroll-y>
					<!-- 机构 -->
					<view class="Yi-mechanism">
						<scroll-view class="Daren-swiper-tab" scroll-x>
							<block v-for="(item,index) in 4" :key="index">
							<view class="item" @click="tolink('/pages/homepage/homepage')">
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
							<view class="author flex-start" @click="tolink('/pages/homepage/homepage')">
								<view class="tx"><image src="@/static/default.png" mode="aspectFill"></image></view>
								<view class="name uni-ellipsis">kastyle</view>
								<view class="tochat" @click.stop="tolink('/pages/chat/chat?id=','login')"><image src="@/static/chat.png"></image></view>
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
							<view class="more c_999" @click="tolink('/pages/replylist/replylist?id=')">
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
					
				</scroll-view>
			</swiper-item>
			<!-- 资讯	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-news" scroll-y>
					<view class="Yi-newslist">
						<view class="Yi-media" v-for="(item,index) in 5" :key="index" @click="tolink('/pages/msgDetail/msgDetail')">
							<view class="media-bd">
								<view class="desc">
									一代舞坛传奇人物-Micheal，重温经典，回味依旧！一代舞坛传奇人物-Micheal，重温经典，回味依旧
								</view>
								<view class="maxpic">
									<image src="@/static/of/p1.jpg" mode="widthFix"></image>
								</view>
								<view class="media-ft flex-between">
									<view class="ft_l flex-start">
										<view class="txt_info">一舞</view>
										<view class="txt_info">2020-05-03</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 名师	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-User" scroll-y>
					<view class="Yi-Userlist">
						<view class="user-item" v-for="(item,index) in 6" :key="index">
							<view class="flex-between">
								<view class="author flex-start">
									<view class="tx"><image src="@/static/default.png" mode="aspectFill"></image></view>
									<view class="info">
										<view class="name uni-ellipsis">kastyle</view>
										<view class="fz12 c_999">关注人数：229</view>
									</view>
								</view>
								<view class="flow active">已关注</view>
							</view>
							<view class="introduce uni-mt10 uni-ellipsis2">
								毕业于广东舞蹈艺术学院毕业于广东舞蹈艺术学院，毕业于广东舞蹈艺术学院，毕业于广东舞蹈艺术学院毕业于广东舞蹈艺术学院
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 机构	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-mechanism" scroll-y>
					<view class="Yi-mechanismlist">
						<view class="mechanism-item" v-for="(item,index) in 6" :key="index">
							<view class="flex-between">
								<view class="author flex-start">
									<view class="tx"><image src="@/static/of/3.png" mode="aspectFill"></image></view>
									<view class="info">
										<view class="name uni-ellipsis">kastyle舞蹈机构</view>
										<view class="fz12 c_999">关注人数：229</view>
										<view class="introduce uni-ellipsis">
											专注舞蹈教育30年机构专注舞蹈教育30年
										</view>
									</view>
								</view>
								<view class="flow active">已关注</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 课程	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-course" scroll-y>
					<view class="Yi-courselist flexWrap flex-between">
						<view class="item" v-for="(item,index) in 6" :key="index" @click="tolink('/pages/videoDetails/videoDetails?id=')">
							<view class="maxpic">
								<image src="@/static/of/p1.jpg" mode="widthFix"></image>
								<view class="isplay"></view>
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">一舞拉丁黑色舞蹈现身材连衣裙</view>
								<view class="item_total">
									<view class="item_market">55人付款</view>
									<span class="item_price">￥79</span>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
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
						TypeName:"名师"
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
					this.setScrollLeft(index)
				}
			},
			changeTab(e) {
				let index = e.detail.current;
				let id= this.tabnav[index].Id;
				this.tabIndex = index;
				this.setScrollLeft(index);
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width+8;//8是margin值
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
			},
			getWidth(id) { //得到元素的宽
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff;
		// height: 100vh;
	}
</style>
