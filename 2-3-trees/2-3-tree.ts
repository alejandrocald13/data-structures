import TreeNode from "./tree-node";
import Data from "./data";

export default class Tree23 {
  public root: TreeNode;

  constructor(data: Data) {
    this.root = new TreeNode(data);
  }

  private splitNode(ref: TreeNode, data: Data, oldData: [TreeNode, Data, TreeNode] | null): [TreeNode, Data, TreeNode] | null  {
    let leftKey: TreeNode;
    let promotedKey: Data;
    let middleKey: TreeNode;
    if (data.key < ref.data1.key) {
      leftKey = new TreeNode(data);
      promotedKey = ref.data1;
      middleKey = new TreeNode(ref.data2!);

      if (oldData){
        leftKey.left = oldData[0]
        leftKey.middle = oldData[2]

        middleKey.left = ref.middle;
        middleKey.middle = ref.right;


      }

    } else if (ref.data2 && 
      data.key > ref.data1.key 
      && data.key <ref.data2.key) {
        leftKey = new TreeNode(ref.data1);
        promotedKey = data;
        middleKey = new TreeNode(ref.data2)
        
        if (oldData){
          leftKey.left = ref.left
          leftKey.middle = oldData[0]

          middleKey.left = oldData[2]
          middleKey.middle = ref.right
        }

      } else {
        leftKey = new TreeNode(ref.data1);
        promotedKey = ref.data2!;
        middleKey = new TreeNode(data);

        if (oldData){
          leftKey.left = ref.left
          leftKey.middle = ref.middle

          middleKey.left = oldData[0]
          middleKey.middle = oldData[2]
        }
      }
    if ( ref === this.root) {
      const newRoot = new TreeNode(promotedKey)
      newRoot.left = leftKey;
      newRoot.middle = middleKey;
      this.root = newRoot;
      return null
    }
    return [leftKey, promotedKey, middleKey];
  }
  
  public insert(data: Data, ref: TreeNode = this.root): [TreeNode, Data, TreeNode] | null {
    if (this.root.data1 === undefined){
      this.root.data1 = data;
      return null;
    }
    else if (this.root.data1.key === -1){
      this.root.data1 = data;
      return null;
    }
    else{
      if (ref.isLeaf()) {
        if (ref.isFull() && ref.data2) {
          return this.splitNode(ref, data, null);
    
        } else {
          ref.insert(data);
          return null;
        }
      } else {
        const branch = ref.getBranch(data.key);
        const result = this.insert(data, branch);
        if (result) {
          if (ref.isFull()) {
    
            if (ref === this.root){
              if (result[1].key < ref.data1.key){
    
                const oldTree = this.root;
    
                this.root = new TreeNode(ref.data1);
                this.root.left = new TreeNode(result[1]);
                this.root.middle = new TreeNode(ref.data2!);
    
                this.root.left.left = result[0];
                this.root.left.middle = result[2];
    
                this.root.middle.left = oldTree.middle;
                this.root.middle.middle = oldTree.right;
    
    
              }
              else if (result[1].key > ref.data1.key && result[1].key < ref.data2!.key){
                const oldTree = this.root;
    
                this.root = new TreeNode(result[1]);
                this.root.left = new TreeNode(ref.data1);
                this.root.middle = new TreeNode(ref.data2!);
    
                this.root.left.left = oldTree.left;
                this.root.left.middle = result[0];
    
                this.root.middle.left = result[2];
                this.root.middle.middle = oldTree.right;
    
              }
              else{
                const oldTree = this.root;
    
                this.root = new TreeNode(ref.data2!);
                this.root.left = new TreeNode(ref.data1);
                this.root.middle = new TreeNode(result[1]);
    
                this.root.left.left = oldTree.left;
                this.root.left.middle = oldTree.middle;
    
                this.root.middle.left = result[0];
                this.root.middle.middle = result[2];
    
              }
            }
            else {
    
              return this.splitNode(ref, result[1], result);
            }
    
          } else {
    
            const promotedKey = result[1];
            if (promotedKey.key < ref.data1.key) {
              ref.insert(result[1]);
              const leftNode = result[0];
              const middleNode = result[2];
              const rightNode = ref.middle;
    
              ref.left = leftNode;
              ref.middle = middleNode;
              ref.right = rightNode;
            } else {
              ref.insert(promotedKey);
              ref.middle = result[0];
              ref.right = result[2];
            }
            
    
            return null;
          }
        }
        
      }
      return null;
     }
  }
  
  public search(key: number, ref: TreeNode = this.root): TreeNode | null{
    if (ref.data1.key === key || ref.data2?.key === key){
      return ref;
    }
    else if (ref.isLeaf()){
      throw new Error("Value Not Found")
    }
    else{
      const newBranch = ref.getBranch(key);
      return this.search(key, newBranch);
    }
  }

