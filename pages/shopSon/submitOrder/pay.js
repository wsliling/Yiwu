import {post,toast,redirect ,navigate,navigateBack} from '@/common/util'
let params = {};
export default async function payFn(payType,param={}){
    params = param;
    const type = payType.id;
    // 余额
    if(type==1){
        const res = await post('Order/PaymentOrder',{
            UserId: uni.getStorageSync('userId'),
            Token: uni.getStorageSync('token'),
            OrderNo:params.OrderNo,
            Password:params.Password
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
        paySuccess(res);
    }else 
    // 积分
    if(type==3){
        const res = await post('Order/PayScoreOrder',{
            UserId: uni.getStorageSync('userId'),
            Token: uni.getStorageSync('token'),
            OrderNo:params.OrderNo,
            Password:params.Password
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
        paySuccess(res);
    }else 
    //微信
    if(type==0){
        console.log(type,'微信支付')
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
    }
}

//微信公众号支付  微信自带浏览器的h5支付
async function payweixin() {
    let NewUrl=GetUrlRelativePath() +`/#/pages/shopSon/submitOrder/submitStatus?orderNo=${+params.orderNo}&status=success&allprice=${params.price}`;
    let result = await post("Order/WechatPay", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.OrderNo,
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
//非微信环境 使用微信支付H5
async function H5payweixin() {
    console.log('pay')
    let NewUrl=GetUrlRelativePath() +`/#/pages/shopSon/submitOrder/submitStatus?orderNo=${+params.orderNo}&status=success&allprice=${params.price}`;
    let result = await post("Order/WechatPay", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        OrderNo:params.OrderNo,
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
//app微信支付
async function appwxpay() {
    let result = await post("User/WeiXinPlus", {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        paytype:2
    })
    if(result.code==0){console.log(result.data)
        // var payData=JSON.parse(result.data.JsParam)
        uni.requestPayment({
          provider:"wxpay",
          orderInfo:result.data.JsParam,
          success(res) {
              console.log(res)
              _this.type = "";
                _this.showPay=false;
                uni.redirectTo({
                    url: "/pages/payresult/payresult?allprice="+params.TotalPrice+"&orderNo="+params.orderNo
                })
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

// 支付成功
function paySuccess(res){
    toast(res.msg,{icon:true})
    setTimeout(()=>{
        redirect('shopSon/submitOrder/submitStatus',{
            status:'success',
            orderNo:params.OrderNo,
            allprice:params.price
        })
    },2000)
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