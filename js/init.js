$(function (){
    var settings={
        position: 'left'
    };

    var customEvent=function(currentIndex){
        alert('Show image #'+currentIndex);
    }

    $('#ag_rotator').ag_rotator(settings,customEvent).find('img').each(function(element,index){
        $(this).css('border','1px solid #ffffff');
    });


    $('#ag_rotator1').ag_rotator({position:'right'},customEvent).find('img').each(function(element,index){
        $(this).css('border','1px solid #ffffff');
    });
    $('#ag_rotator2').ag_rotator({position:'top'},customEvent).find('img').each(function(element,index){
        $(this).css('border','1px solid #ffffff');
    });
    $('#ag_rotator3').ag_rotator({position:'bottom'},customEvent).find('img').each(function(element,index){
        $(this).css('border','1px solid #ffffff');
    });
});