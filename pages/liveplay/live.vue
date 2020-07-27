<template>
	<view class="swiper">
		<swiper :vertical="true" :current="swiperIndex" class="playSwiper"
			@change="swiperChange">
			<block v-for="(liveItem, liveIndex) in liveList" :key="liveIndex">
				<swiper-item v-if="liveItem.Flag" class="swiperItem">
					<!-- #ifdef H5 -->
					<div class="H5video" :id="liveItem.StreamName" :style="{ height: height + 'px' }"></div>
					<!-- #endif -->
					<!-- 顶部信息 -->
					<view class="header-btn">
						<div class="left">
							<img :src="liveItem.Avatar" alt="" mode="aspectFill" />
							<div class="name">
								<p>{{ liveItem.NickName }}</p>
								<p>{{ liveItem.ViewNum+1 }}人观看</p>
							</div>
							<div class="btn" :class="{ active: liveItem.IsFollow }" @click="onFollow(liveItem)">{{ liveItem.IsFollow ? '已关注' : '关注' }}</div>
						</div>
						<div class="close" @click="closePlay">×</div>
					</view>
					<view class="nlv-footToolbar">
						<!-- 滚动msg信息 -->
						<scroll-view class="nlv-rollMsgPanel" scroll-y show-scrollbar="false" :scroll-top="scrollTop">
							<block v-for="(msgitem, msgidx) in strArr" :key="msgidx">
								<view class="nlv-msglist">
									<view class="msg_bg">
										<text class="msg_name">{{ msgitem.name }}:</text>
										<text class="msg_text">{{ msgitem.Info }}</text>
									</view>
								</view>
							</block>
						</scroll-view>
						<view class="nlv-infobox">
							<view class="nlv_btntool" v-if="liveItem.ShopId && proList.length">
								<view class="btn-toolitem" @click="showGoods">
									<image src="/static/icons/product-icon.png" class="icon_goods"></image>
									<span>{{ proList.length }}</span>
								</view>
							</view>
							<view class="nlv_reply" @click="Repliy">
								<image src="http://www.sc-mall.net/static/icons/icon_bianji.png" class="icon_bianji"></image>
								<text class="nlv_reply_text">跟主播聊点什么？</text>
							</view>
							<div class="btn-box">
								<share :url="'/pages/liveplay/live?id='+liveItem.MemberId">
									<img src="/static/icons/share.png" alt="" mode="widthFix" />
								</share>
								
								<img @click="showGift" src="/static/icons/gift.png" alt="" mode="widthFix" />
								<div class="like" @click="onLike(liveItem)">
									<img src="http://yw.wtvxin.com/static/like2.png" alt="" mode="widthFix" />
									<div class="num active">
										{{likeNum(liveItem.LikeNum)}}
									</div>
								</div>
							</div>
						</view>
					</view>
				</swiper-item>
			</block>
		</swiper>
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
		<!-- 产品 -->
		<uni-popup type="bottom" ref="proList">
			<proListConponent :list="proList" @confirm="proBuy"></proListConponent>
		</uni-popup>
		<!-- 礼物 -->
		<uni-popup type="bottom" ref="gift">
			<div class="giftBox">
				<div class="gift-list">
					<div class="gift-item" @click="sendGift(item)"
						v-for="(item,index) in giftList" :key="index"
						>
						<img :src="item.Img" alt="" mode="aspectFill">
						<div class="name">
							<div class="price">{{item.Cost}}
								<span class="bi">币</span>
							</div>
							{{item.Name}}
						</div>
					</div>
				</div>
				<div class="total">
					<div>{{myMoney}}
						<span class="bi">币</span>
					</div>
					<div class="btn" @click="payTo">充值</div>
				</div>
			</div>
		</uni-popup>
	</view>
</template>

