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
				<scroll-view class="swiper-item swiper-item-recom" scroll-y  @scrolltolower="loadMore(tabIndex)">
					<!-- 机构 -->
					<view class="Yi-mechanism">
						<scroll-view class="Daren-swiper-tab" scroll-x>
							<view class="item" v-for="(item,index) in Dancerlist" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
								<view class="tx">
									<image :src="item.Avatar||'/static/default.png'" mode="aspectFill"></image>
								</view>
								<view class="name uni-ellipsis">
									{{item.Name}}
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 图文 -->
					<block v-if="hasData">
						<block v-for="(item,index) in datalist" :key="index">
							<block v-if="index==3&&recuserlist.length>0">
								<!-- 推荐用户 -->
								<view class="Yi-recomUser uni-mb10">
									<view class="Yi-hd flex-between">
										<view class="title">推荐用户</view>
										<view class="more">查看全部</view>
									</view>
									<view class="Yi-bd">
										<scroll-view class="User-swiper-tab" scroll-x>
											<view class="item" v-for="(item,index) in recuserlist" :key="index">
												<view class="uni-icon uni-icon-closeempty close"></view>
												<view class="tx">
													<image :src="item.Avatar||'/static/default.png'" mode="aspectFill"></image>
												</view>
												<view class="name uni-ellipsis">
													{{item.NickName}}
												</view>
												<view class="flow">
													关注
												</view>
											</view>
										</scroll-view>
									</view>
								</view>
							</block>
							<view class="Yi-media">
								<view class="media-hd flex-between">
									<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">
										<view class="tx"><image :src="item.Avatar||'/static/default.png'" mode="aspectFill"></image></view>
										<view class="name uni-ellipsis">{{item.NickName}}</view>
										<view class="tochat" @click.stop="tolink('/pages/chat/chat?id='+item.MemberId,'login')"><image src="/static/chat.png"></image></view>
									</view>
									<view :class="['flow',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
								</view>
								<view class="media-bd">
									<view class="desc">
										{{item.Title}}
									</view>
									<view class="maxpic" v-if="item.PicImg||item.VideoUrl">
										<image :src="item.PicImg" mode="widthFix"></image>
										<view v-if="item.VideoUrl" class="isplay"></view>
									</view>
									<view class="media-ft flex-between">
										<view class="ft_l flex-start">
											<view :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum}}</view>
											<view class="txt_info reply">{{item.CommentNum}}</view>
											<view class="txt_info share"></view>
										</view>
										<view class="ft_r">
											<view :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
										</view>
									</view>
								</view>
								<view class="media-comment" v-if="item.CommentNum>0">
									<view class="comment-item" v-if="e<4" v-for="(i,e) in item.EvaluateList" :key="e">
										<text class="name">{{i.MemberName||'匿名用户'}}：</text>
										<text class="con">
											{{i.Comment}}
										</text>
									</view>
									<view class="more c_999" v-if="item.CommentNum>4" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
										查看全部评论
									</view>
								</view>
							</view>
						</block>
						<view class="uni-tab-bar-loading">
							<uni-load-more :loadingType="loadingType"></uni-load-more>
						</view>	
					</block>
					<noData :isShow="noDataIsShow"></noData>
					
				</scroll-view>
			</swiper-item>
			<!-- 资讯	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-news" scroll-y @scrolltolower="loadMore(tabIndex)">
					<view class="Yi-newslist" v-if="hasnews">
						<view class="Yi-media" v-for="(item,index) in NewsList" :key="index" @click="tolink('/pages/msgDetail/msgDetail?id='+item.Id)">
							<view class="media-bd">
								<view class="desc">
									{{item.Title}}
								</view>
								<view class="maxpic" v-if="item.Logo">
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
					<view class="uni-tab-bar-loading" v-if="hasnews">
						<uni-load-more :loadingType="loadingType"></uni-load-more>
					</view>	
					<noData :isShow="noDataIsShow"></noData>
				</scroll-view>
			</swiper-item>
			<!-- 名师	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-User" scroll-y>
					<view class="Yi-Userlist">
						<view class="user-item" v-for="(item,index) in 6" :key="index" @click="tolink('/pages/homepage/homepage')">
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
						<view class="mechanism-item" v-for="(item,index) in 6" :key="index" @click="tolink('/pages/homepage/homepage')">
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
						<view class="item" v-for="(item,index) in 6" :key="index" @click="tolink('/pages/video/videoDetails/videoDetails?id=')">
							<view class="maxpic">
								<image src="@/static/of/p1.jpg" mode="widthFix"></image>
								<view class="isplay"></view>
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">壹舞拉丁黑色舞蹈现身材连衣裙</view>
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
				],
				page:1,
				pageSize:6,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,//是否有推荐视频
				hasnews:false,//是否有资讯
				noDataIsShow: false,
				Dancerlist:[],//达人
				recuserlist:[],//推荐用户
				datalist:[],//推荐视频
				NewsList:[],//资讯
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.GetDancerList();
			this.IndexRecommend();
			this.GetReCommendMember();
			this.YWNewsList();
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
					this.page=1;
					this.tabIndex = index;
					this.setScrollLeft(index)
				}
			},
			changeTab(e) {
				this.page=1;
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
			//获取推荐大人
			async GetDancerList(){
				let result = await post("User/GetDancerList", {
					IsRecommend:1
				});
				if(result.code==0){
					this.Dancerlist=result.data;
				}
			},
			//获取推荐大人
			async GetReCommendMember(){
				let result = await post("User/GetReCommendMember", {});
				if(result.code==0){
					this.recuserlist=result.data;
				}
			},
			//推荐视频
			async IndexRecommend(){
				let result = await post("Find/IndexRecommend", {
					page:this.page,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			//分页获取资讯
			async YWNewsList(){
				let result = await post("News/YWNewsList", {
					page:this.page,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (result.data.length > 0) {
						this.hasnews = true;
						this.noDataIsShow = false;
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasnews = false;
					}
					if (this.page === 1) {
						this.NewsList = result.data;
					}
					if (this.page > 1) {
						this.NewsList = this.NewsList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			loadMore(e) {
				console.log(e)
				if (this.isLoad) {
					this.loadingType = 1;
					this.page++;
					if(e==0){
						this.IndexRecommend();
					}
				} else {
					this.loadingType = 2;
				}
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
