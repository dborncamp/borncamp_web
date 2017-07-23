$(document).ready(function(){
    var date_input=$("#date");
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
        pickTime: false
    })
    console.log(date_input);
})

$(document).ready(function(){
    var time_input=$("#time");
    time_input.datepicker({
        format: 'hh:mm',
        container: container,
        autoclose: true,
        pickDate: false,
        pickTime: true,
        pick12HourFormat: true
    }).on('change', function() {
        var time = $.format.date(dateDepart.datepicker('getDate'), spanDateFormat);
})

$(function () {
    $('#startTime, #endTime').datetimepicker({
        format: 'HH:mm',
        pickDate: false,
        pickSeconds: false,
        pick12HourFormat: false
    });
});