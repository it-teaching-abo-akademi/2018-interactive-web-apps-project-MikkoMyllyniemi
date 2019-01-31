import React, { Component } from 'react';

class Stock extends Component{
    constructor(){
        super();


        this.state = {
            name: "",
            volume: 0,
            data: [],
            isLoaded: false,
            error: false,
            exchangerate: 1,
            total: 0,
            unittotal: 0
        }

        this.passTotal = this.passTotal.bind(this);
    }

    //Was a little unclear on which API I was supposed to use, but this works
    componentDidMount() {
        let temp = this.props.name;
        let prop = temp.split("-");
        let api = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+prop[0]+"&interval=5min&apikey=8PFPHDPBTTPVP3T6";

        fetch(api)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result,
                        name: prop[0],
                        volume: prop[1]
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                        name: prop[0],
                        volume: prop[1]
                    });
                }
            )

    }

    //A lifecycle method, checking whether or not the props exhange rate has changed
    componentDidUpdate(prevProps) {
        if (this.props.userID !== prevProps.userID) {
            this.fetchData(this.props.userID);

        }

        this.checkTotal();
        this.checkCurrency();

    }

    checkCurrency = () => {

        //Checking exchange rates
        if(this.props.exchangerate !== this.state.exchangerate){

            this.setState({
                exchangerate: this.props.exchangerate
            });

        }

    }

    
    //We check if the prices are up to date by comparing the current total to volumeprice

    checkTotal = () => {
        let d = new Date();
        let month= d.getMonth()+1;
        if(month.toString().length === 1){
            month = "0"+month;
        }

        let date = d.getDate();
        let day = d.getDay();

        if(day === 6 || day === 0){
            if(d.getDay() === 6){
                day = day - 1;
                date = date -1;
            }else{
                day = day + 1;
                date = date - 2
            }
        }


        let time = (d.getFullYear()+"-"+month+"-"+(date)+" 09:35:00");
        console.log(time + "rendertwice");
        let closeprice = parseFloat(this.state.data["Time Series (5min)"][time]["1. open"]).toFixed(2);
        let unitprice = Math.round((closeprice * this.state.exchangerate) * 100) / 100;
        let volumeprice = Math.round((unitprice * this.state.volume) * 100) / 100;

        //A minor headache, but completed following several tutorials


        if(this.state.total === 0){
            console.log("Immediately")
            this.passTotal(volumeprice);
        }

        if(this.state.total !== volumeprice){
            this.setState({
                unittotal: unitprice,
                total: volumeprice
            });
        }
    }

    

    passTotal(e) {
        this.props.getValue(e);
    }


    render(){
        if(!this.state.isLoaded){
            return(<div>Loading...</div>);
        }else{

            let d = new Date();
            let date = d.getDate();
            let day = d.getDay();

            if(day === 6 || day === 0){
                if(d.getDay() === 6){
                    day = day - 1;
                    date = date -1;
                }else{
                    day = day + 1;
                    date = date - 2
                }
            }

            let month= d.getMonth()+1;
            console.log(month.toString().length);

            if(month.toString().length === 1){
                month = "0"+month;

            }


            let time = (d.getFullYear()+"-"+month+"-"+((date)+" 09:35:00"));

            console.log(time + "render");
            console.log(this.state.data);
            let closeprice = parseFloat(this.state.data["Time Series (5min)"][time.toString()]["1. open"]).toFixed(2);

            let unitprice = Math.round((closeprice * this.state.exchangerate) * 100) / 100;
            let volumeprice =Math.round((unitprice * this.state.volume) * 100) / 100;


            return(
                <div id={"stockstable"}>


                    <table>
                        <tbody>
                        <tr>
                            <th>{this.state.name}</th>
                            <th>{this.state.volume}</th>
                            <th> {unitprice}</th>
                            <th> {volumeprice } </th>
                            <th><button onClick={this.props.delete}>X</button></th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            );
        }

    }
}

export default Stock;