export const handlePriceFormat = (x) => {
    var result = "";
    if(!x) return "";
    if(x==0) return "0";
    while(x > 0){
        let s = x % 1000;
        x = Math.floor(x/1000);
        let num = s.toString();
        if(x){
            num = num.padStart(3, "0");
        }
        result = num + (result ? "," : "") + result;
        
    }
return result;
}