export default function Factorial(x: number):number{
    let res: number = x;
    for(let i = 1; i < x - 1; i++){
        res = res * (x-i);
    }
    return res;
}