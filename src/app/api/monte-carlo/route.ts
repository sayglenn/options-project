import { NextRequest, NextResponse } from 'next/server';

function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function monteCarlo({strike, current, days, rate, volatility, simulations} : { strike: number; current: number; days: number; rate: number; volatility: number; simulations: number; }) {
    const T = days / 365;
    let callSumPayoff = 0;
    let putSumPayoff = 0;
    for (let i = 0; i < simulations; i++) {
        const Z = randn_bm();
        let ST = current * Math.exp((rate - 0.5 * volatility ** 2) * T + volatility * Math.sqrt(T) * Z);
        callSumPayoff += Math.max(ST - strike, 0);
        putSumPayoff += Math.max(strike - ST, 0);
    }

    let callOptionPrice = Math.exp(-rate * T) * (callSumPayoff / simulations);
    let putOptionPrice = Math.exp(-rate * T) * (putSumPayoff / simulations);
    return [callOptionPrice, putOptionPrice];
  }

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { expiration, rate, strike, ticker, volatility, simulations } = body;
  
    const stockInfo = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`);
    const stockData = await stockInfo.json();
  
    if (stockData.resultsCount === 0) {
      return new NextResponse("Ticker not found", { status: 404 });
    }
  
    const days = Math.round((new Date(expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const prices = monteCarlo({
      strike: parseFloat(strike),
      current: stockData.results[0].c,
      days: days,
      rate: parseFloat(rate),
      volatility: parseFloat(volatility),
      simulations: parseInt(simulations),
    });
  
    return NextResponse.json(prices);
  }