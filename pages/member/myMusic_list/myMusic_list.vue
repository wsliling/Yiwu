<template>
	<view>
		<view class="menulist">
			<view class="item flex-between">
				<view class="imgbox"><image :src="menupost||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image></view>
				<view class="info flex1">
					<view class="name uni-ellipsis">{{menuName}}</view>
					<view class="fz12 c_999 uni-mt10">{{menuLen}}</view>
				</view>
			</view>
		</view>
		<view class="musiclist pd15" v-if="Id==-1">
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
				<view class="imgbox">
					<image :src="item.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',(playID==item.Id&&isplayingmusic)?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click.stop="playBtn(item)"><image :src="(playID==item.Id&&isplayingmusic)?'http://yw.wtvxin.com/static/play3.png':'http://yw.wtvxin.com/static/play2.png'" mode="widthFix"></image></view>
						<view class="icon" @click.stop="ShowOperation(item)"><image src="http://yw.wtvxin.com/static/more.png" mode="widthFix"></image></view>
					</view>
				</view>
			</view>
		</view>
		<view class="musiclist pd15" v-else>
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
				<view class="imgbox">
					<image :src="item.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',(playID==item.Id&&isplayingmusic)?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click.stop="playBtn(item)"><image :src="(playID==item.Id&&isplayingmusic)?'http://yw.wtvxin.com/static/play3.png':'http://yw.wtvxin.com/static/play2.png'" mode="widthFix"></image></view>
						<view class="icon" @click.stop="ShowOperation(item)"><image src="http://yw.wtvxin.com/static/more.png" mode="widthFix"></image></view>
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
								<image class="iconimg" src="http://yw.wtvxin.com/static/play_next.png" mode="widthFix"></image>
								<text class="txt">播放下一首</text>
							</view>
						</view>
						<view class="line-item" @click="ShowSelect">
							<view class="line-item-l flex-start">
								<image class="iconimg" src="http://yw.wtvxin.com/static/add.png" mode="widthFix"></image>
								<text class="txt">添加到歌单</text>
							</view>
						</view>
						<view class="line-item" @click="tolink('/pages/music/artPost/artPost?MusicId='+itemdata.Id+'&keystr='+itemdata.Name)">
							<view class="line-item-l flex-start">
								<image class="iconimg" src="http://yw.wtvxin.com/static/fabu.png" mode="widthFix"></image>
								<text class="txt">分享到动态</text>
							</view>
						</view>
						<share class="line-item" :url="'/pages/music/playMusic/playMusic?type=share&id='+itemdata.Id">
							<view class="line-item-l flex-start" style="width:100%;">
								<image class="iconimg" src="http://yw.wtvxin.com/static/share.png" mode="widthFix"></image>
								<text class="txt">分享</text>
							</view>
						</share>
						<view class="line-item" @click="Collect">
							<view class="line-item-l flex-start">
								<image class="iconimg" :src="isCollect?'http://yw.wtvxin.com/static/collect2.png':'http://yw.wtvxin.com/static/collect.png'" mode="widthFix"></image>
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
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex'
	import {editShareUrl} from '@/common/common'
	export default {
		data() {
			return {
				barHeight:0,
				userId: '',
				token: '',
				Id:0,//曲单id
				page:1,
				pageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist: [], //列表
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playID:"",//当前播放
				MusicId:0,//选择更多操作的id
				price:0,//选择更多操作的价格
				itemdata:{},
				DancePlayList:[],//曲单列表
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
				menuName:"",//曲单名称
				menuLen:0,//曲单数量
				menupost:""
			}
		},
		components: {
			uniPopup,
			uniLoadMore,
			noData
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			this.Id=e.id
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.playID=uni.getStorageSync("playID")
			// #ifndef APP-PLUS
			this.Id=this.$mp.query.id;
			// #endif
			this.workeslist();
			this.playIDtype=this.$store.state.isplayingmusic;
		},
		computed: {
		   ...mapGetters(['isplayingmusic'])
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			toback() {
				uni.switchTab({
					url: '/pages/tabBar/my/my'
				});
			},
			//播放
			playBtn(item){
				let src=item.Audio,
				    id=item.Id,
					isbuy=item.IsShowBuy,
					PicImg=item.PicImg;
				this.setPlaydetail({id,pic:PicImg});
				if(isbuy==0){
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
			/*获取列表*/
			async workeslist() {
				let result=""
				if(this.Id==-1){
					result = await post('DanceMusic/DanceMusicList', {
						UserId: this.userId,
						Token: this.token,
						MemberId:uni.getStorageSync("MemberId"),
						page: this.page,
						pageSize: this.pageSize
					});
				}else{
					result = await post('DanceMusic/GetMusicListByPId', {
						UserId: this.userId,
						Token: this.token,
						PlayId:this.Id,
						page: this.page,
						pageSize: this.pageSize
					});
				}
				if (result.code === 0) {
					let _this=this;
					let list=[];
					if(this.Id==-1){
						this.menuName="我上传的舞曲";
						this.menuLen=result.count+'首';
						list=result.data;
					}else{
						this.menuName=result.data.Name;
						this.menuLen=result.data.Num;
						list=result.data.DanceMusicList;
						if(list.length){
							this.menupost=list[0].PicImg
						}
					}
					if (list.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
					}
					if (list.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = list;
					}
					if (this.page > 1) {
						this.datalist.splice(this.pageSize*(this.page-1),this.pageSize);
						this.datalist = this.datalist.concat(
							list
						);
					}
					if (!result.isok) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
					this.setAudiolist(this.datalist);
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
		// 上拉加载
		onReachBottom: function() {
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
	page{
		background: #fff;
	}
</style>
<style lang="scss" scoped>
.Menulist__modal{
	.line-list{
		max-height: 700upx;
		overflow-y: auto;
	}
}
.menulist{
	.item{
		padding: 30upx;
		.imgbox{
			width: 200upx;
			height: 200upx;
			margin-right: 20upx;
			image{
				display: block;width: 100%; height: 100%;
				border-radius: 12upx;
			}
		}
		.name{
			max-width: 300upx;
			font-size: 30upx;
			margin-right: 20upx;
			line-height: 1.5;
		}
	}
}
.musiclist{
	.item{
		padding: 30upx 0;
		border-bottom: 1px solid #f5f5f5;
		.imgbox{
			width: 84upx;
			height: 84upx;
			margin-right: 20upx;
			image{
				display: block;width: 100%; height: 100%;
				border-radius: 10upx;
			}
		}
		.name{
			max-width: 380upx;
			font-size: 30upx;
			margin-right: 20upx;
			line-height: 1.5;
		}
		.icons{
			.icon{
				margin-left: 20upx;
				image{
					width: 40upx;
					height: 40upx;
				}
			}
		}
	}
}
</style>
