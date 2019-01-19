import React, {Component} from 'react'

class AddModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            type: "asset",
            account: "",
            detail: ""
        }
    }

    handleTypeChange = (event) => {
        this.setState({type: event.target.value});
    }

    handleAccountChange = (event) => {
        this.setState({account: event.target.value});
    }

    handleDetailChange = (event) => {
        this.setState({detail: event.target.value});
    }

    getComboBoxItems = (accounts) => {
        return accounts.map((account, i) => {
            return <option key={i}>{account}</option>
        })
    }

    doAdd = () => {
        this.props.handleAdd(this.state);
    }

    render = () => {
        const {
            show, accounts,
            handleAdd, handleClose 
        } = this.props
        const showHideClassName = show ? "modal display-block" : "modal display-none";

        return (            
            <div className={showHideClassName}>
                <div className="modal-main">
                    <div className="modal-input-container">
                        <div className="label-and-input">
                            <span>Type</span>
                            <select type="select" name="type" onChange={this.handleTypeChange}>
                                <option value="asset">Asset</option>
                                <option value="liability">Liability</option>
                            </select>
                        </div>
                        <div className="label-and-input">
                            <span>Account</span>
                            <input type="text" list="account-items" onChange={this.handleAccountChange}/>
                            <datalist id="account-items">
                                {this.getComboBoxItems(accounts)}
                            </datalist>                        
                        </div>
                        <div className="label-and-input">
                            <span>Detail</span>
                            <input type="text" onChange={this.handleDetailChange}/>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={this.doAdd}>Add</button>
                            <button onClick={handleClose}>Cancel</button>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default AddModal