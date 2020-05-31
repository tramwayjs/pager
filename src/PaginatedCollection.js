import {Collection} from 'tramway-core-connection';

export default class PaginatedCollection extends Collection {
    static from(items = []) {
        let collection = new PaginatedCollection();
        items.forEach(item => collection.add(item));
        return collection;
    }

    getPage() {
        return this.page;
    }

    setPage(page) {
        this.page = page;
        return this;
    }

    getLimit() {
        return this.limit;
    }

    setLimit(limit) {
        this.limit = limit;
        return this;
    }

    getPages() {
        return this.pages;
    }

    setPages(pages) {
        this.pages = pages;
        return this;
    }

    getTotal() {
        return this.total;
    }

    setTotal(total) {
        this.total = total;
        return this;
    }
}