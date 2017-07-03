/**
 * Created by tarojiang on 2017/6/8.
 */
// let React = require('react');
// let ReactDOM = require('react-dom');

let jquery = require('jquery');

// document.getElementById('remove').onclick = (e) => {
//   ReactDOM.unmountComponentAtNode(document.getElementById("tick"));
// };
//
// let AppComponent = require('./components/productBox.js');
//
// ReactDOM.render(<AppComponent />, document.getElementById('content'));
//
// class Clock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       date: new Date(),
//       name: props.name
//     };
//   }
//
//   componentDidMount() {
//     this.timerID = setInterval(
//       () => this.tick(),
//       1000
//     );
//   }
//
//   componentWillUnmount() {
//     console.log('removed');
//     clearInterval(this.timerID);
//   }
//
//   tick() {
//     console.log('tick');
//     this.setState({
//       date: new Date()
//     });
//   }
//
//   render() {
//     return (
//       <div id="tick_wraper">
//         <h1>Hello, {this.state.name}!</h1>
//         <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
//       </div>
//     );
//   }
// }
//
// ReactDOM.render(
//   <Clock name="tarojiang"/>,
//   document.getElementById('tick')
// );
//
// class Toggle extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {isToggleOn: true};
//
//     // this.handleClick = this.handleClick.bind(this);
//   }
//
//   handleClick() {
//     console.log(this);
//     this.setState(preState => ({
//       isToggleOn: !preState.isToggleOn
//     }));
//   }
//
//   render() {
//     return (
//       <button onClick={this.handleClick.bind(this)}>
//         {this.state.isToggleOn ? 'ON' : 'OFF'}
//       </button>
//     );
//   }
// }
//
// ReactDOM.render(<Toggle/>, document.getElementById('root'));
//
// function WarningBanner(props) {
//   if (!props.warn) {
//     return null;
//   }
//
//   return (
//     <div className="warning">
//       Warning!
//     </div>
//   );
// }
//
// class Page extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {showWarning: true}
//     this.handleToggleClick = this.handleToggleClick.bind(this);
//   }
//
//   handleToggleClick() {
//     this.setState(prevState => ({
//       showWarning: !prevState.showWarning
//     }));
//   }
//
//   render() {
//     return (
//       <div>
//         <WarningBanner warn={this.state.showWarning} />
//         <button onClick={this.handleToggleClick}>
//           {this.state.showWarning ? 'Hide' : 'Show'}
//         </button>
//       </div>
//     );
//   }
// }
//
// ReactDOM.render(
//   <Page />,
//   document.getElementById('root')
// );
//
// const numbers = [1, 2, 3, 4, 5];
// const listItems = numbers.map((number, i) => <li key={number}>{number}</li>);
//
// ReactDOM.render(<ul>{listItems}</ul>, document.getElementById('root'));
//
// class NameForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {value: ''};
//
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//
//   handleChange(event) {
//     this.setState({value: event.target.value});
//   }
//
//   handleSubmit(event) {
//     alert('A name was submitted: ' + this.state.value);
//     event.preventDefault();
//   }
//
//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>
//           Name:
//           <input type="text" value={this.state.value} onChange={this.handleChange} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   }
// }
//
// ReactDOM.render(<NameForm />, document.getElementById('root'));