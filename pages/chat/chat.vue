<template>
	<view>
		<view class="cu-chat">
			<block v-for="item in list" :key="item.Id">
				<block v-if="item.IsMy">
					<uni-view class="cu-info round" v-if="item.AddTime">{{item.AddTime}}</uni-view>
					<view class="cu-item self">
						<view class="main">
							<view class="content bg-green">
								<text>{{item.Info}}</text>
							</view>
						</view>
						<view class="cu-avatar" :style="`background-image:url(${item.Avatar});`"></view>
					</view>
				</block>
				<block v-else>
					<uni-view class="cu-info round" v-if="item.AddTime">{{item.AddTime}}</uni-view>
					<view class="cu-item">
						<view class="cu-avatar" :style="`background-image:url(${item.Avatar});`"></view>
						<view class="main">
							<view class="content">
								<text>{{item.Info}}</text>
							</view>
						</view>
					</view>
				</block>
			</block>
			<!-- <view class="cu-item self">
				<view class="main">
					<!-- #ifdef MP-WEIXIN --1>
					<image src="/static/of/banner.jpg" mode="widthFix"></image>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN --1>
					<img src="/static/of/banner.jpg" class="img">
					<!-- #endif --1>
				</view>
				<view class="cu-avatar" style="background-image:url(/static/default.png);"></view>
			</view>
			<view class="cu-item">
				<view class="cu-avatar" style="background-image:url(/static/of/2.png);"></view>
				<view class="main">
					<!-- #ifdef MP-WEIXIN --1>
					<image src="/static/of/3.png" mode="widthFix"></image>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN --1>
					<img src="/static/of/3.png" class="img">
					<!-- #endif --1>
				</view>
			</view> -->
		</view>

		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" @click="showReplyBox" 
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
	import {post,get,toLogin,playMusic} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				id:'',//要通讯的他人id
				IsShowReplyBox:false,//是否显示发布按钮
				Comment:"",//发布内容
				list:[],
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

				uni.onSocketOpen((res)=>{
						console.log('成功连接',res)
						this.getMsg();
				})
				uni.onSocketError((err)=>{
						console.log('失败连接',err)
				})
				uni.onSocketClose((res)=>{
						console.log('关闭连接',res)
				})
				uni.connectSocket({
					url:'ws://ywapi.wtvxin.com/WebSocketServer.ashx?Signature='+res.data.Signature,
					complete(err){
						console.log(err)
					}
				})
				uni.onSocketMessage((res)=>{
					console.log('收到的消息',res)
				})
			},
			async send(){
				await post('Message/SendMessage',{
					UserId: this.userId,
					Token: this.token,
					ToMemberId:this.id,
					Info:this.Comment
				})
				this.Comment='';
				this.getMsg();
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
				this.$nextTick(function(){	
					// 滚动至页面底部
					uni.pageScrollTo({
						scrollTop: 99999999999,
						duration:100
					})
					// this.pageToBottom()
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

