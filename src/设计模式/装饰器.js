/**
 * 基本结构
 */

var a = {
    b: ()=>{
        console.log(1);
    }
};

function myB(){
    a.b();  //先调用以前的方法

    console.log(2);  //再增加一些自己的操作
}



