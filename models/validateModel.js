import { showToast } from "../utils/util"

class ValidateModel{
  // 策略
  static strategies = {
    checkEmpty: function(value) {
      return {
        title: '不能为空',
        value: value !== ''
      };
    },
  }
  constructor() {
    this.cache = [];
  }

  // 添加策略事件
  add(value, method) {
    this.cache.push(function() {
      return ValidateModel.strategies[method](value);
    });
  };

  // 检查
  check() {
    for (let i = 0; i < this.cache.length; i++) {
      let valiFn = this.cache[i];
      var data = valiFn(); // 开始检查
      console.log('开始坚持')
      console.log(data)
      if (!data.value) {
        showToast(data.title)
        return false;
      }
    }
    return true;
  };
}

export default ValidateModel



