import { LightningElement ,wire,track} from 'lwc';
import getCustomers from '@salesforce/apex/GetCustomers.getCustomers';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class QuoteManagement extends LightningElement {

    @track options=[];
    @track comboBoxValue="";
    
    @track hasRendered = true;
    @track products=[];
    @track prices=[];
    totalprice=0;

    str="<table><tr><th>Name</th></tr><tr><td>Gaurang</td></tr></table>"
    renderedCallback()
    {

        const comboOptions = [];
        
       if(this.hasRendered)
       {
        getCustomers().then(
            result=>{

                    result.forEach(
                        ele=>{

                        
                            const combo = {label:ele.Name,value:ele.Id};
                            comboOptions.push(combo);
                        
                        })

                        this.options=comboOptions;
                
            

                    }).catch(error=>{

                        console.log(error);

        });

        this.hasRendered=false;


       }
       

    }

    handleOnChangeComboBox(event)
    {
        this.comboBoxValue = event.detail.value;

        getProducts({ownerID:this.comboBoxValue}).then(products=>{

            this.products=products;
            const index=0;
            const tempPrices=[];
            products.forEach(product=>{

                var price = {};
                this.totalprice=0;
                price.id=index;

                price.basiccharge = 500;
                if(product.Height__c>=100)
                {
                    price.heightprice=50;
                }
                else
                {
                    price.heightprice=0;

                }
                if(product.Weight__c>=100)
                {
                    price.weightprice=50;
                }
                else
                {
                    price.weightprice=0;

                }

                if(product.Width__c>=100)
                {
                    price.widthprice=50;
                }
                else
                {
                    price.widthprice=0;
                }
                if(product.Length__c>=100)
                {
                    price.lengthprice=50;

                }
                else
                {
                    price.lengthprice=0;
                }
                price.totalprice=this.totalprice+price.basiccharge+price.heightprice+price.weightprice+price.lengthprice+price.widthprice;
                tempPrices.push(price);
                

            });
            this.prices=tempPrices;
            console.log(this.prices);
            this.hasRendered=true;


        });

    }
    
    
}