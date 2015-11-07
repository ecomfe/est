$(function () {

    // load projects content
    $.get('http://ecomfe.github.io/efe-meta/html/full-intro.html').then(function (html) {
        $('.links').eq(0).append(html);
    });

    // highlight nav while scrolling
    $('.module, .overview').waypoint(function (direction) {
        var name = $(this).hasClass('overview') ? 'top' : $(this).find('a[name]').eq(0).attr('name');
        var $links = $('.nav a[href="#' + name + '"]');
        $links.toggleClass('active', direction === 'down');
    }, {
        offset: '100%'
    }).waypoint(function (direction) {
        var name = $(this).hasClass('overview') ? 'top' : $(this).find('a[name]').eq(0).attr('name');
        var $links = $('.nav a[href="#' + name + '"]');
        $links.toggleClass('active', direction === 'up');
    }, {
        offset: function () {
            return -$(this).height() + 80;
        }
    });

    $.getJSON('https://api.github.com/repos/ecomfe/est/releases').done(function (json) {
        var release = json[0];
        var zipURL = release.zipball_url;
        var tarURL = release.tarball_url;
        $('.download-zip').attr('href', zipURL);
        $('.download-tar').attr('href', tarURL);
        $('.version').text((release.tag_name.charAt(0) === 'v' ? '' : 'v') + release.tag_name);
    });

    // code highlight
    hljs.initHighlightingOnLoad();

    // search
    var haystack = [];
    function wrapKey(me, type) {
        var $me = $(me);
        return {
            key: $me.attr('name'),
            type: type,
            desc: $me.parent().nextAll('.desc').eq(0).html().replace(/<a .*?>(.+?)<\/a>/g, '$1') || ''
        };
    }
    function stripTags(html) {
        return html.replace(/<[^>]+>/g, '');
    }

    $('.mixins h2 > a[name]').each(function () {
        haystack.push(wrapKey(this, 'mixin'));
    });
    $('.variables h2 > a[name]').each(function () {
        haystack.push(wrapKey(this, 'variable'));
    });

    var $searchResult = $('#search-result');
    var $searchKey = $('#search-key');
    var $listBtn = $('#list-all');
    function formatItem(item) {
        return item.type === 'mixin'
            ? ('.' + item.key + '()')
            : ('@' + item.key);
    }
    function updateSearch(isAll) {
        $searchResult.html(
            '<li>'
            + $.map(spotlight.search($searchKey.val(), haystack, {
                limit: isAll ? 0 : 12,
                mapper: function (item) {
                    return item.key;
                }
            }),
            function (item) {
                return [
                    '<a href="#' + item.key + '" title="' + stripTags(item.desc) + '">',
                        '<code class="key ' + item.type + '">' + formatItem(item) + '</code>',
                        '<p>' + item.desc + '</p>',
                    '</a>'
                ].join('');
            }).join('</li><li>')
            + '</li>'
        )
    }
    updateSearch();
    $searchKey.on('input', function () {
        updateSearch();
    });
    $listBtn.on('click', function () {
        updateSearch(true);
        $spotlight.removeClass('collapsed');
        $spotlight.addClass('fullscreen');
    });

    var $spotlight = $('.spotlight');

    function toggleSpotlight(isExpand) {
        var isCollapse;
        if (typeof isExpand === 'boolean') {
            isCollapse = !isExpand;
        }
        $spotlight[0].scrollTop = 0;
        $spotlight.toggleClass('collapsed', isCollapse);
        $spotlight.removeClass('fullscreen');
    }

    $(window).on('keydown', function (e) {
        if (e.which === 191) {
            $searchKey.focus();
            e.preventDefault();
        } else if (e.which === 27) {
            toggleSpotlight(false);
        }
    });

    $searchKey.on('focus', function () {
        toggleSpotlight(true);
    });

    $(document.body).on('click', function (e) {
        if (!$.contains($spotlight[0], e.target)) {
            toggleSpotlight(false);
        } else if ($(e.target).is('a[href^="#"], a[href^="#"] *')) {
            toggleSpotlight(true);
        }
        return true;
    });
    // .on('click', 'a[href*=#]:not([href=#])', function () {
    //     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    //         var target = $(this.hash);
    //         target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    //         if (target.length) {
    //             $('html, body').animate({
    //                 scrollTop: target.offset().top
    //             }, 1000);
    //             return true;
    //         }
    //     }
    // });
});
