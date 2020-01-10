import { FetchPriceQuery, SelectSymbol } from './price-query.actions';
import { Store, select } from '@ngrx/store';
import { filter, map, skip } from 'rxjs/operators';
import { getAllPriceQueries, getSelectedSymbol } from './price-query.selectors';

import { Injectable } from '@angular/core';
import { PriceQueryPartialState } from './price-query.reducer';

@Injectable()
export class PriceQueryFacade {
  fromDate: Date;
  toDate: Date;

  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
      .filter((priceQuery: any) => {
        if (this.fromDate && this.toDate) {
          return this.fromDate.getTime() <= priceQuery[0] && this.toDate.getTime() >= priceQuery[0];
        } else {
          return true;
        }
      })

    )
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, period: string, fromDate: Date = null, toDate: Date = null) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.dispatch(new FetchPriceQuery(symbol, period));
    this.store.dispatch(new SelectSymbol(symbol));
  }

}
