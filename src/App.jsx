import  { useState, useMemo, useEffect } from 'react';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState("NGN");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  
const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const currencies = Object.keys(rates);


 const convertRates = useMemo(()=>{
  return (amount / rates[fromCurrency])
}, [amount, fromCurrency, rates]);

useEffect(()=>{
    
  const fetchRates = async ()=>{
    try{
      const response = await fetch(`https://v6.exchangerate-api.com/v6/npm ${apiKey}/latest/USD`);
  if(!response.ok) throw new Error("Failed to fetch rates")
      
     const data = await response.json();
      setRates(data.conversion_rates)
    }catch(error){
      console.log("Something went wrong",error)
    }finally{
      setLoading(false)
    }
  }
  fetchRates()
},[])

  if(loading){
     return <div className="LoadingMsg">Loading live rates...</div>
  }else{
  return (
 
    <div className="converter-card ">
    <h1>Currency Converter</h1>
    <label>Enter amount to convert:</label> <input type="number" onChange={e=>setAmount(e.target.value)} value={amount} />

    <p>Start Currency</p>
    <select value={fromCurrency} onChange={e=> setFromCurrency(e.target.value)}>
 {currencies.map(currency => <option value={currency} key={currency}>{currency }</option>)}
    </select>

       <p>Target Currency</p>
    <select value={toCurrency} onChange={e=>setToCurrency(e.target.value)}>
  {currencies.map(currency => <option value={currency} key={currency}>{currency }</option>)}
    </select>
    <p className="result-display">Converted Amount:<span className="amount">{ Number((convertRates * rates[toCurrency])).toLocaleString(
      undefined,{ minimumFractionDigits: 2,
      maximumFractionDigits: 2})}</span>
         <span className="curr"> {toCurrency}</span></p>
    </div>
  )
  }

}