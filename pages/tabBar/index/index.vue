<template>
	<view class="content bg_fff">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="index_head flex-center" style="border-bottom: 1px solid #eee;">
				<view class="title"><image src="http://yw.wtvxin.com/static/headTitle.png" mode="widthFix"></image></view>
				<view class="seachbox" v-if="false">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" class="flex1"></ans-input>
				</view>
				<!-- #ifndef H5 -->
				<view class="head_r" @click="scanCode" v-if="false">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
				<!-- #endif -->
			</view>
			
		</view>
		<view :style="{'height':(40+barHeight)+'px'}"></view>
		<!-- 首页 -->
		<view class="index-item index-item-0">
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
							<view :class="['maxpic mv',item.fixed?'dis':'']" v-if="item.Type==1" :id="'box'+item.Id">
								<view v-if="!item.play||item.fixed" class="isplay" @click.stop="playBtn(index,item.Id)"></view>
								<video v-if="item.play" :src="item.VideoUrl" :controls="true" :muted="ismuted" autoplay @play="playVideo(item.Id)" @pause="pauseVideo(item.Id)" @fullscreenchange="screenchange" :id="'video'+item.Id" :show-mute-btn="true" :poster="item.PicImg" object-fit="cover"></video>
								<image class="postpic" :src="item.PicImg" mode="aspectFill"></image>
							</view>
							<view class="maxpic maxh" v-if="(item.Type==0||item.Type==2||item.Type==4)&&item.PicImg" @click="toRec(item.Type,item.Id)">
								<view v-if="item.Type==2" class="tag">课程</view>
								<image :src="item.PicImg" mode="widthFix"></image>
							</view>
							<view class="maxpic audio" v-if="item.Type==3" @click="toRec(item.Type,item.Id)">
								<image :src="item.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image>
								<view :class="['isaudio',playID==item.Id&&isplayingmusic?'active':'']" @click.stop="playAudio(item)">
									<view class="line line1"></view>
									<view class="line line2"></view>
									<view class="line line3"></view>
								</view>
							</view>
						</view>
						<view class="media-ft flex-between" v-if="item.Type!=3&&item.Type!=4">
							<view class="ft_l flex-start">
								<view @click="likeBtn(item.Id,index,item.Type)" :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum>0?item.LikeNum:'点赞'}}</view>
								<view class="txt_info reply">{{item.CommentNum}}</view>
								<share :url="xqUrl[item.Type].url+item.Id" :param="item.Type+'&'+item.Id">
									<view class="txt_info share"></view>
								</share>
							</view>
							<view class="ft_r">
								<view @click="CollectBtn(item.Id,index,item.Type)" :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
							</view>
						</view>
						<view class="likenum" v-if="item.LikeNum>0">被{{item.LikeNum}}人赞过</view>
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
		<!-- #ifndef MP-WEIXIN -->
		<view class="uploadbtn flex-column" @click="navigate('liveplay/live')">直播</view>
		<!-- #endif -->
		<playerMin :pagetype="'share'"></playerMin>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	import noData from '@/components/notData.vue'; //暂无数据
	import ansInput from '@/components/ans-input/ans-input.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import share from '@/components/share/share.vue'; //加载更多
	import {editShareUrl} from '@/common/common'
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex';
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
				page:1,
				pageSize:8,
				isLoad: false,
				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],////推荐视频
				noDataIsShow0:false,
				Page0:1,
				LoadingType0:0,//0加载前，1加载中，2没有更多了
				videoContext:null,
				onplayId:-1,//当前播放视频id
				onplayIndex:-1,//当前播放视频序号
				onplayHeight:0,//当前播放视频距离顶部的高度
				playID:"",//当前播放
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
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
				ismuted:false,
				phoneheight:0
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
			//#ifdef MP
			this.barHeight=uni.getSystemInfoSync().statusBarHeight
			//#endif
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.phoneheight=uni.getSystemInfoSync().screenHeight;
			// #ifdef H5
			this.ismuted=true;
			// #endif
			//#ifndef H5
			this.ismuted=false;
			//#endif
			this.init();
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.playID=uni.getStorageSync("playID");
			this.playIDtype=this.$store.state.isplayingmusic;
		},
		computed: {
		   ...mapGetters(['isplayingmusic'])
		 },
		 onHide(){
			 if(this.onplayId>-1){
				 this.videoContext.pause();
			 }
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			init(){
				this.recuserlist=[];//推荐用户
				this.TeacherUserList=[];//推荐的名师
				this.datalist=[];////推荐视频
				this.Page0=1;
				this.LoadingType0=0;//0加载前，1加载中，2没有更多了
				this.IndexRecommend();
				this.GetReCommendMember();
				this.getRecommendUser();
			},
			screenchange(e){
				//#ifdef H5
				if(e.type=="fullscreenchange"){
					this.ismuted=false;
				}else{
					this.ismuted=true;
				}
				//#endif
			},
			pauseVideo(id){
				let _this=this;
				for(let i=0; i<_this.datalist.length;i++){
					let _id=_this.datalist[i].Id;
					if(_id==id){
						_this.onplayId=id;
						_this.onplayIndex=i;
						_this.$set(_this.datalist[i],'fixed',true);
						_this.$set(_this.datalist[i],'ispause',true);
					}
				}
			},
			playVideo(id){
				let _this=this;
				for(let i=0; i<_this.datalist.length;i++){
					let _id=_this.datalist[i].Id;
					if(_id==id){
						_this.onplayId=id;
						_this.onplayIndex=i;
						_this.$set(_this.datalist[i],'fixed',false);
						_this.$set(_this.datalist[i],'ispause',false);
					}
				}
			},
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.datalist=[];////推荐视频
				this.Page0=1;
				this.LoadingType0=0;//0加载前，1加载中，2没有更多了
				this.IndexRecommend();
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
					page:this.Page0,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					let _this=this;
					if(result.data.length>0){
						_this.noDataIsShow0= false;
						result.data.forEach(function(item){
							if(item.Type==1){
								_this.$set(item,'play',false);
								_this.$set(item,'fixed',false);
							}
						})
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
				_this.datalist.forEach(function(item){
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
			playAudio(item){
				let src=item.VideoUrl,
				    id=item.Id,
					PicImg=item.PicImg;
				this.setPlaydetail({id,pic:PicImg});
				this.setIsplayactive(true)
				this.playID=id;
				if(id==uni.getStorageSync("playID")){
					if (this.playIDtype) {
						this.$au_player.pause();
					} else {
						this.$au_player.play();
					}
					this.playIDtype=!this.playIDtype;
				}else{
					this.playIDtype=true;
					this.$au_player.src = src;
					this.$au_player.play();
				}				
				this.setIsplayingmusic(this.playIDtype)
				Vue.prototype.cusPlay = this.onPlayFn
				Vue.prototype.cusTimeUpdate = this.onTimeUpdateFn
				Vue.prototype.cusEnded = this.onEndedFn
			},
			onPlayFn(){
				this.setIsplayactive(true)
				uni.setStorageSync("playID",this.playID);
			},
			onEndedFn() {
				this.playIDtype = false;
				this.setIsplayingmusic(false)
				this.setIsplayactive(false)
			},
			onTimeUpdateFn() {
				const curtime = this.$au_player.currentTime
				return Math.floor(curtime)
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
					num=_this.datalist[index].LikeNum;
					if(this.datalist[index].IsLike==0){
						num++
						this.$set(_this.datalist[index],"IsLike",1)
					}else{
						num--
						this.$set(_this.datalist[index],"IsLike",0)
					}
					this.$set(_this.datalist[index],"LikeNum",num)
					
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
			this.init();
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom() {
			if(this.LoadingType0==2) return;//0加载前，1加载中，2没有更多了
			this.Page0++;
			this.IndexRecommend();
		},
		//监听页面滚动
        onPageScroll(e){
			let _this=this;
			const query = uni.createSelectorQuery().in(_this);
			this.datalist.forEach(function(item,index){
				let itemh=0;
				let h=0;
				if(item.Type==1){
					query.select('#box'+item.Id).boundingClientRect(data => {
						h=_this.phoneheight-data.height;
						itemh=data.top;
						if(itemh<h&&itemh>44&&!item.ispause){
							_this.$set(item,'play',true);
							_this.$set(item,'fixed',false);
							setTimeout(()=>{
								_this.videoContext=uni.createVideoContext('video'+item.Id);
								_this.videoContext.play();
								// _this.onplayIndex=index;
								// _this.onplayId=item.Id;
							},500)
						}else{
							_this.$set(item,'fixed',true);
							_this.$set(item,'play',false);
						}
					}).exec();
				}
			})
		},
		onShareAppMessage: function(res) {
				if (res.from === 'button') {
					let param = res.target.dataset.param
					let arr = param.split('&')
					let url = '';
					if(arr.length>1){
						url = this.xqUrl[arr[0]].url
					}else{
						url = '/pages/replylist/replylist?id='
					}
					return {
						title: '壹舞',
						path: editShareUrl(url+arr[1]),
						success: function(res) {}
					}
				}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	page{
		background: #fff !important;
		// height: 100vh;
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
