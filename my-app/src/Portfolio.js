import React, { Component } from 'react';
import Stock from "./Stock";

class Portfolio extends Component{
    constructor(){
        super();

        this.state = {
            stocks: [],
            symbol: "",
            volume: "",
            exchangerate: 1,
            currency: "USD",
            total: 0

        }
    }

    //Here we handle click events.
    onClick = () => {
        let stockscopy = this.state.stocks.slice();
        let vol = parseInt(this.state.volume);

        if(vol !== null && vol > 0 && vol < 50){
            this.setState({
                volume: vol
            });
            stockscopy.push(this.state.symbol+"-"+this.state.volume+"-"+this.state.exchangerate);

        }else{
            this.setState({
                volume: 1
            });
            alert("Invalid Volume");

        }

        this.setState({
            stocks: stockscopy,
            symbol: "",
            volume: ""
        });
    }

    deleteStock = i => {
        let stockscopy = this.state.stocks.slice();
        stockscopy.splice(i, 1);

        this.setState({stocks: stockscopy});
    }

    //Changes the internal state symbol and volume on change. Reverts back to blank when the argument has been passed
    onSymbolChange = e => {
        this.setState({
            symbol: e.target.value
        });
    }

    //The value of the stock is calculated by calculating value and exchangerate. The initial value is in USD
    //Then when the currency reverts back to it's original value it is multiplied with 1. So it reverts to it's
    //Original value
    changeCurrencyUSD = () => {
        if(this.state.currency === "USD"){
        } else {
            this.setState({
                exchangerate: 1,
                currency: "USD"
            });
        }

    }

    //We get the exchange rate from USD to Euro from the API. And save the value
    changeCurrencyEuro = () => {
            let api = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=8PFPHDPBTTPVP3T6";
            fetch(api)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            exchangerate: result["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
                            currency: "EURO"
                        });
                    });

    }

    onVolumeChange = e => {
        this.setState({
            volume: e.target.value
        });
    }

        componentDidUpdate(prevProps){
            if (this.props.userID !== prevProps.userID) {
                this.fetchData(this.props.userID);

            }
        }


    //The Portfolio passes along a callback method for the child Stock so it can transfer back the initial value
    //of the stock. The method is called from within the child and this handler logs the value and sets the newtotal
    //to be the previous total plus the value from the callback. The Value is only received once.

    handlevalue (e) {
        let newTotal = this.state.total + e;
        this.setState({
            total: newTotal
        })
    }

    render(){


        let showstocks = this.state.stocks.map((e, i) =>{
            return(
                <Stock key={i} name={e} getValue={(x) => this.handlevalue(x)} total={this.state.total} exchangerate={this.state.exchangerate} delete={() => this.deleteStock(i)}/>
            );
        });
        return(
            <div id={"Portfolio"}>
                <div>
                    {this.props.name}
                    <button onClick={this.props.delete} id={"Xbutton"}>X</button>
                    <br/>
                    <button onClick={this.changeCurrencyEuro}>Show in Euro</button>
                    <button onClick={this.changeCurrencyUSD}>Show in USD</button>
                </div>


                <div id={"scrolltable"}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Symbol</th>
                                <th>Vol</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                    {showstocks}
                 </div>

                <br/>
                <div>
                    Total value of portfolio is:{this.state.total * this.state.exchangerate} {this.state.currency}
                </div>
                <br/>

                <div>
                    <input value={this.state.symbol} onChange={this.onSymbolChange} default={"NOK"} placeholder={"Symbol"}/>
                    <input value={this.state.volume} onChange={this.onVolumeChange} default={1} placeholder={"Volume"}/>
                    <button onClick={this.onClick}>Add stock</button>
                </div>

            </div>

        );

    }
}

export default Portfolio;