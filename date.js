exports.getDate= function(){

    const today=new Date();
    
    const options={ 
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    
        //let currentDay=today.getDay();
    return today.toLocaleDateString("en-US",options);
}
