<template>
	<view>
		<view class="menulist">
			<view class="item flex-between">
				<view class="imgbox">
					<image v-if="Logo" :src="Logo" mode="aspectFill"></image>
					<image v-else src="/static/default_music.png" mode="aspectFill"></image>
				</view>
				<view class="info flex1">
					<view class="name uni-ellipsis">{{Name||'舞曲列表'}}</view>
					<view class="fz12 c_999 uni-mt10">{{count}}首</view>
				</view>
			</view>
		</view>
		<view class="musiclist pd15">
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
				<view class="imgbox">
					<image :src="item.PicImg||'/static/default_music.png'" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',(playID==item.Id&&playIDtype==1)?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click.stop="playBtn(index,item.Id,item.IsShowBuy)"><image :src="(playID==item.Id&&playIDtype==1)?'/static/play3.png':'/static/play2.png'" mode="widthFix"></image></view>
						<view class="icon" @click.stop="ShowOperation(item)"><image src="/static/more.png" mode="widthFix"></image></view>
					</view>
				</view>
			</view>
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
								<image class="iconimg" src="/static/play_next.png" mode="widthFix"></image>
								<text class="txt">播放下一首</text>
							</view>
						</view>
						<view class="line-item" @click="ShowSelect">
							<view class="line-item-l flex-start">
								<image class="iconimg" src="/static/add.png" mode="widthFix"></image>
								<text class="txt">添加到歌单</text>
							</view>
						</view>
						<view class="line-item">
							<view class="line-item-l flex-start">
								<image class="iconimg" src="/static/share.png" mode="widthFix"></image>
								<text class="txt">分享</text>
							</view>
						</view>
						<view class="line-item" @click="Collect">
							<view class="line-item-l flex-start">
								<image class="iconimg" :src="isCollect?'/static/collect2.png':'/static/collect.png'" mode="widthFix"></image>
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
						<view class="line-item" v-for="(item,index) in DancePlayList" :key="index" @click="joinList(item.Id)">
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
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin,playMusic} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data() {
			return {
				barHeight:0,
				userId: '',
				token: '',
				page:1,
				pageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist: [], //列表
				DancePlayList:[],//曲单列表
				count:0,//列表总数
				Logo:"",
				Name:"",
				ClassId:0,//类型id
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playID:"",//当前播放
				playIDtype:0,//当前播放舞曲的状态0：暂停 1：播放中
				MusicId:0,//选择更多操作的id
				price:0,//选择更多操作的价格
				itemdata:{}
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
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			this.ClassId=e.id;
			this.Logo=e.Logo;
			this.Name=e.Name;
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.playID=uni.getStorageSync("playID")
			this.playIDtype=uni.getStorageSync("playIDtype")
			this.workeslist();
		},
		methods: {
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
			playBtn(index,id,isbuy){
				if(isbuy==0){
					uni.setStorageSync("musicList",this.datalist)
					if(this.playID==id){
						this.playID="";
					}else{
						this.playID=id;
					}
					playMusic(index,id)
					this.playID=uni.getStorageSync("playID");console.log(2)
					this.playIDtype=uni.getStorageSync("playIDtype")
				}else{
					uni.showToast({
						title:"抱歉！该舞曲需付费",
						icon:"none"
					})
				}
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
				let result = await post('DanceMusic/DanceMusicList', {
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize,
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
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #fff;
	}
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
