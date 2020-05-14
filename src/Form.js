import React, {Component} from 'react';

export default class Form extends Component {
	render(){
		const {onSubmit, onChange, value} = this.props;
		return (
			<form className="form" onSubmit={onSubmit}>
				<div className="input-group">
					<input className="form-control" 
						onChange={onChange} 
						value={value}
						placeholder="What needs to be done?"
					/>
					<div className="input-group-btn">
						<button className="btn btn-default" type="submit" disabled={!value.length}>submit</button>
					</div>
				</div>
			</form>
		)
	}
}