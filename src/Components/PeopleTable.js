import axios from 'axios';
import React from 'react';

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
        countries: [
            { 
                name: 'sweden', cities: [
                {
                    name: 'göteborg',
                    id: 7
                },
                {
                    name: 'stockholm',
                    id: 2
                },
                {
                    name: 'malmö',
                    id: 3
                }
            ]
        },
        { 
            name: 'canada', cities: [
            {
                name: 'toronto',
                id: 22
                
            },
            {
                name: 'ottowa',
                id: 11
            }
        ]
    },{ 
        name: 'germany', cities: [
        {
            name: 'berlin',
            id: 33
        },
        {
            name: 'frankfurt',
            id: 44
        }
    ]
        } 
    ]
    }
    cities = this.state.countries.flatMap(c => c.cities)
    componentDidMount(){
        this.setState(({person: {...this.state.person, CityId: this.cities[0].id}}))
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
                defaultValue={this.cities[0].id} onChange={event => { 
                    this.setState({person: {...this.state.person, CityId: parseInt(event.target.value)}})}} 
                >
                    {
                    this.cities.map(c => <option value={c.id} key={c.name}>{c.name}</option>  ) 
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
        axios.get(`https://localhost:44350/react/people`)
        .then(r => {
            console.log(r.data.people)
            this.setState({ people: r.data.people });
          
        })
        .catch(e => {
            console.log(e)
        });
    }
    addNewPerson = (person) => {

        let json = JSON.stringify(person)
        axios.post(`https://localhost:44350/react/people`, json,
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
        this.setState(oldState => ({ people: oldState.people.filter(p => p.id !== person.id)}))
    }
    sortPeopleByName = () => { 
        this.setState(oldState => ({people: oldState.people.sort((p1, p2) => 
            { 
                if(p1.name < p2.name) return -1; 
                else if(p2.name < p1.name) return 1; 
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