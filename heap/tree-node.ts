class TreeNode {
    public data: number;
    public left: TreeNode | null;
    public right: TreeNode | null;
  
    constructor(data: number) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  
    hasChildren(): number {
      if (this.left !== null && this.right !== null){
        return 2;
      }
      else if (this.left === null && this.right === null){
        return 0;
      }
      else {
        return 1;
      }
    }
  
    is_leaf(): boolean{
      return (this.left === null && this.right === null);
    }
  
  }
  
  export default TreeNode;
  