  public searchMoreValues(limitA: number, limitB: number, ref: TreeNode = this.root, values: Array<number> = []): Array<number> | null{
    if (ref === null){
        return values.length > 0 ? values: null;
    }
    
    if (ref.data1.key >= limitA && ref.data1.key <= limitB){
        values.push(ref.data1.payload!)
    }

    if (ref.data2){
        if (ref.data2.key >= limitA && ref.data2.key <= limitB){
            values.push(ref.data2.payload!)
        }
    }
    

    
    if (!ref.isLeaf()){
        this.searchMoreValues(limitA, limitB, ref.left, values);
        this.searchMoreValues(limitA, limitB, ref.middle, values);
        if (ref.right){
            this.searchMoreValues(limitA, limitB, ref.right, values);
        }

    }
    
    return values.length > 0 ? values : null;

  }

  private delete_(key: number, ref: TreeNode | undefined): TreeNode | null{

    if (ref === undefined){
      throw new Error();
    }
    
    if (ref.data1.key === key || ref.data2?.key === key){
      return null;
    }
    else{
      const newBranch = ref.getBranch(key);
      const result = this.delete_(key, newBranch);

      if (newBranch){
        if (result === null){
          if (newBranch.isLeaf() && newBranch === ref.left){

            if (newBranch.data2?.key === key){
              newBranch.data2 = undefined;
            }
  
            else if (newBranch.data1.key === key && newBranch.data2){
              newBranch.data1 = {key: newBranch.data2.key, payload: newBranch.data2.payload}
              newBranch.data2 = undefined;
            }

            else if (newBranch.data1.key === key){
              if (ref.data2 === undefined && ref.middle?.isFull()){
                newBranch.data1 = ref.data1;

                ref.data1 = ref.middle.data1;
                ref.middle.data1 = ref.middle.data2!;

                ref.middle.data2 = undefined;
              }

              if (ref.data2 && ref.right && ref.middle){
                newBranch.data1 = ref.data1;
                
                ref.middle.data1 = ref.data2;
                ref.data1 = ref.middle.data1;

                ref.data2 = ref.right.data1;
                ref.right.data1 = ref.right.data2!;

                ref.right.data2 = undefined;
              }

              if (ref.data2 && ref.middle && ref.right?.isFull){
                newBranch.data1 = ref.data1;
                
                ref.middle.data1 = ref.data2;
                ref.data1 = ref.middle.data1;

                ref.middle.data2 = ref.right.data1;

                ref.right = undefined;
              }
            }
            else{
              ref.left = undefined;

              ref.data2 = ref.middle?.data1;

              ref.middle = undefined;
            }
          }
          else if (newBranch.isLeaf() && newBranch === ref.middle){
            if (newBranch.data2?.key === key){
              newBranch.data2 = undefined;
            }
            if (newBranch.data1.key === key && newBranch.isFull()){
              newBranch.data1 = newBranch.data2!
              newBranch.data2 = undefined;
            }

            if (newBranch.data1.key === key){
              if (!newBranch.isFull() && ref.right === undefined && !ref.isFull() && ref.left?.isFull()){
                newBranch.data1 = ref.data1;
                ref.data1 = ref.left.data2!;

                ref.left.data2 = undefined;
              }
              else if (ref.isFull() && !newBranch.isFull() && ref.right){
                newBranch.data1 = ref.data2!


                if (ref.right.isFull()){
                  
                  ref.data2 = ref.right.data1;
                  ref.right.data1 = ref.right.data2!
                  ref.right.data2 = undefined;

                } 
                else{

                  newBranch.data2 = ref.right.data1
                  ref.right = undefined;

                }



              }
              else{
                ref.data2 = ref.data1;
                ref.data1 = ref.left?.data1!;

                ref.middle = undefined;
                ref.left = undefined;
              }
            }
          }
          else if (newBranch.isLeaf() && newBranch === ref.right){
            if (newBranch.data2?.key === key){
              newBranch.data2 = undefined;
            }
            if (newBranch.data1.key === key){
              newBranch.data1 = newBranch.data2!
              newBranch.data2 = undefined;
            }

            if (newBranch.data1.key === key && !newBranch.isFull()){
              if (ref.middle?.isFull()){
                newBranch.data1 = ref.data2!;
                ref.data2 = ref.middle.data1;

                ref.middle.data2 = undefined;

              }
              else{
                ref.right = undefined;

                if (ref.middle){
                  ref.middle.data2 = ref.data2;
                }

                ref.data2 = undefined;
              }
            }

          } else{
            if (newBranch.data1.key === key){
              const newData = this.sucesorNode(newBranch.middle);
              const oldNode = this.search(newData.key);
              const parentOldNode = this.findParent(oldNode?.data1.key!)

              if (oldNode){
                newBranch.data1 = newData;
                oldNode.data1.key = parentOldNode!.data1.key + 1
              }

              this.delete_(oldNode?.data1.key!, this.root);
            }
            else{
              const newData = this.sucesorNode(newBranch.right);
              const oldNode = this.search(newData.key);
              const parentOldNode = this.findParent(oldNode?.data1.key!)

              if (oldNode){
                newBranch.data1 = newData;
                oldNode.data1.key = parentOldNode!.data1.key + 1
              }

              this.delete_(oldNode?.data1.key!, this.root);
            }

          }

        }
      }

      return ref;
    }

  }

