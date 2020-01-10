import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  currentDay = new Date();
  selectedVal: string;
  selectedSymbol$ = this.priceQuery.selectedSymbol$;

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      refreshInterval: '',
      fromDate: new Date(),
      toDate: new Date()
    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      if (symbol && period) {
        this.priceQuery.fetchQuote(symbol, period);
      }
    }
  }

  selectTimePeriod(timePeriod) {
    this.selectedVal = timePeriod.value;
    this.stockPickerForm.patchValue({ period: this.selectedVal, fromDate: null, toDate: null });
    this.fetchQuote();
  }

  triggerDateChange () {
      const { fromDate, toDate } = this.stockPickerForm.value;
      const symbol = this.stockPickerForm.get('symbol').value;
      if (fromDate && toDate) {
        if (symbol && fromDate.getTime() <= toDate.getTime()) {
          let period = this.timePeriods[0].value;
          this.selectedVal = '';
          this.priceQuery.fetchQuote(symbol, period, fromDate, toDate);
        }
      }
  }

}
