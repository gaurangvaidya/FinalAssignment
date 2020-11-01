public with sharing class CustomerController {

    public string selectedValue{get;set;}
    @AuraEnabled
    public static void insertCustomer(Customer__c customer){
        try {

            insert customer;

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public List<SelectOption> getcustomerOrderList()
    {

        List<Customer__c> customers = [SELECT Id,Name From Customer__c];
        List<SelectOption> options = new List<SelectOption>();
        for(Customer__c cust:customers)
        {
            options.add(new SelectOption(cust.Id,cust.Name));
        }
        return options;
    }

    public PageReference goToNewPage()
    {
        PageReference pg =  new PageReference('/apex/pdfPage');
        pg.getParameters().put('id',this.selectedValue);
        pg.setRedirect(true);
           
        return pg;
    }
}
