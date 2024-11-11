class TreeNode {
    public data: string;
    public left: TreeNode | null;
    public right: TreeNode | null;
  
    constructor(data: string) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  
    public isLeaf(): boolean{
      return this.left === null && this.right === null;
    }

    public hasChildren(): number{
      if (this.left && this.right){
        return 2;
      }
      else if (this.left || this.right){
        return 1;
      }
      else
      return 0;
    }
    
  }
  
  export default TreeNode;