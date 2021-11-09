import React, { Component } from 'react';
import socketService from '../services/socketService';
export default class About extends Component {
  state = {
    msg: { from: 'Me', txt: '' },
    msgs: [],
    topic: 'Love'
  };

  componentDidMount() {
    socketService.setup();
    socketService.emit('chat topic', this.state.topic);
    socketService.on('chat addMsg', this.addMsg);
  }

  componentWillUnmount() {
    socketService.off('chat addMsg', this.addMsg);
    socketService.terminate();
  }

  addMsg = newMsg => {
    this.setState(prevState => ({ msgs: [...prevState.msgs, newMsg] }));
  };

  changeTopic = () => {
    socketService.emit('chat topic', this.state.topic);
  };
  
  sendMsg = ev => {
    ev.preventDefault();
    socketService.emit('chat newMsg', this.state.msg.txt);
    this.setState({ msg: { from: 'Me', txt: '' } });
  };

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState({ [name]: value }, () => this.changeTopic(value));
  };

  msgHandleChange = ev => {
    const { name, value } = ev.target;
    this.setState(prevState => {
      return {
        msg: {
          ...prevState.msg,
          [name]: value
        }
      };
    });
  };

  render() {
    return (
      <div className="about">
        <h1>About Us</h1>
        <p>We like You</p>
        <h2>Lets Chat About {this.state.topic}</h2>
        <div>
          <label>
            <input
              type="radio"
              name="topic"
              value="Love"
              checked={this.state.topic === 'Love'}
              onChange={this.handleChange}
            />
            Love
          </label>
          <label>
            <input
              type="radio"
              name="topic"
              value="Politics"
              checked={this.state.topic === 'Politics'}
              onChange={this.handleChange}
            />
            Politics
          </label>
        </div>
        <form onSubmit={this.sendMsg}>
          <input
            type="text"
            value={this.state.msg.txt}
            onChange={this.msgHandleChange}
            name="txt"
          />
          <button>Send</button>
        </form>
        <ul>
          {this.state.msgs.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  }
}
