import TreeNode from "./tree-node";

class AvlTree {
  public root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  public findRightMostNode(ref: TreeNode | null = this.root): null | TreeNode{
    if (ref === null){
      return null;
    }

    if (ref.isLeaf()){
      return ref;
    }
    const leftHeigth = this.height(ref.left);
    const rightHeigth = this.height(ref.right);

    if (leftHeigth > rightHeigth){
      return this.findRightMostNode(ref.left);
    }
    
    return this.findRightMostNode(ref.right);

  }

  private searchParent(value: string, ref: TreeNode | null = this.root): TreeNode | null{
    if (ref === null){
      return null;
    }

    if (ref.isLeaf()){
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

  private rotate(subtree: TreeNode | null){
    if (subtree === null){
      throw new Error();
    }

    const balance = this.balanceFactor(subtree);

    if (balance === 0 || balance === -1 || balance === 1){
      return;
    }


    if (balance === 2){
      const child = subtree.left;
      const balanceChild = this.balanceFactor(child!);
      if (balanceChild !== -1){
        this.rotateRight(subtree);
        return;

      } else{

        this.doubleRight(subtree);
        return;
 
      }
    }

    if (balance === -2){
      const child = subtree.right;
      const balanceChild = this.balanceFactor(child!);
      if (balanceChild !== 1){
        this.rotateLeft(subtree);
        return;
      }
      else{
        this.doubleLeft(subtree);
        return;
      }
    }
  }

  private checkBalanceFactor(value: string, subtree: TreeNode | null = this.root){
    if (subtree === null){
      throw new Error();
    }
    if (subtree.data === value){
      return;
    }

    if (subtree.isLeaf()){
      if (subtree.data === value){
        return; 
      } else {
        throw new Error();
      }
    }

    if (value < subtree.data){
      this.checkBalanceFactor(value, subtree.left);
      this.rotate(subtree)
    } else {
      this.checkBalanceFactor(value, subtree.right);
      this.rotate(subtree)
    }
  }

  private doubleRight(subtree: TreeNode){
    const child = subtree.left;

    if (child === null){
      throw new Error();
    }

    const grandChild = child.right;

    if (grandChild === null){
      throw new Error();
    }

    const temp = grandChild.left;

    subtree.left = grandChild; 
    grandChild.left = child; 
    child.right = temp; 

    this.rotateRight(subtree); 

  }

  private doubleLeft(subtree: TreeNode){
    const child = subtree.right;

    if (child === null){
      throw new Error();
    }

    const grandChild = child.left;

    if (grandChild === null){
      throw new Error();
    }

    const temp = grandChild.right;

    subtree.right = grandChild;
    grandChild.right = child; 

    child.left = temp;

    this.rotateLeft(subtree); 
  }

  public max(ref: TreeNode | null = this.root): TreeNode{
    if (ref === null){
      throw new Error();
    }

    if (ref.right === null){
      return ref;
    }

    return this.max(ref.right);
  }
  
  public min(ref: TreeNode | null = this.root): TreeNode{
    if (ref === null){
      throw new Error();
    }

    if (ref.left === null){
      return ref;
    }

    return this.max(ref.left);
  }

  private rotateRight(subtree: TreeNode){
    const parentData = subtree.data;
    const child = subtree.left;

    if (child === null){
      throw new Error();
    }

    const grandChild = child.left;

    if (grandChild === null){
      throw new Error();
    }

    subtree.data = child.data;

    const subtreeRight = subtree.right;

    subtree.right = new TreeNode(parentData);
    subtree.right.right = subtreeRight; 
    
    subtree.right.left = child.right;
    child.right = null; 

    subtree.left = grandChild;

  }

  private rotateLeft(subtree: TreeNode){
    const parentData = subtree.data;
    const child = subtree.right;

    if (child === null){
      throw new Error();
    }

    const grandChild = child.right;

    if (grandChild === null){
      throw new Error();
    }

    subtree.data = child.data;

    const subtreeLeft = subtree.left;

    subtree.left = new TreeNode(parentData);
    subtree.left.left = subtreeLeft;

    subtree.left.right = child.left;
    child.left = null;

    subtree.right = grandChild;

  }

  public insert(value: string, ref: TreeNode | null = this.root){
    if (this.root === null){
      this.root = new TreeNode(value);
    }
    else{

      this.insert_(value, ref);
    }

  }

  public delete(value: string, ref: TreeNode | null = this.root){
    if (this.root === null){
      throw new Error("Empty Tree");
    }
    else if(this.root.isLeaf()){
      this.root = null;
    }
    else{
      this.delete_(value, ref);
    }

  }

  private delete_(value: string, ref: TreeNode | null){
    if (ref !== null){
      if (value === ref.data){
        if (ref.isLeaf()){
          const currentParent = this.searchParent(ref.data);
          
          if (currentParent !== null){
            if (currentParent.left?.data === value){
              currentParent.left = null;
            }
            else{
              currentParent.right = null;
            }

            this.checkBalanceFactor(currentParent.data);
          }

        }
        else if (ref.hasChildren() === 1){
          if (ref.left){
            ref.data = ref.left.data;
            ref.left = null;
          }
          
          if (ref.right){
            ref.data = ref.right.data;
            ref.right = null;
          }

          this.checkBalanceFactor(ref.data);

        }
        else{

          const rightNode = this.findRightMostNode(ref.left);

          if (rightNode !== null){
            const currentParent = this.searchParent(rightNode.data);
            
            if (currentParent !== null){
              if (currentParent.left?.data === rightNode.data){
                currentParent.left = null;
              }
              else{
                currentParent.right = null;
              }

              ref.data = rightNode.data;

              this.checkBalanceFactor(currentParent.data);
            }
          }
        }
      }

      else if (value < ref.data){
          this.delete_(value, ref.left);
      } else {
          this.delete_(value, ref.right);
        }
      }
  }

  private insert_(value: string, ref: TreeNode | null){
    if (ref !== null){
      if (value < ref.data){
        if (ref.left === null){
          ref.left = new TreeNode(value);
          this.checkBalanceFactor(value);
        } else{
          this.insert_(value, ref.left);
        }
      } else {
        if (ref.right === null){ 
          ref.right = new TreeNode(value);

          this.checkBalanceFactor(value);
        } else{
          this.insert_(value, ref.right);
        }
      }
    }
  }



  public balanceFactor(ref: TreeNode): number{
    const leftHeight = this.height(ref.left);
    const rightHeight = this.height(ref.right);

    return leftHeight - rightHeight;

  }


  public depth(value: string, ref: TreeNode | null = this.root): number {
    if (ref === null) {
      return -1;
    } else if (ref.data === value) {
      return 0;
    }

    const leftDepth = this.depth(value, ref.left);
    const rightDepth = this.depth(value, ref.right);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode | null = null): number {
    if (ref === null) {
      return 0;
    }

    return Math.max(this.height(ref.left), this.height(ref.right)) + 1;
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

  public search(value: string, ref: TreeNode | null = this.root): TreeNode | null {
    if (ref !== null && ref.data >= value) {
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

export default AvlTree;