<template>
  <div class="ticket pw3">
      <div class="bg_statu pp3 boxSize">
          <p class="order_statu mt1">{{info.StatusName}}</p>
          <!-- <p class="font22 mt1">剩余00:59:13自动取消订单</p> -->
      </div>
      <div class="or_list">
        <!-- <div class="pp2 flex justifyContentBetween  bg_fff bor_tit flexAlignEnd">
            <image src="http://jyy.wtvxin.com/static/images/icons/kc.png" alt="" class="kc_icon">
            <div class="flex flex1 flexAlignCenter">
                <div class="flex1">
                    <p class="cr">
                         [深圳市] 投递并签收，签收人：他人收 韵达，感谢使用 EMS经济快递，期待...
                    </p>
                    <p class=" cg mt1">2019-09-26 18:52:10</p>
                </div>
                <image src="http://jyy.wtvxin.com/static/images/icons/right.png" alt="" class="icon_right mr2">
            </div>
        </div> -->
        <div class="pp2 flex justifyContentBetween radius flexWrap flexAlignEnd bg_fff">
            <image src="http://jyy.wtvxin.com/static/images/icons/lc.png" mode="widthFix" alt="" class="icon_lc"></image>
            <div class="flex1">
                <p>
                    <span>{{info.ContactName}}</span><span class="mr5">{{info.Tel}}</span>
                </p>
                <p class="font24 cg mt1">{{info.Addr}}</p>
            </div>
        </div>
        <div class="or_item bg_fff radius">
            <div class="pp3 flex bor_tit" v-for="(item, index) in info.OrderDetails" :key="index" @click.stop="goUrl('/pages/homePage/details?id='+item.ProductId)">
                <image mode="aspectFill" :src="item.PicNo" alt="" class="shop mr2" />
                <div class="flex1 flex  mr2">
                    <div class="or_left flex flexColumn justifyContentBetween">
                      <p>{{item.ProductName}}</p>
                      <p class="c-999">{{item.SpecText}}</p>
                      <p class="cr font30">￥{{item.ActualPay}}</p>
                    </div>
                    <div class="mr3 flex flexColumn flexAlignEnd">
                      <span>x{{item.Number}}</span>
                      <span class="tui_pill mt2" v-if="item.IsRefund!==0" @click.stop="navigate('member/afterSaleType/afterSaleType',{indexId:index,id:info.OrderNumber})">退款</span>
                    </div>
                </div>
            </div>
            <div class="bor_tit pp2">
                <p class="flex justifyContentBetween">
                    <span>支付方式</span>
                    <span>在线支付</span>
                </p>
                <p class="flex justifyContentBetween mt1">
                    <span>商品总价</span>
                    <span>¥{{info.TotalAmount}}</span>
                </p>
                <p class="flex justifyContentBetween">
                    <span>优惠</span>
                    <span>¥{{info.DiscountedAmount}}</span>
                </p>
                <p class="flex justifyContentBetween mt1" v-if="info.IsNeedAudit==0">
                    <span>运费</span>
                    <span>¥{{info.ExpressPrice}}</span>
                </p>
            </div>
            <div class="flex justifyContentBetween mt1 pp2">
                <span>实付</span>
                <span class="cr">¥{{info.Total}}</span>
            </div>
        </div>
      </div>
      <!---订单信息-->
      <div class="bg_fff mt2 pp3 bor_tit radius order_posi">
          <div class="">
              <span class="order_title">订单信息</span>
          </div>
          <div class="cg mt2 order_info font24">
			  <!-- #ifdef H5 -->
			  <input type="text" class="font20 yy_ma mt1" @focus="blur()" :disabled="disabled" 
			   v-model="info.OrderNumber" style="opacity: 0;position: fixed;top: -10000px;">
			  <!-- #endif -->
              <p>订单编号：{{info.OrderNumber}} <span class="copy" @click="cop()">复制</span> </p>
              <p>创建时间：{{info.OrderTime}}</p>
              <!-- <p>取消时间：2019-12-20 09:18:30</p>
              <p>发货时间：2019-12-20 09:18:30</p> -->
              <p>成交时间：{{info.Paytime}}</p>
			  <p v-if="info.OrderDetails&&info.OrderDetails[0].ConsumeCode">特 权 码  ：{{info.OrderDetails[0].ConsumeCode}}</p>
          </div>
      </div>
	  <!-- #ifndef MP-WEIXIN -->
      <div class="bg_fff pp2 flex justifyContentCenter flexAlignCenter radius mt2 order_posi" @click="goUrl('/pages/other/kefu/kefu?qqnum=996889692')">
          <image src="http://jyy.wtvxin.com/static/images/icons/kcf.png" alt="" class="icon_ch" mode="aspectFit"></iamge>
          <span>联系客服</span>
      </div>
	  <!-- #endif -->
	  <!-- #ifdef MP-WEIXIN -->
	  <button open-type="contact" @contact="btnConcat" class="bg_fff pp2 flex justifyContentCenter flexAlignCenter radius mt2 order_posi"
	   style="border:0!important;padding:20upx 0;background: #ffffff;line-height:1.9" >
	      <image src="http://jyy.wtvxin.com/static/images/icons/kcf.png" alt="" class="icon_ch" mode="aspectFit"></iamge>
	      <span class="font26">联系客服</span>
	  </button>
	  <!-- <button open-type="contact" class="WEIXIN_btn"></button> -->
	  <!-- #endif -->
      <div class="flex bg_fff mt2 bb_fix btnbox" v-if="info.StatusName=='已发货'||info.StatusName=='已收货'||info.IsCancel==1||info.IsDel==1||info.Ispay==1||info.IsConfirmReceipt==1">
          <p class="btn btn_gray" v-if="info.StatusName=='已发货'||info.StatusName=='已收货'" @click="goUrl('/pages/member/logistics/logistics?orderNo='+info.OrderNumber)">查看物流</p>
          <p class="btn btn_gray" v-if="info.IsCancel==1" @click="chooseOrders(info.OrderNumber,1)">取消订单</p>
          <p class="btn btn_gray" v-if="info.IsDel==1" @click="chooseOrders(info.OrderNumber,2)">删除订单</p>
          <p class="btn btn_red" v-if="info.Ispay==1" @click="openOayWin">立即支付</p>
          <p class="btn btn_red" v-if="info.IsConfirmReceipt==1" @click="chooseOrders(info.OrderNumber,3)">确认收货</p>
      </div>
		<!-- 支付弹窗 -->
		<uni-popup type="bottom" ref="payWin">
			<!-- :orderNumber="orderNo" -->
			<pay :total="info.Total" @onClose="closePay()" @success="payOrder" :orderNumber="OrderNo"
				:payMode="['wx','alipay','balance','integral']" :disableIntegral="disableIntegral"></pay>
		</uni-popup>
  </div>
