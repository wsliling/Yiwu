<template>
	<view>
		<view class="btns">
			<view class="logo">
				<image class="logoimg" src="http://m.dance-one.com/static/logo.png" mode="widthFix"></image>
			</view>
			<!-- #ifdef H5 -->
			<view class="btn btn_1" @click="dowmapp(0)">
				Android版下载
			</view>
			<view class="btn btn_2" @click="dowmapp(1)">
				Ios版下载
			</view>
			<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="txt center uni-mb10">
			请复制当前链接到浏览器打开<text class="c_blue">{{dowmappURL}}</text>
		</view>
		<view class="btn btn_2" @click="copylink">
			复制链接
		</view>
		<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import {post,dowmappURLios,webUrl,isWeixin} from '@/common/util.js';
	export default {
		data() {
			return {
				dowmappURL:'',
			}
		},
		onLoad(e) {
			this.GetWebConfiguration()
		},
		methods: {
			async GetWebConfiguration(){
				let res=await post('System/GetWebConfiguration')
				if(res.code==0){
					let version=res.data.Copyright.split('.').join('');
					this.dowmappURL=webUrl+'/down/android'+version+'.apk'
				}
			},
			dowmapp(type){
				if(type==0){
					window.location.href=this.dowmappURL
				}else{
					window.location.href=dowmappURLios
				}
			},
			copylink(){
				let _this = this;
				uni.setClipboardData({
					data: _this.dowmappURL,
					success: function() {
						 uni.showToast({title:'复制成功'})
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
.btns{
	padding: 60upx;
	.logoimg{
		display: block;
		width: 200upx;
		height: 200upx;
		border-radius: 46upx;
		margin: 0 auto 60upx;
	}
	.btn{
		height: 90upx;
		width: 100%;
		border-radius: 12upx;
		background: $primary;
		color: #fff;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40upx;
		&.btn_2{
			color: $primary;
			border: 1px solid $primary;
			background-color: #fff;
		}
	}
}
</style>
