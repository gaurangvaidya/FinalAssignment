trigger MailAndPicklist on Product__c (before update) {

    List<Messaging.SingleEmailMessage> mails = 
    new List<Messaging.SingleEmailMessage>();
    List<Product__c> listOfProductsToUpdate = new List<Product__c>();
    for(Product__c product:trigger.new)
    {
        if(product.Status__c!=trigger.oldMap.get(product.id).Status__c)
        {
                    Messaging.SingleEmailMessage mail = 
                    new Messaging.SingleEmailMessage();
                    String userEmail = UserInfo.getUserEmail();
                    List<String> sendTo = new List<String>();
                    sendTo.add(userEmail);
                    mail.setToAddresses(sendTo);
                    mail.setSubject('Delivery Status');
                    Customer__c cust = [SELECT Name,DeliveryAddress__c FROM Customer__c WHERE ID=:product.CustomerID__c];
                    String body;
                    if(product.Status__c=='In Transit')
                    {
                        List<Driver__c> drivers = [SELECT Name,Id,PhoneNumber__c FROM Driver__c WHERE ServiceCity__c=:cust.DeliveryAddress__c];
                        Integer listSize = drivers.size() - 1;
                        Integer randomIndex = Integer.valueof((Math.random())*listSize);
                        String randomDriver = drivers[randomIndex].Name;
                        product.DriverAssigned__c=randomDriver;
                        listOfProductsToUpdate.add(product);
                        body =  'Dear,'+cust.Name;
                        body+='This is to Inform You That Your Product With Order Id'+product.Id;
                        body+='Status has been changed its current status is '+product.Status__c;
                        body+='Driver Assigned To The Delivery Is '+randomDriver;
                        body+='You Can Contact The Driver With '+drivers[randomIndex].PhoneNumber__c;
                        


                    }
                    else {
                         body =  'Dear,'+cust.Name;
                        body+='This is to Inform You That Your Product With Order Id'+product.Id;
                        body+='Status has been changed its current status is '+product.Status__c;
                        
                    }

                    mail.setHtmlBody(body);
                    mails.add(mail);

        }
    }
    Messaging.sendEmail(mails);
  


}