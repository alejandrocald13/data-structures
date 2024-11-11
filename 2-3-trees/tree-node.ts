import Data from "./data";

export default class TreeNode{
    public data1: Data;
    public data2: Data | undefined;

    public left: TreeNode | undefined;
    public middle: TreeNode | undefined;
    public right: TreeNode | undefined;

    constructor(data: Data){
        this.data1 = data;
    }

    public insert(newData: Data){
        if (newData.key < this.data1.key){
            this.data2 = {
                key: this.data1.key,
                payload: this.data1.payload
            };
            this.data1 = {
                key: newData.key,
                payload: newData.payload,
            };
        }
        else {
            this.data2 = {
                key: newData.key,
                payload: newData.payload,
            }
        }
    }

    public isLeaf(): boolean {
        return (this.left === undefined && 
        this.middle === undefined && 
        this.right === undefined);
    }

    public isFull(){
        return this.data2 !== undefined;
    }

    public getBranch(target: number) {
        if (target < this.data1.key) {
            return this.left;
        }
        else if (this.data2 === undefined) {
            return this.middle;
        }
        else if (this.data1.key < target && this.data2.key > target) {
            return this.middle;
        }
        else {
            return this.right;
        }
    }

    public valueContains(key: number): boolean{
        return (this.data1.key === key || this.data2?.key === key)
    }

}