<script>
import { host, post, get, toLogin,wssHost } from '@/common/util.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import proListConponent from './proList.vue';
var player = null;
export default {
	components: {
		uniPopup,
		proListConponent
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
			strArr: [{ name: '系统提示', Info: '欢迎进入直播间' }],
			Id: 0,
			PicNo: '',
			Price: '',
			Name: '',
			Signature: '', // 获取WebSocketId 用于身份验证
			TimeStamp: '',
			SecretKey: '',
			scrollTop: 2000, //滚动到底部
			liveErrNum:0,

			memberId: '',
			swiperIndex: 0, //轮播的index
			liveList: [], //直播列表
			proList: [], //产品列表
			giftList: [], //礼物列表
			myMoney:0,//我的直播币
			userInfo:{},
			xintiao:null,
		};
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		// #endif
		this.memberId = e.id || '';
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.play();
		this.getGiftList();//获取礼物列表
	},
	onShow() {
		let res = uni.getSystemInfoSync();
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		console.log('this.userId',this.userId)
		this.height = res.windowHeight;
		// #ifndef APP-PLUS
		// this.ShopId = this.$mp.query.ShopId
		// #endif
		this.getMyMoney();//获取我的直播币
		this.showgoodsbox = true;
		
		// 每次跳转页面都释放聊天socket,重新打开时,如果存在memberId就重新连接,(比如充值)
		if(!this.SocketTask&&this.data.MemberId){
			
			this.livemessage();
		}
	},
	onHide() {
		if(!this.SocketTask)return;
		this.SocketTask.close();
	},
	onUnload() {
		if(!this.SocketTask)return;
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
				UserId: this.userId||'',
				Token: this.token||'',
				ToMemberId: this.data.MemberId,
				Type:''
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
				url: wssHost + '/LiveRoomServer.ashx?Signature=' + this.Signature,
				complete(err){
					console.log(err)
				}
			});
			this.SocketTask.onOpen(res => {
				console.log("open", res);
				let data = that.LoginData(1, that.TimeStamp, that.SecretKey);
				that.SocketTask.send({ data: JSON.stringify(data) });
				console.log('发送数据', res);
				this.xintiao = null;
				//心跳连接
				// this.xintiao = setInterval(()=>{ 
				// 	console.log('发送了一次心跳测试')
				// 	this.pushMsg('ping')
				// },10000)
				// console.log(that.SocketTask)
			});
			this.onMessage();
			this.SocketTask.onError(function(res) {
				// 如果没超过10次就重新连接
				if(this.liveErrNum<20){
					this.liveErrNum+=1;
					this.livemessage();
				}
				console.log('WebSocket连接打开失败，请检查！',res);
			});
			this.SocketTask.onClose(close => {
				this.SocketTask=null;
				console.log('close', close);
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
		// 推送一条消息
		pushMsg(text,name=''){
			let sendData = {
				MsgType:3,
				Id:JSON.stringify({
					Id:new Date().getTime(),
					Info:text,
					name:name||'系统提示'
				}),
				Info:text,
			}
			this.SocketTask.send({ data: JSON.stringify(sendData) });
		},
		async play() {
			let res = await post('TencentCloud/PlayListURL', {
				MemberId: this.memberId,
				UserId:this.userId,
				Token:this.token
			});
			if (res.code) return;
			const data = res.data;
			if (data.length > 0) {
				this.liveList = data;
				this.data = data[0];
				if (data[0].fType) {
					this.getProList();
				}
				this.livemessage();//打开聊天室
				console.log(this.data);
				// #ifdef H5
				this.$nextTick(()=>{
					this.playH5();
				})
				// #endif
			} else {
				uni.showToast({
					title: '当前没人在直播哦~请晚点再来',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
			}
		},
		// 切换直播
		swiperChange(e){
			console.log(e.detail.current,'eee')
			const index = e.detail.current
			this.data = this.liveList[index];
			this.livemessage();//打开聊天室
			this.strArr = [];//初始化消息
			// this.strArr = [{ name: '系统提示', Info: '欢迎进入直播间' }];//初始化消息
			player.pause();
			player.destroy();
			console.log('player',player)
			this.playH5();
			if(this.data.fType){
				this.getProList()
			}
		},
		playH5() {
			player = new TcPlayer(this.data.StreamName, {
				RTMP:this.data.RTMP,
				m3u8: this.data.HLS, //请替换成实际可用的播放地址
				flv: this.data.FLV,
				autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
				live: true,
				controls: 'none',
				systemFullscreen: false,
				width: '480', //视频的显示宽度，请尽量使用视频分辨率宽度
				height: this.height //视频的显示高度，请尽量使用视频分辨率高度
			});
			document.onload = function(e){
				console.log('load',e)
			}
			document.onerror = function(e){
				console.log('error',e)
			}
			console.log(player,'play')
			player.play();
		},
		//发送消息
		async sendMessage(e) {
			let that = this;
			let data = {
				MsgType:3,
				Id:JSON.stringify({
					Id:new Date().getTime(),
					Info:e.detail.value,
					name:this.userInfo.NickName
				}),
				Info:e.detail.value,
			}
			this.SocketTask.send({ data: JSON.stringify(data) });
			console.log(data, 'data');
			this.sendInfo = '';
			this.closeInput();
		},
		// 关闭输入框
		closeInput(){
			console.log('关闭输入框')
			this.inputFocusStatus= false;
			this.isshowInput=false;
			uni.hideKeyboard();
		},
		//接收消息
		onMessage() {
			let msg;
			let that = this;
			this.SocketTask.onMessage(r => {
				msg = JSON.parse(r.data);
				console.log(msg,'收到的数据')
				if (msg.code == 1) {
					this.pushMsg(that.userInfo.NickName?'欢迎'+that.userInfo.NickName+'进入直播间':'欢迎匿名用户进入直播间')
					
				} else if (msg.code == 3 || msg.code == 0) {
					let obj = JSON.parse(msg.data.Id);
					console.log(obj, '接收到的消息');
					if(obj.Info.indexOf('主播')!==-1){
						this.getProList();
					}
					if(obj.Info!=='ping'){
						that.strArr.push(obj);
					}else{
						console.log('接收了一次心跳测试',obj)
					}
					// for (let i = 0; i < that.strArr.length; i++) {
					// 	for (let j = i + 1; j < that.strArr.length; j++) {
					// 		if (that.strArr[i].Id == that.strArr[j].Id) {
					// 			//第一个等同于第二个，splice方法删除第二个
					// 			that.strArr.splice(j, 1);
					// 			j--;
					// 		}
					// 	}
					// }
					console.log('arr', that.strArr);
					// this.isshowInput = false;
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
			if(!toLogin()) return;
			this.isshowInput = true;
			this.inputFocusStatus = true;
		},
		//失去焦点
		blurFocus() {
			// this.isshowInput=false;
			this.isshowInput = false;
		},
		//链接跳转
		goUrl(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 关注
		async onFollow(item) {
			if(!toLogin()) return;
			const res = await post('Find/FollowOperation', {
				ToMemberId: item.MemberId,
				Token: this.token,
				UserId: this.userId
			});
			if (res.code) return;
			item.IsFollow ? (item.IsFollow = 0) : (item.IsFollow = 1);
			uni.showToast({
				title: res.msg
			});
		},
		// 点赞
		onLike(item){
			if(!toLogin()) return;
			post('TencentCloud/LiveRoomLikes',{
				Token: this.token,
				UserId: this.userId,
				StreamName:item.StreamName,
				pType:item.fType,
				MemberId:item.MemberId||'',
				ShopId:item.ShopId||''
			})
			item.LikeNum+=1;
		},
		// 格式化点赞数量
		likeNum(num){
			if(num>10000){
				return parseInt(num/10000) + '万'
			}else if(num>1000){
				return parseInt(num/1000) + '千'
			}else{
				return num;
			}
		},
		//***************商品***************
		// 获取产品列表
		async getProList() {
			const res = await post('Goods/GetGoodsListByM', {
				ShopId: this.data.ShopId,
				IsRecommend: 1
			});
			if (res.code) return;
			this.proList = res.data;
			console.log(this.proList, 'prolist');
		},
		// 立即购买
		proBuy(item) {
			if(!toLogin()) return;
			uni.navigateTo({
				url: '/pages/shopSon/product/productDetails?proId=' + item.Id
			});
		},
		//**************礼物********
		// 打开礼物
		showGift(){
			this.$refs.gift.open();
		},
		// 获取礼物列表
		async getGiftList() {
			const res = await post('TencentCloud/GiftList',{t:1});
			if (res.code) return;
			this.giftList = res.data;
			console.log('gift',this.giftList)
		},
		// 送礼
		async sendGift(item){
			if(!toLogin()) return;
			const data = this.data;
			const res = await post('TencentCloud/SendGifts',{
				UserId:this.userId,
				Token:this.token,
				GiftId:item.Id,
				pType:data.fType,
				ShopId:data.ShopId,
				MemberId:data.MemberId,
				StreamName:data.StreamName
			})
			if(res.code)return;
			this.myMoney -= item.Cost;
			this.pushMsg(this.userInfo.NickName+'赠送了'+item.Name)
			uni.showToast({
				title:'赠送成功！'
			})
			this.$refs.gift.close();
		},
		// 充值
		payTo(){
			if(!toLogin()) return;
			// uni.setStorageSync('livePayMemberId',)
			uni.navigateTo({
				url:'/pages/member/recharge/recharge?type=2'
			})
		},
		// 获取我的直播币
		getMyMoney(){
			if(!this.userId||!this.token)return;
			// 直播币
			post('User/GetMyIncome',{
				UserId:this.userId,
				Token:this.token
			}).then(res=>{
				if (res.code==2){
					uni.setStorageSync('token','')
					uni.setStorageSync('userId','')
				}
				if(res.code)return;
				this.myMoney = res.data.LiveStreamMoney*1;
			})
			// 用户信息
			post('User/GetCenterInfo',{
				UserId:this.userId,
				Token:this.token
			}).then(res=>{
				if(res.code)return;
				this.userInfo = res.data;
			})
		},
		closePlay(){
			uni.navigateBack();
		}
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
	.nlv-rollMsgPanel {
		height: 35vh;
		padding:0 20upx;
		.nlv-msglist {
			margin-bottom: 5upx;
			flex-direction: row;
			.msg_bg {
				flex-direction: row;
				flex-wrap: wrap;
				background: rgba(0, 0, 0, 0.4);
				border-radius: 30upx;
				padding: 10upx;
				line-height: 1.2;
				font-size: 24upx;
				max-width: 64%;
				display:inline-block;
				text {
					display: inline-block;
					word-break: break-all;
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
	.nlv-infobox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 20upx;
		padding:20upx;
		
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
				width: 50upx;
				height: 50upx;
			}
			.like{
				position:relative;
				font-size:0;
				.num{
					position:absolute;
					top:0;left:0;
					line-height:2.4;
					font-size:18upx;
					color:#dd196d;
					text-align:center;width:100%;
					&.active{
						color:#fff;
					}
				}
				img{
					width: 65upx;
					height: 65upx;
				}
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
	position: absolute;
	top: 30upx;
	left: 0;
	padding: 0 30upx;
	.left {
		background: rgba(0, 0, 0, 0.4);
		padding: 8upx 12upx;
		border-radius: 50upx;
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
			margin-left: 10upx;
			margin-right: 20upx;
			font-size: 20upx;
		}
		.btn {
			background: #dd196d;
			border-radius: 20upx;
			padding: 0 15upx;
			line-height: 43upx;
			&.active {
				color: #dd196d;
				background: #fff;
			}
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
	.swiperItem{
		position:relative;
	}
}
.giftBox{
	background:#fff;
	padding-top:20upx;
	.gift-list{
		display:flex;
		align-items:center;
		flex-flow:row wrap;
		.gift-item{
			display:flex;
			justify-content:space-between;
			align-items:center;
			flex-flow:column nowrap;
			width:170upx;
			margin:30upx 0;
			font-size:28upx;
			text-align:center;
			.price{
				color:#dd196d;
				font-size:20upx;
			}
			img{
				width:100upx;height:100upx;
			}
		}
	}
	.total{
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:0 30upx;
		line-height:3.5;
		border-top:1upx solid #e8e8e8;
		color:#dd196d;
		font-size:28upx;
		.btn{
			background: #dd196d;
			border-radius: 30upx;
			padding: 0 30upx;
			line-height: 2;
			color:#fff;
		}
	}
	.bi{
		width:40upx;height:40upx;border-radius:50%;
		background:rgb(251, 213, 68);
		font-size:16upx;
		line-height:40upx;
		color:#fff;
		text-align:center;
		display:inline-block;
		margin:0 5upx;
	}
}
</style>
