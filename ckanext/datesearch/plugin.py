import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

from ckan.lib.plugins import DefaultTranslation


class DateSearchPlugin(plugins.SingletonPlugin, DefaultTranslation):
    plugins.implements(plugins.ITranslation)
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IPackageController, inherit=True)

    # IConfigurer
    def update_config(self, config):
        toolkit.add_template_directory(config, "templates")
        toolkit.add_resource("assets", "datesearch")

    # IPackageController
    def before_search(self, search_params):
        return self.before_dataset_search(search_params)

    def before_dataset_search(self, search_params):
        extras = search_params.get("extras")
        if not extras:
            # There are no extras in the search params, so do nothing.
            return search_params
        start_date = extras.get("ext_startdate")
        end_date = extras.get("ext_enddate")
        if not start_date or not end_date:
            # The user didn't select a start and end date, so do nothing.
            return search_params

        # Add a date-range query with the selected start and end dates into the
        # Solr facet queries.
        fq = search_params["fq"]
        fq = (
            f"{fq} ((begin_collection_date:[* TO {end_date}] -end_collection_date:[* TO *]) OR "
            f"(-begin_collection_date:[* TO *] AND end_collection_date:[{start_date} TO *]) OR "
            f"(begin_collection_date:[* TO {end_date}] AND end_collection_date:[{start_date} TO *]))"
        )
        search_params["fq"] = fq
        return search_params
