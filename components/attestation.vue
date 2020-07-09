<template>
	<view class="">
		<view class="succeed" v-if="AuditStatus == 0 || AuditStatus == 1">
			<image src="http://yw.wtvxin.com/static/my/succeed.png" mode=""></image>
			<view class="" v-if="AuditStatus == 0"> 认证成功</view>
			<view class="" v-else> 待审核中</view>
		</view>
		<view class="succeed" v-if="AuditStatus == 2">
			<image src="http://yw.wtvxin.com/static/my/defeated.png" mode=""></image>
			<view class="">认证失败！</view>
			<view class="anew" @click="anew">重新认证</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			AuditStatus: {
				type: [String,Number],
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			anew(){
				this.$emit('toAnew');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.succeed{
		font-size: 36upx;
		font-weight:bold;
		text-align: center;
		padding-top: 100upx;
		image{
			width:176upx;
			height:176upx;
		}
		.anew{
			width:516upx;
			height:88upx;
			line-height: 88upx;
			border:1upx solid rgba(239,53,71,1);
			border-radius:44upx;
			font-size:32upx;
			color:rgba(239,53,71,1);
			margin: 0 auto;
			margin-top: 200upx;
		}
	}
</style>
