define(
    [
        'jquery',
        'backbone',
        'underscore',
        'js/events'
    ],
    function ($, Backbone, _, events) {

        var

        StickyScroll = function (options) {

            this.target = options.target || '.v-sticky';
            this.topPadding = options.topPadding || 0;
            this.bottomPadding = options.bottomPadding || 40;
            this.fixedOffsetTop = options.fixedOffsetTop || 0;

            // Should always be zero initially
            this.targetHeightOffset = 0;

            this.initialize();

            if (options.start !== false) {
                this.start();
            }
        };

        StickyScroll.prototype = {

            constructor: StickyScroll,

            initialize: function () {
                _.bindAll(this);

                this.$target = $(this.target);
                // this.calculateLimits();
            },

            start: function () {
                events.on("window:scroll", this.move);
            },

            stop: function () {
                events.off("window:scroll", this.move);
            },

            calculate: function () {
                var self = this;

                self.targetHeightOffset =  $(self.target).height() + self.bottomPadding;

                // Full height of the document that includes the scrollable height.
                this.documentHeight = $(document).height();

                // Height of the window / viewport
                this.windowHeight = $(window).height();

                // Height of the target element
                this.targetHeight = self.$target.height();

                // The limit at which the position of the target element should be changed to fixed.
                this.absoluteLimit = this.topPadding + this.fixedOffsetTop + this.targetHeight + this.bottomPadding - this.windowHeight;

                this.move({top: $('body').scrollTop()});
            },

            move: function (position) {
                var self = this,
                    $target = self.$target;

                // Handling the bounce animation in browsers.
                // For some reason the document height being set in the `calculate` method cannot be trusted. Goddamn monkey wrench!
                self.documentHeight = $(document).height();
                if (position.top + self.windowHeight > self.documentHeight) {
                    position.top = (self.documentHeight - self.windowHeight);
                }

                //console.log(position.top);
                if (this.absoluteLimit < 0) {
                    if (this.positionType !== 'fixed') {
                        this.positionType = 'fixed';
                        $target.css({
                            position: 'fixed',
                            top: (this.topPadding + this.fixedOffsetTop) + 'px',
                            left: 'auto'
                        });
                    }
                }
                else if (position.top > this.absoluteLimit) {
                    if (this.positionType !== 'fixed') {
                        this.positionType = 'fixed';
                        $target.css({
                            position: 'fixed',
                            top: (this.windowHeight - this.targetHeight) + 'px',
                            left: $target.offset().left + 'px'
                        });
                    }
                }
                else {
                    if (this.positionType !== 'absolute') {
                        this.positionType = 'absolute';
                        $target.css({
                            position: 'absolute',
                            top: this.topPadding + 'px',
                            left: 'auto'
                        });
                    }
                }
            }
        };

        return StickyScroll;
    }
);