import { NextRequest, NextResponse } from 'next/server';
import { erf } from 'mathjs';

function normCDF(x : number) {
  return (1.0 + erf(x / Math.sqrt(2.0))) / 2.0;
}

function blackScholes({strike, current, days, rate, volatility} : { strike: number; current: number; days: number; rate: number; volatility: number; }) {
  const T = days / 365;
  const d1 = (Math.log(current / strike) + (rate + 0.5 * Math.pow(volatility, 2)) * T) / (volatility * Math.sqrt(T));
  const d2 = d1 - volatility * Math.sqrt(T);

  const callPrice = current * normCDF(d1) - strike * Math.exp(-rate * T) * normCDF(d2);
  const putPrice = strike * Math.exp(-rate * T) * normCDF(-d2) - current * normCDF(-d1);

  return [callPrice, putPrice];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { expiration, rate, strike, ticker, volatility } = body;

  const stockInfo = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`);
  const stockData = await stockInfo.json();

  if (stockData.resultsCount === 0) {
    return new NextResponse("Ticker not found", { status: 404 });
  }

  const days = Math.round((new Date(expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const prices = blackScholes({
    strike: parseFloat(strike),
    current: stockData.results[0].c,
    days: days,
    rate: parseFloat(rate),
    volatility: parseFloat(volatility),
  });

  return NextResponse.json(prices);
}