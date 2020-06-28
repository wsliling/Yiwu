<template>
	<view>
		<view class="musiclist pd15 uni-bg-white">
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index">
				<view class="imgbox">
					<image v-if="item.PicImg" :src="item.PicImg" mode="aspectFill"></image>
					<image v-else src="/static/default_music.png" mode="aspectFill"></image>
				</view>
				<view class="info flex1 flex-between">
					<view :class="['name uni-ellipsis',playIndex==index?'c_theme':'']">{{item.Name}}</view>
					<view class="icons flex-end">
						<view class="icon" @click="playMusic(index)"><image :src="playIndex==index?'/static/play3.png':'/static/play2.png'" mode="widthFix"></image></view>
						<view class="icon" @click="ShowOperation(item)"><image src="/static/more.png" mode="widthFix"></image></view>
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
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
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
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				page: 1,
				pageSize: 5,
				datalist:[],
				isShowOperation:false,
				isShowSelect:false,
				isCollect:false,//是否收藏
				playIndex:0,//当前播放
				MusicId:0,//选择更多操作的id
				price:0,//选择更多操作的价格
				itemdata:{}
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.workeslist();
		},
		methods: {
			/*获取列表*/
			async workeslist() {
				let result = await post('DanceMusic/MemberPalyVideoList', {
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize
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
			//播放
			playMusic(index){
				this.playIndex=index
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
				this.isShowOperation=false;
				this.isShowSelect=true;
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowOperation=false;
				this.isShowSelect=false;
			},
			//收藏
			async Collect(){
				this.isCollect=!this.isCollect;
				let result = await post('DanceMusic/CollectOperation', {
					UserId: this.userId,
					Token: this.token,
					FindId: this.MusicId,
				});
				uni.showToast({
					title:result.msg,
					icon:"none"
				})
				this.workeslist();//刷新状态
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
		onReachBottom(){
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
	.Menulist__modal{
		.line-list{
			max-height: 700upx;
			overflow-y: auto;
		}
	}
</style>
