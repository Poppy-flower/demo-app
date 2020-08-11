function is(x, y){
    if(x === y){
        return x!==0 || y!==0 || (1/x === 1/y)  //主要考虑+0、-0
    }else{
        return x!==x && y!==y  //主要考虑x、y是NaN
    }
}

export default function shallowEqual(objA, objB){
    if(is(objA, objB)) return true;

    if(
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ){
        return false
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if(keysA.length !== keysB.length) return false;
}
