/*
 * jQuery appear plugin
 * Simple plugin to detect when elements appear in viewport
 */
(function($) {
    $.fn.appear = function(fn, options) {
        var settings = $.extend({
            data: undefined,
            one: true,
            accX: 0,
            accY: 0
        }, options);

        return this.each(function() {
            var t = $(this);
            
            t.appeared = false;

            if (!fn) {
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);
            
            var check = function() {
                if (!t.is(':visible')) {
                    t.appeared = false;
                    return;
                }

                var a = w.scrollTop();
                var b = a + w.height();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= a && y <= b + ay && x + tw + ax >= 0 && x <= ww + ax) {
                    if (!t.appeared) t.trigger('appear', settings.data);
                } else {
                    t.appeared = false;
                }
            };

            var modifiedFn = function() {
                t.appeared = true;
                if (settings.one) {
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }
                fn.apply(this, arguments);
            };

            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);

            w.scroll(check);
            $.fn.appear.checks.push(check);
            (check)();
        });
    };

    $.extend($.fn.appear, {
        checks: [],
        timeout: null,
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0) while (length--) ($.fn.appear.checks[length])();
        },
        run: function() {
            $.fn.appear.timeout = setInterval($.fn.appear.checkAll, 20);
        }
    });

    $.fn.appear.run();
})(jQuery);
