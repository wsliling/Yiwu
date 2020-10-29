<template>
	<view class="playmusic">
		<view class="warp">
			<view class="playimgbox">
				<image :src="itemdata.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="" :class="{'playLoading':isPlay}"></image>
				<view class="border2">
					<view class="border1"></view>
				</view>
			</view>
			<view class="source">来源{{itemdata.Source||'未知'}}</view>
		</view>
		<view class="playbox">
			 <view class="imt-audio">
			 	<view class="audio-control-wrapper">
			 		<view class="audio-control iconfont icon-prev" @click="prev"></view>
			 		<view :class="['audio-control audio-control-switch iconfont',loading?'icon-loading audioLoading':isPlay?'icon-audiopuse':'icon-audioplay']" @click="operation"></view>
			 		<view class="audio-control iconfont icon-prev audio-control-next" @click="next(false)"></view>
			 	</view>
			 	<view class="audio-wrapper">
			 		<view class="audio-number">{{curPlayTimeNum}}</view>
			 		<slider class="audio-slider" activeColor="#e32a76" backgroundColor="#b9b8b8" block-size="16" :value="curPlayTime" :max="playTime" @change="sliderChange"></slider>
			 		<view class="audio-number">{{playTimeNum}}</view>
			 	</view>
			 </view>
			<view class="playicon">
				 <view class="item" @click="Collect">
				 	<image :src="isCollect==0?'http://m.dance-one.com/static/collect3.png':'http://m.dance-one.com/static/collect2.png'" mode="widthFix" class="addwidth"></image>
				 </view>
			 	<view class="item" @click="tabPlayType">
			 		<image src="http://m.dance-one.com/static/music/playicon1.png" mode="widthFix" v-if="playType==0"></image>
					<image src="http://m.dance-one.com/static/music/playicon2.png" mode="widthFix" v-else-if="playType==2"></image>
					<image src="http://m.dance-one.com/static/music/playicon3.png" mode="widthFix" v-else-if="playType==1"></image>
			 	</view>
				<share class="item" :url="'/pages/music/playMusic/playMusic?type=share&id='+musicID">
					<image src="http://m.dance-one.com/static/music/playicon4.png" mode="widthFix"></image>
				</share>
				<view class="item" @click="ShowPlaylist">
					<image src="http://m.dance-one.com/static/music/playicon5.png" mode="widthFix" class="addwidth"></image>
				</view>
			</view>
		</view>
		<!-- 播放列表	 -->
		<uni-popup mode="fixed" :show="isShowPlaylist" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">播放列表</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item,index) in musicList" :key="index" @click="initPlay(item.Id,index)">
							<view class="line-item-l text_left">
								<text :class="['txt',musicID==item.Id?'c_theme':'']">{{item.Name}}</text>
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
	import {post,toLogin,formatSecond} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
	import {editShareUrl} from '@/common/common'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import Vue from 'vue'
	let update = true;
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				userId: '',
				token: '',
				musicList: [],
				nowIndex: 0,
				musicID:"",
				loading: false, //是否处于读取状态
				isCollect:0,//是否收藏
				isbuy:0,//是否需要付费
				itemdata:{
					ADuration: 0,
					Audio: "",
					Id: '',
					IsCollect: 0,
					IsShowBuy: '',
					Is_Charge: '',
					MemberId: "",
					Name: "",
					PicImg: "",
					Price: '',
					Source: ""
				},//舞曲信息
				isShowPlaylist:false,//弹出播放列表
				playType:0,//0:顺序播放  1:随机 2:单曲
				h5Url:'',
				type:'',
				isPlay: true,
				playTime: 0,
				curPlayTime: 0,
				curPlayIndex: 0,
			}
		},
		computed:{
			...mapGetters(['audiolist']),
			playTimeNum() {
				console.log(formatSecond(this.playTime))
				return formatSecond(this.playTime)
			},
			curPlayTimeNum() {
				return formatSecond(this.curPlayTime)
			}
		},
		onLoad(e) {
			this.nowIndex=e.nowIndex||0;
			this.musicID=e.id||'';
			this.type = e.type||'';
			this.musicList=uni.getStorageSync("musicList");//音乐列表
			if(!this.nowIndex&&!e.type){
				this.musicList.forEach((v,i)=>{
					if(v.Id == this.musicID ){
						this.nowIndex = i;
					}
				})
				this.curPlayIndex = this.nowIndex;
			}else{
				this.curPlayIndex = Number(this.nowIndex);
			}
			if(uni.getStorageSync("playID")==this.musicID){
				console.log("当前播放curPlayTime"+this.$au_player.currentTime)
				console.log("当前播放this.playTime"+this.$au_player.duration)
				if(this.$au_player.paused){
					this.$au_player.play();
				}
				this.curPlayTime=Math.floor(this.$au_player.currentTime)
				this.playTime=Math.floor(this.$au_player.duration)
			}else{
				this.curPlayTime=0;
				this.playTime=0;
			}
			this.setAudiolist(this.musicList);
			this.initPlay(this.musicID);
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
		},
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			sliderChange(e) {
				this.curPlayTime = e.detail.value;
				this.$au_player.seek(this.curPlayTime)
			},
			operation() {
				if(this.isbuy==0){
					if (this.isPlay) {
						this.$au_player.pause();
					} else {
						this.$au_player.play();
					}
					this.isPlay = !this.isPlay;
					this.setIsplayingmusic(this.isPlay)
				}else{
					if(uni.getStorageSync("playID")!=this.musicID){
						this.$au_player.pause();
					}
					let _this=this;
					if(!toLogin())return;
					//#ifndef APP-PLUS
					uni.showModal({
						content: "该舞曲需付费,去付费？",
						success(res) {
							if (res.confirm) {
								if(toLogin()){
									let buyInfo={
										PicImg:_this.itemdata.PicImg,
										name:_this.itemdata.Name,
										price:_this.itemdata.Price
									}
									uni.setStorageSync('buyInfo', buyInfo);
									uni.navigateTo({
										url:'/pages/pay2/pay2?type=1&id='+_this.musicID
									})
								}
							} else if (res.cancel) {
							}
						}
					});
					//#endif
					//#ifdef APP-PLUS
					this.$showModal({
						content: "该舞曲需付费,去付费？",
					}).then(res=>{
						if(toLogin()){
							let buyInfo={
								PicImg:_this.itemdata.PicImg,
								name:_this.itemdata.Name,
								price:_this.itemdata.Price
							}
							uni.setStorageSync('buyInfo', buyInfo);
							uni.navigateTo({
								url:'/pages/pay2/pay2?type=1&id='+_this.musicID
							})
						}
						//确认
					  }).catch(res=>{
						//取消
					  })
					//#endif
				}
			},
			
			//弹出播放列表
			ShowPlaylist(){
				this.isShowPlaylist=true;
			},
			initPlay(id,index){
				if(index){
					this.curPlayIndex = index
				}
				console.log(this.$au_player)
				Vue.prototype.cusPlay = this.onPlayFn
				Vue.prototype.cusTimeUpdate = this.onTimeUpdateFn
				Vue.prototype.cusEnded = this.onEndedFn
				Vue.prototype.cusWaiting = this.onWaitingFn
				Vue.prototype.cusonCanplay = this.onCanplayFn
				post('DanceMusic/Music_xq',{
					UserId:uni.getStorageSync('userId'),
					Token:uni.getStorageSync('token'),
					MusicId:id
				}).then(res=>{
					if(this.type==='share'){
						this.musicList=[];
						this.musicList.push(res.data)
						this.setAudiolist(this.musicList);
					}
					const surl = res.data.Audio;
					if(res.data.IsShowBuy==0){
						this.nowIndex=index;
						this.itemdata=res.data;
						this.musicID=res.data.Id;
						this.isbuy=res.data.IsShowBuy;
						this.isCollect=res.data.IsCollect;
						uni.setNavigationBarTitle({
							title: this.itemdata.Name
						})
						// console.log("this.nowIndex"+this.nowIndex)
						// console.log("this.musicID"+this.musicID)
						if(uni.getStorageSync("playID")!=id||this.playType==2){
							console.log("src改变了")
							this.setPlaydetail({id,pic:res.data.PicImg});
							this.$au_player.autoplay = true;
							this.$au_player.title = res.data.Name;
							//app
							this.$au_player.src = res.data.Audio;
							//#ifdef APP-PLUS
							this.$au_player.play();
							//#endif
						}else{
							console.log("同一首歌")
							// this.$au_player.startTime=this.curPlayTime;
							// this.$au_player.play();
						}
					}else{
						let _this=this;
						//#ifndef APP-PLUS
						uni.showModal({
							content: "该舞曲需付费,去付费？",
							success(res) {
								if (res.confirm) {
									if(toLogin()){
										let buyInfo={
											PicImg:_this.musicList[index].PicImg,
											name:_this.musicList[index].Name,
											price:_this.musicList[index].Price
										}
										uni.setStorageSync('buyInfo', buyInfo);
										uni.navigateTo({
											url:'/pages/pay2/pay2?type=1&id='+_this.musicList[index].Id
										})
									}
								} else if (res.cancel) {
								}
							}
						});
						//#endif
						//#ifdef APP-PLUS
						this.$showModal({
							content: "该舞曲需付费,去付费？",
						}).then(res=>{
							if(toLogin()){
								let buyInfo={
									PicImg:_this.musicList[index].PicImg,
									name:_this.musicList[index].Name,
									price:_this.musicList[index].Price
								}
								uni.setStorageSync('buyInfo', buyInfo);
								uni.navigateTo({
									url:'/pages/pay2/pay2?type=1&id='+_this.musicList[index].Id
								})
							}
							//确认
						  }).catch(res=>{
							//取消
						  })
						//#endif
						
					}
				}).catch(e=>{
					this.setIsplayactive(false)
				})
			},
			//切换播放顺序
			tabPlayType(){
				this.playType++
				if(this.playType==3){
					this.playType=0
				}
			},
			onPlayFn() {
				this.playTime = this.itemdata.ADuration;
				this.isPlay = true
				this.loading=false
				this.setIsplayingmusic(true)
				this.setIsplayactive(true)
				uni.setStorageSync("playID",this.musicID)
				console.log('onplaying')
			},
			onTimeUpdateFn() { 
				const curtime = this.$au_player.currentTime
				this.curPlayTime = Math.floor(curtime);
			},
			onEndedFn() {
				console.log('ended')
				this.isPlay = false;
				this.setIsplayingmusic(false)
				this.setIsplayactive(false)
				if(this.musicList.length==1){
					uni.setStorageSync("playID",'')
				}
				this.next(true);
			},
			onWaitingFn(){
				console.log("加载中")
				this.loading=true;
			},
			onCanplayFn(){
				console.log("可播放")
				this.loading=false;
			},
			getIndex(type, isAuto) {
				//['列表循环', '随机播放', '单曲循环']
				let next = 0;
				let prev = 0;
				const cur = this.curPlayIndex;
				const last = this.audiolist.length - 1;
				if (this.playType === 0 || this.playType === 2) {
					next = cur == last ? 0 : cur + 1;
					prev = cur == 0 ? last : cur - 1;
				}
				if (this.playType === 1) {
					next = Math.floor(Math.random() * (last + 1))
					prev = Math.floor(Math.random() * (last + 1))
				}
				if ((isAuto && this.playType === 2)||(isAuto && last === 0)) {
					next = cur
				}
				
				return type == 'next' ? next : prev
			},
			//下一曲
			next(isAuto){
				const index = this.getIndex('next', isAuto)
				this.initPlay(this.audiolist[index].Id)
				this.curPlayIndex = index;
			},
			//上一曲
			prev(){
				const index = this.getIndex('prev')
				this.initPlay(this.audiolist[index].Id)
				this.curPlayIndex = index;
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.isShowPlaylist=false;
			},
			//收藏
			async Collect(){
				if(toLogin()){
				let result = await post('DanceMusic/CollectOperation', {
					UserId: this.userId,
					Token: this.token,
					FindId: this.musicID,
				});
				if(result.code==0){
					if(this.isCollect==0){
						this.isCollect=1
					}else{
						this.isCollect=0
					}
					uni.showToast({
						title:result.msg,
						icon:"none"
					})
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
				}}
			},
		},
		onShareAppMessage: function(res) {
			if (res.from === 'button') {}
			return {
				title: '壹舞',
				path: editShareUrl('/pages/music/playMusic/playMusic?type=share&id='+this.musicID),
				success: function(res) {}
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #252b2f;
	min-height: 100%;
}
.warp{
	padding: 60upx 0 20upx;
}
.source{
	color: #b9b8b8;text-align: center;padding-top: 30upx;font-size: 22upx;
}
/* #ifdef MP-WEIXIN */
.playmusic{
	background-color: #252b2f;height: 100vh;
}
/* #endif */
	.playimgbox{
		width: 560upx;
		height: 560upx;
		margin: auto;
		border-radius: 50%;
		border: #191b1c 30upx solid;
		position: relative;
		background-color: transparent;
		image{
			border-radius: 50%;
			display: block;
			width: 500upx;
			height: 500upx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}
		.border2{
			position: absolute;
			left: 0;
			top: 0;
			border-radius: 50%;
			width: 460upx;
			height: 460upx;
			border: #e32a76 4upx solid;
			margin: 20upx;
			.border1{
				border-radius: 50%;
				width: 126upx;
				height: 126upx;
				border: #e32a76 30upx solid;
				background-color: #1c2227;
				margin: 167upx auto;
			}
		}
	}
	.playLoading {
		animation: loading 40s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	.playicon{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item{
			padding: 40upx;
			image{
				width: 46upx;
				height: 46upx;
			}
			.addwidth{
				width: 54upx;
			}
		}
	}
	.imt-audio {
		padding: 30upx;
		border-radius: 20upx;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
		margin-top: 60upx;
	}

	.audio-number {
		font-size: 24upx;
		line-height: 1;
		color: #6f7274;
	}

	.audio-slider {
		flex: 1;
		margin: 0 30upx;
	}

	.audio-control-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "icon" !important;
		color: #fff;
	}

	.audio-control {
		font-size: 40upx;
		line-height: 1;
		padding: 16upx;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.audio-control-switch {
		font-size: 40upx;
		margin: 0 80upx;
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
 
	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}

</style>
