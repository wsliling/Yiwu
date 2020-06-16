<template>
  <view class="editpage">
      <view class="list-box bg_fff">
        <view class="list flex-between" >
          <span>昵称</span>
          <view class="flex">
            <input type="text" placeholder="请输入" v-model="userNick" style="width:600upx" maxlength="16">
          </view>
        </view>
      </view>
      <view class="pp3 dec c_999">
        *1~16个字符
      </view>
      <view class="btn" @click="EditUserNick">确定</view>
  </view>
</template>

<script>
import {post,get,toLogin} from '@/common/util.js';
export default {
  data () {
    return {
      userId:"",
      token:"",
      userNick:""
    }
  },
  onLoad(e){
    this.userId = uni.getStorageSync("userId")
    this.token = uni.getStorageSync("token")
    this.userNick=e.text;
  },
  methods: {
    //编辑昵称
    EditUserNick(){
      if(this.userNick){
        post('User/EditUserNick',{
          UserId:this.userId,
          Token:this.token,
          UserNick:this.userNick
        }).then(res=>{
          uni.showToast({
            title: res.msg,
            icon: 'none',
          })
          setTimeout(() =>{
            uni.navigateBack();
          },1500)
        })
      }else{
        uni.showToast({
          title: "请输入昵称",
          icon: 'none',
        })
      }
    },

  },
}
</script>

<style lang='scss' scoped>
.list-box{
  .list{
    height: 88upx;
    line-height: 88upx;
    padding:0 30upx;
    display: flex;justify-content: space-between;align-items: center;
	span{
	  font-size: 28upx;
	  color: #333
	}
  }
 
}
.btn{
  background: $primary;
  height:80upx;
  line-height: 80upx;
  width:690upx;
  margin: 0 auto;
  color:#ffffff;
  border-radius: 40upx;
  margin-top:50upx;
  text-align: center;
}

</style>
