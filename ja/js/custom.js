(function ($) {

  "use strict";

    var LANGUAGE_STORAGE_KEY = 'preferredLanguage';
    var COLOR_MODE_STORAGE_KEY = 'preferredColorMode';

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

    function getStoredColorMode() {
      try {
        return window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    }

    function storeColorMode(colorMode) {
      try {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
      } catch (error) {
        // Ignore storage failures so the rest of the page still works.
      }
    }

    function isJapanesePath(pathname) {
      return /(?:^|\/)ja(?:\/|$)/.test(pathname || '');
    }

    function removeJapaneseSegment(pathname) {
      var currentPath = pathname || '/';

      if (currentPath === '/' || currentPath === '') {
        return '/index.html';
      }

      if (/(?:^|\/)ja\/?$/.test(currentPath)) {
        return currentPath.replace(/\/?ja\/?$/, '/index.html');
      }

      return currentPath.replace('/ja/', '/');
    }

    function addJapaneseSegment(pathname) {
      var currentPath = pathname || '/';
      var lastSlashIndex;
      var directoryPath;
      var fileName;

      if (currentPath === '/' || currentPath === '') {
        return '/ja/index.html';
      }

      if (isJapanesePath(currentPath)) {
        return currentPath;
      }

      lastSlashIndex = currentPath.lastIndexOf('/');
      directoryPath = currentPath.slice(0, lastSlashIndex);
      fileName = currentPath.slice(lastSlashIndex + 1) || 'index.html';

      if (!directoryPath) {
        return '/ja/' + fileName;
      }

      return directoryPath + '/ja/' + fileName;
    }

    function getLanguageTargetPath(language) {
      if (language === 'ja') {
        return addJapaneseSegment(window.location.pathname);
      }

      return removeJapaneseSegment(window.location.pathname);
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

    function applyStoredColorMode() {
      var storedColorMode = getStoredColorMode();
      var isDarkMode = storedColorMode === 'dark';

      $('body').toggleClass('dark-mode', isDarkMode);
      $('.color-mode-icon').toggleClass('active', isDarkMode);
    }

    function bindLanguageSelector() {
      $('.dropdown-item').each(function () {
        var href = $(this).attr('href') || '';
        var link = document.createElement('a');
        var resolvedPath;

        link.href = href;
        resolvedPath = (link.pathname || href).toLowerCase();

        if (isJapanesePath(resolvedPath)) {
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
    applyStoredColorMode();
    bindLanguageSelector();

    // COLOR MODE
    $('.color-mode').click(function(){
        $('.color-mode-icon').toggleClass('active')
        $('body').toggleClass('dark-mode')
        storeColorMode($('body').hasClass('dark-mode') ? 'dark' : 'light');
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
