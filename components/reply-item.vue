<template>
	<view class="comment-item">
		<view class="comment-hd flex-between">
			<view class="flex-start">
				<view class="tx">
					<image :src="itemData.MemberHead||'/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="name">{{itemData.MemberName||'匿名用户'}}</view>
					<view class="time">{{itemData.AddTime}}</view>
				</view>
			</view>
			<view class="flex-end">
				<view class="txt_info reply" @click="Sendreplay(itemData.Id,itemData.MemberName,false)">
					<image class="icon" src="/static/reply2.png"></image>
					{{itemData.MyCommnetList.length>0?itemData.MyCommnetList.length:'回复'}}
				</view>
				<view :class="['txt_info zan',itemData.IsLike==1?'active':'']" @click="like(itemData.Id,1)"><image class="icon" :src="itemData.IsLike==1?'/static/zan2.png':'/static/zan.png'"></image>{{itemData.LikeNum>0?itemData.LikeNum:"点赞"}}</view>
			</view>
		</view>
		<view class="comment-con">
			{{itemData.Comment}}
		</view>
		<view class="comment-reply" v-if="itemData.MyCommnetList.length>0">
			<view class="item" v-if="itemData.isSHOW?index>-1:index<3" v-for="(item,index) in itemData.MyCommnetList">
				<view class="reply-hd flex-between">
					<view class="flex-start">
						<view class="tx">
							<image :src="item.MemberHead||'/static/default.png'" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">{{item.MemberName||'匿名用户'}}</view>
							<view class="time">{{item.AddTime}}</view>
						</view>
					</view>
					<view class="flex-end">
						<view :class="['txt_info zan',item.IsLike==1?'active':'']" @click="like(item.Id,2,index)"><image class="icon" :src="item.IsLike==1?'/static/zan2.png':'/static/zan.png'"></image>{{item.LikeNum>0?item.LikeNum:"点赞"}}</view>
					</view>
				</view>
				<view class="reply-con">
					<text class="c_999" @click="Sendreplay(item.ParentCommentId,item.MemberName,true)">回复<text style="color: #0A98D5;">{{item.pname}}</text>：</text>{{item.Comment}}
				</view>
			</view>
			<view class="morereply c_999" v-if="itemData.MyCommnetList.length>3" @click="showAll">
				<block v-if="itemData.isSHOW">收起回复</block>
				<block v-else>
				—查看全部回复{{itemData.MyCommnetList.length}}条
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js';
	export default {
		name: 'reply',
		props: {
			itemData: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		data() {
			return {
				userId: "",
				token: "",
			};
		},
		created() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			//显示全部回复
			showAll(){
				this.itemData.isSHOW=!this.itemData.isSHOW;
			},
			Sendreplay(mid,name,isPname) {
				this.$emit('Sendreplay',[mid,name,isPname]);
			},
			//点赞/取消点赞
			async like(id,level,index){
				let result = await post("Find/FindlikeOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId": id,
					"TypeStatu":2
				});
				if (result.code === 0) {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					if(level==1){
						if(this.itemData.IsLike==1){
							this.itemData.IsLike=0;
							this.itemData.LikeNum--;
						}else{
							this.itemData.IsLike=1;
							this.itemData.LikeNum++;
						}
					}else if(level==2){
						if(this.itemData.MyCommnetList[index].IsLike==1){
							this.itemData.MyCommnetList[index].IsLike=0;
							this.itemData.MyCommnetList[index].LikeNum--;
						}else{
							this.itemData.MyCommnetList[index].IsLike=1;
							this.itemData.MyCommnetList[index].LikeNum++;
						}
					}
					
				}else if (result.code === 2) {
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
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.comment-item{
		padding: 30upx;
		border-bottom: 1px solid #f5f5f5;
		.comment-hd{
			.tx{
				height: 90upx; width: 90upx;
			}
			.name{ font-size: 28upx;}
			
		}
		.info{ line-height: 1.3;}
		.time{
			color: #999; font-size: 24upx;
		}
		.tx {
			border-radius: 50%; 
			overflow: hidden;
			margin-right: 20upx;
			image{
				width: 100%; height: 100%; 
			}
		}
		.comment-con{
			line-height: 1.5;margin-left: 110upx;
		}
		.comment-reply{
			margin-left: 14upx;
			.item{ margin-top: 20upx;}
			.tx{
				height: 76upx; width: 76upx;
			}
			.name{ font-size: 26upx;}
			.time{
				font-size: 22upx;
			}
			.reply-con{
				margin-left: 96upx;
				color: #555; font-size: 26upx;
			}
		}
		.name{
			max-width: 200upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.txt_info{ 
			color: #999;
		    font-size: 24upx;
			margin-left: 20upx;
			display: flex;
			justify-content: flex-start;
			.icon{
				display: block;
				height: 34upx;
				width: 34upx;
				margin-right: 6upx;
			}
			&.active{
				color: $primary;
			}
		}
	}
</style>
