public with sharing class ProductController {
    @AuraEnabled
    public static void insertProduct(Product__c prod){
        try {

            insert prod;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static boolean checkIfProductAdded (String recordId){
        try {

            Customer__c cust = [SELECT checkif_productadded__c FROM Customer__c WHERE Id=:recordId];

            return cust.checkif_productadded__c;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void setProductCheck(String recordId){
        try {

            Customer__c cust = [SELECT checkif_productadded__c FROM Customer__c WHERE Id=:recordId];

            cust.checkif_productadded__c=true;

            update cust;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Product__c> getProducts(String ownerID){

        try {

            return[
                SELECT Id,Length__c,Weight__c,Height__c,Width__c FROM Product__c WHERE CustomerID__c=:ownerID
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



}
