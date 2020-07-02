<template>
	<div class="box">
		<input type="text" v-model="content"
        	@input="$emit('input', content)" :placeholder="placeholder" 
			confirm-type="search" @confirm="onConfirm" :style="'text-align:'+align"
			class="input"
		>
		<div class="clear" @click="clear" v-if="content">
			<uni-icons color="#ccc" class="my-close" size="20" type="clear" />
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			type:{
				type:String,
				default:'text'
			},
			value:{
				type:String,
				default:''
			},
			placeholder:{
				type:String,
				default:'请输入搜索内容'
			},
			align:{
				type:String,
				default:'left'
			},
			maxLength:{
				type:[String,Number],
				default:-1
			}
		},
		watch:{
			value(){
				this.content = this.value;
			}
		},
		data() {
			return {
				content:''
			}
		},
		onLoad() {
		},
		methods: {
			// 非空判断
			isNull(str){
				console.log(str)
				return str.replace(/(^\s*)|(\s*$)/g,"");
			},
			onConfirm(){	
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				if(this.isNull(this.content)) {
					console.log('我是空')
				}
				this.$emit("confirm",this.content)
			},
			clear(){
				this.content='';
				this.$emit("clear",this.content)
			}
		}
	}
</script>
<style scoped lang="scss">
	.box{
		display:flex;
		align-items:center;
		justify-content:space-between;
		border-radius:5upx; 
		padding-left:20upx;
		padding-right:30upx;
		width:100%;
		height:100%;
		line-height:100%;
		position:relative;
	}
	.input{
		line-height:1em;
		font-size:100%;
		color:#333;
		width:95%;
		height:100%;
		line-height:100%;
		margin: 0;
		font-family: inherit;
		-webkit-appearance: none;
		border:none;
		background-color:transparent;
		&:focus{outline:none;}
	}
	.clear{
		position:absolute;
		// right:10upx;
		right: 50rpx;
		top:0;
		height:100%;
		line-height:100%;
		font-weight:100;
		display:flex;
		// align-items:center;
		align-items: left;
		padding-top:6upx;
	}
	.my-close {
		position:absolute;
		top: 50%;
		transform: translateY(-50%);
	}
</style>