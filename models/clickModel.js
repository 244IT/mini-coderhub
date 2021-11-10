/* 点击模型 @author: chh */

class ClickModel{
  debounce(fn, wait){
    let timer = null;
    return function(){
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
    }
  }
}

module.exports = new ClickModel()