<template>
	<view>
		<view v-if="false" class="head" :style="{'padding-top':barHeight+'px'}">
			<!-- #ifndef MP-WEIXIN -->
			<view class="head_l" @click="toback"><text class="uni-icon uni-icon-arrowleft"></text></view>
			<view class="mine">我的舞曲</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view></view>
			<view></view>
			<!-- #endif --> 
			<view class="head_r">
				<image src="@/static/playmusic.png" class="iconimg"></image>
			</view>
		</view> 
		<view v-if="false" :style="{height:(44+barHeight)+'px'}"></view>
		<view class="Yi-hd flex-between">
			<view class="title">我的曲单</view>
			<view class="uni-icon uni-icon-plusempty" @click="isShowCreatMenu=true"></view>
		</view>
		<view class="menulist">
			<view class="item flex-between" v-for="(item,index) in datalist" :key="index" @click="tolink('/pages/member/myMusic_list/myMusic_list?id='+item.Id)">
				<view class="imgbox"><image src="/static/default_music.png" mode="aspectFill"></image></view>
				<view class="info flex1">
					<view class="name uni-ellipsis">{{item.Name}}</view>
					<view class="fz12 c_999 uni-mt10">{{item.Num}}</view>
				</view>
			</view>
		</view>
		<!-- 创建曲单 -->
		<uni-popup mode="fixed" :show="isShowCreatMenu" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music creatMenu__modal">
				<view class="uni-modal__hd pd15">新建曲单</view>
				<view class="uni-modal__bd">
					<input class="inputBox" type="text" v-model="Title" placeholder="请输入名称" autofocus="autofocus" />
					<view class="btns flex-between">
						<view class="btn" @click="hidePopup">取消</view>
						<view class="btn active" @click="surePop">完成</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { post, get } from '@/common/util.js';
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
				pageSize:6,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist: {}, //列表
				isShowCreatMenu:false,
				Title:"",//新建曲单名称
			}
		},
		components: {
			uniPopup,
			uniLoadMore,
			noData
		},
		onLoad() {
			// #ifdef APP-PLUS
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.workeslist();
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			//返回
			toback() {
				uni.switchTab({
					url: '/pages/tabBar/my/my'
				});
			},
			//创建曲单
			surePop(){
				if(this.Title==""){
					uni.showToast({
						title:"请输入曲单名称！",
						icon:"none"
					})
				}else{
					this.EditPlayList()
					this.isShowCreatMenu=false;
				}
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowCreatMenu=false;
			},
			//创建曲单
			async EditPlayList(){
				let res = await post("DanceMusic/EditPlayList", {
					UserId: this.userId,
					Token: this.token,
					PlayId: 0,
					PlayListName:this.Title,
				});
				if(res.code==0){
					uni.showToast({
						title:"创建成功"
					})
				}else{
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			},
			/*获取列表*/
			async workeslist() {
				let result = await post('DanceMusic/DancePlayList', {
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
.head {
	height: 44px;
	border-bottom: 1px solid #eee;
	.head_l{
		.uni-icon{ font-size: 26px; margin: 0 5px;}
	}
	display: flex;
	justify-content: space-between;
	align-items: center;
	.mine {
		font-size: 16px;
		font-family: PingFang;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.iconimg{
		width:26px;
		height: 26px;
	}
	.head_r{ 
		padding-right: 15px; 
	}
}
.Yi-hd{
	.uni-icon{ color:$primary;
		font-size: 56upx;
		font-weight: bold;
		line-height: 1;
	}
}
.menulist{
	.item{
		padding: 0 30upx;
		margin-bottom: 30upx;
		.imgbox{
			width: 160upx;
			height: 160upx;
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
