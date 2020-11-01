public with sharing class GetCustomers {
    
    @AuraEnabled
    public static List<Customer__c> getCustomers(){
        
        try {
            return [
                SELECT Id,Name FROM Customer__c WHERE CreatedById=:UserInfo.getUserId()
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
