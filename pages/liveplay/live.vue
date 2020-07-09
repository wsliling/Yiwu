<template>
	<view class="swiper">
		<swiper :vertical="true" :current="swiperIndex" class="playSwiper">
			<swiper-item v-for="(liveItem,liveIndex) in liveList" :key="liveIndex">
				<!-- #ifdef H5 -->
				<div class="H5video" id="H5video" :style="{ height: height + 'px' }"></div>
				<!-- #endif -->
				<!-- 底部信息 -->
				<view class="header-btn">
					<div class="left">
						<img src="http://www.sc-mall.net/static/icons/icon_goods.png" alt="" mode="aspectFill" />
						<div class="name">
							<p>你好，用户名</p>
							<p>123人观看</p>
						</div>
						<div class="btn">关注</div>
					</div>
					<div class="close">×</div>
				</view>
				<view class="nlv-footToolbar">
					<!-- 滚动msg信息 -->
					<scroll-view class="nlv-rollMsgPanel" scroll-y show-scrollbar="false" :scroll-top="scrollTop">
						<block v-for="(msgitem, msgidx) in strArr" :key="msgidx">
							<view class="nlv-msglist">
								<view class="msg_bg">
									<text class="msg_name">{{ msgitem.name }}</text>
									<text class="msg_text">{{ msgitem.Info }}</text>
								</view>
							</view>
						</block>
					</scroll-view>
					<!-- <view class="goodsbox" v-if="showgoodsbox">
				<view class="item">
					<view class="imgbox">
						<image :src="PicNo" mode="widthFix"></image>
					</view>
					<view class="txtBox">
						<view class="title uni-ellipsis">
							{{Name}}
						</view>
						<view class="price red">
							￥{{Price}}
						</view>
					</view>
				</view>
			</view> -->
					<view class="nlv-infobox">
						<view class="nlv_btntool" v-if="liveItem.ShopId&&proList.length">
							<view class="btn-toolitem" @click="showGoods">
								<image src="/static/icons/product-icon.png" class="icon_goods"></image>
								<span>123</span>
							</view>
						</view>
						<view class="nlv_reply" @click="Repliy">
							<image src="http://www.sc-mall.net/static/icons/icon_bianji.png" class="icon_bianji"></image>
							<text class="nlv_reply_text">跟主播聊点什么？</text>
						</view>
						<div class="btn-box">
							<img src="/static/icons/share.png" alt="" mode="widthFix" />
							<img src="/static/icons/gift.png" alt="" mode="widthFix" />
							<img src="/static/icons/xin.png" alt="" mode="widthFix" />
						</div>
					</view>
				</view>
				
					</swiper-item>
				</swiper>
				<uni-popup type="bottom" ref="proList" >
					<proList :list="[1,2,3,4]"></proList>
				</uni-popup>
				<view class="bottomicon" v-if="isshowInput">
					<view class="inputbtn">
						<input
							type="text"
							placeholder="说点什么..."
							class="input_text"
							v-model="sendInfo"
							confirm-type="send"
							confirm-hold
							@blur="blurFocus"
							:focus="inputFocusStatus"
							@confirm="sendMessage"
							:cursor-spacing="10"
						/>
						<!-- <view class="rightbtn" @click="sendMessage(sendInfo)">
							<image src="http://www.sc-mall.net/static/icons/icon_Send.png" class="sendBtn"></image>
						</view> -->
					</view>
				</view>
	</view>
</template>

