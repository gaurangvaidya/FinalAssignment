import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCustomers from '@salesforce/apex/GetCustomers.getCustomers';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import insertProduct from '@salesforce/apex/ProductController.insertProduct';
import checkIfProductAdded from '@salesforce/apex/ProductController.checkIfProductAdded';
import setProductCheck from '@salesforce/apex/ProductController.setProductCheck';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductDetails extends LightningElement {


    @track options=[];
    prodObj = PRODUCT_OBJECT;
    height;
    weight;
    length;
    width;
    name;
    @track hasRendered=true;

    @track value;
    addedProduct=[];
    displayedOrders;
    disabledCreateButton=false;
    disabledFields=false;

    renderedCallback()
    {

        if(this.hasRendered)
        {
            const comboOptions=[];


            console.log("ReRendered");
            getCustomers().then(customer=>{
    
                        customer.forEach(cust=>{
                                const combo = {label:cust.Name,value:cust.Id};
                                comboOptions.push(combo);
                        });
    
                        this.options=comboOptions;
    
            }).catch(error=>{
                console.log(error);
    
            });

            this.hasRendered=false;
    

        }
        
}

handleOnChangeCombo(event)
{
    
    this.value = event.detail.value;
    this.prodObj.CustomerID__c = this.value;
    checkIfProductAdded({recordId:this.value}).then(check=>{

        if(check)
        {
            this.disabledCreateButton=true;
            this.disabledFields=true;
            this.dispatchEvent(new ShowToastEvent({
                title:"Product Added",
                message:"Products Already Added",
                variant:"error"
            }));

        }
        else{
            this.disabledCreateButton=false;
            this.disabledFields=false;


        }

        this.hasRendered=true;
    });


}

handleOnChangeHeight(event)
{
    event.preventDefault();
    this.height=event.target.value;
    this.prodObj.Height__c = this.height;



}
handleOnChangeWeight(event)
{
    event.preventDefault();
    this.weight=event.target.value;
    this.prodObj.Weight__c = this.weight;

}
handleOnChangeLength(event)
{
    event.preventDefault();
    this.length=event.target.value;
    this.prodObj.Length__c = this.length;


}
handleOnChangeWidth(event)
{
    event.preventDefault();
    this.width=event.target.value;
    this.prodObj.Width__c = this.width;

}
handleOnChangeName(event)
{
    event.preventDefault();
    this.name = event.target.value;
    this.prodObj.Name=this.name;
}

handleOnClickProduct()
{

    if(isNaN(this.height))
    {
        this.dispatchEvent(new ShowToastEvent({
            title:"Wrong Value In Field",
            message:"Height is Not A Number",
            variant:"error"
        }

        ));
        this.height="";
        return;
    }
    if(isNaN(this.weight))
    {
        this.dispatchEvent(new ShowToastEvent({
            title:"Wrong Value In Field",
            message:"Weight is Not A Number",
            variant:"error"
        }
    
        ));
        this.weight="";
        return;
    }
    if(isNaN(this.width))
    {
        this.dispatchEvent(new ShowToastEvent({
            title:"Wrong Value In Field",
            message:"Width is Not A Number",
            variant:"error"
        }

        ));
        this.width="";
        return;
    }
    if(isNaN(this.length))
    {
        this.dispatchEvent(new ShowToastEvent({
            title:"Wrong Value In Field",
            message:"Length is Not A Number",
            variant:"error"
        }

        ));
        this.length="";
        return;
    }

    insertProduct({prod:this.prodObj}).then(prod=>{

        this.dispatchEvent(new ShowToastEvent({
            title:"Success",
            message:"Product Added Sucessfully",
            variant:"Success"
            
        }));

        this.resetFields();
    }).catch(error=>{
        
        this.dispatchEvent(new ShowToastEvent({
            title:"Error In Adding Product",
            message:error.body.message,
            variant:"error"
        }));
    });
    



}
handleOnClickPlace()
{


    getProducts({ownerID:this.value}).then(products=>{

        console.log(products);
        if(products.length==0)
        {

                this.dispatchEvent(new ShowToastEvent({
                    title:"No Products Added",
                    message:"No Products Are Added Please Add A Product!",
                    variant:"error"
                }));
                
        }
        else
        {
            setProductCheck({recordId:this.value}).then(prod=>{

                this.dispatchEvent(new ShowToastEvent({
                    title:"Order Placed",
                    message:"Order Placed Succesfully",
                    variant:"success"
                }));

                this.value="";
            });

        }

        
    });



}

resetFields()
{
    this.name="";
    this.weight="";
    this.height="";
    this.width="";
    this.length="";
}


}