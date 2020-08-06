

const host = 'https://ywapi.wtvxin.com/api/';  //测试接口地址
// const host = 'https://api.dadanyipin.com/api/';  //正式接口地址
const webUrl = 'http://yw.wtvxin.com';
const wssPath = 'wss://ywapi.wtvxin.com/WebSocketServer.ashx';  //wss接口地址
const wssHost = 'wss://ywapi.wtvxin.com';  //wss接口地址


function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
function formatTime(date) {
	date = new Date(date);
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	const t1 = [year, month, day].map(formatNumber).join('/')
	const t2 = [hour, minute, second].map(formatNumber).join(':')
	return `${t1} ${t2}`
}
// 秒格式化 00:00 格式
function formatSecond(second){
	var sec = second % 60;
	var min = Math.floor(second / 60);
	if(min.toString().length < 2){
		min = '0' + min;
	}
	if(sec.toString().length < 2){
		sec = '0' + sec;
	}
	return min + ':' + sec
}
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDate()) + ' ' +
			_format(date.getHours()) + ':' + _format(date.getMinutes())+':'+_format(date.getSeconds());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};



// 判断是否登录了
function toLogin(objUrl) { 
  // const userInfo = wx.getStorageSync('userInfo');
  const userId = uni.getStorageSync('userId');
  const token = uni.getStorageSync('token');
  if(userId && token){
    return true;
  }else{
		var strUrl = '';
		if(objUrl){
			strUrl = objUrl.replace(/\?/g, '%3F').replace(/\=/g, '%3D').replace(/\&/g, '%26');
		}
		uni.showModal({
			title:'登录提示',
			content: "您还没有登录，是否重新登录？",
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: "/pages/login/login?askUrl="+strUrl
					})
				} else if (res.cancel) {
				}
			}
		});
    return false;
  }
}
// 获取openId
function getStorageOpenid() {
  const openId = uni.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return ''
  }
}

// 获取当前地址
function getCurrentPageUrlWithArgs() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  // #ifndef H5
  const options = currentPage.options;
  // #endif
  // #ifdef H5
  const options = currentPage.$mp.query;
  // #endif
  
  let urlWithArgs = `/${url}?`;
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

//每3秒去检查token是否过期
// function checkAccessToken() {
//   setInterval(checkAccessTokenTimeout, 3 * 1000); //这个时间可以自定义。比如 25 * 60 * 1000（代表25分钟）
// }
// function checkAccessTokenTimeout() {
//   var accesstoken = wx.getStorageSync('token');
//   if (accesstoken == null || accesstoken == undefined || accesstoken == "") {
//     return false
//   }
//   var tokenDate = wx.getStorageSync('tokenDate');
//   var aftertimestamp = Date.parse(new Date()); //返回时间毫秒数，比如1489899243209
//   if (aftertimestamp - tokenDate >= 43200000) { //超过了12小时,重新登陆
//     removeLocalToken()
//     return false
//   }
//   return true
// }
//验证手机号
function valPhone(tel) {
	var r_phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	// var phoneNumber = $.trim($('#phoneNumber').val());
	if(tel == "") {
		uni.showToast({
          title: "手机号不能为空!",
          icon: "none",
          duration: 2000
        });
		return false;
	}
	if(!r_phone.test(tel)) {
		uni.showToast({
		  title: "请输入正确的手机格式!",
		  icon: "none",
		  duration: 2000
		});
		return false;
	}
	return true;
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var url = window.location.search.substr(1); //.toLowerCase();
	var r = url.match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
function uncodeUtf16(str){
  　　var reg = /\&#.*?;/g;
  　　var result = str.replace(reg,function(char){
  　　	 var H,L,code;
  　　　　if(char.length == 9 ){
  　　　　　　code = parseInt(char.match(/[0-9]+/g));
  　　　　　　H = Math.floor((code-0x10000) / 0x400)+0xD800;
  　　　　　　L = (code - 0x10000) % 0x400 + 0xDC00;
  　　　　　　return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
  　　　　}else{
  　　　　　　return char;
  　　　　}
  　　});
  　　return result;
 }
// position--类='.class'id='#id'
// function scrollPosition(position){
// 	uni.createSelectorQuery().select(position).boundingClientRect(data=>{//目标节点
// 		　　uni.createSelectorQuery().select(position).boundingClientRect((res)=>{//最外层盒子节点 　　　　
// 		　　　　uni.pageScrollTo({ 　　　　　　
// 		　　　　　　duration: 0,//过渡时间必须为0，否则运行到手机会报错
// 		　　　　　　scrollTop: 位置 //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
// 		　　　　})
// 		　　}).exec()
// 		}).exec()
//  }
//#ifdef MP-WEIXIN
const compareVersion = function(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
 
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
 
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
 
  return 0
}
 //#endif
//记录播放舞曲
function MemberPaly(id){
	const userId = uni.getStorageSync('userId');
	const token = uni.getStorageSync('token');
	if (userId && token){
		post("DanceMusic/PlayMusic", {
			UserId: userId,
			Token: token,
			MusicId: id,
		}).then(res=>{
			
		});
	}
}
// 判断浏览器环境true:微信内置
function isWeixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}
//获取当前页面的域名
function GetUrlRelativePath() {
	var urlStr = '';　　　　
	var url = document.location.toString();　　　　
	var arrUrl = url.split("//");　　　　
	var start = arrUrl[1].split("/");
	urlStr = arrUrl[0] + '//' + start[0];　　　　
	return urlStr;　　
}
import {toast,debounce,throttle,navigateBack,navigate,switchTab,redirect,call,previewImage} from './ans-utils'
import {get,post,requestHideLoading} from './request.js'
export {
	formatTime,
	formatSecond,
	formatLocation,
	dateUtils,
	host,
	wssHost,
	webUrl,
	get,
	post,
	requestHideLoading,
	toLogin,
	getCurrentPageUrlWithArgs,
	getStorageOpenid,
	valPhone,
	getUrlParam,
	uncodeUtf16,
	//audio,
	MemberPaly,
	isWeixin,
	GetUrlRelativePath,
	toast,
	debounce,
	throttle,
	navigate,
	switchTab,
	redirect,
	navigateBack,
	call,
	previewImage
}
