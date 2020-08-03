/**
 * 1. 传统的单例模式
 * 2. "透明"的单例模式
 * 3. 代理模式创建单例模式
 * 4. js中的单例模式
 * 5. 惰性单例
 */


/**
 * 1. 传统的单例模式
 */

function Singleton(name){
    this.name = name;
}

Singleton.getInstance = function(name){
    if(this.instance){
        return this.instance;
    }else{
        this.instance = new Singleton(name);
        return this.instance;
    }
};

var a = Singleton.getInstance('a');
var b = Singleton.getInstance('b');

console.log(a===b);



/**
 * 2. '透明'的单例
 *     可以跟正常一样 new 多次
 */
var instance;
function Person(name){
    this.name = name;
    if(!instance){
        instance = this;
    }
    return instance;
}

Person.prototype.getName = function(){
    console.log(this.name);
}

var a = new Person('a');
var b = new Person('b');

console.log(a === b);


/**
 * 3. 代理模式创建单例
 *    代理模式： 自己不去做，委托中间人去做
 *    Person 是一个普通类，通过new Person 可以创建一个对象
 *    用代理模式创建 CreateSinglePerson方法，通过 new CreateSinglePerson 创建单例
 */

function Person(name){
    this.name = name;
}

Person.prototype.getName = function(){
    return this.name;
};

var CreateSinglePerson = ( function(name){
    var instance;

    return function(name){
        if(!instance){
            instance = new Person(name);
        }

        return instance;
    }
})();

var a = new CreateSinglePerson('a');
var b = new CreateSinglePerson('b');
console.log(a === b);

var c = new Person('c');
var d = new Person('d');
console.log(c === d);



/**
 *  4. js中的单例模式
 *     单例模式的核心是只有一个实例，并提供全局访问；
 *     在js中可以通过直接创建一个对象来实现单例模式；
 *     可以用闭包实现私有变量；
 */

let myApp = {
    name: 'app',
    getName: function(){
        console.log(this.name);
    }
};

let myApp2 = (function(){
    var _name = 'app';
    return {
        getName: function(){
            console.log(_name);  //通过闭包，访问到  _name
        }
    }
})();



/**
 * 5. 惰性单例
 *  惰性单例是指在用到的时候才创建
 *  调用render方法，创建A对象，A对象是单例的
 */

var createA = (function(){
    var instance;
    return function(){
        if(!instance){
            instance = 'A';
        }
        return instance;
    }
})();

function render(){
    createA();
    console.log('b');
}

render();
render();

var createB = (function () {
    var instance;
    return function () {
        if(!instance){
            instance = 'B';
        }
        return instance;
    };
})();


/**
 * 分析：  A B 类似，所以可以抽离出公共的创建的惰性单例的代码
 */

function getSingleton(fn){
    var result;
    return function(){
        return result || (result = fn.apply(this, arguments));
    }
}

var createA = function(){
    console.log('createA');
    var instance;
    if(!instance){
        instance = 'A';
    }
    return instance;
};

var createB = function(){
    console.log('createB');
    var instance;
    if(!instance){
        instance = 'B';
    }
    return instance;
};

var createASingle = getSingleton(createA);
var createBSingle = getSingleton(createB);

function render(){
    createASingle();
    createBSingle();
}

render();
render();
















