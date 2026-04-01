(function ($) {

  "use strict";

    var LANGUAGE_STORAGE_KEY = 'preferredLanguage';

    function getStoredLanguage() {
      try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    }

    function storeLanguage(language) {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch (error) {
        // Ignore storage failures so the rest of the page still works.
      }
    }

    function isJapanesePath(pathname) {
      return pathname === '/ja' || pathname.indexOf('/ja/') === 0;
    }

    function getNormalizedPath(pathname) {
      if (!pathname || pathname === '/') {
        return '/index.html';
      }

      if (pathname === '/ja' || pathname === '/ja/') {
        return '/index.html';
      }

      if (pathname.indexOf('/ja/') === 0) {
        return pathname.replace('/ja/', '/');
      }

      return pathname;
    }

    function getLanguageTargetPath(language) {
      var normalizedPath = getNormalizedPath(window.location.pathname);

      if (language === 'ja') {
        return '/ja' + normalizedPath;
      }

      return normalizedPath;
    }

    function applyStoredLanguage() {
      var storedLanguage = getStoredLanguage();

      if (storedLanguage !== 'ja' && storedLanguage !== 'en') {
        return;
      }

      var currentLanguage = isJapanesePath(window.location.pathname) ? 'ja' : 'en';
      if (storedLanguage === currentLanguage) {
        return;
      }

      var targetPath = getLanguageTargetPath(storedLanguage);
      var targetUrl = targetPath + window.location.search + window.location.hash;
      var currentUrl = window.location.pathname + window.location.search + window.location.hash;

      if (targetUrl !== currentUrl) {
        window.location.replace(targetUrl);
      }
    }

    function bindLanguageSelector() {
      $('.dropdown-item').each(function () {
        var href = ($(this).attr('href') || '').toLowerCase();

        if (href.indexOf('ja/') !== -1 || href === 'ja' || href === 'ja/index.html') {
          $(this).attr('data-language', 'ja');
        } else if (href) {
          $(this).attr('data-language', 'en');
        }
      });

      $('[data-language]').on('click', function () {
        storeLanguage($(this).attr('data-language'));
      });
    }

    applyStoredLanguage();
    bindLanguageSelector();

    // COLOR MODE
    $('.color-mode').click(function(){
        $('.color-mode-icon').toggleClass('active')
        $('body').toggleClass('dark-mode')
    })

    // HEADER
    $(".navbar").headroom();

    // PROJECT CAROUSEL
    $('.owl-carousel').owlCarousel({
    	items: 1,
	    loop:true,
	    margin:10,
	    nav:true
	});

    // SMOOTHSCROLL
    $(function() {
      $('.nav-link, .custom-btn-link').on('click', function(event) {
        var href = $(this).attr('href');
        if (!href || href.charAt(0) !== '#') {
          return;
        }

        var $target = $(href);
        if ($target.length === 0) {
          return;
        }

        $('html, body').stop().animate({
          scrollTop: $target.offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });

    // TOOLTIP
    $('.social-links a').tooltip();

})(jQuery);
