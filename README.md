Tramway Pager is a simple pager to handle pagination in the Tramway framework. It includes:

1. A Pager class
2. A PaginatedCollection

> Disclaimer: This library will include Paging-based parameters to include with queries sent via the Provider but it does not at this time. The Pager will only take the results returned as a `Collection` from the `Repository` via the `Service` and slice the part that needs to be returned with a request.

# Installation:
1. `npm install @tramwayjs/pager`

# Pager

The `Pager` facilitates the process of taking a full collection and breaking it to a suitable `PaginatedCollection` to be used with the paginated formatter that is included in the `tramway-formatter-hateaos` library.

In order to use it, the corresponding Controller method that handles the collection you want to paginate needs to be overridden such to add the pager after the service has returned a collection. Some new query options should also be added to handle the dynamic input of `page` and `limit` values.

```javascript
async get(req, res) {
    let items;
    const {page, limit, ...conditions} = req.query || {};

    try {
        items = await this.service.get(conditions);
    } catch (e) {
        this.logger.error(e.stack);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!items) {
        this.logger.info(`${this.constructor.name} - No items found`);
        return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    let pager = new Pager(items)
        .setPageSize(limit)
        .setCurrentPage(page)
    ;

    return this.sendCollection(res, pager.getItems(), {links: this.getLinks('get')});
}
```

Instead of passing the `items` directly to the `sendCollection` call, we create a new `Pager`, set the corresponding parameters and pass the `PaginatedCollection` returned by `pager.getItems()`.

In the services configuration for the controller (found in `src/config/services/controllers.js`), replace the default HATEAOSFormatter with the paginated variant by changing the service declaration to `{"type": "service", "key": "hateoas.service.formatter:paginated"}`. This declaration will work if you have [installed `tramway-formatter-hateaos` version 0.5.0](https://github.com/tramwayjs/formatter-hateoas#getting-started) or newer.

The `Pager` exposes the following methods to be used.

| Function | Type | Usage |
| --- | --- | --- |
| ```setPageSize(pageSize: number)``` | instance | Sets the limit or pageSize to use when paging the collection |
| ```setCurrentPage(page: number)``` | instance | Sets the current page number that is desired for the collection |
| ```getTotal(): number``` | instance | The total number of pages required to get all the paginated content |
| ```getItems(): PaginatedCollection``` | instance | A paginated collection with only the items for the specific page |
| ```getPreviousPage(): number``` | instance | The page number of the previous page |
| ```getNextPage(): number``` | instance | The page number of the next page |
| ```hasNextPage(): boolean``` | instance | Whether there is a next page to iterate |
| ```hasPreviousPage(): boolean``` | instance | Whether there is a previous page to iterate |

# PaginatedCollection

The `PaginatedCollection` extends the base [`Collection`](https://github.com/tramwayjs/connection#collection) class from `traamway-core-connection` and adds additional methods to facilitate pagination with the paginated formatter that is included in the `tramway-formatter-hateaos` library.

| Function | Type | Usage |
| --- | --- | --- |
| ```from(entities: Entity[]): PaginatedCollection``` | static | Creates a collection from an array of entities. ```let collection = PaginatedCollection.from(entities)``` |
| ```getPage(): number``` | instance | The current page number of the collection |
| ```getLimit(): number``` | instance | The total number of items that can be in the collection |
| ```getPages(): number``` | instance | The total number of pages required to get all the paginated content |
| ```getTotal(): number``` | instance | The total number of items that have been paginated |

To create an collection, extend the class.

```javascript
import { PaginatedCollection } from '@tramwayjs/pager';
```