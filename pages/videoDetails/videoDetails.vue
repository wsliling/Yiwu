<template>
	<view>
		<view class="videobox">
			<video src="" poster="/static/of/banner.jpg" controls></video>
		</view>
		<view class="videoinfo uni-mb10 pd15">
			<view class="title uni-mb10">
				拉丁舞中骨盆的运动方向拉丁舞中骨盆的运动方向拉丁舞中骨盆
			</view>
			<view class="flex-between">
				<view class="left">
					<text class="price color_red">￥18.00</text>
					<text class="fz12 c_999">时长00:3:11</text>
					<text class="fz12 c_999">45552人已学</text>
				</view>
				<view class="buybtn">购买</view>
			</view>
			<view class="media-ft flex-between">
				<view class="ft_l flex-start">
					<view class="txt_info like active">124</view>
					<view class="txt_info reply">678</view>
					<view class="txt_info share"></view>
				</view>
				<view class="ft_r flex-end">
					<view class="txt_info download"></view>
					<view class="txt_info sign active"></view>
				</view>
			</view>
		</view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
			<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)" style="width: 50%;">{{tab.TypeName}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</scroll-view>
		<view class="Yi-courselist flexWrap flex-between" v-if="tabIndex==0">
			<view class="item" v-for="(item,index) in 6" :key="index" @click="tolink('/pages/videoDetails/videoDetails?id=')">
				<view class="maxpic">
					<image src="@/static/of/p1.jpg" mode="widthFix"></image>
					<view class="isplay"></view>
				</view>
				<view class="item_info">
					<view class="item_title uni-ellipsis">一舞拉丁黑色舞蹈现身材连衣裙</view>
					<view class="item_total">
						<view class="item_market">55人付款</view>
						<span class="item_price">￥79</span>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-list" v-if="tabIndex==1">
			<block v-for="(item,index) in 5" :key="index">
				<reply-item></reply-item>
			</block>
			<view class="center c_999 uni-mb10" @click="tolink('/pages/replylist/replylist?id=')">
				查看全部评论
			</view>
		</view>
		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
				<input class="ipt" type="text" v-model="Comment" @click="showReplyBox" placeholder="写评论"/>
				<view class="btn-r" v-if="IsShowReplyBox">
					<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import replyItem from '@/components/reply-item.vue'; //评论组件
	export default {
		components: {
			replyItem
		},
		data() {
			return {
				userId: "",
				token: "",
				tabIndex:0,
				tabnav:[
					{
						Id:1,
						TypeName:"其他课程"
					},
					{
						Id:2,
						TypeName:"评论"
					}
				],
				IsShowReplyBox:false,//是否显示发布按钮
				Comment:"",//发布内容
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			
		},
		onShow(){
			
		},
		computed: {
		   tabStyle(){
		     return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		   }
		 },
		methods: {
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			tapTab(index,id) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
				}
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
	page{ 
		background: #fff;
	}
</style>
