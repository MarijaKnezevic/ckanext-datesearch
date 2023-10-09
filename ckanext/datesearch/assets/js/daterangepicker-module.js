this.ckan.module('daterangepicker-module', function($, _) {
    return {
        initialize: function(e) {
            $.proxyAll(this, /_on/);
            // Add hidden <input> tags #ext_startdate and #ext_enddate,
            // if they don't already exist.
            var form = $("#dataset-search-form");
            if ($("#ext_startdate").length === 0) {
                $('<input type="hidden" id="ext_startdate" name="ext_startdate" />').appendTo(form);
            }
            if ($("#ext_enddate").length === 0) {
                $('<input type="hidden" id="ext_enddate" name="ext_enddate" />').appendTo(form);
            }

            let url = new URL(window.location.href)
            let startDate = url.searchParams.get("ext_startdate") || null;
            let endDate = url.searchParams.get("ext_enddate") || null;

            // Define the options object
            var options = {
                ranges: {
                    'Today': [moment().startOf('day'), moment().endOf('day')],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                startDate: startDate === null ? moment().subtract(29, 'days'): moment(startDate),
                endDate: endDate === null ? moment() : moment(endDate),
                showDropdowns: true,
                timePicker: true
            };

            // Initialize the daterangepicker
            $('input[id="daterange"]').daterangepicker(options, function(start, end) {
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
