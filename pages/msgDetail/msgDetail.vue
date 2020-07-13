<template>
	<view class="pp3">
		<view class="title">{{dataInfo.Title}}</view>
		<view class="time flex-between">
			<view>
				{{dataInfo.Source}}<span>{{dataInfo.AddTime}}</span>
			</view>
			<span>{{dataInfo.Hits+'人点击'}}</span>
		</view>
		<view class="artInfo-desc" v-if="dataInfo.Intro">
			{{dataInfo.Intro}}
		</view>
		<view class="arthtmlbox" v-if="dataInfo.Content">
			<uParse :content="dataInfo.Content"></uParse>
		</view> 
	</view>
</template>

<script>
	import {post,dateUtils,toLogin} from '@/common/util.js';
	import uParse from '@/components/uParse/src/wxParse.vue';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				userId: "",
				token: "",
				dataInfo:{},
			};
		},
		onLoad: function(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Findid=e.id;
			this.GetYWNewsInfo();
		},
		methods:{
			async GetYWNewsInfo(){
				let	result = await post("News/GetYWNewsInfo", {
					"Id":this.Findid
				});
				if (result.code === 0){
					this.dataInfo=result.data;
				}
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.title{
		font-size: 40upx;
		color: #333;
		font-weight: 600;
	}
	.time{
		margin: 30upx 0;
		font-size: 24upx;
		color: #999;
		span{
			margin-left: 40upx;
		}
	}
	.artInfo-desc{
	    font-size: 28upx;
	    padding: 20upx;
	    border-radius: 12upx;
	    background: #f6f8f7;
	    color: #666;
	}
	.wxParse /deep/ view{
		font-size: 32upx;
	}
</style>
