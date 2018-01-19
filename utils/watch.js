class Watch{
  constructor(context){
    this.page = context;

    this.observers = new Map();		//观察者队列

    this.init();				//将watch数据写入观察者队列
  }

  /**
   **	初始化观察队列，将已订阅的
   **/
  init(){
    const that = this;
    Object.keys(this.page.watch).forEach((key) => {
      if(that.isSet(that.page.data, key)){
        that.subscribe(key, that.page.watch[key]);
      }
    })
  }

  /**
   **	只改变数据，不更新视图
   **/
  data(key, val){
    if(this.isSet(this.page.data, key)){
      this.setter(key, val);
    }
  }

  /**
   **	模拟小程序原生setData方法，改变更新视图前推送订阅事件
   **/
  setData(obj){
    const that = this;
    Object.keys(obj).forEach((key) => {
      that.notify(key, that.page, obj[key], that.getter(that.page.data, key))
      // if(that.observers.has(key)){
      // 	that.observers.get(key).apply(that.page, [obj[key], that.getter(that.page.data, key)]);
      // }
    })
    this.page.setData(obj);
  }

  /**
   **	发布订阅事件
   **/
  notify(key, ctx, val, oldVal) {
    if(this.observers.has(key)){
      this.observers.get(key).apply(ctx, [val, oldVal]);
    }
  }

  /**
   **	获取所有的观察者对象
   **/
  getObs() {
    return this.observers;
  }

  /**
   **	添加观察者
   **/
  subscribe(key, cb){
    if(this.observers.has(key)) this.observers.delete(key);
    this.observers.set(key, cb);

  }

  /**
   **	删除观察者
   **/
  unSubscribe(key){
    if(this.observers.has(key)) this.observers.delete(key);
  }

  /**
   **	根据路径设置data值
   **/
  setter(path, val) {
    if(!path || !this.isSet(this.page.data, path)) return undefined;
    const REG_KEY = /\[(['"a-zA-Z0-9]*)\]|\./gi;
    const pathArr = path.split(REG_KEY).filter(item => !!item);
    let depDataNote = [];
    let oldVal;

    pathArr.reduce((result, currentPath, currentIndex) => {
      if(currentIndex === pathArr.length - 1){
        oldVal = result[currentPath];
        result[currentPath] = val
      }
      depDataNote.push({
        key: currentPath,
        value: result[currentPath]
      })
      return result[currentPath];
    }, this.page.data)

    this.page.data[pathArr[0]] = depDataNote[0].value;

    this.notify(path, this.page, val, oldVal);

    // console.log(this.path.data);

    return oldVal === undefined ? undefined : val;
  }

  /**
   **	根据路径获取data值
   **/
  getter(data, path) {
    const REG_KEY = /\[(['"a-zA-Z0-9]*)\]|\./gi;
    const pathArr = path.split(REG_KEY).filter(item => !!item);

    const result = pathArr.reduce((result, currentPath, currentIndex) => {
      const currentValueType = Object.prototype.toString.call(result);
      return /String|Number|Boolean|Null|Undefined/.test(currentValueType) ? undefined : result[currentPath]
    }, data)



    return result;

  }


  /**
   **	检查target[key]是否存在
   **/
  isSet(target, key) {
    return this.getter(target, key) !== undefined ? true : false;
  }
}

export default Watch;