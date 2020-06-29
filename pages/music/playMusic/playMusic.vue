<template>
	<view>
		<view class="warp">
			<view class="playimgbox">
				<image :src="postImg||'/static/default_music.png'" mode="" :class="{'playLoading':!paused}"></image>
				<view class="border2">
					<view class="border1"></view>
				</view>
			</view>
		</view>
		<view class="playbox">
<!-- 			<imt-audio :src="musicList[now].Audio" :duration="musicList[now].ADuration" @prev="now = now === 0?musicList.length-1:now-1"
			 @next="now = now === musicList.length-1?0:now+1"></imt-audio> -->
			 <view class="imt-audio">
			 	<view class="audio-control-wrapper">
			 		<view class="audio-control audio-control-prev" @click="prev">&#xe601;</view>
			 		<view class="audio-control audio-control-switch" :class="{audioLoading:loading}" @click="operation">{{loading?'&#xe600;':(paused?'&#xe865;':'&#xe612;')}}</view>
			 		<view class="audio-control audio-control-next" @click="next">&#xe601;</view>
			 	</view>
			 	<view class="audio-wrapper">
			 		<view class="audio-number">{{currentTime}}</view>
			 		<slider class="audio-slider" activeColor="#e32a76" backgroundColor="#b9b8b8" block-size="16" :value="current" :max="duration" @changing="seek=true,current=$event.detail.value"
			 		 @change="change"></slider>
			 		<view class="audio-number">{{durationTime}}</view>
			 	</view>
			 </view>
			 <view class="playicon">
				 <view class="item" @click="Collect">
				 	<image :src="isCollect==0?'/static/collect3.png':'/static/collect2.png'" mode="widthFix" class="addwidth"></image>
				 </view>
			 	<view class="item">
			 		<image src="/static/music/playicon1.png" mode="widthFix"></image>
					<!-- <image src="/static/music/playicon2.png" mode="widthFix"></image> -->
					<!-- <image src="/static/music/playicon3.png" mode="widthFix"></image> -->
			 	</view>
				<view class="item">
					<image src="/static/music/playicon4.png" mode="widthFix"></image>
				</view>
				<view class="item">
					<image src="/static/music/playicon5.png" mode="widthFix" class="addwidth"></image>
				</view>
			 </view>
		</view>
	</view>
</template>

<script>
	import {post,audio,playMusic} from '@/common/util.js';
	export default {
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
				postImg:"",//当前封面
				isCollect:0,//是否收藏
			}
		},
		watch: {
			//监听总时长改变
			duration(e) {
				this.durationTime = this.format(e)
			},
			//监听当前进度改变
			current(e) {console.log(e)
				this.currentTime = this.format(e)
			}
		},
		onLoad(e) {
			this.nowIndex=e.nowIndex
			this.musicID=e.id
		},
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.musicList=uni.getStorageSync("musicList");//音乐列表
			this.duration=this.musicList[this.nowIndex].ADuration;
			this.postImg=this.musicList[this.nowIndex].PicImg;
			this.isCollect=this.musicList[this.nowIndex].IsCollect;
			uni.setNavigationBarTitle({
				title: this.musicList[this.nowIndex].Name
			})
			this.init()
		},
		methods: {
			init(){
				let playID=uni.getStorageSync("playID");console.log(playID,this.musicID)
				this.durationTime = this.format(this.duration);
				this.currentTime = this.format(this.current);
				audio.obeyMuteSwitch = false
				audio.autoplay =true
				if(playID==this.musicID){
					//音频进度更新事件
					audio.onTimeUpdate(() => {
						if (!this.seek) {
							this.current = audio.currentTime;
						}
					})
					this.paused = false
				}else{
					this.current = 0
				}
				//音频播放事件
				audio.onPlay(() => {
					this.paused = false
					this.loading = false
				})
				//音频暂停事件
				audio.onPause(() => {
					this.paused = true
				})
				//音频结束事件
				audio.onEnded(() => {
					this.next()
				})
				//音频完成更改进度事件
				audio.onSeeked(() => {
					this.seek = false
				})
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//播放/暂停操作
			operation() {
				playMusic(this.nowIndex,this.musicID)
				// if (audio.paused) {
				// 	audio.play()
				// 	this.loading = true
				// } else {
				// 	audio.pause()
				// }
			},
			//完成拖动事件
			change(e) {
				audio.seek(e.detail.value)
			},
			//收藏
			async Collect(){
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
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
page{
	background-color: #252b2f;
	min-height: 100%;
}
.warp{
	padding: 60upx 0;
}
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








@font-face {
		font-family: 'icon';
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
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
		font-size: 32upx;
		line-height: 1;
/* 		border: 4upx solid;
		border-radius: 50%; */
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
