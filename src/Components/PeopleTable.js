import React from 'react';

class CreatePersonForm extends React.Component {
    state = {
        person: {
            name: '',
            lastname: '',
            city: {},
            id: ''
        },
        countries: [
            { 
                name: 'sweden', cities: [
                {
                    name: 'göteborg'
                },
                {
                    name: 'stockholm'
                },
                {
                    name: 'malmö'
                }
            ]
        },
        { 
            name: 'canada', cities: [
            {
                name: 'toronto'
            },
            {
                name: 'ottowa'
            }
        ]
    },{ 
        name: 'germany', cities: [
        {
            name: 'berlin'
        },
        {
            name: 'frankfurt'
        }
    ]
        } 
    ]
    }
  
    cities = this.state.countries.flatMap(c => c.cities)
    componentDidMount(){
        this.setState(({person: {...this.state.person, city: this.cities[0]}}))
    }
    render() {
        return (<form onSubmit={ev => { ev.preventDefault(); this.props.handleSubmit(this.state.person) }}> 
                <input value={this.state.person.name} 
                onChange={event => {this.setState({person: {...this.state.person, name: event.target.value }})}}
                type="text" required/>
                <input value={this.state.person.lastname} onChange={event => {this.setState({ person: {...this.state.person, lastname: event.target.value}})}}
                type="text"/>
                <select id="cities" name="cities" type="text"
                defaultValue={this.cities[0]} onChange={event => { console.log(this.cities[event.target.value]); console.log(event.target.value); this.setState({person: {...this.state.person, city: this.cities[event.target.value] }})}} 
                >
                    {
                    this.cities.map((c, index) => <option value={index} key={c.name}>{c.name}</option>  ) 
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
            <td>{this.person.name}</td>
            <td>{this.person.lastname}</td>
           
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
            {
                name: "test",
                lastname: "testsson",
                city: { name: "testcity"},
                id: "45453"
            },
            {
                name: "atest2",
                lastname: "testsson2",
                city: { name: "testcity2"},
                id: "34534"
            },
            {
                name: "btest3",
                lastname: "testsson3",
                city: { name: "testcity3"},
                id: "08982"
            }
        ],
    };
    addNewPerson = (person) => {
        //add check?
        person.id = Math.ceil(Math.random() * 100);
        console.log(person)
        this.setState(oldState => ({ people: [...oldState.people, person]}))
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