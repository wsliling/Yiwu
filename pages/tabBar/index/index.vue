<template>
	<view class="content bg_fff">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="index_head flex-between">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm"></ans-input>
				</view>
				<!-- #ifndef H5 -->
				<view class="head_r" @click="scanCode">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
				<!-- #endif -->
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view :style="{'height':(80+barHeight)+'px'}"></view>
		<!-- 首页 -->
		<view class="index-item index-item-0" v-if="tabIndex==0">
			<!-- 达人 -->
			<view class="Yi-mechanism" v-if="TeacherUserList.length">
				<scroll-view class="Daren-swiper-tab" scroll-x>
					<view class="item" v-for="(item,index) in TeacherUserList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
						<view class="tx">
							<image :src="item.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill"></image>
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
					<!-- 推荐用户 -->
					<view class="Yi-recomUser uni-mb10" v-if="index==3&&recuserlist.length>0">
						<view class="Yi-hd flex-between">
							<view class="title">推荐用户</view>
							<!-- <view class="more">查看全部</view> -->
						</view>
						<view class="Yi-bd">
							<scroll-view class="User-swiper-tab" scroll-x>
								<view class="item" v-for="(e,i) in recuserlist" :key="i">
									<view class="uni-icon uni-icon-closeempty close" @click="closeuser(i)"></view>
									<view class="tx" @click="tolink('/pages/homepage/homepage?id='+e.Id)">
										<image :src="e.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill"></image>
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
					<view class="Yi-media">
						<view class="media-hd flex-between">
							<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">
								<view class="tx"><image :src="item.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill"></image></view>
								<view class="name uni-ellipsis">{{item.NickName}}</view>
								<view class="tochat" @click.stop="tolink('/pages/chat/chat?id='+item.MemberId,'login')"><image src="http://yw.wtvxin.com/static/chat.png"></image></view>
							</view>
							<view v-if="item.IsMy==0" @click="flow(item.MemberId,index,1)" :class="['flow',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
						</view>
						<view class="media-bd">
							<view class="desc" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
								{{item.Title}}
							</view>
							<view :class="['maxpic',item.fixed?'dis':'']" v-if="item.Type==1" :id="'box'+item.Id">
								<view v-if="!item.play||item.fixed" class="isplay" @click="playBtn(index,item.Id)"></view>
								<video v-if="item.play" :src="item.VideoUrl" controls autoplay @play="playVideo(item.Id)" @pause="pauseVideo(item.Id)" :id="'video'+item.Id" :show-mute-btn="true" :poster="item.PicImg" object-fit="cover"></video>
								<image class="postpic" :src="item.PicImg" mode="aspectFill"></image>
							</view>
							<view class="maxpic maxh" v-if="item.Type==0&&item.PicImg">
								<image :src="item.PicImg" mode="widthFix"></image>
							</view>
							<view class="media-ft flex-between">
								<view class="ft_l flex-start">
									<view @click="likeBtn(item.Id,index)" :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum}}</view>
									<view class="txt_info reply" @click="tolink('/pages/replylist/replylist?id='+item.Id)">{{item.CommentNum}}</view>
									<share wxUrl="/pages/tabBar/index/index" :h5Url="'/pages/replylist/replylist?id='+item.Id">
										<view class="txt_info share"></view>
									</share>
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
					<uni-load-more :loadingType="LoadingType0"></uni-load-more>
				</view>	
			</block>
			<noData v-if="!datalist.length"></noData>
		</view>
		<!-- 资讯	 -->
		<view class="index-item index-item-1" v-if="tabIndex==1">
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
				<uni-load-more :loadingType="LoadingType1"></uni-load-more>
			</view>	
			<noData v-if="!NewsList.length"></noData>
		</view>
		<!-- 名师	 -->
		<view class="index-item index-item-2" v-if="tabIndex==2" style="background: #f7f7f7;">
			<view class="Yi-Userlist">
				<view class="user-item uni-bg-white uni-mb10" v-for="(item,index) in TeacherList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
					<view class="flex-between">
						<view class="author flex-start">
							<view class="tx"><image :src="item.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill"></image></view>
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
				<uni-load-more :loadingType="LoadingType2"></uni-load-more>
			</view>
			<noData v-if="!TeacherList.length"></noData>
		</view>
		<!-- 机构	 -->
		<view class="index-item index-item-3" v-if="tabIndex==3" style="background: #f7f7f7;">
			<view class="Yi-mechanismlist">
				<view class="mechanism-item uni-bg-white uni-mb10" v-for="(item,index) in JiGouList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.Id)">
					<view class="flex-between">
						<view class="author flex-start">
							<view class="tx"><image :src="item.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill"></image></view>
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
				<uni-load-more :loadingType="LoadingType3"></uni-load-more>
			</view>
			<noData v-if="!JiGouList.length"></noData>
		</view>
		<!-- 课程	 -->
		<view class="index-item index-item-4" v-if="tabIndex==4">
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
				<uni-load-more :loadingType="LoadingType4"></uni-load-more>
			</view>
			<noData v-if="!CourseList.length"></noData>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/notData.vue'; //暂无数据
	import ansInput from '@/components/ans-input/ans-input.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import share from '@/components/share/share.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore,
			ansInput,share	
		},
		data() {
			return {
				userId: "",
				token: "",
				barHeight:0,
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
				isLoad: false,
				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],////推荐视频
				Page0:1,
				LoadingType0:0,//0加载前，1加载中，2没有更多了
				NewsList:[],//资讯
				Page1:1,
				LoadingType1:0,//0加载前，1加载中，2没有更多了
				TeacherList:[],//名师
				Page2:1,
				LoadingType2:0,//0加载前，1加载中，2没有更多了
				JiGouList:[],//机构
				Page3:1,
				LoadingType3:0,//0加载前，1加载中，2没有更多了
				CourseList:[],//课程
				Page4:1,
				LoadingType4:0,//0加载前，1加载中，2没有更多了
				videoContext:null,
				onplayId:-1,//当前播放视频id
				onplayIndex:-1,//当前播放视频序号
				onplayHeight:0,//当前播放视频距离顶部的高度
				index0:0,
				index1:0,
				index2:0,
				index3:0,
				index4:0,
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.init(0);
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
			init(index){
				if(index==0){
					this.recuserlist=[];//推荐用户
					this.TeacherUserList=[];//推荐的名师
					this.datalist=[];////推荐视频
					this.Page0=1;
					this.LoadingType0=0;//0加载前，1加载中，2没有更多了
					this.IndexRecommend();
					this.GetReCommendMember();
					this.getRecommendUser();
				}
				if(index==1){
					this.NewsList=[];//资讯
					this.Page1=1;
					this.LoadingType1=0;//0加载前，1加载中，2没有更多了
					this.YWNewsList();
				}
				if(index==2){
					this.TeacherList=[];//名师
					this.Page2=1;
					this.LoadingType2=0;
					this.GetTeacher();
				}
				if(index==3){
					this.JiGouList=[];//机构
					this.Page3=1;
					this.LoadingType3=0;
					this.GetJiGouList();
				}
				if(index==4){
					this.CourseList=[];//课程
					this.Page4=1;
					this.LoadingType4=0;
					this.GetCourseList();
				}
			},
			pauseVideo(id){
				for(let i=0; i<this.datalist.length;i++){
					let _id=this.datalist[i].Id;
					if(_id==id){
						this.onplayId=id;
						this.onplayIndex=i;
						this.$set(this.datalist[i],'fixed',true);
					}
				}
			},
			playVideo(id){
				for(let i=0; i<this.datalist.length;i++){
					let _id=this.datalist[i].Id;
					if(_id==id){
						this.onplayId=id;
						this.onplayIndex=i;
						this.$set(this.datalist[i],'fixed',false);
					}
				}
			},
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.page=1;
				switch(this.tabIndex*1){
					case 0:
						this.datalist=[];////推荐视频
						this.Page0=1;
						this.LoadingType0=0;//0加载前，1加载中，2没有更多了
						this.IndexRecommend();
						break;
					case 1:
						this.NewsList=[];//资讯
						this.Page1=1;
						this.LoadingType1=0;//0加载前，1加载中，2没有更多了
						this.YWNewsList();
						break;
					case 2:
						this.TeacherList=[];//名师
						this.Page2=1;
						this.LoadingType2=0;
						this.GetTeacher();
						break;
					case 3:
						this.JiGouList=[];//机构
						this.Page3=1;
						this.LoadingType3=0;
						this.GetJiGouList();
						break;
					case 4:
						this.CourseList=[];//课程
						this.Page4=1;
						this.LoadingType4=0;
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
				let _this = this;
				if (this.tabIndex === index) {
					return false;
				} else {
					if(this.onplayIndex>-1&&index!=0){
						this.$set(_this.datalist[_this.onplayIndex],'fixed',false);
						this.$set(_this.datalist[_this.onplayIndex],'play',false);
					}
					this.tabIndex = index;
					this.setScrollLeft(index);
					if((this.index0==0&&index==0)||(this.index1==0&&index==1)||(this.index2==0&&index==2)||(this.index3==0&&index==3)||(this.index4==0&&index==4)){
						this.init(index);
					}
				}
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
				this.index0++;
				let result = await post("Find/IndexRecommend", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page0,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if(result.data.length>0){
						for(let i=0;i<result.data.length;i++){
							this.$set(result.data[i],'play',false);
							this.$set(result.data[i],'fixed',false);
						}
						
					}
					if (this.Page0 === 1) {
						this.datalist = result.data;
					}
					if (this.Page0 > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType0 = 2;
					} else {
						this.LoadingType0 = 0
					}
				}
			},
			playBtn(index,id){
				let _this = this;
				this.datalist.forEach(function(item){
					if(id==item.Id){
						_this.$set(item,'play',true);
						_this.$set(item,'fixed',false);
						setTimeout(()=>{
							_this.videoContext=uni.createVideoContext('video'+item.Id);
							_this.videoContext.play();
						},500)
					}else{
						_this.$set(item,'play',false);
					}
				})
			},
			//分页获取资讯
			async YWNewsList(){
				this.index1++;
				let result = await post("News/YWNewsList", {
					UserId:this.userId,
					Token:this.token,
					Keywords:this.searchText,
					page:this.Page1,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page1 === 1) {
						this.NewsList = result.data;
					}
					if (this.Page1 > 1) {
						this.NewsList = this.NewsList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType1 = 2;
					} else {
						this.LoadingType1 = 0
					}
				}
			},
			//分页获取名师
			async GetTeacher(){
				this.index2++;
				let result = await post("User/GetDancerList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page2,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page2 === 1) {
						this.TeacherList = result.data;
					}
					if (this.Page2 > 1) {
						this.TeacherList = this.TeacherList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType2 = 2;
					} else {
						this.LoadingType2 = 0
					}
				}
			},
			//分页获取机构
			async GetJiGouList(){
				this.index3++;
				let result = await post("User/GetJiGouList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page3,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page3 === 1) {
						this.JiGouList = result.data;
					}
					if (this.Page3 > 1) {
						this.JiGouList = this.JiGouList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType3 = 2;
					} else {
						this.LoadingType3 = 0
					}
				}
			},
			//分页获取课程
			async GetCourseList(){
				this.index4++;
				let result = await post("Course/GetCourseOutlineList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page4,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page4 === 1) {
						this.CourseList = result.data;
					}
					if (this.Page4 > 1) {
						this.CourseList = this.CourseList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType4 = 2;
					} else {
						this.LoadingType4 = 0
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
			scanCode(){
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.init(this.tabIndex);
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom() {
			let index=this.tabIndex;
			if(this['LoadingType'+index]===2)return;
			this['Page'+index]++;
			this.fun(index);
		},
		onPageScroll(e){
			let _this=this;
			const query = uni.createSelectorQuery().in(_this);
			if(_this.onplayIndex>-1&&_this.tabIndex==0){
				query.select('#box'+_this.onplayId).boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
				  // console.log("节点离页面顶部的距离为" + data.top);
				  _this.onplayHeight=data.top;
				}).exec();
				if(_this.onplayHeight<80){
					_this.$set(_this.datalist[_this.onplayIndex],'fixed',true);
					_this.videoContext.pause();
				}else{
					_this.$set(_this.datalist[_this.onplayIndex],'fixed',false);
					_this.videoContext.play();
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff !important;
		// height: 100vh;
	}
</style>
