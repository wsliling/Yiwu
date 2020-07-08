<template>
	<view class="content">
		<view class="head autotop">
			<view class="index_head flex-between">
				<view class="head_l">
					<image src="@/static/live.png" class="iconimg"></image>
				</view>
				<view class="title">视频</view>
				<view class="head_r" @click="openAttestation">
					<image src="@/static/video.png" class="iconimg"></image>
				</view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
				<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
			</scroll-view>
		</view>
		<view :style="{'height':(80+barHeight)+'px'}"></view>
		<view class="search">
			<view class="seachbox">
				<text class="uni-icon uni-icon-search"></text>
				<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" @clear="searchClear"></ans-input>
			</view>
		</view>
		<view class="videolist" v-if="hasData">
			<view class="Yi-media" v-for="(item,index) in datalist" :key="index">
				<view class="media-bd">
					<view :class="['maxpic',IsEdit?'dis':'']" v-if="item.VideoUrl">
						<image v-if="IsEdit" class="postpic" :src="item.PicImg" mode="aspectFill"></image>
						<video :src="item.VideoUrl" controls @play="onplayvideo" :id="'video'+item.Id" :show-mute-btn="true" :poster="item.PicImg" object-fit="cover"></video>
					</view>
					<view class="desc uni-ellipsis2" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
						{{item.Title}}
					</view>
					<view class="media-ft flex-between">
						<view class="ft_l flex-start">
							<view class="author flex-start">
								<view class="tx">
									<image :src="item.Avatar||'/static/default.png'" mode="aspectFill" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)"></image>
									<view class="islive" v-if="item.Flag" @click="navigate('liveplay/live',{id:item.MemberId})">
										<view class="line line1"></view>
										<view class="line line2"></view>
										<view class="line line3"></view>
										<view class="txt">直播</view>
									</view>
								</view>
								<view class="name uni-ellipsis" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">{{item.NickName}}</view>
							</view>
						</view>
						<view class="ft_r flex-end">
							<view @click="likeBtn(item.Id,index)" :class="['txt_info like',item.IsLike?'active':'']">{{item.LikeNum}}</view>
							<view class="txt_info reply" @click="tolink('/pages/replylist/replylist?id='+item.Id)">{{item.CommentNum}}</view>
							<share wxUrl="/pages/tabBar/live/live" :h5Url="'/pages/replylist/replylist?id='+item.Id">
								<view class="txt_info share"></view>
							</share>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore
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
						Id:0,
						TypeName:"推荐"
					},
					{
						Id:0,
						TypeName:"最新"
					},
					{
						Id:1,
						TypeName:"教学"
					},
					{
						Id:2,
						TypeName:"比赛"
					},
					{
						Id:3,
						TypeName:"练习"
					},
					{
						Id:0,
						TypeName:"全部"
					}
				],
				ClassId:0,
				page:1,
				pageSize:6,
				noDataIsShow: false,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				datalist:[],
				videoContext:[],
				onplayId:-1,//当前播放
				IsEdit:false
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.VideoList();
		},
		onShow(){
			
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		 },
		methods: {
			onplayvideo(e){
				let id=e.currentTarget.id;
				for(let i=0; i<this.datalist.length;i++){
					let _id='video'+this.datalist[i].Id;
					if(_id==id){
						this.onplayId=i;
					}else{
						this.videoContext[i].pause();
					}
				}
			},
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.page=1;
				this.hasData=false;
				this.noDataIsShow=false;
				this.VideoList();
			},
			searchClear(){
				this.searchText = '';
				this.page=1;
				this.hasData=false;
				this.noDataIsShow=false;
				this.VideoList();
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
			tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
					this.page=1;
					this.hasData=false;
					this.noDataIsShow=false;
					this.VideoList();
				}
			},
			openAttestation(){
				if(toLogin()){
					if(this.onplayId>=0){
						this.videoContext[this.onplayId].pause();
						this.IsEdit=true;
					}
					let urlstr="";
					uni.showActionSheet({
						itemList: ['拍视频', '上传课程','舞者直播','店铺直播'],
						success: (e) => {
							console.log(e.tapIndex);
							if(e.tapIndex==0){
								urlstr="/pages/video/videoUpload/videoUpload?type=0";
							}else if(e.tapIndex==1){
								urlstr="/pages/video/videoUpload/videoUpload?type=1";
							}else if(e.tapIndex==2){
								// #ifndef APP-PLUS
								uni.showToast({
									title:'APP端才能开启直播哦~',
									icon:'none'
								})
								// #endif
								// #ifdef APP-PLUS
								urlstr="/pages/livepush/livepush?type=0";
								// #endif
							}else if(e.tapIndex==3){
								urlstr="/pages/livepush/livepush?type=1";
							}
							uni.navigateTo({
								url: urlstr
							})
						},
						complete:(e)=>{
							this.IsEdit=false;
						}
					})
				}
			},
			//视频列表
			async VideoList(){
				uni.showLoading({
				  title: '加载中' //数据请求前loading
				})
				var json={
						"UserId": this.userId,
						"Token": this.token,
						"page": this.page,
						"pageSize": this.pageSize,
						SearchKey:this.searchText
					};
				if(this.tabIndex==0){
					json.IsRecommend=1;
				}else if(this.tabIndex==1){
					json.IsNews=1;
				}else if(this.tabIndex==2||this.tabIndex==3||this.tabIndex==4){
					json.ClassId=this.tabnav[this.tabIndex].Id;
				}else if(this.tabIndex==5){
					json.IsALL=1;
				}	
				let result =await post("Find/VideoList",json);
				if(result.code==0){
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						this.videoContext=[];
						for(let i=0;i<result.data.length;i++){
							let n=result.data[i].Id;
							this.videoContext[i]=uni.createVideoContext('video'+n);
						}
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
				uni.hideLoading();
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
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.VideoList();
			} else {
				this.loadingType = 2;
			}
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