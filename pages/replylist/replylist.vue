<template>
	<view class="content">
		<!-- 评价列表 -->
		<view class="comment-list uni-bg-white" v-if="hasData">
			<block v-for="(item,index) in datalist" :key="index">
				<reply-item :itemData='item' @Sendreplay="Sendreplay"></reply-item>
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
	import {post,get,dateUtils,toLogin} from '@/common/util.js';
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
				Findid:"",
				page:1,
				pageSize:10,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist:[],
				IsShowReplyBox:false,//是否显示评论按钮
				placeholder:"写评论~",
				PCommentId:0,//上级评论id
				Comment:"",//评论内容
				PCommentname:"",//上级评论名
			}
		},
		onLoad(e){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Findid=e.id;
			this.CommnetList();
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
				this.PCommentId=0;
			},
			async CommnetList(){
				let result = await post("Find/CommnetList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"FkId": this.Findid
				});
				if(result.code==0){
					if (result.data.length > 0) {
						let _this=this;
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.AddTime=dateUtils.format(item.AddTime);
							_this.$set(item, "imgArr",item.ImgList.split(","));
							_this.$set(item, "isSHOW",false);
							item.MyCommnetList.forEach(function(item2) {
								item2.AddTime=dateUtils.format(item2.AddTime);
								let txt =item2.Comment.split("#$#");
								if(txt.length==2){
									_this.$set(item2, "Comment",txt[1]);
									_this.$set(item2, "pname",txt[0]);
								}else{
									_this.$set(item2, "Comment",txt[0]);
									_this.$set(item2, "pname","");
								}
							})
						})
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					} 
				}
			},
			// 发表评论
			async CommentOperation(){
				let result = await post("Find/CommentOperation",{
					"UserId": this.userId,
					"Token": this.token,
					"FkId":this.Findid,
					"TypeInt":0,
					"ParentCommentId":this.PCommentId,
					"Comment":this.Comment,
					"PicList":'',
					"PicNo":''
				});
				if(result.code===0){
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
					//更新评论列表，并清空评论内容
					this.page=1;
					this.CommnetList();
					this.placeholder="写评论~";
					this.PCommentname="";
					this.PCommentId=0,
					this.Comment="";
				}else if (result.code === 2) {
					let _this =this;
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
			Send(){
				if(this.Comment!=""){
					if(this.PCommentname!=""){
						this.Comment=this.PCommentname+this.Comment;
					}
					this.CommentOperation();
				}else{
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
						duration: 2000
					});
				}
			},
			Sendreplay(e){
				console.log(e)
				if(e[1]==""){
					this.placeholder="回复匿名";
					if(e[2]==true){
						this.PCommentname="@匿名"+"#$#"
					}
				}else{
					this.placeholder="回复"+e[1];
					if(e[2]==true){
						this.PCommentname="@"+e[1]+"#$#";
					}
				}
				this.PCommentId=e[0];
				this.IsShowReplyBox=true;
			},
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.CommnetList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
