type MarketProvider = 'polygon' | 'finnhub';

export interface MarketQuote {
  symbol: string;
  price: number;
  changePercent: number | null;
  updatedAt: string;
}

function getProvider(): MarketProvider {
  const provider =
    (process.env.MARKET_DATA_PROVIDER as MarketProvider | undefined) ?? 'polygon';

  if (provider !== 'polygon' && provider !== 'finnhub') {
    return 'polygon';
  }

  return provider;
}

export async function fetchQuote(symbol: string): Promise<MarketQuote | null> {
  const provider = getProvider();

  if (provider === 'polygon') {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) return null;

    const url = new URL(
      `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/prev`
    );
    url.searchParams.set('adjusted', 'true');
    url.searchParams.set('apiKey', apiKey);

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.warn('[market-data] Polygon request failed', res.statusText);
      return null;
    }

    const json = (await res.json()) as {
      results?: Array<{ c: number; o: number; t: number }>;
    };

    const result = json.results?.[0];
    if (!result) return null;

    const change = result.o ? ((result.c - result.o) / result.o) * 100 : null;

    return {
      symbol: symbol.toUpperCase(),
      price: result.c,
      changePercent: change,
      updatedAt: new Date(result.t).toISOString(),
    };
  }

  if (provider === 'finnhub') {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return null;

    const url = new URL('https://finnhub.io/api/v1/quote');
    url.searchParams.set('symbol', symbol.toUpperCase());
    url.searchParams.set('token', apiKey);

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.warn('[market-data] Finnhub request failed', res.statusText);
      return null;
    }

    const json = (await res.json()) as {
      c: number;
      pc: number;
    };

    const change =
      json.pc && json.pc !== 0 ? ((json.c - json.pc) / json.pc) * 100 : null;

    return {
      symbol: symbol.toUpperCase(),
      price: json.c,
      changePercent: change,
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}

export async function fetchQuotes(symbols: string[]) {
  const results = await Promise.all(symbols.map((symbol) => fetchQuote(symbol)));
  return results.filter((quote): quote is MarketQuote => Boolean(quote));
}