<script>
import { host, post, get, wssPath } from '@/common/util.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import proList from './proList.vue';
export default {
	components: {
		uniPopup,proList
	},
	data() {
		return {
			height: '',
			mark: false,
			data: {},
			showPopupGoods: false, //弹出商品
			isshowInput: false, //弹出输入
			inputFocusStatus: false, //input对焦状态
			sendInfo: '', //发送消息的内容
			userId: '',
			token: '',
			showgoodsbox: true,
			countNum: 0,
			type: 0,
			SocketTask: null,
			socketStatus: false,
			strArr: [{ name: '系统提示', Info: '欢迎进入直播间' }],
			Id: 0,
			PicNo: '',
			Price: '',
			Name: '',
			Signature: '', // 获取WebSocketId 用于身份验证
			TimeStamp: '',
			SecretKey: '',
			scrollTop: 2000, //滚动到底部

			memberId:'',
			swiperIndex: 0 ,//轮播的index
			liveList:[],//直播列表
			proList:[],//产品列表
		};
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		// #endif
		this.memberId = e.id;
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onShow() {
		let res = uni.getSystemInfoSync();
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.height = res.windowHeight;
		// #ifndef APP-PLUS
		// this.ShopId = this.$mp.query.ShopId
		// #endif
		console.log(this.ShopId);
		this.play();
		this.showgoodsbox = true;
		this.countTime();
		this.livemessage();
	},
	onHide() {
		this.SocketTask.close();
	},
	onUnload() {
		this.SocketTask.close();
	},
	methods: {
		//统一的关闭popup方法
		hidePopup: function() {
			// this.showPopupGoods = false;
			this.$refs.proList.close();
		},
		//展示商品
		showGoods: function() {
			this.$refs.proList.open();
			// this.hidePopup();
			// this.showPopupGoods = true;
		},
		// 获取WebSocketId 用于身份验证
		async livemessage() {
			let res = await post('User/GetWebSocketId', {
				UserId: this.userId,
				Token: this.token,
				Type: 0,
				FriendId: this.ShopId
			});
			console.log(res);
			this.Signature = res.data.Signature;
			this.TimeStamp = res.data.TimeStamp;
			this.SecretKey = res.data.SecretKey;
			this.connectSocket();
		},
		// 打开webSocket链接登录验证
		async connectSocket() {
			let that = this;
			this.SocketTask = uni.connectSocket({
				url: wssPath + '?Signature=' + this.Signature,
				success: () => {}
			});

			this.SocketTask.onOpen(res => {
				// console.log("open", res);
				that.socketStatus = true;
				let data = that.LoginData(1, that.TimeStamp, that.SecretKey);
				that.SocketTask.send({ data: JSON.stringify(data) });
				console.log('发送数据', res);
				// console.log(that.SocketTask)
			});
			this.onMessage();
			this.SocketTask.onError(function(res) {
				console.log('WebSocket连接打开失败，请检查！');
			});
			this.SocketTask.onClose(close => {
				console.log('close', close);
				this.socketStatus = false;
			});
		},
		//WebSocket连接请求数据
		LoginData(MsgType, TimeStamp, SecretKey) {
			let data = {
				MsgType: MsgType, //咨询者还是回答者
				TimeStamp: TimeStamp,
				SecretKey: SecretKey
			};
			// console.log(data)
			return data;
		},
		//发送数据处理
		MsgData(MsgType, Id, Info, Pic, AddTime, Lat, Lng) {
			var data = new Object();
			var msg = new Object();
			data.MsgType = MsgType;
			var fixInt = function(num, n) {
				return (Array(n).join(0) + num).slice(-n);
			};
			var newdate = function() {
				var now = new Date();
				var yy = now.getFullYear(); //年
				var mm = now.getMonth() + 1; //月
				var dd = now.getDate(); //日
				var hh = now.getHours(); //时
				var ii = now.getMinutes(); //分
				var ss = now.getSeconds();
				return yy + '-' + fixInt(mm, 2) + '-' + fixInt(dd, 2) + ' ' + fixInt(hh, 2) + ':' + fixInt(ii, 2) + ':' + fixInt(ss, 2);
			};
			if (uni.getStorageSync('name')) {
				msg.name = uni.getStorageSync('name');
			} else {
				msg.name = '匿名用户';
			}
			msg.Info = Info == undefined ? '' : Info;
			msg.Id = Id;
			msg.AddTime = AddTime == undefined ? newdate() : AddTime;
			msg = JSON.stringify(msg);
			data.Id = msg;
			data.Info = Info == undefined ? '' : Info;
			data.Pic = Pic == undefined ? '' : Pic;
			data.AddTime = AddTime == undefined ? newdate() : AddTime;
			data.Lat = Lat == undefined ? 0 : Lat;
			data.Lng = Lng == undefined ? 0 : Lng;
			return data;
		},
		async play() {
			// let res = await post('TencentCloud/PlayURL',{
			// 	UserId: this.userId,
			// 	Token: this.token,
			// 	MemberId:this.ShopId
			// })
			let res = await post('TencentCloud/PlayListURL', {
				UserId: this.userId,
				Token: this.token,
				MemberId: this.memberId
			});
			if (res.code == 0) {
				const data = res.data;
				if(data[0].ShopId){
					this.getProList(data[0].ShopId)
				}
				this.liveList = res.data;
				console.log(res.data);
				// #ifdef H5
				this.playH5();
				// #endif
			}
		},
		playH5() {
			var player = new TcPlayer('H5video', {
				m3u8: this.data.HLS, //请替换成实际可用的播放地址
				flv: this.data.FLV,
				autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
				live: true,
				controls: 'none',
				systemFullscreen: false,
				width: '480', //视频的显示宽度，请尽量使用视频分辨率宽度
				height: this.height //视频的显示高度，请尽量使用视频分辨率高度
			});
			player.play();
		},
		//发送消息
		async sendMessage(e) {
			console.log(e, 'eee');
			return;
			let that = this;
			let time = new Date();
			console.log(this.Id);
			this.Id = +new Date();
			let data = this.MsgData(3, this.Id, e, '', time, 0, 0);
			this.SocketTask.send({ data: JSON.stringify(data) });
			this.onMessage();
			this.sendInfo = '';
		},
		//接收消息
		onMessage() {
			let msg;
			let that = this;
			this.SocketTask.onMessage(r => {
				msg = JSON.parse(r.data);
				// console.log(msg,55555)
				if (msg.code == 1) {
				} else if (msg.code == 3 || msg.code == 0) {
					let obj = JSON.parse(msg.data.Id);
					console.log(obj, 987);
					that.strArr.push(obj);
					for (let i = 0; i < that.strArr.length; i++) {
						for (let j = i + 1; j < that.strArr.length; j++) {
							if (that.strArr[i].Id == that.strArr[j].Id) {
								//第一个等同于第二个，splice方法删除第二个
								that.strArr.splice(j, 1);
								j--;
							}
						}
					}
					console.log('arr', that.strArr);
					this.isshowInput = false;
					this.$nextTick(function() {
						//等最新一条消息dom更新，滚动到底部
						that.scrollTop = this.scrollTop + 50;
					});
				} else if (msg.code == 2) {
					//连接断开，重新连接
					// let data=that.LoginData(1,that.TimeStamp,that.SecretKey)
					// that.SocketTask.send({data:JSON.stringify(data)})
					// uni.showToast({
					// 	title:'正在重连请稍等...',
					// 	icon:'none'
					// })
				}
			});
		},
		//弹出输入框获取焦点
		Repliy() {
			this.isshowInput = true;
			this.inputFocusStatus = true;
		},
		//失去焦点
		blurFocus() {
			// this.isshowInput=false;
			this.isshowInput = false;
		},
		//商品倒计时隐藏
		countTime() {
			let TIME_COUNT = 10;
			this.countNum = TIME_COUNT;
			let timer = setInterval(() => {
				if (this.countNum > 0 && this.countNum <= TIME_COUNT) {
					this.countNum--;
					this.showgoodsbox = true;
				} else {
					clearInterval(timer);
					timer = null;
					this.showgoodsbox = false;
				}
			}, 1000);
		},
		//链接跳转
		goUrl(url) {
			uni.navigateTo({
				url: url
			});
		},
		//***************商品***************
		// 获取产品列表
		async getProList(shopId){
			const res = await post('Goods/GetGoodsListByM',{
				UserId:this.userId,
				Token:this.token,
				ShopId:shopId,
				IsRecommend:1
			})
			if(!toLogin())return;
			if(res.code)return;
			res.data.map(item=>{
				item.confirmText='推荐商品';
			})
			this.proList = res.data;
		},
	}
};
</script>

<style scoped lang="scss">
.swiper {
	height: 100vh;
	width: 100vw;
	video {
		width: 100%;
		height: 100%;
		/* #ifdef H5 */
		height: 92%;
		/* #endif */
	}
}
.H5video {
	width: 100%;
}

.nlv-footToolbar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20upx;
	.nlv-rollMsgPanel {
		height: 35vh;
		.nlv-msglist {
			// margin-bottom: 20upx;
			flex-direction: row;
			.msg_bg {
				flex-direction: row;
				flex-wrap: wrap;
				background: rgba(0, 0, 0, 0.4);
				border-radius: 12upx;
				padding: 10upx;
				line-height: 1.2;
				font-size:24upx;
				max-width: 64%;
				text {
					display: inline-block;
				}
				.msg_name {
					color: #f5d916;
					margin-right: 10upx;
				}
				.msg_text {
					color: #fff;
				}
			}
			.nlv-msglist::after {
				display: block;
				content: '';
				width: 100%;
			}
		}
	}
	.goodsbox {
		width: 420upx;
		margin-top: 20upx;
		.item {
			display: flex;
			background: #fff;
			flex-direction: row;
			justify-content: flex-start;
			.imgbox {
				width: 100upx;
				height: 100upx;
				margin-right: 20upx;
			}
			.txtBox {
				width: 300upx;
			}
			.title {
				display: block;
			}
		}
	}
	.nlv-infobox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 20upx;
		padding: 0 10upx;
		.nlv_reply {
			flex-direction: row;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			border-bottom: 1upx solid #fff;
			height: 80upx;
			margin: 0 10upx;
			width: 50%;
			padding: 0 20upx;
			.icon_bianji {
				width: 46upx;
				height: 46upx;
				margin-right: 7upx;
			}
			.nlv_reply_text {
				color: #fff;
			}
		}
		.btn-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 215upx;
			img {
				width: 45upx;
				height: 45upx;
			}
		}
		.btn-toolitem {
			height: 72upx;
			width: 76upx;
			box-sizing: border-box;
			position: relative;
			.icon_goods {
				width: 100%;
				height: 100%;
				display: block;
			}
			span {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				line-height: 2;
				color: #fff;
				text-align: center;
				font-size: 20upx;
			}
		}
	}
}
.bottomicon {
	background: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20upx;
	z-index: 9999;
	box-sizing: border-box;
	.inputbtn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.input_text {
			border: 1px solid #ddd;
			border-radius: 8upx;
			padding: 0 20upx;
			min-height: 60upx;
			display: block;
			width: 100%;
			background: #f5f5f5;
		}
		.rightbtn {
			flex-direction: row;
			.sendBtn {
				display: block;
				width: 52upx;
				height: 52upx;
				margin-left: 4upx;
				padding: 0 20upx;
			}
		}
	}
}
.header-btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	color: #fff;
	position: fixed;
	top: 30upx;
	left: 0;
	padding: 0 30upx;
	.left {
		background: rgba(0, 0, 0, 0.4);
		padding: 10upx;
		border-radius: 30upx;
		display: flex;
		align-items: center;
		img {
			width: 70upx;
			height: 70upx;
			border-radius: 50%;
		}
		.name {
			color: #fff;
			line-height: 1.5;
			margin: 0 10upx;
			min-width: 200upx;
			font-size: 20upx;
		}
		.btn {
			background: #dd196d;
			border-radius: 20upx;
			padding: 0 15upx;
			line-height: 43upx;
		}
	}
	.close {
		font-size: 60upx;
		line-height: 1;
		// transform:rotate(45deg);
	}
}
.playSwiper {
	height: 100%;
}
</style>
