<template>
	<view class="playmusic">
		<view class="warp">
			<view class="playimgbox">
				<image :src="itemdata.PicImg||'http://yw.wtvxin.com/static/default_music.png'" mode="" :class="{'playLoading':!paused}"></image>
				<view class="border2">
					<view class="border1"></view>
				</view>
			</view>
			<view class="source">来源{{itemdata.Source||'未知'}}</view>
		</view>
		<view class="playbox">
			 <view class="imt-audio">
			 	<view class="audio-control-wrapper">
			 		<view :class="['audio-control iconfont icon-prev',musicList.length>1?'':'c_999']" @click="prev"></view>
			 		<view :class="['audio-control audio-control-switch iconfont',loading?'icon-loading audioLoading':paused?'icon-audioplay':'icon-audiopuse']" @click="operation"></view>
			 		<view :class="['audio-control iconfont icon-prev audio-control-next',musicList.length>1?'':'c_999']" @click="next"></view>
			 	</view>
			 	<view class="audio-wrapper">
			 		<view class="audio-number">{{currentTime}}</view>
			 		<slider class="audio-slider" activeColor="#e32a76" backgroundColor="#b9b8b8" block-size="16" :value="current" :max="itemdata.ADuration" @changing="seek=true,current=$event.detail.value"
			 		 @change="change"></slider>
			 		<view class="audio-number">{{durationTime}}</view>
			 	</view>
			 </view>
			<view class="playicon">
				 <view class="item" @click="Collect">
				 	<image :src="isCollect==0?'http://yw.wtvxin.com/static/collect3.png':'http://yw.wtvxin.com/static/collect2.png'" mode="widthFix" class="addwidth"></image>
				 </view>
			 	<view class="item" @click="tabPlayType">
			 		<image src="http://yw.wtvxin.com/static/music/playicon1.png" mode="widthFix" v-if="playType==0"></image>
					<image src="http://yw.wtvxin.com/static/music/playicon2.png" mode="widthFix" v-else-if="playType==1"></image>
					<image src="http://yw.wtvxin.com/static/music/playicon3.png" mode="widthFix" v-else></image>
			 	</view>
				<share class="item" :url="'/pages/music/playMusic/playMusic?type=share&id='+musicID">
					<image src="http://yw.wtvxin.com/static/music/playicon4.png" mode="widthFix"></image>
				</share>
				<view class="item" @click="ShowPlaylist">
					<image src="http://yw.wtvxin.com/static/music/playicon5.png" mode="widthFix" class="addwidth"></image>
				</view>
			</view>
		</view>
		<!-- 播放列表	 -->
		<uni-popup mode="fixed" :show="isShowPlaylist" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">播放列表</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item,index) in musicList" :key="index" @click="slectplay(index)">
							<view class="line-item-l text_left">
								<text :class="['txt',nowIndex==index?'c_theme':'']">{{item.Name}}</text>
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
	import {post,audio,toLogin,playMusic} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup.vue';
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
				duration: 0, //总时长（单位：s）
				currentTime: '', //当前播放时间
				durationTime: '', //总时长
				current: '', //slider当前进度
				loading: false, //是否处于读取状态
				paused: true, //是否处于暂停状态
				seek: false, //是否处于拖动状态
				isCollect:0,//是否收藏
				isbuy:0,//是否需要付费
				itemdata:{},//舞曲信息
				isShowPlaylist:false,//弹出播放列表
				playType:0,//0:顺序播放 1:单曲 2:随机
				h5Url:'',
				type:'',
				nowSrc:'',
				waitFlag:false,
				playIDtype:0,//当前播放舞曲的状态0：暂停 1：播放中
				playnum:0,
				pagetype:"",//页面来源
			}
		},
		watch: {
			//监听总时长改变
			duration(e) {
				this.durationTime = this.format(e)
			},
			//监听当前进度改变
			current(e) {
				this.currentTime = this.format(e)
			}
		},
		onLoad(e) {
			this.nowIndex=e.nowIndex||0
			this.musicID=e.id||'';
			this.type = e.type||'';
			this.pagetype=e.pagetype||'';
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.playIDtype=uni.getStorageSync("playIDtype")
			this.musicList=uni.getStorageSync("musicList");//音乐列表
			this.playnum=0;
			//console.log(this.musicList,'list')
			// 获取一条音乐，用户分享的页面
			if(this.type==='share'){
				this.getSoleMusic();
				return;
			}
			if(this.musicList&&this.musicList.length&&this.nowIndex!=undefined&&!this.pagetype){
				// this.isCollect=this.musicList[this.nowIndex].IsCollect;
				// this.isbuy=this.musicList[this.nowIndex].IsShowBuy;
				// this.itemdata=this.musicList[this.nowIndex];
				// this.duration=this.itemdata.ADuration
				// uni.setNavigationBarTitle({
				// 	title: this.itemdata.Name
				// })
				// this.init()
				this.getSoleMusic()
			}
			if(this.pagetype){
				if(uni.getStorageSync("playID")){
					this.musicID=uni.getStorageSync("playID")
					this.getSoleMusic();
				}else{
					this.musicID=this.musicList[0].Id;
					this.getSoleMusic(1);
				}
				
			}
		},
		methods: {
			init(){
				//audio.offEnded()
				let playID=uni.getStorageSync("playID");
				this.durationTime = this.format(this.itemdata.ADuration);
				this.currentTime = this.format(this.current);
				// audio.autoplay =true
				if(playID==this.musicID){
					if(this.playnum==0){
						this.playnum++
						audio.play()
					}
					//音频进度更新事件
					audio.onTimeUpdate(() => {
						if (!this.seek) {
							this.current = audio.currentTime;
						}
						this.paused = false
						this.loading=false
					})
				}else{
					this.current = 0
				}
				//音频加载中
				audio.onWaiting(()=>{
					this.loading=true;
					console.log("加载中")
					audio.pause();
					this.waitFlag=true;// 标明是onWaiting触发的暂停
				})
				//音频暂停事件
				audio.onPause(() => {
					console.log("暂停状态")
					this.paused = true
				})
				//音频结束事件
				audio.onEnded(() => {
					if(this.playType!=1){
						this.next()
					}
				})
				//音频完成更改进度事件
				audio.onSeeked(() => {
					this.seek = false
				})
				audio.onCanplay(() => {
					if(this.waitFlag){
						audio.play()
					}
					this.waitFlag=false; 
				})
				//音频播放事件
				audio.onPlay(() => {
					console.log("播放状态")
					this.paused = false
					this.loading = false
				})
				
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//播放/暂停操作
			
			operation() {
				if(this.isbuy==0){
					playMusic(this.nowIndex,this.musicID,this.nowSrc)
					this.init()
				}else{
					let _this=this;
					if(!toLogin())return;
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
				}
			},
			//完成拖动事件
			change(e) {
				audio.seek(e.detail.value)
			},
			//弹出播放列表
			ShowPlaylist(){
				this.isShowPlaylist=true;
			},
			//选择播放
			slectplay(index){
				// console.log("选择播放index:"+index)
				post('DanceMusic/Music_xq',{
					UserId:this.userId,
					Token:this.token,
					MusicId:this.musicList[index].Id
				}).then(res=>{
					if(res.data.IsShowBuy==0){
						this.nowSrc=res.data.Audio;
						this.nowIndex=index;
						this.itemdata=res.data;
						this.musicID=res.data.Id;
						this.isbuy=res.data.IsShowBuy;
						uni.setNavigationBarTitle({
							title: this.itemdata.Name
						})
						console.log("this.nowIndex"+this.nowIndex)
						console.log("this.musicID"+this.musicID)
						playMusic(this.nowIndex,this.musicID,this.nowSrc)
						this.init()
						// this.operation();
						// this.init();
					}else{
						let _this=this;
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
					}
				})
				
			},
			//切换播放顺序
			tabPlayType(){
				this.playType++
				if(this.playType==1){
					audio.loop = true;
				}else{
					audio.loop = false;
				}
				if(this.playType==3){
					this.playType=0
				}
			},
			//下一曲
			next(){
				// console.log("this.playType"+this.playType)
				if(this.musicList.length<2)return;
				if(this.playType==2){
					let leng=this.musicList.length
					let num=Math.floor(Math.random() * leng);//生成一个0~length的随机数
					if(num==this.nowIndex){//跳过正在播放的
						this.next()
					}{
						this.slectplay(num)
					}
				}else{
					let leng=this.musicList.length
					if(this.nowIndex==leng-1){
						this.slectplay(0)
					}else{
						this.slectplay(this.nowIndex*1+1)
					}
				}
			},
			//上一曲
			prev(){
				if(this.musicList.length<2)return;
				if(this.playType==2){
					let leng=this.musicList.length
					let num=Math.floor(Math.random() * leng);//生成一个0~length的随机数
					if(num==this.nowIndex){//跳过正在播放的
						this.next()
					}else{
						this.slectplay(num)
					}
				}else{
					let leng=this.musicList.length
					if(this.nowIndex==0){
						this.slectplay(leng)
					}else{
						this.slectplay(this.nowIndex*1-1)
					}
				}
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
					if(this.musicList[this.nowIndex].IsCollect==0){
						this.isCollect=1
					}else{
						this.isCollect=0
					}
					uni.showToast({
						title:result.msg,
						icon:"none"
					})
					//刷新状态
					this.musicList[this.nowIndex].IsCollect=this.isCollect;
					uni.setStorageSync("musicList",this.musicList);
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
				}}
			},
			// 获取一条音乐详情
			getSoleMusic(noplay){
				post('DanceMusic/Music_xq',{
					UserId:this.userId,
					Token:this.token,
					MusicId:this.musicID
				}).then(res=>{
					const data = res.data;
					if(this.type==='share'){
						this.musicList=[];
						this.musicList.push(data)
					}
					this.nowSrc=data.Audio;
					this.isCollect=data.IsCollect;
					this.isbuy=data.IsShowBuy;
					this.duration=data.ADuration
					this.itemdata=data;
					uni.setNavigationBarTitle({
						title: data.Name
					})
					if(!noplay){
						this.operation();
					}
					//this.init()
					if(!toLogin())return;
				})
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
