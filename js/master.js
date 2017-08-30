$(document).ready(function() {
  $('.websites-items').find('*').removeAttr('style');
  $('.url-bar input[type="text"]')[0].focus();
});

$('.url-bar > input').keypress(function(event) {

  var link = $(this).val();
  if (/(^|\s)((\w+:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(link)) {
    if (!/^http[s]?\:\/\//.test(link))
      link = 'http://' + link;
  }
  else {
    link = 'https://google.com/#q=' + encodeURI(link);
  }
  console.log(link);

  if(event.which === 13) {
    window.location.href = link;
  }
});

$('.url-bar > svg').on("click", function() {
  var link = $('.url-bar > input').val();
  if (/(^|\s)((\w+:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(link)) {
    if (!/^http[s]?\:\/\//.test(link))
      link = 'http://' + link;
  }
  else {
    link = 'https://google.com/#q=' + encodeURI(link);
  }
  window.location.href = link;
});

(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery)); // thanks Felix Kling, stack overflow

$('.plus').clickToggle(
  function() {
    $('.plus').css({
      "opacity": 1,
      "transform": "rotate(45deg)",
      "color": "#999"
    });
    $('.popup').css({"z-index": 2, "display": "block"});
    $('.popup').css("opacity", 1).delay(420);
    $('.url-bar').css("opacity", 0).delay(420);
  },
  function() {
    $('.plus').removeAttr("style");
    $('.plus').css("transform", "rotate(0deg)");
    $('.popup').css("opacity", 0);
    $('.popup').css({"z-index": -1, "display": "none"}).delay(420);
    $('.url-bar').css("opacity", 1).delay(420);
  }
);

// $(".website-list").sortable({
//   placeholder: "empty-li"
// });
$(".website-list > li").addClass("ui-state-default");
$(function() {
  var $webSort = $(".website-list").sortable({
    placeholder: "empty-li",
    items: ".sorting-initialize",
    update: function() {
      $(".website-list > li").addClass("ui-state-default");
      sliderUpdate();
    }
  });
  $webSort.find(".ui-state-default").one("mouseenter",function(){
    $(this).addClass("sorting-initialize");
    $webSort.sortable('refresh');
  });
});

$('.addWebsite').click(function() {
  var inputWebsite = $('.input-website').val();
  var inputURL     = $('.input-URL').val();
  if (/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(inputURL)) {
    if (!/^http[s]?\:\/\//.test(inputURL)) {
      inputURL = 'http://' + inputURL;
    }
  }
  if (inputWebsite === "" || inputURL === "") { return 1; }

  $('.input-website').val("");
  $('.input-URL').val(""); // reset

  $('.website-list').prepend(
    "<li class=\"website-list-item ui-state-default sorting-initialize ui-sortable-handle\">\n" +
      "<span class=\"website-name\">" + inputWebsite + "</span> \n" +
      "<i class=\"fa fa-times remove-website\"></i> \n" +
      "<a target=\"_blank\" class=\"website-link\" href=\"" + inputURL + "\">" + inputURL + "</a> \n" +
    "</li>\n"
  );

  var scrollTo = $('.website-list-item:nth-child(1)');
  $('.websites-items').animate({
    scrollTop: scrollTo.offset().top - $('.websites-items').offset().top + $('.websites-items').scrollTop()
  });

  sliderUpdate();
  highlight(scrollTo);
});

$('.input-URL').keypress(function(event) {
 if(event.which === 13) {
   var inputWebsite = $('.input-website').val();
   var inputURL     = $('.input-URL').val();
   if (/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(inputURL)) {
     if (!/^http[s]?\:\/\//.test(inputURL)) {
       inputURL = 'http://' + inputURL;
     }
   }
   if (inputWebsite === "" || inputURL === "") { return 1; }

   $('.input-website').val("");
   $('.input-URL').val(""); // reset

   $('.website-list').prepend(
     "<li class=\"website-list-item ui-state-default sorting-initialize ui-sortable-handle\">\n" +
       "<span class=\"website-name\">" + inputWebsite + "</span> \n" +
       "<i class=\"fa fa-times remove-website\"></i> \n" +
       "<a target=\"_blank\" class=\"website-link\" href=\"" + inputURL + "\">" + inputURL + "</a> \n" +
     "</li>\n"
   );

   var scrollTo = $('.website-list-item:nth-child(1)');
   $('.websites-items').animate({
     scrollTop: scrollTo.offset().top - $('.websites-items').offset().top + $('.websites-items').scrollTop()
   });

   sliderUpdate();
   highlight(scrollTo);
  }
});

function highlight(elem) {
  var fadeTime = 1750;
  elem.css({
    "transition": "all 1s ease-in-out",
    "background-color": "#ff7"
  });

  setTimeout(function() {
    elem.css({"background-color": ""});
  }, fadeTime);
  setTimeout(function() {
    elem.css({"transition": ""});
  }, fadeTime * 2);
}

$(document).on("click", ".remove-website", function() {
  $(this).parent().remove();
  sliderUpdate();
});


var clearLocal = false;
$('#reset').on("click", function() {
  localStorage.clear('website-list');
  clearLocal = true;
  location.reload();
});

$(window).on("unload", function(e) {
  if (!clearLocal) {
    localStorage.setItem('website-list', $('.website-list').prop('outerHTML'));
  }
  $('.websites-items').find('*').removeAttr('style');
});
if (localStorage.getItem('website-list') !== null) {
  $('.website-list').replaceWith(localStorage.getItem('website-list'));
}
// SIX (FOUR SIGNIFICANT) LINES FOR OFFLINE STORAGE AND DEFAULTING, I LOVE YOU HTML5

$('.import').on("click", function() {
  $('#importer').get(0).click();
});
$('.export').on("click", function() {
  $('#exporter').get(0).click();
});

$('#importer').change(function() {
  var file = $('#importer')[0].files[0];
  var reader = new FileReader();
  var contents;
  reader.readAsText(file, 'UTF-8');
  
  reader.onload = function(evt) {
    contents = evt.target.result;
    $('.website-list').replaceWith(contents);
    localStorage.setItem('website-list', contents);
    location.reload();
  }
  reader.onerror = function(evt) {
    alert('There was an error reading your file: "' + file.name + '"');
  }

});

$('body').hover(
  function() {
    $('.plus').addClass('show');
  },
  function() {
    $('.plus').removeClass('show');
  }
);

$('.slider').hover(
  function() {
    $('html').addClass('scroll-hide');
  },
  function() {
    $('html').removeClass('scroll-hide');
  }
);

function sliderUpdate() {
  console.log('Updated slider!')
  $('.slider').empty();
  $('.website-list > .website-list-item').each(function(i) {
    var name = $(this).children('.website-name').text();
    var link = $(this).children('.website-link').text();

    $('.slider').append(
      "<a href=\"" + link + "\" class=\"slider-link\">" +
        "<div class=\"slider-item\">\n" +
          "<span>" + name + "</span>\n" +
        "</div>\n" +
      "</a>"
    );
  });
  $('.slider').append("<a class=\"spacer\"></a>");

  sliderItems = $('.slider').children('.slider-link');

  hue = 360 / sliderItems.length;
  i = sliderItems.length
  sliderItems.each(function () {
    console.log($(this).attr('class'));
    $(this).addClass('hue-' + i);

    $('.hue-' + i).css('background', 'hsl(' + (hue * (i - 0.4)) + ', 80%, 60%)');
    i--;
  });
  console.log(hue);


  //Deal with exporting link to save the .website-list outer html
  (function() {
    var data = $('.website-list').prop('outerHTML');
    $('#exporter')
      .attr('href', 'data:text/html;charset=utf8,' + encodeURIComponent(data))
      .attr('download', 'homepage-favourites.html');
  })();

}
sliderUpdate()
