import PaginatedCollection from "./PaginatedCollection";

export default class Pager {
    page = 1;
    pageSize = 10;

    constructor(collection, options = {}) {
        this.collection = collection;
        this.pageSize = options.pageSize || this.pageSize;
    }

    setPageSize(pageSize) {
        this.pageSize = parseInt(pageSize);
        return this;
    }

    setCurrentPage(page) {
        this.page = parseInt(page);
        return this;
    }

    getTotal() {
        return Math.ceil(this.collection.getSize() / this.pageSize);
    }

    getItems() {
        const offset = (this.page - 1) * this.pageSize;
        const indexes = this.collection.getIds();
        let range = indexes.slice(offset, offset + this.pageSize).filter(i => i).map(id => this.collection.get(id));
        let collection = PaginatedCollection.from(range);
        return collection
            .setPage(this.page)
            .setLimit(this.pageSize)
            .setPages(this.getTotal())
            .setTotal(this.collection.getSize())
        ;
    }

    getPreviousPage() {
        if (!this.hasPreviousPage()) {
            return;
        }

        return this.page - 1;
    }

    getNextPage() {
        if (!this.hasNextPage()) {
            return;
        }

        return this.page + 1;
    }

    hasNextPage() {
        return this.getTotal() === this.page;
    }

    hasPreviousPage() {
        return 1 !== this.page
    }
}