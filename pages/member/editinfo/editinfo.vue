<template>
  <view class="editpage">
	  <view class="line-list">
	  	<view class="line-item line-arrow-r">
	  		<view class="lab">头像</view>
			<view class="item_r avatar" @click="uplLoadImg">
			    <image class="img" :src="Avatar||'/static/default.png'" mode="aspectFill"></image>
			</view>
	  	</view>
		<view class="line-item line-arrow-r" @click="tolink('/pages/member/editNickName/editNickName?text='+info.NickName)">
			<view class="lab">昵称</view>
			<view class="item_r">
			  <input type="text" placeholder="去设置" disabled class="flex1 text_right" :value="info.NickName">
			</view>
		</view>
		<view class="line-item line-arrow-r" @click="tolink('/pages/member/editintro/editintro?text='+info.Introduction)">
			<view class="lab">简介</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <input type="text" placeholder="去设置" disabled class="flex1 text_right" :value="info.Introduction">
			</view>
		</view>
	  </view>
  </view>
</template>

<script>
import {post} from '@/common/util'
import { pathToBase64, base64ToPath } from '@/common/image-tools.js';
export default {
  data () {
    return {
      userId:"",
      token:"",
      info:{},
      Avatar:"",
	  mysign:"",//个性签名
    }
  },
  components: {
    
  },
  onLoad(){
    this.userId = uni.getStorageSync("userId")
    this.token = uni.getStorageSync("token")
  },
  onShow(){
    this.GetMemInfo()
  },
  methods: {
    tolink(url){
      uni.navigateTo({
        url
      })
    },
    GetMemInfo(){
      post('User/GetMemInfo',{
        UserId:this.userId,
        Token:this.token
      }).then(res=>{
        this.info = res.data;
        this.Avatar=this.info.Avatar;
      })
    },
    //上传头像
    uplLoadImg(){
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) =>{
				// tempFilePath可以作为img标签的src属性显示图片
				this.Avatar=res.tempFilePaths[0];console.log(this.Avatar)
				this.UploadPhoto()
			} 
		})
    },
	async base64Img(arr) {
		const res = await pathToBase64(arr);
		return res;
	},
    async UploadPhoto(){
		let Avatarstr=await this.base64Img(this.Avatar);console.log(Avatarstr)
		post('User/UploadPhoto',{
			UserId:this.userId,
			Token:this.token,
			Avatar:Avatarstr
		}).then(res=>{
			this.Avatar=res.data;
			uni.showToast({
			  title: res.msg,
			})
		})
    },
	
  },
}
</script>

<style lang='scss' scoped>
.avatar{
  height:100upx;width:100upx;
  .img{
    width:100%;height:100%;border-radius:50%;
  }
}
</style>
