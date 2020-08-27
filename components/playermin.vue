<template>
		<view class="player-min" :class="[!isOpen?'open':'']" v-if="(isplayactive && require)">
			<image class="img" :class="[isplayingmusic ? '':'stoped']" :src="playdetail.pic" mode="" @click="toPlayPage"></image>
			<view class="btns" v-show="isOpen">
				<text :class="['item iconfont',isplayingmusic?'icon-audiopuse':'icon-audioplay']" @click="play"></text>
				<text class="item iconfont icon-close" @click="longbtn"></text>
			</view>
		</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		props:{
			require:{
				type:Boolean,
				default:true
			},
			pagetype:{
				type:String,
				default:""
			}
		},
		mounted() {
			console.log(this.require)
		},
		data() {
			return {
				isOpen:true
			};
		},
		computed:{
			...mapGetters(['isplayingmusic','playdetail','audiolist','isplayactive'])
		},
		methods:{
			...mapMutations(['setIsplayingmusic','setPlaydetail','setIsplayactive']),
			play(){
				if(this.isplayingmusic){
					this.$au_player.pause();
					this.setIsplayingmusic(false)
				}else{
					this.$au_player.play()
					this.setIsplayingmusic(true)
				}
			},
			toPlayPage(){
				if(this.pagetype=="share"){
					uni.navigateTo({
						url:'/pages/music/playMusic/playMusic?type=share&id='+this.playdetail.id
					})
				}else{
					const list  = this.audiolist;
					uni.setStorageSync("musicList",list)
					uni.navigateTo({
						url:'/pages/music/playMusic/playMusic?id='+this.playdetail.id
					})
				}
			},
			longbtn(){
				let _this=this;
				//#ifndef APP-PLUS
				uni.showModal({
					content: "确定要关闭音乐播放器？",
					confirmColor:"#DD196D",
					success(res) {
						if (res.confirm) {
							_this.setIsplayingmusic(false)
							_this.setIsplayactive(false)
							_this.$au_player.stop();
							
						} else if (res.cancel) {
						}
					}
				});
				// #endif
				// #ifdef APP-PLUS
				this.$showModal({
					content: "确定要关闭音乐播放器",
				}).then(res=>{
					_this.setIsplayingmusic(false)
					_this.setIsplayactive(false)
					_this.$au_player.stop();
					//确认
				  }).catch(res=>{
					//取消
				  })
				// #endif
			}
		}
	}
</script>

<style lang="scss">
		.player-min{
			position: fixed;
			bottom: 40%;
			left: 12upx;
			z-index: 999;
			display: flex;
			align-items: center;
			width: 240upx;
			background-color: rgba(0,0,0,0.7);
			border-radius: 50upx 15upx 15upx 50upx ;
			&.open{
				border-radius: 45upx ;
			}
			.img{
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
				&.stoped {
					animation-play-state: paused;
				}
				animation: rotate 10s linear .1s infinite;
				box-shadow: 0 0 20upx;
			}
			.btns{
				display: flex;
				height: 100upx;
				line-height: 100upx;
				font-size: 48upx;
				color: #F0F0F0;
				transition: width 2.5s linear;
				align-items: center;
				padding: 0 10upx;
				.item{
					margin: 0 14upx;
				}
			}
		}
		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}
		
			100% {
				transform: rotate(360deg);
			}
		
		}
</style>
