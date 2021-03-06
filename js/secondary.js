//    /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test("urlhere.com")

/*
if (link.search(/^http[s]?\:\/\//) == -1) {
  link = 'http://' + link;
}
return link;
*/

$('.url-bar > input').keypress(function(event) {

  var link = $(this).val();
  if (/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(link)) {
    if (!/^http[s]?\:\/\//.test(link)) {
      link = 'http://' + link;
    }
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
  if (/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test(link)) {
    if (!/^http[s]?\:\/\//.test(link)) {
      link = 'http://' + link;
    }
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
    $('.popup').css("z-index", 2);
    $('.popup').css("opacity", 1).delay(220);
    $('.url-bar').css("opacity", 0).delay(220);
  },
  function() {
    $('.plus').removeAttr("style");
    $('.plus').css("transform", "rotate(0deg)");
    $('.popup').css("opacity", 0);
    $('.popup').css("z-index", -1).delay(220);
    $('.url-bar').css("opacity", 1).delay(220);
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

  $('.website-list').append(
    "<li class=\"website-list-item ui-state-default sorting-initialize ui-sortable-handle\">\n" +
      "<span class=\"website-name\">" + inputWebsite + "</span> \n" +
      "<i class=\"fa fa-times remove-website\"></i> \n" +
      "<a target=\"_blank\" class=\"website-link\" href=\"" + inputURL + "\">" + inputURL + "</a> \n" +
    "</li>\n"
  );
  sliderUpdate();
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

   $('.website-list').append(
     "<li class=\"website-list-item ui-state-default sorting-initialize ui-sortable-handle\">\n" +
       "<span class=\"website-name\">" + inputWebsite + "</span> \n" +
       "<i class=\"fa fa-times remove-website\"></i> \n" +
       "<a target=\"_blank\" class=\"website-link\" href=\"" + inputURL + "\">" + inputURL + "</a> \n" +
     "</li>\n"
   );
   sliderUpdate();
  }
});

// $('.remove-website').on('click', (function() {
//   $(this).parent().remove();
// });

$(document).on("click", ".remove-website", function() {
  $(this).parent().remove();
  sliderUpdate();
});

// $(document).on("click", ".title", function() {
//   console.log($('.website-list').prop('outerHTML'));
// });
// $(window).on("load", function(e) {
//   localStorage.setItem('website-list', $('.website-list').prop('outerHTML'));
// });
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
});
if (localStorage.getItem('website-list') !== null) {
  $('.website-list').replaceWith(localStorage.getItem('website-list'));
}
// SIX (FOUR SIGNIFICANT) LINES FOR OFFLINE STORAGE AND DEFAULTING, I LOVE YOU HTML5

function sliderUpdate() {
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

  sliderItems = $('.slider').children('.slider-link');
  var sliderLinks = []

$('.slider-link').each(function() {
  sliderLinks.push($(this).prop('outerHTML'));
});
console.log(sliderLinks);

var i = 0;

var sliderHeight = $('.slider').height();

while (sliderHeight < $(document).height()) {
  sliderHeight = $('.slider').height();
  console.log(sliderHeight);
  if (i >= sliderLinks.length) {
    i = 0;
  }
  $('.slider').append(sliderLinks[i]);
  i++;
}
k = 0
while (k < 14) {
  sliderHeight = $('.slider').height();
  console.log(sliderHeight);
  if (i >= sliderLinks.length) {
    i = 0;
  }
  $('.slider').append(sliderLinks[i]);
  i++;
  k++;
}
  sliderItems = $('.slider').children('.slider-link');

  hue = 310 / sliderItems.length;
  var j = 0
  sliderItems.each(function () {
    console.log($(this).attr('class'));
    $(this).addClass('hue-' + j);

    $('.hue-' + j).css('background', 'hsl(' + (hue * (j - 0.4)) + ', 80%, 60%)');
    j++;
  });
}
sliderUpdate()

var ul = document.querySelector('ul');
for (var i = ul.children.length; i >= 0; i--) {
    ul.appendChild(ul.children[Math.random() * i | 0]);
}
