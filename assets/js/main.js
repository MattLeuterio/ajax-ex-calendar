/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {
    
    /**
     * SETUP
     */

    // Punto di partenza
    var baseMonth = moment('2018-01-01'); 
    
    // Init Hndlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

     // cambiare mese 

     // Un mese avanti
     $('.right').click( function(){

        if($('.month').attr('data-this-date') !=  '2018-12-01') {

            // setto variabile con il mese successivo
            var monthNext = baseMonth.add(1, 'M');

            // reset dati nel DOM
            $('.month-list').html('');
            $('.main-side .day-holiday').html('')

            // Genero nuovi dat e li printo nel DOM
            printMonth(template, monthNext)
            printHoliday(monthNext)
        }

     });

     //Un mese indietro
     $('.left').click( function(){

        if($('.month').attr('data-this-date') !=  '2018-01-01') {

            // setto variabile con il mese precedente
            var monthPrev = baseMonth.subtract(1, 'M');

            // reset dati nel DOM
            $('.month-list').html('');
            $('.main-side .day-holiday').html('')

            // Genero nuovi dat e li printo nel DOM
            printMonth(template, monthPrev)
            printHoliday(monthPrev)
        }

     });


}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    // numero primo giorno del mese
    var numFirstDay = date.day();

    // prendo il mese precedente al corrente
    var getMonthPrev = date.get('month') - 1;
    
    // creo un oggetto momento con il mese precedente
    var prevMonth = moment({
        y: date.year(),
        M: getMonthPrev
    })

    // leggo quanti giorni contiene il mese precedente
    var prevMonthDays = prevMonth.daysInMonth()

    // a questi giorni aggiungo sottraggo il numero nella settimana ed aggiungo 1
    // così setto da dove far partire la numerazione ed ho la variabile da inserire come valore nei blankBoxes
    prevMonthDays = (prevMonthDays - numFirstDay) + 1;
    


    // se è il primo giorno è diverso da 0 
    if (numFirstDay != 0) {

        // crea un box vuoto fino ad arrivare al numero del primo giorno del mese
        for(var x = 0; x < numFirstDay; x++) {

            if (date.month() != 0) {
                
                var blankBoxes = {
                    class: 'blank',
                    day: prevMonthDays
                }
    
                prevMonthDays = prevMonthDays + 1;
    
                // stampa tramite il template i box vuoti creati
                var htmlBlankBoxes = template(blankBoxes);
                $('.month-list').append(htmlBlankBoxes);
            } else {
                var blankBoxes = {
                    class: 'blank',
                    day: 31
                }
    
                    // stampa tramite il template i box vuoti creati
                    var htmlBlankBoxes = template(blankBoxes);
                    $('.month-list').append(htmlBlankBoxes);
            }
           
            }

        }

    
    
    //  setta header
    $('.info-sidebar h1').html( date.format('MMMM') );
    $('.info-sidebar h2').html( date.format('YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);

    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            if(holidays.length != 0) {
                for (var i = 0; i < holidays.length; i++) {
                    var thisHoliday = holidays[i];
    
                    var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');
    
                    if(listItem) {
                        listItem.addClass('holiday');
                        //listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                        
                        // backup holiday già printate
                        var backupHoliday = $('.main-side .day-holiday').html();
                        // Setto newHoliday
                        var newHoliday = '<h4>' + listItem.text() + ' - ' + thisHoliday.name + '</h4>';
                        // Aggiungo le holiday nel backup più le nuove
                        $('.main-side .day-holiday').html(backupHoliday + newHoliday);
                        
                    }
                }
            } else {
                $('.main-side .day-holiday').html('We are sorry &#128533 , there are no holidays in ' + date.format('MMMM'));
            }

            
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}

// cambiare mese con il controller

function nextMonth(baseMonth, template, date) {
    baseMonth.add(1, 'months');
    $('.month-list').html('')
    printMonth(template, date);
    printHoliday(date);
}