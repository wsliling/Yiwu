import {post,toast,navigateBack} from '@/common/util'
let disable = false;
let payType=null;//支付类型0--微信支付，1--余额支付，2--支付宝
let params={}; //参数
// params={
//     orderNo；订单号
//     WxCode
//     WxOpenid
//     TotalPrice;总价
//     payPassword;支付密码
// }

export function payFn(type,param={}){
    payType = type.id;
    params = param;
    if(!disable){
        disable = true;
        console.log(payType,'支付方式')
        if(payType==0){//微信支付
            // #ifdef  H5
            if(isWeixin()){
                payweixin();
            }else{
                H5payweixin();
            }
            // #endif
            // #ifdef  MP-WEIXIN
            ConfirmWeiXinSmallPay()
            // #endif
            // #ifdef APP-PLUS
            appwxpay()
            // #endif
        }else if(payType==2){//支付宝支付
            // #ifdef APP-PLUS
            zfbapppay()
            // #endif
            // #ifdef H5
            if(isWeixin()){
                uni.showToast({
                    title:"微信暂不支持支付宝支付，请在浏览器中打开！",
                    icon:"none",
                    duration:2500
                })
            }else{
                zfbH5pay()
            }
            // #endif
        }else if(payType==1){//余额
            balancePay();
        }
    }
}

//微信公众号支付  微信自带浏览器的h5支付
async function payweixin() {
    let NewUrl=GetUrlRelativePath() +'/#/pages/pay/pay?orderNo='+params.orderNo;
    let result = await post("User/WeiXinPlus", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        NewUrl:NewUrl,//支付后的回调地址
        WxCode:params.WxCode,
        WxOpenid:params.WxOpenid,
        paytype:0
    })
    if (result.code == 201) { //检测不到openid需要进行微信授权
        window.location.href=result.data;
    }else if(result.code == 0){console.log(result.data)
        uni.setStorageSync('openId', result.data.openid);
        params.WxOpenid = uni.getStorageSync("openId");
        if(params.WxOpenid!=""&&params.WxOpenid!="undefined"){
            params.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
        }
        callpay(result.data.JsParam);
    }else {
        uni.showToast({
            title: result.msg,
            icon: "none",
            duration: 1500
        });
    }
}
//app微信支付
async function appwxpay() {
    let result = await post("User/WeiXinPlus", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        paytype:2
    })
	console.log(result)
    if(result.code==0){
        // var payData=JSON.parse(result.data.JsParam)
        uni.requestPayment({
          provider:"wxpay",
          orderInfo:result.data.JsParam,
          success(res) {
              console.log(res)
              navigateBack();
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
}
//非微信环境 使用微信支付H5
async function H5payweixin() {
    console.log('pay')
    let NewUrl=GetUrlRelativePath() +'/#/pages/member/orderDetail/orderDetail?id='+params.orderNo
    let result = await post("User/WeiXinPlus", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        NewUrl:NewUrl,
        paytype:3
    })
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
//支付宝app支付
async function zfbapppay() {
    let result = await post("Order/AliPay", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        paytype:2
    });console.log(result)
    if(result.code==0){console.log(result.data)
        // var payData=JSON.parse(result.data.JsParam)
        let _this=this;
        uni.requestPayment({
          provider:"alipay",
          orderInfo:result.data,
          success(res) {
              console.log(res)
              _this.type = "";
                _this.showPay=false;
                uni.redirectTo({
                    url: "/pages/payresult/payresult?allprice="+_this.orderInfo.TotalPrice+"&orderNo="+_this.orderNo
                })
            },
          fail(err) {console.log(err)
             //  uni.showToast({
             //  	title:"支付失败",
                // icon:"none",
                // duration:4000
             //  })
          }
        })
    }else {
        uni.showToast({
            title: result.msg,
            icon: "none",
            duration: 1500
        });
    }
}
//支付宝支付H5
async function zfbH5pay(){
    let NewUrl=this.GetUrlRelativePath() +'/#/pages/payresult/payresult?allprice='+this.orderInfo.TotalPrice+"&orderNo="+this.orderNo;
    let QuitUrl=this.GetUrlRelativePath() +'/#/pages/pay/pay?orderNo='+this.orderNo;
    let result= await post("Order/AliPay",{
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        NewUrl: NewUrl,
        QuitUrl:QuitUrl,//放弃支付跳转
        paytype:3
    });
    if(result.code == 0){
        params.isshowalipay=true;
        params.alipayCon=result.data;console.log(result.data)
        params.$nextTick().then(() => {
             document.forms['alipaysubmit'].submit()
        })
    }else {
        uni.showToast({
            title: result.msg,
            icon: "none",
        });
    }
}
//小程序支付
async function ConfirmWeiXinSmallPay(){
        let result= await post("User/WeiXinPlus",{
            UserId: uni.getStorageSync('userId'),
            Token: uni.getStorageSync('token'),
            OrderNo: params.orderNo,
            WxCode: params.WxCode,
            WxOpenid:params.WxOpenid ,
            paytype:4
        });
        var payData=JSON.parse(result.data.JsParam)
        if(result.code===0){
        uni.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
            success(res) {
                _this.type = "";
                _this.showPay=false;
                uni.redirectTo({
                    url: "/pages/payresult/payresult?allprice="+params.TotalPrice+"&orderNo="+params.orderNo
                })
            },
            fail(res) {}
        })
        }
}
//余额支付
async function balancePay(){
    console.log('余额支付')
    let res = await post('User/PlusPaymentByBalance',{
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        RecordNo: params.orderNo,
        PayPassword:params.payPassword
    })
    disable = false;
	if(res.code==3){
		uni.showModal({
		    title:'是否跳转设置支付密码页面',
		    success(ret){
		        if(ret.confirm){
					uni.navigateTo({
						url:'/pages/member/setpwd/setpwd'
					})
		        }
		    }
		})
	}else if(res.code==0){
		toast('购买成功！',{icon:true})
		navigateBack();
	}else{
		uni.showToast({
		    title: res.msg,
		    icon: "none",
		    duration: 1500
		});
	}
}



// 判断浏览器环境
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    // 判断是否为微信浏览器
    if (ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
function GetUrlRelativePath() {
    var urlStr = '';　　　　
    var url = document.location.toString();　　　　
    var arrUrl = url.split("//");　　　　
    var start = arrUrl[1].split("/");
    urlStr = arrUrl[0] + '//' + start[0];　　　　
    return urlStr;　　
}
function callpay(param) {
    if(typeof WeixinJSBridge === 'undefined') {
        if(document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(), false);
        } else if(document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady());
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady());
        }
    } else {
        onBridgeReady(param);
    }
}
function onBridgeReady(param){
    var parameter = JSON.parse(param);
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', parameter,
        function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          uni.redirectTo({
            url: "/pages/payresult/payresult?allprice="+params.TotalPrice+"&orderNo="+params.orderNo
          })
        }else{
            uni.showToast({
                title: "支付失败",
                icon: "none",
                duration: 1500
            });
        } 
    }); 
}