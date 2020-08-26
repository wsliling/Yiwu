<template>
	<view class="bg_fff">
		<block v-if="pageCon==1">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="search" @click="tolink('/pages/music/list/list?type=3')">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search">请输入你想搜索的舞曲</text>
				</view>
			</view>
		</view>
		<view :style="{'height':(40+barHeight)+'px'}"></view>
		</block>
		<block v-if="pageCon==2">
			<view class="head" :style="{'padding-top':barHeight+'px'}">
				<view class="title center" style="height: 44px; line-height: 44px; font-size: 16px; font-weight: bold;border-bottom: 1px solid #eee;">Danceone</view>
			</view>
			<view :style="{'height':(44+barHeight)+'px'}"></view>
		</block>
		<view class="music-content" v-if="pageCon==1">
			<!--轮播图-->
			<view class="index_swiper uni-mt10">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(item,index) in banner" :key="index">
						<view class="swiper-item pd15">
							<image class="img" :src="item.Pic" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="dots">
					<view v-for="(item,index) in 3" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
				</view>
			</view>
			<!-- 快捷导航 -->
			 <view class="icon-menu">
				 <view class="item" @click="tolink('/pages/music/list/list?type=0')">
					 <image class="icon" src="http://m.dance-one.com/static/music/icon15.png"></image>
					 <text class="txt">每日推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=1')">
					 <image class="icon" src="http://m.dance-one.com/static/music/icon16.png"></image>
					 <text class="txt">最新推荐</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/list/list?type=2')">
					 <image class="icon" src="http://m.dance-one.com/static/music/icon17.png"></image>
					 <text class="txt">最热</text>
				 </view>
				 <view class="item" @click="tolink('/pages/music/recently/recently')">
					 <image class="icon" src="http://m.dance-one.com/static/music/icon18.png"></image>
					 <text class="txt">最近播放</text>
				 </view>
			 </view>
			<view class="classifytab">
			 	<scroll-view id="tab-bar" v-if="!isshowAll" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
			 		<view v-for="(tab,index) in classifylist" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)" style="width: auto; padding: 0 20upx;">{{tab.Name}}</view>
			 	</scroll-view>
			 	<view class="flex-column menuIco" id="allbtn" @click="isshowAll=!isshowAll">
					<block v-if="!isshowAll">
						<view class="line1"></view>
						<view class="line2"></view>
						<view class="line3"></view>
					</block>
					<text v-if="isshowAll" class="iconfont icon-close"></text>
				</view>
				<view class="showClassify" v-if="isshowAll">
					<view class="allhd">全部分类</view>
					<view v-for="(tab,index) in classifylist" :key="index" :class="['btn',tabIndex==index ? 'active' : '']"  @click="tapTab(index,tab.Id)">{{tab.Name}}</view>
				</view>
			 </view>
			 <block v-if="tabIndex==0">
			 	<view class="list" v-if="hasData">
			 		<block v-for="(item,index) in findlist" :key="index">
			 			<media-list :datajson="item" Grid="2" @click="goDetail" @previewImg="previewImg"></media-list>
			 		</block>
			 	</view>
			 </block>
			<view class="musiclist pd15" v-if="tabIndex>0&&hasData">
				<view class="item flex-between" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
					<view class="imgbox">
						<image :src="item.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
					</view>
					<view class="info flex1 flex-between">
						<view :class="['name uni-ellipsis',(playID==item.Id&&isplayingmusic)?'c_theme':'']">{{item.Name}}</view>
						<view class="icons flex-end">
							<view class="icon" @click.stop="playBtn(item)"><image :src="(playID==item.Id&&isplayingmusic)?'http://m.dance-one.com/static/play3.png':'http://m.dance-one.com/static/play2.png'" mode="widthFix"></image></view>
							<view class="icon" @click.stop="ShowOperation(item)"><image src="http://m.dance-one.com/static/more.png" mode="widthFix"></image></view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData">
				<uni-load-more :loadingType="loadingType"></uni-load-more>
			</view>
			<noData :isShow="noDataIsShow"></noData>
			<!-- 更多操作	 -->
			<uni-popup mode="fixed" :show="isShowOperation" :h5Top="true" position="bottom" @hidePopup="hidePopup">
				<view class="uni-modal-music Operation__modal">
					<view class="uni-modal__bd">
						<view class="line-list">
							<view class="line-item" v-if="itemdata.IsShowBuy==1">
								<view class="line-item-l text_left">
									<text class="txt c_theme">￥{{price}}</text>
								</view>
								<view class="item-r">
									<view class="btnbuy" @click="tobuy">购买</view>
								</view>
							</view>
							<view class="line-item" v-if="false">
								<view class="line-item-l flex-start">
									<image class="iconimg" src="http://m.dance-one.com/static/play_next.png" mode="widthFix"></image>
									<text class="txt">播放下一首</text>
								</view>
							</view>
							<view class="line-item" @click="ShowSelect">
								<view class="line-item-l flex-start">
									<image class="iconimg" src="http://m.dance-one.com/static/add.png" mode="widthFix"></image>
									<text class="txt">添加到歌单</text>
								</view>
							</view>
							<view class="line-item" @click="tolink('/pages/music/artPost/artPost?MusicId='+itemdata.Id+'&keystr='+itemdata.Name)">
								<view class="line-item-l flex-start">
									<image class="iconimg" src="http://m.dance-one.com/static/fabu.png" mode="widthFix"></image>
									<text class="txt">分享到动态</text>
								</view>
							</view>
							<share class="line-item" :url="'/pages/music/playMusic/playMusic?type=share&id='+itemdata.Id" :param="itemdata.Id">
								<view class="line-item-l flex-start" style="width:100%;">
									<image class="iconimg" src="http://m.dance-one.com/static/share.png" mode="widthFix"></image>
									<text class="txt">分享</text>
								</view>
							</share>
							<view class="line-item" @click="Collect">
								<view class="line-item-l flex-start">
									<image class="iconimg" :src="isCollect?'http://m.dance-one.com/static/collect2.png':'http://m.dance-one.com/static/collect.png'" mode="widthFix"></image>
									<text class="txt">收藏</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
			<!-- 选择曲单	 -->
			<uni-popup mode="fixed" :show="isShowSelect" :h5Top="true" position="bottom" @hidePopup="hidePopup">
				<view class="uni-modal-music Menulist__modal">
					<view class="uni-modal__hd pd15">选择曲单</view>
					<view class="uni-modal__bd">
						<view class="line-list">
							<view class="line-item" v-if="item.Id!=-1" v-for="(item,index) in DancePlayList" :key="index" @click="joinList(item.Id)">
								<view class="line-item-l text_left">
									<text class="txt">{{item.Name}}</text>
								</view>
							</view>
						</view>
						<view class="btns flex-between">
							<view class="btn c_theme"  @click="hidePopup">关闭</view>
						</view>
					</view>
				</view>
			</uni-popup>
			
		</view>
		<view class="staticPage" v-if="pageCon==2">
			<view class="Yi-newslist" >
				<view class="Yi-media uni-bg-white" v-for="(item,index) in NewsList" :key="index" @click="tolink('/pages/msgDetail/msgDetail?id='+item.Id)">
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
		</view>
		<view v-if="pageCon==1" @click="openAttestation" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text></view>
		<!-- <view @click="tolink('/pages/music/playMusic/playMusic?pagetype=music')" class="Musicbtn flex-column"><image src="http://m.dance-one.com/static/playmusic.png" class="icon"></image></view> -->
		<playerMin></playerMin>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import mediaList from '@/components/mediaList.vue';//发现列表
	import uniPopup from '@/components/uni-popup.vue';
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex'
	import {editShareUrl} from '@/common/common'
	export default {
		components: {
			noData,
			uniLoadMore,
			mediaList,
			uniPopup
		},
		data() {
			return {
				pageCon:0,
				userId: "",
				token: "",
				barHeight:0,
				classifylist:[],//舞曲分类列表
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 5,
				pageSize2: 12,
				currentSwiper :0,
				scrollLeft: 0,
				tabIndex:0,
				findlist:[],
				banner:[],
				isshowAll:false,
				datalist: [], //列表
				DancePlayList:[],//曲单列表
				ClassId:0,//类型id
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playID:"",//当前播放
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
				MusicId:0,//选择更多操作的id
				price:0,//选择更多操作的价格
				itemdata:{},
				NewsList:[]
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
			if(this.pageCon==1){
				this.getclassifyList();
				this.getBanner();
			}else{
				this.YWNewsList()
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			if(this.tabIndex==0){
				this.hasData=false;
				this.page=1;
				this.findlist=[];
				this.FindList()
			}else{
				this.playID=uni.getStorageSync("playID")
				this.playIDtype=this.$store.state.isplayingmusic;
				this.workeslist();
			}
		},
		computed: {
		   ...mapGetters(['isplayingmusic'])
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
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
					this.setScrollLeft(index);
					this.ClassId=id;
					this.page=1;
					if(this.tabIndex==0){
						this.FindList();
					}else{
						this.workeslist();
					}
				}
			},
			getclassifyList(){
				post('DanceMusic/DanceMusicClassList',{}).then(res=>{
					if(res.code===0){
						let json={
							Id:-1,
							Name:"动态"
						};
						this.classifylist=res.data;
						this.classifylist.unshift(json)
					}
				})
			},
			openAttestation(){
				if(toLogin()){
					let urlstr="";
					uni.showActionSheet({
						itemList: ['发布动态','上传舞曲'],
						success: (e) => {
							if(e.tapIndex==0){
								urlstr="/pages/music/artPost/artPost";
							}else if(e.tapIndex==1){
								urlstr="/pages/music/uploadMusic/uploadMusic";
							}
							uni.navigateTo({
								url: urlstr
							})
						},
						complete:(e)=>{}
					})
				}
			},
			async getBanner(){
				const res = await post('Banner/BannerList',{Cid:2})
				if(res.code)return;
				this.banner = res.data;
			},
			/*获取动态列表*/
			async FindList() {
				let result = await post("Find/FindList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"myType": 4,
					// "MemberId": "",
					// "SearchKey": ""
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.findlist = result.data;
					}
					if (this.page > 1) {
						this.findlist = this.findlist.concat(
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
			//链接动态详情页
			goDetail(e) {
				if(e.artType==0){//用户发布详情
					uni.navigateTo({
						url:'/pages/replylist/replylist?id='+e.id
					})
				}
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				let btnElement = await this.getWidth('allbtn');
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width+btnElement.width+10;//10是margin值
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
				console.log("scrollLeft"+this.scrollLeft)
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
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			/*获取列表*/
			async workeslist() {
				let result = await post('DanceMusic/DanceMusicList', {
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize2,
					ClassId:this.ClassId
				});
				if (result.code === 0) {
					let _this=this;
					this.count=result.count;
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
						this.datalist.splice(this.pageSize2*(this.page-1),this.pageSize2);
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (!result.isok) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			//播放
			playBtn(item){
				let src=item.Audio,
				    id=item.Id,
					isbuy=item.IsShowBuy,
					PicImg=item.PicImg,
					title=item.Name;
				if(isbuy==0){
					this.playID=id;
					if(id==uni.getStorageSync("playID")){
						if (this.playIDtype) {
							this.$au_player.pause();
						} else {
							this.$au_player.play();
						}
						this.playIDtype=!this.playIDtype;
					}else{
						this.setPlaydetail({id,pic:PicImg});
						this.$au_player.title = title;
						this.playIDtype=true;
						this.$au_player.src = src;
						this.$au_player.play();
					}	
					this.setIsplayactive(true)			
					this.setIsplayingmusic(this.playIDtype)
					Vue.prototype.cusPlay = this.onPlayFn
					Vue.prototype.cusTimeUpdate = this.onTimeUpdateFn
					Vue.prototype.cusEnded = this.onEndedFn
				}else{
					uni.showToast({
						title:"抱歉！该舞曲需付费",
						icon:"none"
					})
				}
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
			toplaylist(id,index){
				uni.setStorageSync("musicList",this.datalist)
				uni.navigateTo({
					url:'/pages/music/playMusic/playMusic?nowIndex='+index+'&id='+id
				})	
			},
			//弹出更多操作
			ShowOperation(item){
				this.isShowOperation=true;
				this.MusicId=item.Id;
				this.price=item.Price;
				this.itemdata=item;
				if(item.IsCollect==0){
					this.isCollect=false;
				}else{
					this.isCollect=true;
				}
			},
			//弹出选择歌单
			ShowSelect(){
				if(toLogin()){
					this.getDancePlayList();
					this.isShowOperation=false;
					this.isShowSelect=true;
				}
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowOperation=false;
				this.isShowSelect=false;
			},
			//收藏
			async Collect(){
				let result = await post('DanceMusic/CollectOperation', {
					UserId: this.userId,
					Token: this.token,
					FindId: this.MusicId,
				});
				if(result.code==0){
					this.isCollect=!this.isCollect;
					uni.showToast({
						title:result.msg,
						icon:"none"
					})
					this.workeslist();//刷新状态
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
			/*获取曲单列表*/
			async getDancePlayList() {
				let result = await post('DanceMusic/DancePlayList', {
					UserId: this.userId,
					Token: this.token,
					page: 1,
					pageSize: 99
				});
				if (result.code === 0) {
					let _this=this;
					this.DancePlayList=result.data
				}
			},
			//加入曲单
			async joinList(id){
				let result = await post('DanceMusic/AddPlayList', {
					UserId: this.userId,
					Token: this.token,
					MusicId: this.MusicId,
					PlayId: id
				});
				if(result.code==0){
					uni.showToast({
						title:"添加成功"
					})
				}else{
					uni.showToast({
						title:result.msg,
						icon:"none"
					})
				}
				this.hidePopup()
			},
			//购买
			tobuy(){
				if(toLogin()){
					let buyInfo={
						PicImg:this.itemdata.PicImg,
						name:this.itemdata.Name,
						price:this.itemdata.Price
					}
					uni.setStorageSync('buyInfo', buyInfo);
					uni.navigateTo({
						url:'/pages/pay2/pay2?type=1&id='+this.MusicId
					})
				}
			},
			//预览图片
			previewImg(obj){
				uni.previewImage({
					current:obj.imgurls[obj.index],
					urls: obj.imgurls,
					indicator:obj.imgurls.length
				});
			},
			async YWNewsList(){
				let result = await post("News/YWNewsList", {
					UserId:this.userId,
					Token:this.token,
					page:1,
					pageSize:20
				});
				if (result.code === 0) {
					this.NewsList = result.data;
				}
			},
		},
		// 下拉刷新
		onPullDownRefresh(){
			if(this.tabIndex==0){
				this.hasData=false;
				this.page=1;
				this.findlist=[];
				this.FindList();
			}else{
				
			}
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom(){
			if(this.tabIndex==0){
				if (this.isLoad) {
					this.loadingType = 1;
					this.page++;
					this.FindList();
				} else {
					this.loadingType = 2;
				}
			}
		},
		onShareAppMessage: function(res) {
				if (res.from === 'button') {
					let param = res.target.dataset.param
					return {
						title: '壹舞',
						path: editShareUrl('/pages/music/playMusic/playMusic?type=share&id='+param),
						success: function(res) {}
					}
				}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.Yi-media{
		padding: 30upx;
		.media-bd{
			.desc{ line-height: 1.5;font-size: 32upx; font-weight: 600;}
			.maxpic{
				margin-top: 20upx;
				//border-radius: 12upx;
				overflow: hidden;
				position: relative;
				// background-color: #e0e0e0;
				background-color: #000;
				margin-left: -30upx;
				margin-right: -30upx;
				&.maxh{
					max-height: 1000upx;
				}
				
			}
		}
		.media-ft{
			margin-top: 24upx;
			.txt_info{
				font-size: 24upx;
				color: #999;
				height: 44upx;
				line-height: 44upx;
			}
			.ft_l .txt_info{
				margin-right: 40upx;
			}
			
		}
	
	}
</style>
