<template>
	<view>
		<scroll-view scroll-y :scroll-top="scrolltop" scroll-with-animation="true" class="cu-chat">
			<block v-for="item in list" :key="item.Id">
				<block v-if="item.IsMy">
					<uni-view class="cu-info round" v-if="item.AddTime">{{item.AddTime}}</uni-view>
					<view class="cu-item self">
						<view class="main">
							<view class="content bg-green">
								<text>{{decodeURIComponent(item.Info)}}</text>
							</view>
						</view>
						<view class="cu-avatar" :style="'background-image:url('+item.Avatar+');'"></view>
					</view>
				</block>
				<block v-else>
					<uni-view class="cu-info round" v-if="item.AddTime">{{item.AddTime}}</uni-view>
					<view class="cu-item">
						<view class="cu-avatar" :style="'background-image:url('+item.Avatar+');'"></view>
						<view class="main">
							<view class="content">
								<text>{{decodeURIComponent(item.Info)}}</text>
							</view>
						</view>
					</view>
				</block>
			</block>
			<!-- <view class="cu-item self">
				<view class="main">
					<!-1- #ifdef MP-WEIXIN --1>
					<image src="http://m.dance-one.com/static/of/banner.jpg" mode="widthFix"></image>
					<!-1- #endif -->
					<!-- #ifndef MP-WEIXIN --1>
					<img src="http://m.dance-one.com/static/of/banner.jpg" class="img">
					<!-1- #endif --1>
				</view>
				<view class="cu-avatar" style="background-image:url(http://m.dance-one.com/static/default.png);"></view>
			</view>
			<view class="cu-item">
				<view class="cu-avatar" style="background-image:url(http://m.dance-one.com/static/of/2.png);"></view>
				<view class="main">
					<!-1- #ifdef MP-WEIXIN --1>
					<image src="http://m.dance-one.com/static/of/3.png" mode="widthFix"></image>
					<!-1- #endif -1->
					<!-1- #ifndef MP-WEIXIN -1->
					<img src="http://m.dance-one.com/static/of/3.png" class="img">
					<!-1- #endif --1>
				</view>
			</view> -->
		</scroll-view>

		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" cursor-spacing="10" @click="showReplyBox" 
					placeholder="请输入" confirm-type="send" @confirm="send"
					/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="send">发布</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {post,get,toLogin,playMusic,wssHost,toast } from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				id:'',//要通讯的他人id
				IsShowReplyBox:false,//是否显示发布按钮
				Comment:"",//发布内容
				list:[],
				scrolltop:99999
			};
		},
		onLoad(e){
			this.id = e.id||'5AE70E637DF4EC76';
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.openSocket();
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onUnload() {
			uni.closeSocket({
			success() {
				console.log("关闭socket成功");
			}
			});
		},
		methods: {
			async openSocket(){
				const res = await post('Message/GetWebSocketId',{
					UserId: this.userId,
					Token: this.token,
					ToMemberId:this.id
				})
				// 创建连接
				uni.connectSocket({
					url:wssHost+'/WebSocketServer.ashx?Signature='+res.data.Signature,
					complete(err){
						console.log(err,res.data.Signature)
					}
				})
				uni.onSocketOpen((ress)=>{
					console.log('成功连接',ress)
					this.sendSocketMsg({MsgType: 1})
					this.getMsg();
				})
				uni.onSocketError((err)=>{
						console.log('失败连接',err)
						toast('系统错误，请重新尝试')
						setTimeout(()=>{
							uni.navigateBack();
						},1500)
				})
				//code=99,是错误，也包过正常错误。
				// code=1 发起登录、登录成功、
				// code=2 发起退出、需要登录
				// code=3 聊天
				// code=0 服务反馈处理了。
				uni.onSocketMessage((ress)=>{
					console.log('收到的消息',ress)
        			let res = JSON.parse(ress.data);
					if(res.code==3||res.code==0){
						this.getMsg();
					}
				})
			},
			// 发送socket
			sendSocketMsg(data){
				uni.sendSocketMessage({ data: JSON.stringify(data) });
			},
			async send(data){
				const res = await post('Message/SendMessage',{
					UserId: this.userId,
					Token: this.token,
					ToMemberId:this.id,
					Info:encodeURIComponent(this.Comment)
				})
				this.sendSocketMsg({
					MsgType:3,
					Id:res.data.Id,
					Info:encodeURIComponent(this.Comment)
				})
				this.Comment='';
			},
			async getMsg(){
				const res = await post('Message/ReadMessage',{
					UserId: this.userId,
					Token: this.token,
					ToMemberId:this.id,
				})
				const data = res.data;
				let time=0;
				data.map(item=>{
					let nowTime = new Date(item.AddTime).getTime();
					if((nowTime-time)/1000/60>5){
						item.AddTime = item.AddTime.slice(0,item.AddTime.lastIndexOf(':'))
					}else{
						item.AddTime ='';
					}
					time = nowTime;
				})
				this.list = data;
				let that=this
				this.$nextTick(function(){	
					that.scrolltop=that.scrolltop*1+30
					// 滚动至页面底部
					// uni.pageScrollTo({
					// 	scrollTop: 99999999999,
					// 	duration:100
					// })
				})
			},
			//显示评论按钮
			showReplyBox(){
				this.IsShowReplyBox=true;
			},
			//取消评论
			CancelReply(){
				this.IsShowReplyBox=false;
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import './style';
</style>

