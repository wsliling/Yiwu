<template>
	<view class="comment-item">
		<view class="comment-hd flex-between">
			<view class="flex-start">
				<view class="tx" @click="tolink('/pages/homepage/homepage?id='+dataitem.MemberId)">
					<image :src="dataitem.MemberHead||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="name">{{dataitem.MemberName||'匿名用户'}}</view>
					<view class="time">{{dataitem.AddTime}}</view>
				</view>
			</view>
			<view class="flex-end">
				<view class="txt_info reply" @click="Sendreplay(dataitem.Id,dataitem.MemberName,false)">
					<image class="icon" src="http://m.dance-one.com/static/reply2.png"></image>
					{{dataitem.MyCommnetList.length>0?dataitem.MyCommnetList.length:'回复'}}
				</view>
				<view :class="['txt_info zan',dataitem.IsLike==1?'active':'']" @click="like(dataitem.Id,1)"><image class="icon" :src="dataitem.IsLike==1?'http://m.dance-one.com/static/zan2.png':'http://m.dance-one.com/static/zan.png'"></image>{{dataitem.LikeNum>0?dataitem.LikeNum:"点赞"}}</view>
			</view>
		</view>
		<view class="comment-con">
			{{dataitem.Comment}}
		</view>
		<view class="comment-reply" v-if="dataitem.MyCommnetList.length>0">
			<view class="item" v-if="dataitem.isSHOW?index>-1:index<3" v-for="(item,index) in dataitem.MyCommnetList" :key="index">
				<view class="reply-hd flex-between">
					<view class="flex-start">
						<view class="tx" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">
							<image :src="item.MemberHead||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">{{item.MemberName||'匿名用户'}}</view>
							<view class="time">{{item.AddTime}}</view>
						</view>
					</view>
					<view class="flex-end">
						<view :class="['txt_info zan',item.IsLike==1?'active':'']" @click="like(item.Id,2,index)"><image class="icon" :src="item.IsLike==1?'http://m.dance-one.com/static/zan2.png':'http://m.dance-one.com/static/zan.png'"></image>{{item.LikeNum>0?item.LikeNum:"点赞"}}</view>
					</view>
				</view>
				<view class="reply-con">
					<text class="c_999" @click="Sendreplay(item.ParentCommentId,item.MemberName,true)">回复<text style="color: #0A98D5;">{{item.pname}}</text>：</text>{{item.Comment}}
				</view>
			</view>
			<view class="morereply c_999" v-if="dataitem.MyCommnetList.length>3" @click="showAll">
				<block v-if="dataitem.isSHOW">收起回复</block>
				<block v-else>
				—查看全部回复{{dataitem.MyCommnetList.length}}条
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
				dataitem:{}
			};
		},
		created() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.dataitem=this.itemData;
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
				this.dataitem.isSHOW=!this.dataitem.isSHOW;
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
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					if(level==1){
						if(this.dataitem.IsLike==1){
							this.dataitem.IsLike=0;
							this.dataitem.LikeNum--;
						}else{
							this.dataitem.IsLike=1;
							this.dataitem.LikeNum++;
						}
					}else if(level==2){
						if(this.dataitem.MyCommnetList[index].IsLike==1){
							this.dataitem.MyCommnetList[index].IsLike=0;
							this.dataitem.MyCommnetList[index].LikeNum--;
						}else{
							this.dataitem.MyCommnetList[index].IsLike=1;
							this.dataitem.MyCommnetList[index].LikeNum++;
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
				 display: block;
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
			align-items: center;
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
