<template>
	<view class="content bg_fff">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="index_head flex-between" v-if="false">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" class="flex1"></ans-input>
				</view>
				<!-- #ifndef H5 -->
				<view class="head_r" @click="scanCode">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
				<!-- #endif -->
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index)" style="width: 25%;">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view :style="{'height':(40+barHeight)+'px'}"></view>
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
							<view class="more" @click="tolink('/pages/member/addUser/addUser')">查看全部</view>
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
							<view v-if="item.IsMy==0" @click="flow(item.MemberId,index,1)" :class="['flow','active',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
						</view>
						<view class="media-bd">
							<view class="desc uni-ellipsis2" @click="toRec(item.Type,item.Id)">
								{{item.Title}}
							</view>
							<view :class="['maxpic',item.fixed?'dis':'']" v-if="item.Type==1" :id="'box'+item.Id">
								<view v-if="!item.play||item.fixed" class="isplay" @click.stop="playBtn(index,item.Id)"></view>
								<video v-if="item.play" :src="item.VideoUrl" controls autoplay @play="playVideo(item.Id)" @pause="pauseVideo(item.Id)" :id="'video'+item.Id" :show-mute-btn="true" :poster="item.PicImg" object-fit="cover"></video>
								<image class="postpic" :src="item.PicImg" mode="aspectFill"></image>
							</view>
							<view class="maxpic maxh" v-if="(item.Type==0||item.Type==2||item.Type==4)&&item.PicImg" @click="toRec(item.Type,item.Id)">
								<view v-if="item.Type==2" class="tag">课程</view>
								<image :src="item.PicImg" mode="widthFix"></image>
							</view>
							<view class="maxpic audio" v-if="item.Type==3" @click="toRec(item.Type,item.Id)">
								<image :src="item.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image>
								<!-- <view class="audioinfo uni-ellipsis2">
									{{item.Title}}
								</view> -->
								<view :class="['isaudio',playID==item.Id&&playIDtype==1?'active':'']" @click.stop="playAudio(item.Id,item.VideoUrl)">
									<view class="line line1"></view>
									<view class="line line2"></view>
									<view class="line line3"></view>
								</view>
							</view>
						</view>
						<view class="media-ft flex-between" v-if="item.Type!=3&&item.Type!=4">
							<view class="ft_l flex-start">
								<view @click="likeBtn(item.Id,index,item.Type)" :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum>0?item.LikeNum+'人赞过':'点赞'}}</view>
								<view class="txt_info reply">{{item.CommentNum}}人评论</view>
								<share :url="xqUrl[item.Type].url+item.Id">
									<view class="txt_info share"></view>
								</share>
							</view>
							<view class="ft_r">
								<view @click="CollectBtn(item.Id,index,item.Type)" :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
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
							<view class="more c_999" v-if="item.CommentNum>4" @click="toRec(item.Type,item.Id)">
								查看全部评论
							</view>
						</view>
					</view>
				</block>
				<view class="uni-tab-bar-loading" v-if="datalist.length">
					<uni-load-more :loadingType="LoadingType0"></uni-load-more>
				</view>	
			</block>
			<noData v-if="noDataIsShow0"></noData>
		</view>
		<!-- 最新、关注、视频	 -->
		<view class="videolist bg_fff" v-if="tabIndex==1||tabIndex==2||tabIndex==3">
			<view class="Yi-media" v-for="(item,index) in NewsList" :key="index">
				<view class="media-bd">
					<view :class="['maxpic',IsEdit||item.fixed?'dis':'']" v-if="item.VideoUrl" :id="'box'+item.Id">
						<view v-if="!item.play||item.fixed" class="isplay" @click="playBtn(index,item.Id)"></view>
						<image class="postpic" :src="item.PicImg" mode="aspectFill"></image>
						<video v-if="item.play" :src="item.VideoUrl" controls autoplay @play="playVideo(item.Id)" @pause="pauseVideo(item.Id)" :id="'video'+item.Id" :show-mute-btn="true" :poster="item.PicImg" object-fit="cover"></video>
					</view>
					<view class="desc uni-ellipsis2" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
						{{item.Title}}
					</view>
					<view class="media-ft flex-between">
						<view class="ft_l flex-start">
							<view class="author flex-start">
								<view class="tx">
									<image :src="item.Avatar||'http://yw.wtvxin.com/static/default.png'" mode="aspectFill" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)"></image>
									<!-- #ifdef MP-WEIXIN -->
									<view class="islive" v-if="item.Flag==1" @click.stop="navigate('liveplay/live',{id:item.MemberId})">
										<view class="line line1"></view>
										<view class="line line2"></view>
										<view class="line line3"></view>
										<view class="txt">直播</view>
									</view>
									<!-- #endif -->
								</view>
								<view class="name uni-ellipsis" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">{{item.NickName}}</view>
							</view>
						</view>
						<view class="ft_r flex-end">
							<view @click="likeBtn(item.Id,index)" :class="['txt_info like',item.IsLike?'active':'']">{{item.LikeNum}}</view>
							<view class="txt_info reply" @click="tolink('/pages/replylist/replylist?id='+item.Id)">{{item.CommentNum}}</view>
							<share :url="'/pages/replylist/replylist?id='+item.Id">
								<view class="txt_info share"></view>
							</share>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="NewsList.length">
				<uni-load-more :loadingType="LoadingType1"></uni-load-more>
			</view>
			<noData v-if="noDataIsShow1"></noData>
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="uploadbtn flex-column" @click="navigate('liveplay/live')">直播</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {post,get,toLogin,navigate,debounce,audio,playMusic} from '@/common/util.js';
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
				navigate,
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
						TypeName:"最新"
					},
					{
						Id:3,
						TypeName:"关注"
					},
					{
						Id:4,
						TypeName:"视频"
					},
				],
				page:1,
				pageSize:8,
				isLoad: false,
				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],////推荐视频
				noDataIsShow0:false,
				Page0:1,
				LoadingType0:0,//0加载前，1加载中，2没有更多了
				NewsList:[],//资讯
				noDataIsShow1:false,
				Page1:1,
				LoadingType1:0,//0加载前，1加载中，2没有更多了
				videoContext:null,
				onplayId:-1,//当前播放视频id
				onplayIndex:-1,//当前播放视频序号
				onplayHeight:0,//当前播放视频距离顶部的高度
				index0:0,
				index1:0,
				IsEdit:false,
				playID:"",//当前播放
				playIDtype:0,//当前播放舞曲的状态0：暂停 1：播放中
				xqUrl:[
					{
						type:0,
						url:'/pages/replylist/replylist?id='
					},
					{
						type:1,
						url:'/pages/replylist/replylist?id='
					},
					{
						type:2,
						url:'/pages/video/videoDetails/videoDetails?id='
					},
					{
						type:3,
						url:'/pages/music/playMusic/playMusic?type=share&id='
					},
					{
						type:4,
						url:'/pages/shopSon/product/productDetails?proId='
					}
				],//详情链接
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
			this.playID=uni.getStorageSync("playID");
			this.playIDtype=uni.getStorageSync("playIDtype");
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
				if(index==1||index==2||index==3){
					this.NewsList=[];//最新视频
					this.Page1=1;
					this.LoadingType1=0;//0加载前，1加载中，2没有更多了
					this.YWNewsList();
				}
			},
			pauseVideo(id){
				let datalist=[]
				if(this.tabIndex==0){
					datalist=this.datalist
				}else{
					datalist=this.NewsList
				}
				for(let i=0; i<datalist.length;i++){
					let _id=datalist[i].Id;
					if(_id==id){
						this.onplayId=id;
						this.onplayIndex=i;
						this.$set(datalist[i],'fixed',true);
					}
				}
			},
			playVideo(id){
				let datalist=[]
				if(this.tabIndex==0){
					datalist=this.datalist
				}else{
					datalist=this.NewsList
				}
				for(let i=0; i<datalist.length;i++){
					let _id=datalist[i].Id;
					if(_id==id){
						this.onplayId=id;
						this.onplayIndex=i;
						this.$set(datalist[i],'fixed',false);
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
						this.NewsList=[];//最新视频
						this.Page1=1;
						this.LoadingType1=0;//0加载前，1加载中，2没有更多了
						this.YWNewsList();
						break;
					case 2:
						this.NewsList=[];//关注
						this.Page1=1;
						this.LoadingType1=0;//0加载前，1加载中，2没有更多了
						this.YWNewsList();
						break;
					case 3:
						this.NewsList=[];//全部视频
						this.Page1=1;
						this.LoadingType1=0;//0加载前，1加载中，2没有更多了
						this.YWNewsList();
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
			toRec(type,id){
				let _this=this;
				uni.navigateTo({
					url: _this.xqUrl[type].url+id
				})
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
					if((this.index0==0&&index==0)||index==1||index==2||index==3){
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
						this.noDataIsShow0= false;
						for(let i=0;i<result.data.length;i++){
							this.$set(result.data[i],'play',false);
							this.$set(result.data[i],'fixed',false);
						}
						
					}
					if (result.data.length == 0 && this.Page0 == 1) {
						this.noDataIsShow0 = true;
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
				let datalist=[]
				if(this.tabIndex==0){
					datalist=this.datalist
				}else{
					datalist=this.NewsList
				}
				datalist.forEach(function(item){
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
			playAudio(id,nowSrc){
				debounce(function(){
					playMusic('',id,nowSrc);
				})
				//音频暂停事件
				audio.onPause(() => {
					this.playID=uni.getStorageSync("playID");
					this.playIDtype=0;
				})
				//音频播放事件
				audio.onPlay(() => {
					this.playID=uni.getStorageSync("playID");
					this.playIDtype=1;
				})
				// this.playID=uni.getStorageSync("playID");
				// this.playIDtype=uni.getStorageSync("playIDtype");
				//音频结束事件
				audio.onEnded(() => {
					uni.setStorageSync("playIDtype",0)
					this.playIDtype=0;
				})
			},
			//分页视频
			async YWNewsList(){
				this.index1++;
				var json={
						"UserId": this.userId,
						"Token": this.token,
						"page": this.page1,
						"pageSize": this.pageSize,
						"SearchKey":this.searchText,
					};	
				if(this.tabIndex==1){
					json['IsNews']=1
				}else if(this.tabIndex==2){
					json['IsFollow']=1
				}else if(this.tabIndex==3){
					json['IsALL']=1;
				}
				let result =await post("Find/VideoList",json);
				if (result.code === 0) {
					if(result.data.length>0){
						this.noDataIsShow1= false;
					}
					if (result.data.length == 0 && this.page1 == 1) {
						this.noDataIsShow1 = true;
					}
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
			fun(index){
				if(index==0){
					this.IndexRecommend();
				}else if(index==1){
					this.YWNewsList();
				}else if(index==2){
					this.YWNewsList();
				}else if(index==3){
					this.YWNewsList();
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
			async CollectBtn(id,index,type){
				let result;
				if(type==2){
					result = await post("Course/CourseCollection", {
						"UserId": this.userId,
						"Token": this.token,
						"OutlineId":id
					});
				}else{
					result = await post("Find/CollectOperation", {
						"UserId": this.userId,
						"Token": this.token,
						"FindId":id
					});
				}
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
			async likeBtn(id,index,type){
				let result;
				if(type==2){
					result = await post("Course/CourseOutlineLikes", {
						"UserId": this.userId,
						"Token": this.token,
						"CourseId":id
					});
				}else{
					result = await post("Find/FindlikeOperation", {
						"UserId": this.userId,
						"Token": this.token,
						"FindId":id
					});
				}
				if(result.code==0){
					let _this=this;
					let num=0;
					uni.showToast({
						title: result.msg
					})
					if(this.tabIndex==0){
						num=_this.datalist[index].LikeNum;
						if(this.datalist[index].IsLike==0){
							num++
							this.$set(_this.datalist[index],"IsLike",1)
						}else{
							num--
							this.$set(_this.datalist[index],"IsLike",0)
						}
						this.$set(_this.datalist[index],"LikeNum",num)
					}else{
						num=_this.NewsList[index].LikeNum;
						if(this.NewsList[index].IsLike==0){
							num++
							this.$set(_this.NewsList[index],"IsLike",1)
						}else{
							num--
							this.$set(_this.NewsList[index],"IsLike",0)
						}
						this.$set(_this.NewsList[index],"LikeNum",num)
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
			if(index==3){
				if(this['LoadingType1']===2)return;
				this['Page1']++;
			}else{
				if(this['LoadingType'+index]===2)return;
				this['Page'+index]++;
			}
			this.fun(index);
		},
		//监听页面滚动
		onPageScroll(e){
			let _this=this;
			const query = uni.createSelectorQuery().in(_this);
			let datalist=[]
			if(this.tabIndex==0){
				datalist=this.datalist
			}else{
				datalist=this.NewsList
			}
			if(_this.onplayIndex>-1){
				query.select('#box'+_this.onplayId).boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
				  // console.log("节点离页面顶部的距离为" + data.top);
				  _this.onplayHeight=data.top;
				}).exec();
				if(_this.onplayHeight<50){
					_this.$set(datalist[_this.onplayIndex],'fixed',true);
					_this.videoContext.pause();
				}else{
					// _this.$set(_this.datalist[_this.onplayIndex],'fixed',false);
					// _this.videoContext.play();
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
	.videolist{
		.Yi-media{
			padding: 20upx 30upx;
			&:first-child{
				padding-top: 0;
			}
			.media-bd{
				.maxpic{
					// border-radius: 12upx;
					overflow: hidden;
					position: relative;
					background-color: #e0e0e0;
					&.maxh{
						max-height: 450upx;
					}
					video{
						width: 100%;
						height: 450upx;
						display: block;
						position: absolute;
						left: 0;
						top: 0;
					}
					.postpic{height: 450upx;}
					.isplay{
						height: 88upx;
						width: 88upx;
						position: absolute;
						left: 50%;
						top: 50%;
						margin: -44upx 0 0 -44upx;
						background: url(http://yw.wtvxin.com/static/play.png);
						background-size: cover;
						z-index: 2;
					}
					&.dis{
						video{
							left: -2000px;
						}
					}
				}
				.desc{
					// position: absolute;
					// width: 100%;
					// bottom: 0;
					// left: 0;
					padding: 16upx 0;
					font-size: 30upx;
					// color: #fff;
					// text-align: center;
					// overflow: hidden;
					// white-space: nowrap;
					// text-overflow: ellipsis;
					// background: -moz-linear-gradient(top,rgba(0,0,0,0) 0,#000 100%);
					// background: -webkit-linear-gradient(top,rgba(0,0,0,0) 0,#000 100%);
					// background: linear-gradient(to bottom,rgba(0,0,0,0) 0,#000 100%);
					// filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#000000', GradientType=0);
				}
			}
			.media-ft{
				margin-top: 20upx;
				.author{
					.tx{
						width: 80upx;
						height: 80upx;
						padding: 4upx;
						border: 1px solid $primary;
						border-radius: 100%;
						margin-right: 20upx;
						position: relative;
						image{
							display: block;width: 100%; height: 100%;
							border-radius: 100%;
						}
					}
					.name{
						max-width: 300upx;
						font-size: 30upx;
						margin-right: 20upx;
					}
				}
				.txt_info{
					font-size: 24upx;
					color: #999;
					height: 40upx;
					line-height: 40upx;
				}
				.ft_r .txt_info{
					margin-left: 40upx;
				}
				.like{padding-left: 50upx; background: url(http://yw.wtvxin.com/static/like.png) left center no-repeat;
				background-size: 40upx 40upx;}
				.like.active{ background: url(http://yw.wtvxin.com/static/like2.png) left center no-repeat;
				background-size: 40upx 40upx;}
				.reply{
					padding-left: 50upx;background: url(http://yw.wtvxin.com/static/reply.png) left center no-repeat;
					background-size: 40upx 40upx;
				}
				.share{
					width: 40upx;
					height: 40upx;
					background: url(http://yw.wtvxin.com/static/share.png) left center no-repeat;
					background-size: 40upx 40upx;
				}
			}
		}
	}
	.uploadbtn{
		position: fixed;
		right: 20upx;
		bottom: 20upx;
		/* #ifdef H5 */
		bottom: 160upx;
		/* #endif */
		width: 100upx;
		height: 100upx;
		line-height:1;
		color: #fff;
		font-size: 22upx;
		background: $primary;
		border-radius: 50%;
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
		z-index: 9;
		.uni-icon{
			font-weight: bold;
			font-size: 52upx;
			line-height: .8;
		}
		.icon{
			display: block;
			height: 40upx;
			width: 40upx;
			margin-bottom: 8upx;
		}
	}
</style>