  private sucesorNode(ref: TreeNode = this.root): Data{
    if (ref.isLeaf()){
      return ref.data1
    }
    else{
      return this.sucesorNode(ref.left);
    }
  }

  public delete(key: number, ref: TreeNode = this.root): TreeNode | null{
    try{
      const nodeFound = this.search(key);
      if (nodeFound === this.root && nodeFound.left !== undefined){
        const newBranch = ref.getBranch(key);

        if (!newBranch){
          throw new Error();
        }

        if (newBranch.data1.key === key){
          const newData = this.sucesorNode(newBranch.middle);
          const oldNode = this.search(newData.key);
          const oldData = newBranch.data1;

          if (oldNode){
            newBranch.data1 = newData;
            oldNode.data1 = oldData;
          }

          this.delete_(oldNode?.data1.key!, this.root);
        }
        else{
          const newData = this.sucesorNode(newBranch.right);
          const oldNode = this.search(newData.key);
          const oldData = newBranch.data1;

          if (oldNode){
            newBranch.data1 = newData;
            oldNode.data1 = oldData;
          }

          return this.delete_(oldNode?.data1.key!, this.root);
        }
      }
      else if (nodeFound === this.root && nodeFound.left === undefined){
        if (nodeFound.data1.key === key){
          nodeFound.data1 = nodeFound.data2!
          nodeFound.data2 = undefined;
        }
        else{
          nodeFound.data2 = undefined;
        }
        return nodeFound;
      }
    }
    catch{
      throw new Error("Value Not Found")
    }
    return this.delete_(key, ref);

  }

  private findParent(key: number, ref: TreeNode | null = this.root): TreeNode | null{
    
    if (ref === null){
        return null;
    }

    const newBranch = ref.getBranch(key);

    if (newBranch){
        if (newBranch.valueContains(key)){
            return ref;
        }
        else{
            return this.findParent(key, newBranch);
        }
    } else {
        return null;
    }
  }

  public inorder(ref: TreeNode | null = this.root): string{
    if (ref === null){
      return "";
    }

    if (ref.data1 === undefined){
      return "Empty Tree";
    }

    if (ref.isLeaf()){
      if (ref.data2){
        return `${ref.data1} | ${ref.data2}`
      }
      else{
        return `${ref.data1}`
      }
    } else{
      let result = this.inorder(ref.left);
      result += ` | ${ref.data1} | `;
      result += `${this.inorder(ref.middle)}`;
      
      if (ref.data2){
        result += ` | ${ref.data2}`
        if (ref.right){
          result += ` | ${this.inorder(ref.right)}`;
        }
      }

      return result;

    }

  }

  public postorder(ref: TreeNode | null = this.root): string{
    if (ref === null){
      return "";
    }
  
    if (ref.data1 === undefined){
      return "Empty Tree";
    }
  
    if (ref.isLeaf()){
      if (ref.data2){
        return `${ref.data1} - ${ref.data2}`
      }
      else{
        return `${ref.data1}`
      }
    } else{
      let result = this.postorder(ref.left);
      result += ` - ${this.postorder(ref.middle)}`;
      
      if (ref.data2){
        if (ref.right){
          result += ` - ${this.postorder(ref.right)}`;
        }
  
        result += ` - ${ref.data2}`;
      }
  
      result += ` - ${ref.data1}`;
  
      return result;
  
    }
  
  }
  
  public preorder(ref: TreeNode | null = this.root): string {
    if (ref === null) {
      return "";
    }
  
    if (ref.data1 === undefined) {
      return "Empty Tree";
    }
  
    let result = `${ref.data1}`; 
  
    if (ref.isLeaf()) {
      if (ref.data2) {
        result += ` - ${ref.data2}`; 
      }
    } else {
      result += ` - ${this.preorder(ref.left)}`; 
      result += ` - ${this.preorder(ref.middle)}`; 
      
      if (ref.data2) {
        if (ref.right) {
          result += ` - ${this.preorder(ref.right)}`; 
        }
        result += ` - ${ref.data2}`; 
      }
    }
  
    return result;
  }

}