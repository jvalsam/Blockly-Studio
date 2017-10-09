this.$el = $(
            $("<div>").append(this.$el.clone()).html() +
            $("<div>").append($elList.clone()).html()
        );