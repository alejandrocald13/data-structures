import TreeNode from "./tree-node";

export default class Heap {
  private root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  public depth(value: number, subtree: TreeNode | null = this.root): number {
    if (subtree === null) {
      return -1;
    } else if (subtree.data === value) {
      return 0;
    }

    const leftDepth = this.depth(value, subtree.left);
    const rightDepth = this.depth(value, subtree.right);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode | null = this.root): number {
    if (ref === null) {
      return 0;
    }

    return Math.max(this.height(ref.left), this.height(ref.right)) + 1;
  }

  public countNodes(ref: TreeNode | null = this.root): number{
    if (ref !== null){
      if (ref.is_leaf()){
        return 1;
      }
      const leftChildren = this.countNodes(ref.left);  
      
      const rightChildren = this.countNodes(ref.right);

      return leftChildren + rightChildren + 1;
    }
    else{
      return 0;
    }
  }
  
  public insert(value: number, ref: TreeNode | null = this.root) {
    let amountComplete = 0;
    const height = this.height() - 1;

    for (let i = 0; i <= height; i++){
      amountComplete += Math.pow(2, i)
    }

    if (this.root == null){
      const newNode = new TreeNode(value);
      this.root = newNode;
      return;
    }

    if (ref !== null){
      if (ref.data < value){
        const temp = ref.data;
        ref.data = value;
        value = temp;
      }
      if (this.countNodes() === amountComplete){
          if (ref !== null){
            if (ref.is_leaf()){
              const newNode = new TreeNode(value);
              ref.left = newNode;
            }
            else{
              this.insert(value, ref.left);
            }
          }
      }
      else {
        this.recursive_insert(value);
      }
    } 
  }
  
  public searchParent(value: number, ref: TreeNode | null = this.root): TreeNode | null{
    if (ref === null){
      return null;
    }

    if (ref.is_leaf()){
      return null;
    }
    
    if (ref.left?.data === value || ref.right?.data === value){
      return ref;
    }
    else{
      const leftResult = this.searchParent(value, ref.left);

      if (leftResult === null){
        const rightResult = this.searchParent(value, ref.right);

        return rightResult;
      }

      return leftResult;
    }
  }
  
  public delete(): number{
    if (this.root === null){
      throw new Error("Empty Tree");
    }
    else{
      if (this.root.is_leaf()){
        const temp = this.root;
        this.root = null;
        return temp.data;
      }
      const temp = this.root.data;
      const newRoot = this.findRightMostNode();
      
      if (newRoot === null){
        throw new Error("Invalid Root");
      }

      
      if (this.searchParent(newRoot.data) === this.root){
        if (this.root.right?.data === newRoot.data){
          this.root.right = null;
        }
        else if (this.root.left?.data === newRoot.data){
          this.root.left = null;
        }
        return this.root.data;
      }

      this.root.data = this.swapUp(newRoot, newRoot.data);

      return temp;

    }
  }

  private swapUp(ref: TreeNode | null, value: number): number{
    
    if (ref === null){
      return value;
    }

    const currentParent = this.searchParent(ref.data);

    if (currentParent !== null){

      const temp = currentParent.data;

      if (currentParent.left !== null && currentParent.right !== null){
        
          if (currentParent === this.root){
            if (currentParent.left.data > value){
              console.log("entre");
              const temp2 = currentParent.left.data;
              currentParent.left.data = value;
              
              return temp2;
            }
            else{
              return Math.max(currentParent.left.data, value)
            }

          }
          else{
            currentParent.data = Math.max(currentParent.left.data, value, currentParent.right.data)
          }

          
          if (currentParent.left.is_leaf() && currentParent.left.data === value){
            currentParent.left = null;
          }
          else if (currentParent.right.is_leaf() && currentParent.right.data === value){
            currentParent.right = null;
          }

        }
        else if (currentParent.left !== null){
          currentParent.data = Math.max(value, currentParent.left.data)
          currentParent.left = null;
        }
        else if (currentParent.right !== null){
          currentParent.data = Math.max(value, currentParent.right.data)
          currentParent.right = null;
        }

        return this.swapUp(currentParent, temp);

      }
      
      return value;

    }

  private findRightMostNode(ref: TreeNode | null = this.root): null | TreeNode{
    if (ref === null){
      return null;
    }

    if (ref.is_leaf()){
      return ref;
    }
    const leftHeigth = this.height(ref.left);
    const rightHeigth = this.height(ref.right);

    if (leftHeigth > rightHeigth){
      return this.findRightMostNode(ref.left);
    }
    
    return this.findRightMostNode(ref.right);

  }

  private recursive_insert(value: number, ref: TreeNode | null = this.root){
    if (ref !== null) {
      if (ref.data < value){
        const temp = ref.data;
        ref.data = value;
        value = temp;
      }

      const leftSide = ref.left;
      const rightSide = ref.right;

      const leftNodes = this.countNodes(leftSide)

      if (ref.hasChildren() <= 1){
        const newNode = new TreeNode(value);
        if (leftSide === null){
          ref.left = newNode;

        }
        else if (rightSide === null){
          ref.right = newNode;
        } 
      }
      
      if (leftSide !== null && rightSide !== null){  
        
        let completeLeft = 0;
        for (let i = 0; i <= this.height() - this.depth(leftSide.data) - 1; i++){
          completeLeft += Math.pow(2, i)
        }
        if (leftNodes === completeLeft){
          this.recursive_insert(value, ref.right);
        }
        else {
          this.recursive_insert(value, ref.left);
        }
        
      }
    }

  }

  public preorder(ref: TreeNode | null = this.root): string {
    if (ref === null) {
      return "";
    }

    if (ref.left === null && ref.right === null) {
      return ref.data.toString();
    }

    let result = `${ref.data} (`;
    result += `${this.preorder(ref.left)},`;
    result += `${this.preorder(ref.right)})`;

    return result;
  }

  public search(
    value: number,
    ref: TreeNode | null = this.root
  ): TreeNode | null {
    if (ref !== null && ref.data === value) {
      return ref;
    } else if (ref !== null) {
      const leftResult = this.search(value, ref.left);

      if (leftResult === null) {
        const rightResult = this.search(value, ref.right);

        return rightResult;
      }

      return leftResult;
    }

    return null;
  }
}