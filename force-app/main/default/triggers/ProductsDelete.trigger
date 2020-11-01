trigger ProductsDelete on   Product__c  (after delete) {
    List<Customer__c> listOfCustomersToUpdate = new List<Customer__c>();

    for(Product__c prod : trigger.old)
    {
        String customerId = prod.CustomerID__c;
        List<AggregateResult> results = [SELECT Count(Id) FROM Product__c WHERE CustomerID__c=:customerId];
        Integer count = (Integer)results[0].get('expr0');
        Customer__c cust = [SELECT Id From Customer__c WHERE Id=:customerId];
        if(count==0)
        {
            cust.checkif_productadded__c=false;
            listOfCustomersToUpdate.add(cust);
        }


    }
    update listOfCustomersToUpdate;

}