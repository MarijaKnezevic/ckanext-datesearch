this.ckan.module('daterangepicker-module', function($, _) {
    return {
        initialize: function() {

            // Add hidden <input> tags #ext_startdate and #ext_enddate,
            // if they don't already exist.
            var form = $("#dataset-search-form");
            if ($("#ext_startdate").length === 0) {
                $('<input type="hidden" id="ext_startdate" name="ext_startdate" />').appendTo(form);
            }
            if ($("#ext_enddate").length === 0) {
                $('<input type="hidden" id="ext_enddate" name="ext_enddate" />').appendTo(form);
            }

            const filterBy = {
                'today': this._('Today'),
                'yesterday': this._('Yesterday'),
                'last7': this._('Last 7 Days'),
                'last30': this._('Last 30 Days'),
                'thisMonth': this._('This Month'),
                'lastMonth': this._('Last Month')
              };

            // Add a date-range picker widget to the <input> with id #daterange
            $('input[id="daterange"]').daterangepicker({
                ranges: {
                   [filterBy.today]: [moment().startOf('day'), moment().endOf('day')],
                   [filterBy.yesterday]: [moment().subtract('days', 1), moment().subtract('days', 1)],
                   [filterBy.last7]: [moment().subtract('days', 6), moment()],
                   [filterBy.last30]: [moment().subtract('days', 29), moment()],
                   [filterBy.thisMonth]: [moment().startOf('month'), moment().endOf('month')],
                   [filterBy.lastMonth]: [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment(),
                showDropdowns: true,
                timePicker: true
            },
            function(start, end) {

                // Bootstrap-daterangepicker calls this function after the user
                // picks a start and end date.

                // Format the start and end dates into strings in a date format
                // that Solr understands.
                start = start.format('YYYY-MM-DDTHH:mm:ss') + 'Z';
                end = end.format('YYYY-MM-DDTHH:mm:ss') + 'Z';

                // Set the value of the hidden <input id="ext_startdate"> to
                // the chosen start date.
                $('#ext_startdate').val(start);

                // Set the value of the hidden <input id="ext_enddate"> to
                // the chosen end date.
                $('#ext_enddate').val(end);

                // Submit the <form id="dataset-search">.
                $("#dataset-search-form").submit();
            });
        }
    }
});
