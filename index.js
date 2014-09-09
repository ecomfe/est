$(function() {

    // prepare
    var $body = $(document.body);
    var $header = $('body > header');

    var isMouseOn = false;

    // header switch
    $header.on('mouseenter', function() {
        $body.removeClass('mini-header');
        isMouseOn = true;
    }).on('mouseleave', function() {
        if (window.scrollY > 0) {
            $body.addClass('mini-header');
        }
        isMouseOn = false;
    });

    $(window).on('scroll', function() {
        $body.toggleClass('mini-header', !isMouseOn && window.scrollY > 0);
    });

    // highlight nav while scrolling
    $('.module, .overview').waypoint(function(direction) {
        var name = $(this).hasClass('overview') ? 'top' : $(this).find('a[name]').eq(0).attr('name');
        var $links = $('header nav a[href="#' + name + '"]');
        $links.toggleClass('active', direction === 'down');
    }, {
        offset: '100%'
    }).waypoint(function(direction) {
        var name = $(this).hasClass('overview') ? 'top' : $(this).find('a[name]').eq(0).attr('name');
        var $links = $('header nav a[href="#' + name + '"]');
        $links.toggleClass('active', direction === 'up');
    }, {
        offset: function() {
            return -$(this).height() + 80;
        }
    });

    // highlight code
    $('pre[lang]').addClass('prettyprint');
    prettyPrint();

    // search
    var haystack = [];
    function wrapKey(me, type) {
        return {
            key: $(me).attr('name'),
            type: type,
            desc: $(me).parent().next().html().replace(/<a .*?>(.+?)<\/a>/g, '$1') || ''
        }
    }
    $('.mixins h2 > a[name]').each(function() {
        haystack.push(wrapKey(this, 'mixin'));
    });
    var variables = [];
    $('.variables h2 > a[name]').each(function() {
        haystack.push(wrapKey(this, 'variable'));
    });

    var $searchResult = $('#search-result');
    var $searchKey = $('#search-key');
    function formatItem(item) {
        return item.type === 'mixin'
            ? ('.' + item.key + '()')
            : ('@' + item.key);
    }
    function updateSearch() {
        $searchResult.html(
            '<li>'
            + $.map(spotlight.search($searchKey.val(), haystack, {
                limit: 12,
                mapper: function(item) {
                    return item.key;
                }
            }), function(item) {
                return [
                    '<a href="#' + item.key + '">',
                        '<code class="key ' + item.type + '">' + formatItem(item) + '</code>',
                        '<p>' + item.desc + '</p>',
                    '</a>'
                ].join('');
            }).join('</li><li>')
            + '</li>'
        )
    }
    updateSearch();
    $searchKey.on('input', updateSearch);

    var $spotlight = $('.spotlight');

    function toggleSpotlight(isExpand) {
        var isCollapse;
        if (typeof isExpand === 'boolean') {
            isCollapse = !isExpand;
        }
        $spotlight.toggleClass('collapsed', isCollapse);
    }

    $(window).on('keydown', function(e) {
        if (e.which === 114 || (e.ctrlKey || e.metaKey) && e.which === 70) {
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
        }
    });
});
