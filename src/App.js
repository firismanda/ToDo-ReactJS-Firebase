import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Header from './Header';
import Form from './Form';
import 'bootstrap/dist/css/bootstrap.css';
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import './App.css';
import uuidV1 from 'uuid/v1';
import _ from 'lodash';
import dummyData from '../data.json';
import base from './base';
import './polyfils/find';
import './polyfils/findIndex';

class App extends Component {
  constructor(){
    super();
    this.state = {
      items: {},
      tmpItem: '',
      filter: 'all'
    };
  }

  componentWillMount(){
		const loadDummyData = () => {
			if(_.isEmpty(this.state.items)){
				this.setState({items: dummyData})
			}
		}

    this.ref = base.syncState('/react-01/', {
      context: this,  
      state: 'items',
			then: loadDummyData
    });
   }

  updateTempItem = (e) => {
    e.preventDefault();
    
    this.setState({
      tmpItem: e.target.value
    });
  }

  updateList = (e) => {
    e.preventDefault();
    const tmpItem = this.state.tmpItem;

    const newItem = {
      id: uuidV1(),
      txt: tmpItem,
      isDone: false
    }

    tmpItem.length && this.setState({
      items: [newItem, ...this.state.items],
      tmpItem: ''
    })
  }

  deleteItem = (e) => {
    e.preventDefault();
    const removeIndex = this.state.items.findIndex(item => item.id === e.target.getAttribute('data-index'));
    
    this.setState({
      items: [
        ...this.state.items.slice(0, removeIndex),
        ...this.state.items.slice(removeIndex+1)
      ]
    })
  }

  toggleTodo = (id) => {
    const whichTodo = _.find(this.state.items, { 'id': id });
    const index = _.findIndex(this.state.items, { 'id': id });
    const edited = {...whichTodo, isDone : !whichTodo.isDone};
    
    this.setState({
      items: [
        ...this.state.items.slice(0, index),
        edited,
        ...this.state.items.slice(index+1)
      ]
    })
  }
  updateFilter = (e) => {
    e.preventDefault();
    const filter = e.target.innerHTML;
    this.setState({filter});
  }

  render() {
    const unfiltered = this.state.items;
    const filter = this.state.filter;

		function filtered (unfiltered, filter) {
      if (filter === "done") {
        return _.filter(unfiltered, o => o.isDone);
      } else if (filter === "in progress") {
        return _.filter(unfiltered, o => !o.isDone);
      } else if (filter === "all") {
        return unfiltered;
      }      
    }  

    const filterdList = filtered(unfiltered, filter);

    const list = (filterdList.length)
      ? filterdList.map((item, i) => 
        <li className="list-group-item clearfix" key={i}>
          <span className="abc-checkbox pull-left">
              <input id={item.id} className="" type="checkbox" onChange={() => this.toggleTodo(item.id)} checked={item.isDone}/> 
              <label htmlFor={item.id} ></label>
          </span>
          <span className={item.isDone ? "todo done" : "todo"}>&nbsp;{item.txt}&nbsp;</span> 
          <button className="btn btn-danger glyphicon glyphicon-remove delete pull-right" onClick={this.deleteItem} data-index={item.id}></button> 
        </li>
      )
      : (_.isEmpty(unfiltered)) 
				? <li>Loading ...  in nothing loads after max 10 sec - try to refresh the page ;)</li> 
				: <li>Category <em>{filter}</em> is empty</li>; 
    
    return (
		<div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <p className="App-intro">Add Todo:</p>
              <Form 
                onSubmit={this.updateList}
                onChange={this.updateTempItem}
                value={this.state.tmpItem}
              />
              
              <div className="btn-group">
                <a href="#" onClick={this.updateFilter} className={filter === "all" ? "btn btn-info active" : "btn btn-info"}>all</a>
                <a href="#" onClick={this.updateFilter} className={filter === "done" ? "btn btn-info active" : "btn btn-info"}>done</a>
                <a href="#" onClick={this.updateFilter} className={filter === "in progress" ? "btn btn-info active" : "btn btn-info"}>in progress</a>
                <a href="#" onClick={(e)=> e.preventDefault()} className="btn btn-default btn-fake">items: {filterdList.length}</a>
              </div>

              <ul className="list-group">
								<ReactCSSTransitionGroup
									transitionName="list-anim"
									transitionEnterTimeout={150}
									transitionLeaveTimeout={250}>

               	 { list }
									
								</ReactCSSTransitionGroup>
              </ul>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
