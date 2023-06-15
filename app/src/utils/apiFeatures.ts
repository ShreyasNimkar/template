import { Query } from 'mongoose';

interface QueryString {
    [key: string]: string | number | undefined;
    search?: string;
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
}

class APIFeatures<T> {
    query: Query<T[], T>;
    queryStr: QueryString;

    constructor(query: Query<T[], T>, queryStr: QueryString) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const search = this.queryStr.search
            ? {
                  $or: [],
              }
            : {};
        this.query = this.query.find(search);
        return this;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        const exlcudeFields = ['page', 'sort', 'limit', 'fields'];
        exlcudeFields.forEach((item) => delete queryObj[item]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.replace(',', ' ');
            this.query = this.query.sort(sortBy);
        } else this.query = this.query.sort('createdAt');

        return this;
    }

    fields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.replace(',', ' ');
            this.query = this.query.select(fields);
        } else this.query = this.query.select('-__v');

        return this;
    }

    paginator() {
        const page = (this.queryStr.page ?? 1) as number;
        const limit = (this.queryStr.limit ?? 10) as number;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default APIFeatures;
