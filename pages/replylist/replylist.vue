<template>
	<view class="content">
		<!-- 评价列表 -->
		<view class="comment-list uni-bg-white" v-if="hasData">
			<block v-for="(item,index) in 5" :key="index">
				<reply-item></reply-item>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" @click="showReplyBox" :placeholder="placeholder"/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import replyItem from '@/components/reply-item.vue'; //评论组件
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			replyItem,
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				page:1,
				pageSize:4,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: true,
				noDataIsShow: false,
				datalist:[],
				IsShowReplyBox:false,//是否显示评论按钮
				placeholder:"写评论~",
				Comment:"",//评论内容
			}
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			//显示评论按钮
			showReplyBox(){
				this.IsShowReplyBox=true;
			},
			//取消评论
			CancelReply(){
				this.placeholder="写评论~";
				this.IsShowReplyBox=false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
