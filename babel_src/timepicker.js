Date.prototype.addDay = function () {
    this.setDate(this.getDate() + 1);
    return this.getTime();
}

Date.prototype.minusDay = function () {
    this.setDate(this.getDate() - 1);
    return this.getTime();
}

Date.prototype.addMonth = function () {
    this.setMonth(this.getMonth() + 1);
    return this.getTime();
}

Date.prototype.minusMonth = function () {
    this.setMonth(this.getMonth() - 1);
    return this.getTime();
}

Date.prototype.addFullYear = function () {
    this.setFullYear(this.getFullYear() + 1);
    return this.getTime();
}

Date.prototype.minusFullYear = function () {
    this.setFullYear(this.getFullYear() - 1);
    return this.getTime();
}


function SinglePicker(props) {
    return ( 
        <div>
            <button onClick={props.previousHandler}>{props.previousIcon || '<'}</button>
            <label>{props.value}</label>
            <button onClick={props.nextHandler}>{props.nextIcon || '>'}</button>
        </div>
    );
}


class TimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: props.defaultDate};
        
        this.previousYear = this.previousYear.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.previousDay = this.previousDay.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.nextDay = this.nextDay.bind(this);
    }
    
    previousYear() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.minusFullYear();
            props.setDate(date);
            return {date: date};
        });
    }
    
    previousMonth() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.minusMonth();
            props.setDate(date);
            return {date: date};
        });
    }
    
    previousDay() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.minusDay();
            props.setDate(date);
            return {date: date};
        });
    }
    
    nextYear() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.addFullYear();
            props.setDate(date);
            return {date: date};
        });
    }
    
    nextMonth() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.addMonth();
            props.setDate(date);
            return {date: date};
        });
    }
    
    nextDay() {
        this.setState((state, props) => {
            const date = new Date(state.date.getTime());
            date.addDay();
            props.setDate(date);
            return {date: date};
        });
    }
    
    render() {
        return (
            <div>
                <SinglePicker value={this.state.date.getFullYear()} previousHandler={this.previousYear} nextHandler={this.nextYear}/>
                <SinglePicker value={this.state.date.getMonth()+1} previousHandler={this.previousMonth} nextHandler={this.nextMonth}/>
                <SinglePicker value={this.state.date.getDate()} previousHandler={this.previousDay} nextHandler={this.nextDay}/>
            </div>
        )
    }
}
