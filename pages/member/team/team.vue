<template>
  <view class="student">
      <view class="pp3 bg_fff">
          <view class="card_gu">
              <view class="flex gu_num">
                    <p>
                      <span class="fb">{{info.TeamNum}}</span>
                      <span class="font22">总人数</span>
                    </p>
                    <p>
                      <span class="fb">{{info.JTNum}}</span>
                      <span class="font22">今日新增</span>
                    </p>
                    <p>
                      <span class="fb">{{info.ZTNum}}</span>
                      <span class="font22">昨日新增</span>
                    </p>
              </view>
              <view class="flex flexAlignCenter gu_ava" v-if="isFather">
                  <img :src="info.FatherData[0].Avatar" alt="" class="ava1">
                  <view class="mr2">
                      <p>{{info.FatherData[0].NickName}}</p>
                      <p class="font22 mt1">我的邀请人</p>
                  </view>
              </view>
          </view>
      </view>
	  <view class="fb p3 flex-between bb_tab_list bg_fff uni-mb10">
		  <!-- <view class="bb_gu_tab active">一级好友</view>
		  <view class="bb_gu_tab">二级好友</view> -->
		  <view class="pw3">我的下级</view>
	  </view>
      <view class="mt2 bg_fff" v-if="hasData">
          <view class="pp3 stu_item flex-between" v-for="(item,index) in datalist" :key="index">
            <view class="flex flexAlignCenter">
              <img :src="item.Avatar" alt=""  class="ava mr2">
              <text class="name uni-ellipsis mr2">{{item.NickName}}</text>
            </view>
            <span class="c_999 fz12">{{item.CreateTime}}</span>
          </view>
      </view>
	  <noData :isShow="noDataIsShow"></noData>
	  <view class="uni-tab-bar-loading" v-if="hasData">
	  	<uni-load-more :loadingType="loadingType"></uni-load-more>
	  </view>
  </view>
</template>

<script>
import {post} from '@/common/util.js'
import noData from "@/components/noData"; //没有数据的通用提示
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {

  data () {
    return {
      userId:"",
      token:"",
      hasData:false,
			noDataIsShow: false,//没有数据的提示是否显示
			page: 1,
      pageSize: 8,
			isLoad: false,
			isOved:false,       //显示已经到底了
			loadingType: 0, //0加载前，1加载中，2没有更多了
      datalist:{},
      info:{},
      isFather:false,
    }
  },
  components: {
    noData,
	uniLoadMore
  },
  onShow(){
    this.userId = wx.getStorageSync("userId")
    this.token = wx.getStorageSync("token")
    this.MyCustom();
  },
  methods: {
    //我的客户
    MyCustom(){
        post('User/MyCustom',{
            UserId:this.userId,
            Token:this.token,
            Page:this.page,
            PageSize:this.pageSize
        }).then(res=>{
          if(res.code==0){
            this.info=res.data;
            if(this.info.FatherData.length){
              this.isFather=true;
            }
            let _this = this;
            let len=res.data.TeamList.length;
            if (len > 0) {
              this.hasData = true;
              this.noDataIsShow = false;
            }
            if (len == 0&&this.page==1) {
              this.noDataIsShow = true;
              this.hasData = false;
            }
            if (this.page === 1) {
              this.datalist = res.data.TeamList;
            }
            if (this.page > 1) {
              this.datalist = this.datalist.concat(
                res.data
              );
            }
            if (len < this.pageSize) {
              this.isLoad = false;
              this.loadingType = 2;
            } else {
              this.isLoad = true;
              this.loadingType = 0
            }
            
          }
        })
    },
  },
  onReachBottom: function() {
    if (this.isLoad) {
      this.loadingType = 1;
      this.isOved = false;
      this.page++;
      this.MyCustom();
    } else {
      this.loadingType = 2;
      if (this.page > 1) {
        this.isOved = true;
      } else {
        this.isOved = false;
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  .stu_item{
    border-bottom: 1upx solid #f5f5f5;
  }
  .ava{
    width:80upx;height:80upx;
	border-radius: 50%;
  }
  .name_pill{
    color:#ffffff;background: #f4b644;
    font-size:20upx;padding:2upx 10upx;
    margin-left:10upx;border-radius:2upx;
  }
  .card_gu{
    border-radius:25upx;
    background: #fd6a4c;
    width:692upx;
    /* height:298upx; */
    color:#fff;
    .ava1{
      width:100upx;height:100upx;border-radius: 50%;
    }
    .gu_num{
      height:175upx;
      p{
        width:33%;
        display: flex;justify-content: center;align-items: center;
        flex-direction: column;
        span:first-child{
          font-size:35upx;
        }
      }
    }
    .gu_ava{
      background: rgba(255,255,255,0.3);
      height:125upx;
      padding:0 30upx;
    }
  }
  .bb_tab_list{
	  padding-bottom:30upx;
  }
  .bb_gu_tab{
	  width:50%;text-align: center;
	  &.active{
		  color:#fd6a4c;
		  position: relative;
		  &:after{
			  content:'';
			  position: absolute;
			  width:80upx;
			  height:4upx;
			  background: #fd6a4c;
			  bottom:-30upx;
			  left:50%;
			  transform: translateX(-50%);
		  }
	  }
  }
</style>
