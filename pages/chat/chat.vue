<template>
	<view>
		<view class="cu-chat">
			<view class="cu-item self">
				<view class="main">
					<view class="content bg-green">
						<text>喵喵喵！喵喵喵！喵喵喵！喵喵！喵喵！！喵！喵喵喵！</text>
					</view>
				</view>
				<view class="cu-avatar" style="background-image:url(/static/default.png);"></view>
			</view>
			<uni-view class="cu-info round">昨天 13:23</uni-view>
			<view class="cu-item">
				<view class="cu-avatar" style="background-image:url(/static/of/2.png);"></view>
				<view class="main">
					<view class="content">
						<text>喵喵喵！喵喵喵！</text>
					</view>
				</view>
			</view>
			<view class="cu-item self">
				<view class="main">
					<!-- #ifdef MP-WEIXIN -->
					<image src="/static/of/banner.jpg" mode="widthFix"></image>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<img src="/static/of/banner.jpg" class="img">
					<!-- #endif -->
				</view>
				<view class="cu-avatar" style="background-image:url(/static/default.png);"></view>
			</view>
			<view class="cu-item self">
				<view class="main">
					<view class="content bg-green">
						喵星球，喵喵市
					</view>
				</view>
				<view class="cu-avatar" style="background-image:url(/static/default.png);"></view>
			</view>
			<view class="cu-item">
				<view class="cu-avatar" style="background-image:url(/static/of/2.png);"></view>
				<view class="main">
					<!-- #ifdef MP-WEIXIN -->
					<image src="/static/of/3.png" mode="widthFix"></image>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<img src="/static/of/3.png" class="img">
					<!-- #endif -->
				</view>
			</view>
		</view>

		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" @click="showReplyBox" placeholder="请输入"/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				IsShowReplyBox:false,//是否显示发布按钮
				Comment:"",//发布内容
			};
		},
		methods: {
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

