import React from 'react';
import axios from 'axios';
import Table from './PeopleTable';
import CreatePersonForm from './CreatePersonForm.js'

const url = "https://localhost:44350/react";

export default class People extends React.Component {
    state = {
        showCreateForm: false,
        people: [
            
        ],
    };
    componentDidMount(){
        axios.get(`${url}/people`)
        .then(r => {
            this.setState({ people: r.data.people });
        })
        .catch(e => {
            console.log(e)
        });
    }
    addNewPerson = (person) => {

        let json = JSON.stringify(person)

        axios.post(`${url}/people`, json,
        { headers: {
            'Content-Type': 'application/json'
            } 
        }
        )
        .then(r => {
            this.setState(oldState => ({ people: [...oldState.people, r.data]}))
        })
        .then(() => {
            this.setState({showCreateForm: false})
        })
        .catch(e => {
            console.log(e)
        });
      
    }
    removePerson = (person) => {
        axios.delete(`${url}/people/${person.id}`)
        .then(r => {
            if(r.status === 200){
                this.setState(oldState => ({ people: oldState.people.filter(p => p.id !== person.id)}))
            }
        })
        .catch(e => {
            console.log(e)
        });
    }
    sortPeopleByName = () => { 
        this.setState(oldState => ({people: oldState.people.sort((p1, p2) => 
            { 
                if(p1.firstName < p2.firstName) return -1; 
                else if(p2.firstName < p1.firstName) return 1; 
                return 0; })
            }))
    }
    render(){
       return( 
       <div>
            <div className="row">
                <button className="col-lg-1 mt-3 ml-5 btn btn-primary sort-btn" onClick={this.sortPeopleByName}>SORT BY NAME</button>
            </div>

            <Table deletePersonFunction={this.removePerson} people={this.state.people}/>

            <button onClick={() => this.setState(oldState => ({showCreateForm: !oldState.showCreateForm}))} 
            className="btn btn-primary">
            {
                this.state.showCreateForm ? 'Hide' : 'Create person' 
            }
           </button>

            {
           this.state.showCreateForm ? <CreatePersonForm handleSubmit={this.addNewPerson}/> : null
            }
       </div>
       )
    }
}