<template>
	<view>
		<view class="bg1">
			<view class="bg2">
			</view>
		</view>
		<view class="flex-end list_hd p_re pd15">
			<image :src="pageType==0?'http://m.dance-one.com/static/icon_rec.png':pageType==1?'http://m.dance-one.com/static/icon_new.png':pageType==2?'http://m.dance-one.com/static/icon_hot.png':''"></image>
			<text>{{pageTitle}}</text>
		</view>
		<view class="bgbox">
			<view class="topplay flex-start" @click="toplaylist(datalist[0].Id,0)" v-if="pageType!=3">
				<image src="http://m.dance-one.com/static/play4.png"></image>
				<text>播放全部</text>
			</view>
			<view class="search" v-else>
				<view class="seachbox">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" @clear="searchClear" class="flex1"></ans-input>
				</view>
			</view>
			<view class="musiclist pd15">
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
			<noData :isShow="noDataIsShow"></noData>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
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
						<view class="line-item" v-if="false" @click="tolink('/pages/music/artPost/artPost?MusicId='+itemdata.Id+'&keystr='+itemdata.Name)">
							<view class="line-item-l flex-start">
								<image class="iconimg" src="http://m.dance-one.com/static/fabu.png" mode="widthFix"></image>
								<text class="txt">分享到动态</text>
							</view>
						</view>
						<share class="line-item" :url="'/pages/music/playMusic/playMusic?type=share&id='+itemdata.Id">
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
		<playerMin></playerMin>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex'
	import {editShareUrl} from '@/common/common'
	export default {
		components: {
			uniPopup,
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				searchText:'',
				pageType:0,//0每日推荐，1最新推荐，2最热推荐,3搜索舞曲
				pageTitle:"",//页面名称
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 12,
				datalist:[],
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playID:"",//当前播放
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
				MusicId:0,//选择更多操作的id
				price:0,//选择更多操作的价格
				itemdata:{},
				DancePlayList:[],//曲单列表
			}
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			this.pageType=e.type;
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.playID=uni.getStorageSync("playID");
			this.playIDtype=this.$store.state.isplayingmusic;
			// #ifndef APP-PLUS
			this.pageType=this.$mp.query.type;
			// #endif
			if(this.pageType==0){
				this.pageTitle="每日推荐";
			}else if(this.pageType==1){
				this.pageTitle="最新推荐";
			}else if(this.pageType==2){
				this.pageTitle="最热推荐";
			}else if(this.pageType==3){
				this.pageTitle="搜索舞曲";
			}
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
			this.workeslist();
		},
		computed: {
		   ...mapGetters(['isplayingmusic'])
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.page=1;
				this.hasData=false;
				this.noDataIsShow=false;
				this.workeslist();
			},
			// 取消搜索
			searchClear(){console.log(111)
				this.searchText = '';
				this.page=1;
				this.hasData=false;
				this.noDataIsShow=false;
				this.workeslist();
			},
			/*获取列表*/
			async workeslist() {
				var url=""
				var param={
						UserId: this.userId,
						Token: this.token,
						page: this.page,
						pageSize: this.pageSize,
						SearchKey:this.searchText
					}
				if(this.pageType==0){
					url="DanceMusic/EverydayRecommend";
				}else if(this.pageType==1){
					url="DanceMusic/DanceMusicList";
					param.IsRecommend=1;
				}else if(this.pageType==2){
					url="DanceMusic/DanceMusicList";
					param.IsHot=1;
				}else if(this.pageType==3){
					url="DanceMusic/DanceMusicList";
				}
				let result = await post(url, param);
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
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist.splice(this.pageSize*(this.page-1),this.pageSize);
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
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			//播放
			playBtn(item){
				console.log(this.$au_player)
				let src=item.Audio,
				    id=item.Id,
					isbuy=item.IsShowBuy,
					PicImg=item.PicImg,
					title=item.Name;
				this.setAudiolist(this.datalist);
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
					uni.hideToast();
					//#ifndef APP-PLUS
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
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				}
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
					this.isShowOperation=false;
				}
			},
			/*获取列表*/
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
			}
		},
		onReachBottom(){
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.workeslist();
			} else {
				this.loadingType = 2;
			}
		},
		onShareAppMessage: function(res) {
			if (res.from === 'button') {}
			return {
				title: '壹舞',
				path: editShareUrl('/pages/music/playMusic/playMusic?type=share&id='+this.itemdata.Id),
				success: function(res) {}
			}
		}
	}
</script>
<style>
	/* #ifdef APP-PLUS */
	page{
		background: #fff;
	}	
	/* #endif */
</style>
<style lang="scss" scoped>
	@import './style'
</style>
