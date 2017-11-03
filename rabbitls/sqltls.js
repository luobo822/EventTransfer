module.exports = function() {
	/**
	* 正整数检查
	* 检查是否为正整数
	* [引数]   target: 入力値
	* [返回值] true:  正整数
	*          false: 正整数以外
	*/
	this.isPInt = function (target){
		var pattern = /^[1-9]\d*$/;
		return pattern.test(target);
	}
	
	/**
	* 整数检查
	* 检查是否为整数
	* [引数]   target: 入力値
	* [返回值] true:  整数
	*          false: 整数以外
	*/
	this.isInt = function (target){
		var pattern = /^-?[1-9]\d*$/;
		return pattern.test(target);
	}
	
	/**
	* 数値チェック関数
	* 入力値が数値 (符号あり小数 (- のみ許容)) であることをチェックする
	* [引数]   target: 入力値
	* [返却値] true:  数値
	*          false: 数値以外
	*/
 	this.isNumber = function (target){
		var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
		return pattern.test(target);
	}
	
	/**
	* EventID检查
	* 检查是否为EventID
	* [引数]   target: 入力値
	* [返回值] true:  数値
	*          false: 数値以外
	*/
	this.isEventID = function (target){
		var pattern = /^.{10}$/;
		if (this.isPInt(target)) return pattern.test(target);
		else return false;
	}
	
	
	/**
	* CircleID检查
	* 检查是否为CircleID
	* [引数]   target: 入力値
	* [返回值] true:  数値
	*          false: 数値以外
	*/
	this.isCircleID = function (target){
		var pattern = /^.{6}$/;
		if (this.isPInt(target)) return pattern.test(target);
		else return false;
	}
	
	/**
	* 普通字符串检查
	* 检查是否为普通字符串
	* [引数]   target: 入力値
	* [返回值] true:  普通字符串
	*          false: 普通字符串以外
	*/
	this.isStr = function (target){
		var pattern = /^[^']*$/;
		return pattern.test(target);
	}
	
	/**
	* 普通Url检查
	* 检查是否为Url
	* [引数]   target: 入力値
	* [返回值] true:  Url字符串
	*          false: Url字符串以外
	*/
	this.isUrl = function (target){
		var pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;
		return pattern.test(target);
	}
	
	return this;
}