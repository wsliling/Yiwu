<template>
	<view class="content" style="height: 100%;">
		<view class="head">
			<view class="index_head flex-between">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm"></ans-input>
				</view>
				<view class="head_r">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view style="height: 80px;"></view>
		<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
			<!-- 首页 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-recom" scroll-y @scrolltolower="loadMore('datalist')">
					<!-- 达人 -->
					<view class="Yi-mechanism" v-if="TeacherUserList.length">
						<scroll-view class="Daren-swiper-tab" scroll-x>
							<view class="item" v-for="(item,index) in TeacherUserList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
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
					<block v-if="datalist.length">
						<block v-for="(item,index) in datalist" :key="index">
							<block v-if="index==3&&recuserlist.length>0">
								<!-- 推荐用户 -->
								<view class="Yi-recomUser uni-mb10">
									<view class="Yi-hd flex-between">
										<view class="title">推荐用户</view>
										<!-- <view class="more">查看全部</view> -->
									</view>
									<view class="Yi-bd">
										<scroll-view class="User-swiper-tab" scroll-x>
											<view class="item" v-for="(e,i) in recuserlist" :key="i">
												<view class="uni-icon uni-icon-closeempty close" @click="closeuser(i)"></view>
												<view class="tx" @click="tolink('/pages/homepage/homepage?id='+e.Id)">
													<image :src="e.Avatar||'/static/default.png'" mode="aspectFill"></image>
												</view>
												<view class="name uni-ellipsis">
													{{e.NickName||'壹舞用户'}}
												</view>
												<view :class="['flow',e.IsFollow==1?'active':'']" @click="flow(e.Id,i,4)">
													{{e.IsFollow==1?'已关注':'关注'}}
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
									<view v-if="item.IsMy==0" @click="flow(item.MemberId,index,1)" :class="['flow',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
								</view>
								<view class="media-bd">
									<view class="desc">
										{{item.Title}}
									</view>
									<view :class="['maxpic',item.Type==0?'maxh':'']" v-if="item.PicImg||item.VideoUrl">
										<!-- <view v-if="item.VideoUrl" class="isplay"></view> -->
										<video v-if="item.Type==1" :src="item.VideoUrl" controls :show-mute-btn="true" :poster="item.PicImg"></video>
										<image v-if="item.Type==0" :src="item.PicImg" mode="widthFix"></image>
									</view>
									<view class="media-ft flex-between">
										<view class="ft_l flex-start">
											<view @click="likeBtn(item.Id,index)" :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum}}</view>
											<view class="txt_info reply" @click="tolink('/pages/replylist/replylist?id='+item.Id)">{{item.CommentNum}}</view>
											<view class="txt_info share"></view>
										</view>
										<view class="ft_r">
											<view @click="CollectBtn(item.Id,index)" :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
										</view>
									</view>
								</view>
								<view class="media-comment" v-if="item.CommentNum>0">
									<block v-for="(i,e) in item.EvaluateList" :key="e">
										<view class="comment-item" v-if="e<4">
											<text class="name">{{i.MemberName||'匿名用户'}}：</text>
											<text class="con">
												{{i.Comment}}
											</text>
										</view>
									</block>
									<view class="more c_999" v-if="item.CommentNum>4" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
										查看全部评论
									</view>
								</view>
							</view>
						</block>
						<view class="uni-tab-bar-loading" v-if="datalist.length">
							<uni-load-more :loadingType="datalistLoadingType"></uni-load-more>
						</view>	
					</block>
					<noData v-if="!datalist.length"></noData>
					
				</scroll-view>
			</swiper-item>
			<!-- 资讯	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-news" scroll-y @scrolltolower="loadMore('NewsList')">
					<view class="Yi-newslist" >
						<view class="Yi-media" v-for="(item,index) in NewsList" :key="index" @click="tolink('/pages/msgDetail/msgDetail?id='+item.Id)">
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
					<view class="uni-tab-bar-loading" v-if="NewsList.length">
						<uni-load-more :loadingType="NewsListLoadingType"></uni-load-more>
					</view>	
					<noData v-if="!NewsList.length"></noData>
				</scroll-view>
			</swiper-item>
			<!-- 名师	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-User" scroll-y @scrolltolower="loadMore('TeacherList')">
					<view class="Yi-Userlist">
						<view class="user-item" v-for="(item,index) in TeacherList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
							<view class="flex-between">
								<view class="author flex-start">
									<view class="tx"><image :src="item.Avatar||'/static/default.png'" mode="aspectFill"></image></view>
									<view class="info">
										<view class="name uni-ellipsis">{{item.Name}}</view>
										<view class="fz12 c_999">关注人数：{{item.FansNum}}</view>
									</view>
								</view>
								<view v-if="item.IsMy==0" @click.stop="flow(item.UserId,index,2)" :class="['flow',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
							</view>
							<view class="introduce uni-mt10 uni-ellipsis2">
								{{item.Introduction}}
							</view>
						</view>
					</view>
					<view class="uni-tab-bar-loading" v-if="TeacherList.length">
						<uni-load-more :loadingType="TeacherListLoadingType"></uni-load-more>
					</view>
				    <noData v-if="!TeacherList.length"></noData>
				</scroll-view>
			</swiper-item>
			<!-- 机构	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-mechanism" scroll-y @scrolltolower="loadMore('JiGouList')">
					<view class="Yi-mechanismlist">
						<view class="mechanism-item" v-for="(item,index) in JiGouList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.Id)">
							<view class="flex-between">
								<view class="author flex-start">
									<view class="tx"><image :src="item.Avatar||'/static/default.png'" mode="aspectFill"></image></view>
									<view class="info">
										<view class="name uni-ellipsis">{{item.Name}}</view>
										<view class="fz12 c_999">关注人数：{{item.FansNum}}</view>
										<view class="introduce uni-ellipsis">
											{{item.Introduction}}
										</view>
									</view>
								</view>
								<view v-if="item.IsMy==0" @click.stop="flow(item.Id,index,3)" :class="['flow',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
							</view>
						</view>
					</view>
					<view class="uni-tab-bar-loading" v-if="JiGouList.length">
						<uni-load-more :loadingType="JiGouListLoadingType"></uni-load-more>
					</view>
					<noData v-if="!JiGouList.length"></noData>
				</scroll-view>
			</swiper-item>
			<!-- 课程	 -->
			<swiper-item>
				<scroll-view class="swiper-item swiper-item-course" scroll-y @scrolltolower="loadMore('CourseList')">
					<view class="Yi-courselist flexWrap flex-between">
						<view class="item" v-for="(item,index) in CourseList" :key="index" @click="tolink('/pages/video/videoDetails/videoDetails?id='+item.Id)">
							<view class="maxpic">
								<image :src="item.PicImg" mode="aspectFill"></image>
								<view class="isplay"></view>
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">{{item.Title||'无标题'}}</view>
								<view class="item_total">
									<view class="item_market">{{item.Is_Charge==1?item.SalesNum+'人购买':item.Hits+'人点击'}}</view>
									<span class="item_price">{{item.Is_Charge==1?'￥'+item.Price:'免费'}}</span>
								</view>
							</view>
						</view>
					</view>
					<view class="uni-tab-bar-loading" v-if="CourseList.length">
						<uni-load-more :loadingType="CourseListLoadingType"></uni-load-more>
					</view>
					<noData v-if="!CourseList.length"></noData>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/notData.vue'; //暂无数据
	import ansInput from '@/components/ans-input/ans-input.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore,
			ansInput
		},
		data() {
			return {
				userId: "",
				token: "",
				searchText:'',
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
				pageSize:8,
				noDataIsShow: false,

				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],////推荐视频
				datalistPage:1,
				datalistLoadingType:0,//0加载前，1加载中，2没有更多了
				NewsList:[],//资讯
				NewsListPage:1,
				NewsListLoadingType:0,//0加载前，1加载中，2没有更多了
				TeacherList:[],//名师
				TeacherListPage:1,
				TeacherListLoadingType:0,
				JiGouList:[],//机构
				JiGouListPage:1,
				JiGouListLoadingType:0,
				CourseList:[],//课程
				CourseListPage:1,
				CourseListLoadingType:0,
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.init();
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		 },
		methods: {
			init(){
				this.recuserlist=[],//推荐用户
				this.TeacherUserList=[],//推荐的名师
				this.datalist=[],////推荐视频
				this.datalistPage=1,
				this.datalistLoadingType=0,//0加载前，1加载中，2没有更多了
				this.NewsList=[],//资讯
				this.NewsListPage=1,
				this.NewsListLoadingType=0,//0加载前，1加载中，2没有更多了
				this.TeacherList=[],//名师
				this.TeacherListPage=1,
				this.TeacherListLoadingType=0,
				this.JiGouList=[],//机构
				this.JiGouListPage=1,
				this.JiGouListLoadingType=0,
				this.CourseList=[],//课程
				this.CourseListPage=1,
				this.CourseListLoadingType=0;
				this.IndexRecommend();
				this.GetReCommendMember();
				this.getRecommendUser();
				this.YWNewsList();
				this.GetTeacher();
				this.GetJiGouList();
				this.GetCourseList();
			},
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.page=1;
				switch(this.tabIndex*1){
					case 0:
						this.datalist=[],////推荐视频
						this.datalistPage=1,
						this.datalistLoadingType=0,//0加载前，1加载中，2没有更多了
						this.IndexRecommend();
						break;
					case 1:
						this.NewsList=[],//资讯
						this.NewsListPage=1,
						this.NewsListLoadingType=0,//0加载前，1加载中，2没有更多了
						this.YWNewsList();
						break;
					case 2:
						this.TeacherList=[],//名师
						this.TeacherListPage=1,
						this.TeacherListLoadingType=0,
						this.GetTeacher();
						break;
					case 3:
						this.JiGouList=[],//机构
						this.JiGouListPage=1,
						this.JiGouListLoadingType=0,
						this.GetJiGouList();
						break;
					case 4:
						this.CourseList=[],//课程
						this.CourseListPage=1,
						this.CourseListLoadingType=0;
						this.GetCourseList();
						break;
				}
			},
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
			tapTab(index) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					// this.page=1;
					// this.noDataIsShow=false;
					this.tabIndex = index;
					this.setScrollLeft(index)
					// this.fun(index);
					// if(index==0){
					// 	this.GetDancerList();
					// 	this.GetReCommendMember();
					// }
				}
			},
			changeTab(e) {
				// this.page=1;
				// this.noDataIsShow=false;
				let index = e.detail.current;
				let id= this.tabnav[index].Id;
				this.tabIndex = index;
				this.setScrollLeft(index);
				// this.fun(index);
				// if(index==0){
				// 	this.GetDancerList();
				// 	this.GetReCommendMember();
				// }
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
			//获取推荐名师
			async getRecommendUser(){
				let res = await post("User/GetDancerList", {
					IsRecommend:1
				});
				this.TeacherUserList=res.data;
			},
			//获取推荐大人
			async GetReCommendMember(){
				let result = await post("User/GetReCommendMember", {
					UserId:this.userId,
					Token:this.token,
					page:1,
					pageSize:20
				});
				if(result.code==0){
					this.recuserlist=result.data;
				}
			},
			closeuser(index){
				this.recuserlist.splice(index,1);
			},
			//推荐视频
			async IndexRecommend(){
				let result = await post("Find/IndexRecommend", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.datalistPage,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.datalistPage === 1) {
						this.datalist = result.data;
					}
					if (this.datalistPage > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.datalistLoadingType = 2;
					} else {
						this.datalistLoadingType = 0
					}
				}
			},
			//分页获取资讯
			async YWNewsList(){
				let result = await post("News/YWNewsList", {
					UserId:this.userId,
					Token:this.token,
					Keywords:this.searchText,
					page:this.NewsListPage,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.NewsListPage === 1) {
						this.NewsList = result.data;
					}
					if (this.NewsListPage > 1) {
						this.NewsList = this.NewsList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.NewsListLoadingType = 2;
					} else {
						this.NewsListLoadingType = 0
					}
				}
			},
			//分页获取名师
			async GetTeacher(){
				let result = await post("User/GetDancerList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.TeacherListPage,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.TeacherListPage === 1) {
						this.TeacherList = result.data;
					}
					if (this.TeacherListPage > 1) {
						this.TeacherList = this.TeacherList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.TeacherListLoadingType = 2;
					} else {
						this.TeacherListLoadingType = 0
					}
				}
			},
			//分页获取机构
			async GetJiGouList(){
				let result = await post("User/GetJiGouList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.JiGouListPage,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.JiGouListPage === 1) {
						this.JiGouList = result.data;
					}
					if (this.JiGouListPage > 1) {
						this.JiGouList = this.JiGouList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.JiGouListLoadingType = 2;
					} else {
						this.JiGouListLoadingType = 0
					}
				}
			},
			//分页获取课程
			async GetCourseList(){
				let result = await post("Course/GetCourseOutlineList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.CourseListPage,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.CourseListPage === 1) {
						this.CourseList = result.data;
					}
					if (this.CourseListPage > 1) {
						this.CourseList = this.CourseList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.CourseListLoadingType = 2;
					} else {
						this.CourseListLoadingType = 0
					}
				}
			},
			fun(index){
				if(index==0){
					this.IndexRecommend();
				}else if(index==1){
					this.YWNewsList();
				}else if(index==2){
					this.GetTeacher();
				}else if(index==3){
					this.GetJiGouList();
				}else if(index==4){
					this.GetCourseList();
				}
			},
			loadMore(key) {
				console.log(key)
				if(this[key+'LoadingType']===2)return;
				this[key+'Page']++;
				this.fun(this.tabIndex);
			},
			//关注取消关注 followtype 1推荐视频用户 2名师 3机构 4推荐用户
			async flow(id,index,followtype){
				let result = await post("Find/FollowOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId":id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(followtype==1){
						let isf=0;
						if(this.datalist[index].IsFollow==0){
							isf=1;
						}else{
							isf=0;
						}
						_this.datalist.forEach(function(item){
							if(item.MemberId==id){
								_this.$set(item,"IsFollow",isf)
							}
						})
					}else if(followtype==2){
						if(this.TeacherList[index].IsFollow==0){
							this.$set(this.TeacherList[index],"IsFollow",1)
						}else{
							this.$set(this.TeacherList[index],"IsFollow",0)
						}
					}else if(followtype==3){
						if(this.JiGouList[index].IsFollow==0){
							this.$set(this.JiGouList[index],"IsFollow",1)
						}else{
							this.$set(this.JiGouList[index],"IsFollow",0)
						}
					}else if(followtype==4){
						if(this.recuserlist[index].IsFollow==0){
							this.$set(this.recuserlist[index],"IsFollow",1)
						}else{
							this.$set(this.recuserlist[index],"IsFollow",0)
						}
					}
					
				}else if(result.code==2){
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			//发现收藏和取消收藏
			async CollectBtn(id,index){
				let result = await post("Find/CollectOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId":id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(this.datalist[index].IsCollect==0){
						this.$set(this.datalist[index],"IsCollect",1)
					}else{
						this.$set(this.datalist[index],"IsCollect",0)
					}
				}else if(result.code==2){
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			//发现点赞
			async likeBtn(id,index){
				let result = await post("Find/FindlikeOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId":id
				});
				if(result.code==0){
					let _this=this;
					let num=0;
					uni.showToast({
						title: result.msg
					})
					if(this.datalist[index].IsLike==0){
						this.$set(this.datalist[index],"IsLike",1)
						this.$set(this.datalist[index],"LikeNum",_this.datalist[index].LikeNum++)
					}else{
						this.$set(this.datalist[index],"IsLike",0)
						this.$set(this.datalist[index],"LikeNum",_this.datalist[index].LikeNum--)
					}
				}else if(result.code==2){
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
				}
			},
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.init();
			uni.stopPullDownRefresh();
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
