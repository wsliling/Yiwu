<template>
	<view class="uni-numbox">
		<view class="uni-numbox__minus" :class="{'uni-numbox--disabled': disableSubtract||disabled}" @click="_calcValue('subtract')">-</view>
		<input class="uni-numbox__value" type="number" :disabled="true" :value="inputValue" @blur="_onBlur">
		<view class="uni-numbox__plus" :class="{'uni-numbox--disabled': disableAdd||disabled}" @click="_calcValue('add')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			value: {
				type: Number,
				default: 1
			},
			index: {
				type: Number,
				default: 0
			},
			shopindex:{
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: 1
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value,
			}
		},
		computed: {
			disableSubtract() {
				return this.inputValue <= this.min
			},
			disableAdd() {
				if(this.max!=0){
					return this.inputValue >= this.max;
				}else{
					return 
				}
			}
		},
		watch: {
			value(val) {
				this.inputValue = val;
			},
			inputValue(val) {
				this.$emit('change', [val,this.shopindex,this.index]);
			}
		},
		methods: {
			_calcValue(type) {
				if(this.max!=0){
					if (this.disabled) {
						console.log("8888");
						return
					}
					console.log("99999");
				}else{
					console.log("pppppppppp");
					this.disabled=false
				}
				const scale = this._getDecimalScale()
				let value = this.inputValue * scale
				let step = this.step * scale
				if (type === 'subtract') {
					value -= step
				} else if (type === 'add') {
					value += step
				}
				if (value < this.min || value > this.max&&this.max!=0) {
					return
				}
				this.inputValue = value / scale;
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					this.inputValue = 0
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 70upx;
		position: relative
	}

	.uni-numbox:after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: 0;
		left: 0;
		border: 1px solid #ededee;
		border-radius: 12upx;
	}

	.uni-numbox__minus,
	.uni-numbox__plus {
		margin: 0;
		background-color: #f8f8f8;
		width: 70upx;
		font-size: 40upx;
		height: 100%;
		line-height: 70upx;
		text-align: center;
		color: #333;
		position: relative
	}

	.uni-numbox__value {
		position: relative;
		background-color: #fff;
		width: 80upx;
		height: 100%;
		text-align: center;
		padding: 0
	}

	.uni-numbox__value:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border-style: solid;
		border-color: #c8c7cc;
		border-left-width: 1px;
		border-right-width: 1px;
		border-top-width: 0;
		border-bottom-width: 0;
		transform: scale(.5)
	}

	.uni-numbox--disabled {
		color: silver
	}
</style>