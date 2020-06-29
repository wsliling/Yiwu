<template>
	<view>
		<view class="menulist">
			<view class="item flex-between">
				<view class="imgbox"><image src="/static/default_music.png" mode="aspectFill"></image></view>
				<view class="info flex1">
					<view class="name uni-ellipsis">{{Id==-1?'我上传的舞曲':datalist.Name}}</view>
					<view class="fz12 c_999 uni-mt10">{{Id==-1?datalist.length:datalist.Num}}</view>
				</view>
			</view>
		</view>
		<view class="musiclist pd15" v-if="Id==-1">
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index">
				<view class="imgbox">
					<image v-if="item.PicImg" :src="item.PicImg" mode="aspectFill"></image>
					<image v-else src="/static/default_music.png" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',playID==item.Id?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click.stop="playBtn(index,item.Id)"><image :src="playID==item.Id?'/static/play3.png':'/static/play2.png'" mode="widthFix"></image></view>
						<view class="icon" @click.stop="ShowOperation(item)"><image src="/static/more.png" mode="widthFix"></image></view>
					</view>
				</view>
			</view>
		</view>
		<view class="musiclist pd15" v-else>
			<view class="item flex-between" v-for="(item,index) in datalist.DanceMusicList" :key="index">
				<view class="imgbox">
					<image v-if="item.PicImg" :src="item.PicImg" mode="aspectFill"></image>
					<image v-else src="/static/default_music.png" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',playID==item.Id?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click.stop="playBtn(index,item.Id)"><image :src="playID==item.Id?'/static/play3.png':'/static/play2.png'" mode="widthFix"></image></view>
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
						<view class="line-item">
							<view class="line-item-l text_left">
								<text class="txt c_theme">￥34</text>
							</view>
							<view class="item-r">
								<view class="btnbuy">购买</view>
							</view>
						</view>
						<view class="line-item">
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
						<view class="line-item" v-for="(item,index) in 12" :key="index">
							<view class="line-item-l text_left">
								<text class="txt">默认曲单</text>
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
</template>

<script>
	import {post,get,playMusic} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
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
				datalist: {}, //列表
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playID:"",//当前播放
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
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.Id=e.id
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
			playBtn(index,id){
				uni.setStorageSync("musicList",this.datalist)
				if(this.playID==id){
					this.playID="";
				}else{
					this.playID=id;
				}
				playMusic(index,id)
			},
			//弹出更多操作
			ShowOperation(index){
				this.isShowOperation=true;
			},
			//弹出选择歌单
			ShowSelect(){
				this.isShowOperation=false;
				this.isShowSelect=true;
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowOperation=false;
				this.isShowSelect=false;
			},
			//收藏
			Collect(){
				this.isCollect=!this.isCollect;
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
