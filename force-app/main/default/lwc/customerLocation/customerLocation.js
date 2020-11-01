import { LightningElement,track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CUSTOMER_OBJECT from '@salesforce/schema/Customer__c';
import insertCustomer from '@salesforce/apex/CustomerController.insertCustomer';



export default class CustomerLocation extends LightningElement {

    @track hasRendered = true;
    @track customerObj = CUSTOMER_OBJECT;

    customerName;
    deliveryAddress;
    pickupAddress;
    latitude;
    longitude;
   
    boolCheckLocation = false;
    handleOnChangeName(event)
    {
        event.preventDefault();
        this.customerName = event.target.value;
        this.customerObj.Name=this.customerName;

    }
    handleOnChangeDelivery(event)
    {
        event.preventDefault();
        this.deliveryAddress=event.target.value;
        this.customerObj.DeliveryAddress__c=this.deliveryAddress;
    }
    handleOnChangePickup(event)
    {
        event.preventDefault();
        this.pickupAddress=event.target.value;
        this.customerObj.PickupAddress__c=this.deliveryAddress;
    }


    renderedCallback()
    {
        if(this.hasRendered)
        {

            if(navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(position=>{

                    this.latitude=position.coords.latitude;
                    this.longitude=position.coords.longitude;
                    this.customerObj.Location__Latitude__s=this.latitude;
                    this.customerObj.Location__Longitude__s=this.longitude;

                },
                error=>{
                    if(error.code==error.PERMISSION_DENIED)
                    {
                        this.dispatchEvent(new ShowToastEvent({
                            title:"Location Permission Not Given",
                            message:"Please Give Location Access!",
                            variant:"error"

                    }));
                    this.boolCheckLocation=false;

                    }
                });
                this.boolCheckLocation=true;

            }
            else
            {
                
                this.dispatchEvent(new ShowToastEvent({
                    title:"Unsupported",
                    message:"The Browser Does Not Support Geolocation API!",
                    variant:"error"

            }));

            }
            this.hasRendered=false;
            
        }

    }
    createCustomer()
    {
        
            if(this.customerName==null)
            {
                this.dispatchEvent(new ShowToastEvent({
                    title:"Empty Field",
                    message:"Name Field Is Empty",
                    variant:"error"

            }));
            return;

            }
            if(this.deliveryAddress==null)
            {
                this.dispatchEvent(new ShowToastEvent({
                    title:"Empty Field",
                    message:"Delivery Address Field Is Empty",
                    variant:"error"

            }));

            return;
            }
            if(this.pickupAddress==null)
            {
                this.dispatchEvent(new ShowToastEvent({
                    title:"Empty Field",
                    message:"Pickup Address Field Is Empty",
                    variant:"error"

            }));
            return;
            }
           
            if(this.boolCheckLocation==false)
            {
                this.dispatchEvent(new ShowToastEvent({
                    title:"Empty Field",
                    message:"Location Permission Not Given Refresh Page And Try Again",
                    variant:"error"

            }));
            return;
            }

           

            var regex = /^[A-Za-z]+$/;
            var isValid = regex.test(this.customerName);
            if(!isValid)
            {
                this.dispatchEvent(
                    new ShowToastEvent(
                        {
                            title:"Field Error",
                            message:"Name Field Consists Of Numbers Or  Letters Or Special Characters",
                            variant:"error"
                        }
                    )
                );
                this.customerName="";
                return;

            }

            


            



           insertCustomer(
               {
                customer:this.customerObj
               }
           )
            .then(customer => {
                
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Order created',
                        variant: 'success',
                    }),
                );

                this.deliveryAddress="";
                this.pickupAddress="";
                this.customerName="";
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
            


    }
}