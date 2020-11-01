public with sharing class dashboardController {
    public List<Product__c> productList {get;set;}
    public dashboardController() {

        productList = [SELECT Id,Name,CustomerID__c,DriverAssigned__c,Status__c FROM Product__c];




    }
}
