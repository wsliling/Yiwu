import sj_show_modal from '@/components/G_show_modal/index.js'
export function G_show_modal(op={}){
	return new Promise((resolve, reject)=>{
		   let ssm=new sj_show_modal({
				...op,
				$event:function(e){
					if(e.res){
						resolve(e);
					}else{
						reject(e);
					}
				 }
				})
				ssm.show();
		})
}
//判断是否登录，未登录做弹窗跳转登录页面
export function judgeLogin(){
    // 未登录false，已登录true
    if (!uni.getStorageSync("userId") || !uni.getStorageSync("token")) {
		// #ifdef APP-PLUS
		G_show_modal({
			title:'未登录',
			content: "是否跳转到登录页面？",
		}).then(res=>{
			navigate(LoginPath)
			//确认
		  }).catch(res=>{
			//取消
		  })
		//#endif
		// #ifndef APP-PLUS
		uni.showModal({
		  title:'未登录',
		  content:'是否跳转到登录页面？',
		  cancelColor:'#999',
		  confirmColor:'#DD196D',
		  success(res){
		    if(res.confirm){
		      navigate(LoginPath)
		    }
		  }
		})
		//#endif
        
        return false;
    }else{
      return true;
    }
  }
// icon--是否显示图标，mask--是否显示防触摸穿透蒙层
export function toast(title,data={icon:false,mask:false,time:2000}){
    uni.showToast({
      title:title,
      icon:data.icon?'success':'none',
      mask:data.mask||false,
      duration:data.time||2000
    })
  }
  // 函数防抖,多少秒内只允许执行一次，重复点击会重新计时
  let timeout = null
  export function debounce(fn, wait = 500) {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(()=>{fn()}, wait)
  }
  // 函数节流,多少秒内只允许执行一次，重复点击会无视
  let throttleStatus = false
  export function throttle(fn, wait = 500) {
    if (throttleStatus) return;
    throttleStatus = true;
    fn()
    // setTimeout(fn, wait)
    setTimeout(() => {
      throttleStatus = false;
    }, wait)
  }
// 后退到上一页,防抖
export function navigateBack(time=2000){
	debounce(function(){uni.navigateBack();},time)
}
// 跳转url,带参
export function navigate(url,params,isLogin){
  console.log('要跳转到的地址'+url)
  // 判断是否已登录
  if(isLogin&&!judgeLogin()){
    return;
  }
  let p ='';
  if(params){
    let arr = Object.keys(params);
    arr.map((item,index)=>{
      p+=`${item}=${params[item]}`;
      if(index<arr.length-1){p+='&'};
    })
  }
  uni.navigateTo({
    url:`/pages/${url}${p&&('?'+p)}`
  })
}
// 跳转url,带参
export function switchTab(url,params,isLogin){
  if(isLogin&&!judgeLogin()){
    return;
  }
  let p ='';
  if(params){
    let arr = Object.keys(params);
    arr.map((item,index)=>{
      p+=`${item}=${params[item]}`;
      if(index<arr.length-1){p+='&'};
    })
  }
  uni.switchTab({
    url:`/pages/${url}?${p}`
  })
}

// 关闭当前页面跳转url,带参
export function redirect(url,params,isLogin){
  console.log(url,'url')
  if(isLogin&&!judgeLogin()){
    return;
  }
  let p ='';
  if(params){
    let arr = Object.keys(params);
    arr.map((item,index)=>{
      p+=`${item}=${params[item]}`;
      if(index<arr.length-1){p+='&'};
    })
  }
  uni.redirectTo({
    url:`/pages/${url}?${p}`
  })
}
// 复制电话
export function call(phone){
  uni.makePhoneCall({
    phoneNumber:phone+'',
    success(res){

    },
    fail(){
      toast('呼叫失败，请重试！')
    }
  })
}
// 全屏浏览图片
export function previewImage(url,nowImg){
	uni.previewImage({
	  urls:url,//预览的图片数组
	  current:nowImg,//预览图片的下标/图片链接
	})
}