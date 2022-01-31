export default function IsPalindrome(string: string): boolean{
    return (string.split("").reverse().join("") == string);
}