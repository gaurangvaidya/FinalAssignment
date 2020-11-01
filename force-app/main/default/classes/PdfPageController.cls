public with sharing class PdfPageController {


    public String customerId{get;set;}
    public List<Map<String,Integer>> priceList{get;set;}
    public List<String> productName {get;set;}
    public PdfPageController()
    {
        String id = System.currentPagereference().getParameters().get('id');
        customerId = id;

        List<Product__c> products = [SELECT Height__c,Weight__c,Length__c,Width__c,Name,Id FROM Product__c WHERE CustomerID__c=:id];
        List<String> productname = new List<String>();
       List<Map<String,Integer>> pricelist = new List<Map<String,Integer>>();
        for(Product__c product : products)
        {
            Map<String,Integer> tempMap = new Map<String,Integer>();
            productname.add(product.Name);
            tempMap.put('BasicCharge',500);
           
            if(product.Height__c>=100)
            {
                tempMap.put('HeightCharge',50);
            }
            else 
            {
                tempMap.put('HeightCharge',0);
            }

            if(product.Width__c>=100)
            {
                tempMap.put('WidthCharge',50);
            }
            else
            {
                tempMap.put('WidthCharge',0);
            }
            if(product.Length__c>=100)
            {
                tempMap.put('LengthCharge',50);
            }
            else
            {
                tempMap.put('LengthCharge',0);
            }

            if(product.Weight__c>=100)
            {
                tempMap.put('WeightCharge',50);
            }
            else
            {
                tempMap.put('WeightCharge',0);
            }
            pricelist.add(tempMap);
            
        }
        this.priceList=pricelist;  
        this.productName = productname;


    }


}
