import axios from 'axios';
import React from 'react';

const url =  window.location.href;

class CreatePersonForm extends React.Component {
    state = {
        person: {
            FirstName: '',
            LastName: '',
            CityId: 0,
            PhoneNr: '',
            SocialSecurityNr: '',
            LanguageIds: [1]
        },
        countries: [],
        cities: []
    }
    
    componentDidMount(){
        axios.get(`${url}/countries`)
        .then(r => {
            this.setState({ countries: r.data.countries });
            this.setState({ cities: r.data.countries.flatMap(c => c.cities)})
            this.setState(({person: {...this.state.person, CityId: r.data.countries[0].cities[0].id}}))
        })
        .catch(e => {
            console.log(e)
        });
    }
    render() {
        return (<form onSubmit={ev => 
        { ev.preventDefault(); this.props.handleSubmit(this.state.person) }}> 
                <input value={this.state.person.FirstName} 
                onChange={event => {
                    this.setState({person: {...this.state.person, FirstName: event.target.value }})}}
                type="text" required/>
                <input value={this.state.person.LastName} onChange={event => {
                    this.setState({ person: {...this.state.person, LastName: event.target.value}})}}
                type="text"/>
                <input value={this.state.person.PhoneNr} onChange={event => {
                    this.setState({ person: {...this.state.person, PhoneNr: event.target.value}})}}
                type="text"/>
                <input value={this.state.person.SocialSecurityNr} onChange={event => {
                    this.setState({ person: {...this.state.person, SocialSecurityNr: event.target.value}})}}
                type="text"/>
                <select id="cities" name="cities" type="text"
                defaultValue={0} onChange={event => { 
                    this.setState({person: {...this.state.person, CityId: parseInt(event.target.value)}})}} 
                >
                    {
                    this.state.cities.map(c => <option value={c.id} key={c.name}>{c.name}</option>  ) 
                    }
                </select>
              
                <button>Create person</button>
        </form>)
    }
}

const PersonDetails = ({person, deletePersonFunction}) => {
 return (
     <div>
        {person.city.name}
    
         <button onClick={() => deletePersonFunction(person)}>DELETE</button>
     
     </div>
 )
}

class Person extends React.Component {
    state = {
        showDetails: false
    };
    person = this.props.person;
    setShowDetails = (val) => {
        this.setState({showDetails: val})
    }
    render() { return (
        <tr>
            <td>{this.person.firstName}</td>
            <td>{this.person.lastName}</td>
           
            <td>
                <button onClick={() => this.setShowDetails(!this.state.showDetails)}>Show details</button>
            </td>
            
                { this.state.showDetails ?
                    <td>
                        <PersonDetails person={this.person} deletePersonFunction={this.props.deletePersonFunction}/>
                    </td>
                : null
                }
           
        </tr>
    )
}
}

const Table = ({people, deletePersonFunction}) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Lastname</th>
                <th>City</th>
            </tr>
            </thead>
            <tbody>
            {people.map(p => <Person deletePersonFunction={deletePersonFunction} key={p.id} person={p}/>)}   
            </tbody>
        </table>
    );
}
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
          
           <button onClick={this.sortPeopleByName}>SORT BY NAME</button>
           <Table deletePersonFunction={this.removePerson} people={this.state.people}/>
       <button onClick={() => this.setState(oldState => ({showCreateForm: !oldState.showCreateForm}))}>Create person</button>
       {
           this.state.showCreateForm ?
                    <CreatePersonForm handleSubmit={this.addNewPerson}/>
                    : null
       }
       </div>)
    }
}