</template>

<script>
import {switchPath,post,navigate,toast,getUrlParam,isWeixin,GetUrlRelativePath} from '@/common/util.js'
import pay from '@/components/pay.vue';
export default {
	components: {
		pay
	},
	data () {
		return {
			navigate,
			info:{},
			OrderNo:'',
			disabled:false,
			disableIntegral:false,//是否禁用积分
		}
	},
	onLoad(e){
		// #ifdef APP-PLUS
		this.OrderNo = e.id;
		// #endif
		// #ifdef H5
		this.WxCode=getUrlParam("code");
		this.WxOpenid = uni.getStorageSync("openId");
		if(this.WxCode){//首次跳转获取code地址都直接调起支付
			this.payWeChat()
		}
		// #endif
	},
	onShow(){
		// #ifndef APP-PLUS
		this.OrderNo = this.$mp.query.id
		// #endif
		this.WxOpenid=uni.getStorageSync("openId");
		this.getDetail()
		// #ifdef MP-WEIXIN
		this.getcode();
		// #endif
	},
methods: {
	btnConcat(e){
	  console.log(e)
	},
    getDetail(){
      post('Order/OrderDetails',{
        UserId:uni.getStorageSync("userId"),
        Token:uni.getStorageSync("token"),
        OrderNo:this.OrderNo
      }).then(res=>{
        this.info = res.data;
		console.log(this.info)
      })
    },
    // 打开支付窗口
    openOayWin(){
		//获取积分可用数量
		post('User/GetMyIncome',{
			UserId: uni.getStorageSync("userId"),
			Token: uni.getStorageSync("token")
		}).then(res=>{
			if(res.data.Amount*1<this.info.Total*1){
				this.disableIntegral = true;
			}else{
				this.disableIntegral = false;
			}
			this.$refs.payWin.open();
		})
    },
    // 支付订单
    async payOrder(payType,Password){
		// 余额
		if(payType.id==1){
			const res = await post('Order/PaymentOrder',{
				UserId:uni.getStorageSync("userId"),
				Token:uni.getStorageSync("token"),
				OrderNo:this.OrderNo,
				Password
			})
			if(res.code==3){
				uni.showModal({
					title:'是否跳转设置支付密码页面',
					success(ret){
						if(ret.confirm){
							navigate('member/setpwd/setpwd')
						}
					}
				})
			}
			if(res.code) return;
			this.paySuccess(res);
		}else 
		// 积分
		if(payType.id==3){
			const res = await post('Order/PayScoreOrder',{
				UserId:uni.getStorageSync("userId"),
				Token:uni.getStorageSync("token"),
				OrderNo:this.OrderNo,
				Password
			})
			if(res.code==3){
				uni.showModal({
					title:'是否跳转设置支付密码页面',
					success(ret){
						if(ret.confirm){
							navigate('member/setpwd/setpwd')
						}
					}
				})
			}
			if(res.code) return;
			this.paySuccess(res);
		}else
		//微信
		if(payType.id==0){
			this.payWeChat()
		}
    },
	//微信支付
	async payWeChat(){
		let url="Order/WechatPay",param={};
		// #ifdef H5
		let NewUrl=GetUrlRelativePath() +'/#/pages/member/orderDetail/orderDetail?id='+this.OrderNo;
		if(isWeixin()){
			var paytype=0
		}else{
			var paytype=3
		}
		// #endif
		param={
			"UserId":uni.getStorageSync("userId"),
			"Token":uni.getStorageSync("token"),
			"OrderNo":this.OrderNo,
			// #ifdef H5
			"NewUrl":NewUrl,//支付后的回调地址
			"WxCode":this.WxCode,
			"WxOpenid":this.WxOpenid,
			"paytype":paytype,
			// #endif
			// #ifdef APP-PLUS
			"paytype":2,
			// #endif
			// #ifdef MP-WEIXIN
			"WxCode": this.WxCode,
			"WxOpenid":this.WxOpenid,
			"paytype":4
			// #endif
		}
		const result = await post(url, param);
		// #ifdef H5
		if(isWeixin()){//微信内置H5支付
			if(result.code == 0){console.log(result.data)
				uni.setStorageSync('openId', result.data.openid);
				this.WxOpenid = uni.getStorageSync("openId");
				if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
					this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
				}
				this.callpay(result.data.JsParam);
			}else if (result.code == 201) { //检测不到openid需要进行微信授权
				window.location.href=result.data;
			}else {
				uni.showToast({
					title: result.msg,
					icon: "none",
					duration: 1500
				});
			}
		}else{//浏览器H5微信支付
			if(result.code == 0){
				window.location.href = result.data.mweb_url;
			}else {
				uni.showToast({
					title: result.msg,
					icon: "none",
					duration: 1500
				});
			}
		}
		// #endif
		// #ifdef APP-PLUS
		if(result.code==0){console.log(result.data)
			// var payData=JSON.parse(result.data.JsParam)
			let _this=this;
			uni.requestPayment({
			  provider:"wxpay",
			  orderInfo:result.data.JsParam,
			  success(res) {
				  console.log(res)
				  _this.type = "";
					_this.showPay=false;
					uni.navigateBack()
				},
			  fail(err) {console.log(err)
				  uni.showToast({
				  	title:"支付失败",
					icon:"none",
					duration:4000
				  })
			  }
			})
		}else {
			uni.showToast({
				title: result.msg,
				icon: "none",
				duration: 1500
			});
		}
		// #endif
		// #ifdef MP-WEIXIN
		if(result.code===0){
			let payData=JSON.parse(result.data.JsParam)
			let _this=this;
			uni.requestPayment({
			  timeStamp: payData.timeStamp,
			  nonceStr: payData.nonceStr,
			  package: payData.package,
			  signType: payData.signType,
			  paySign: payData.paySign,
			  success(res) {
					uni.navigateBack()
				},
			  fail(res) {}
			})
		}
		// #endif
	},
    // 支付成功
    paySuccess(res){
      toast(res.msg,{icon:true})
      this.$refs.payWin.close();
      setTimeout(()=>{
        navigate('shopSon/submitOrder/submitStatus',{
          status:'success',
          orderNo:this.OrderNo,
          allprice:this.info.Total
        })
      },2000)
    },
    // 支付弹窗状态改变
    payWinChange(e){
      if(!e.show){
        this.closePay();
      }
    },
    // 关闭支付弹窗时
    closePay(){
      redirect('shopSon/submitOrder/submitStatus',{
        status:'fail',
        orderNo:this.OrderNo,
        allprice:this.info.Total
      })
      this.$refs.payWin.close();
    },
    chooseOrders(OrderNo,type){//确认取消
      if(type==1){
        var content="您确定要取消此订单吗？"
        var url="Order/CancelOrders"
      }else if(type==2){
        var content="您确定要删除此订单吗？"
        var url="Order/DeleteOrders"
      }else{
        var content="您确定收货成功吗？"
        var url="Order/ConfirmReceipt"
      }
      uni.showModal({
        title: '提示',
        cancelText:"再想想",
        content: content,
        success (res) {
          if (res.confirm) {
            post(url,{
              UserId:uni.getStorageSync("userId"),
              Token:uni.getStorageSync("token"),
              OrderNo:OrderNo,
            }).then(res=>{
              uni.showToast({
                icon:'none',
                title:res.msg,
				success() {
					uni.navigateBack({
						
					})
				}
              })
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }, 
	blur() {
		this.disabled = true;
	},
    cop(){
		// #ifdef  H5
		let url = document.getElementsByTagName("input")[0];
		url.select(); // 选择对象
		document.execCommand("Copy");
		uni.showToast({
			icon: "none",
			title: "复制成功"
		})
		// #endif
		// #ifdef  MP-WEIXIN
		let _this = this;
		// console.log( _this.info.OrderNumber)
		uni.setClipboardData({
			data: _this.info.OrderNumber,
			success: function() {
				// console.log(123)
				uni.showToast({
					icon: 'none',
					title: "复制成功"
				})
			}
		});
		// #endif
        // uni.showToast({
        //   icon:'none',
        //   title: '复制成功',
        // })
        uni.setClipboardData({
          data: this.info.OrderNumber,
          success: function (res) {
            uni.getClipboardData({ 
              success: function (res) {
                console.log(res.data) // data
              }
            })
          }
        })
    },
    goUrl(url){
      uni.navigateTo({
        url:url
      })
    },
	//微信公众号支付
	callpay(param) {
		if(typeof WeixinJSBridge === 'undefined') {
			if(document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
			} else if(document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
				document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
			}
		} else {
			this.onBridgeReady(param);
		}
	},
	onBridgeReady(param){
		var _this=this;
		var parameter = JSON.parse(param);
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', parameter,
			function(res){
			if(res.err_msg == "get_brand_wcpay_request:ok" ){
			// 使用以上方式判断前端返回,微信团队郑重提示：
			//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
			  uni.redirectTo({
				url: "/pages/payresult/payresult?allprice="+_this.orderInfo.TotalPrice+"&orderNo="+_this.orderNo
			  })
			}else{
				uni.showToast({
					title: "支付失败",
					icon: "none",
					duration: 1500
				});
			} 
		}); 
	},
	getcode(){
		let _this=this;
		uni.login({
			success: function(res) {
			  if (res.code) {
				_this.WxCode=res.code;
			  } else {
				console.log('登录失败！' + res.errMsg)
			  }
			}
		});
	},
  },
  onShareAppMessage: function( options ){
  　　var that = this;
  　　// 设置菜单中的转发按钮触发转发事件时的转发内容
  　　var shareObj = {
  　　　　title: "转发的标题",        // 默认是小程序的名称(可以写slogan等)
  　　　　path: '/pages/tabBar/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
  　　　　imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
  　　　　success: function(res){
  　　　　　　// 转发成功之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
  				console.log("1111111111111111")
  　　　　　　}
  　　　　},
  　　　　fail: function(){
  		console.log("22222222222")
  　　　　　　// 转发失败之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
  　　　　　　　　// 用户取消转发
  　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
  　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
  　　　　　　}
  　　　　},
  　　　　complete: function(){
  　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
  			console.log("33333333333333")
  　　　　}
  　　};
  　　// 来自页面内的按钮的转发
  // 　　if( options.from == 'button' ){
  // 　　　　var eData = options.target.dataset;
  // 　　　　console.log( eData.name );     // shareBtn
  // 　　　　// 此处可以修改 shareObj 中的内容
  // 　　　　shareObj.path = '/pages/btnname/btnname?btn_name='+eData.name;
  // 　　}
  　　// 返回shareObj
  　　return shareObj;
  }
}
</script>

<style scoped lang='scss'>
  .ticket{
    padding-bottom:300upx;
  }
.back_col{
  background-color: $primary!important;
}
.or_list{
  position: relative;top:180upx;left:0;
  .shop_logo{
    width:40upx;height:36upx;
  }
  .shop{
    width:161upx;height:161upx;
  }
  .or_item{
    margin-top:20upx;
    &:first-child{
      margin-top:0;
    }
    .or_left{
      width:88%;
      height:98%;
    }
  }
}
  .bor_tit{
      border-bottom:1upx solid #f5f5f5;
    }
    .btnbox{
      align-items:center;
      justify-content:flex-end;
      background:#fff;
      padding:20upx;
      border-top:1upx solid #e8e8e8;
    }
  .btn{
    height:60upx;text-align: center;line-height: 60upx;
    margin-left:20upx;border-radius: 30upx;
    padding:0 25upx;
    flex: 0 0 auto;

  }
  .btn_gray{
    color:#858585;
    border:1upx solid #ccc;
  }
  .btn_red{
    color:#ffffff;background:$primary; 
  }
  .btnbox .btn:nth-child(2){
    // color:#ffffff;background:$primary;
  }
  .order_title{
   border-left:4upx solid $primary;padding-left:20upx;
 }
 .order_info p{
   padding:5upx 0;
 }
 .copy{
   padding:0upx 20upx;border:1upx solid $primary;color:$primary;font-size:20upx;
   line-height:1.5;
   border-radius: 5upx;
   margin-left:10upx;
   display:inline-block;
 }

 .bg_statu{
   width:750upx;background: $primary;
   height:245upx;position: absolute;top:0;left:0;
   color:#ffffff;
 }
 .icon_lc{
   width:60upx;height:61upx;margin-right:20upx;
   margin-bottom:6upx;
 }
 .kc_icon{
   width:43upx;height:33upx;margin-right:20upx;
   margin-bottom:6upx;
 }
  .icon_ch{
    width:34upx;height:34upx;margin-right:15upx;
	margin-left:0
  }
  .btn_menu{
    height:80upx;
    width:50%;border-left:1px solid #f5f5f5;
    &:first-child{
      border-left:0;
    }
  }
  .radius{
    border-radius:15upx;
  }
  .tui_pill{
    width:86upx;font-size:22upx;padding:5upx 0;text-align: center;
    border:1upx solid #999999;color:#999999;border-radius: 10upx;
  }
  .bb_fix{
    position: fixed;width:100%;bottom:0;left:0;
  }
  .order_statu{
    font-size:38upx;
  }
  .order_posi{
    position: relative;top:180upx;left:0;
  }
  button::after{
  		border:none;
  }
</style>
