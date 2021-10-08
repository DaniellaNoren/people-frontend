import axios from 'axios';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { CSSTransition } from 'react-transition-group';
import '../index.css';

const url = window.location.href;

class CreatePersonForm extends React.Component {
    state = {
        showWarning: false,
        warning: '',
        person: {
            FirstName: '',
            LastName: '',
            CityId: 0,
            PhoneNr: '',
            SocialSecurityNr: '',
            LanguageIds: []
        },
        countries: [],
        cities: [],
        languages: []
    }
    checkPerson(){
        const regex = new RegExp('[a-zA-Z]')

        if(this.state.person.FirstName === '' || this.state.person.LastName === ''){
            this.setState({showWarning: true, warning: 'Name has to be filled in'})
            return;
        }
            
        if(regex.test(this.state.person.PhoneNr)){
            this.setState({showWarning: true, warning: 'Invalid phonenumber'})
            return;
        }     
        if(regex.test(this.state.person.SocialSecurityNr) || 
            this.state.person.SocialSecurityNr.length < 10 || 
            this.state.person.SocialSecurityNr.length > 12 ){

            this.setState({showWarning: true, warning: 'Invalid SNN'})
            return;
        }
        this.setState({showWarning: false, warning: ''})

        this.props.handleSubmit(this.state.person)
        
    }
    async componentDidMount(){
        await axios.get(`${url}/countries`)
        .then(r => {
            this.setState({ countries: r.data.countries });
        }).then(() => {
            this.setState({ cities: this.state.countries.flatMap(c => c.cities)})
        })
        .then(() => {
            this.setState(({person: {...this.state.person, CityId: this.state.cities[0].id}}))
        })
        .catch(e => {
            console.log(e)
        });

        await axios.get(`${url}/languages`)
            .then(r => {
                this.setState({ languages: r.data.languages})
            }).catch(e => {
                console.log(e);
            })
    }
    render() {
        return (
       <div className="bg-light d-flex justify-content-center m-2"> 
        
        

        <form onSubmit={ev => 
            { ev.preventDefault(); this.checkPerson();  }}
            className="create-person-form"> 

            { this.state.showWarning ? <p className="form-text text-warning">{this.state.warning}</p> : null } 

            <div className="form-group">
                <label for="FirstName">Firstname:</label>
                <input className="form-control" id="FirstName" value={this.state.person.FirstName} 
                onChange={event => {
                    this.setState({person: {...this.state.person, FirstName: event.target.value }})}}
                type="text" required/>
            </div>

            <div className="form-group">
                <label for="LastName">Lastname:</label>
                <input className="form-control" value={this.state.person.LastName} onChange={event => {
                    this.setState({ person: {...this.state.person, LastName: event.target.value}})}}
                type="text" id="LastName"/>
            </div>

            <div className="form-group">
                <label for="PhoneNr">Phone:</label>
                <input className="form-control" value={this.state.person.PhoneNr} onChange={event => {
                    this.setState({ person: {...this.state.person, PhoneNr: event.target.value}})}}
                    type="tel" id="PhoneNr" required/>
            </div>

            <div className="form-group">
                <label for="SSN">SSN:</label>
                <input className="form-control" value={this.state.person.SocialSecurityNr} onChange={event => {
                    this.setState({ person: {...this.state.person, SocialSecurityNr: event.target.value}})}}
                type="number" id="SSN" required/>
            </div>

            <div className="form-group">
                <label for="City">City:</label>
                <select className="form-control" id="city" name="cities" type="text"
                defaultValue={0} onChange={event => { 
                    this.setState({person: {...this.state.person, CityId: parseInt(event.target.value)}})}} 
                    required>
                    {
                    this.state.cities.map(c => <option value={c.id} key={c.name}>{c.name}</option>  ) 
                    }
                </select>
            </div>

            <div className="form-group">
                <label for="Languages">Languages:</label>
                <select className="form-control" multiple={true} name="languages" type="text"
                defaultValue={[]} onChange={event => { 
                    this.setState({person: {...this.state.person, LanguageIds: [...this.state.person.LanguageIds, parseInt(event.target.value)]}})}} 
                id="languages" required>
                {
                    this.state.languages.map(l => <option value={l.id} key={l.id}>{l.languageName}</option>  ) 
                }
                </select>
            </div>
            
            <button className="mt-3 ml-5 btn btn-primary">Create</button>

        </form>
    </div>
    )
    }
}

const PersonDetails = ({person, deletePersonFunction, hideDetails}) => {
 return (
        <div className="row">
         <button onClick={() => hideDetails(false)} className="col-lg-1 mt-3 ml-5 btn btn-primary">Hide details</button>
         <table className="table">
             <thead>
                 <tr>
                     <th>City</th>
                     <th>SSN</th>
                     <th>Phone</th>
                     <th>Action</th>
                 </tr>
             </thead>
            <tbody>
                <tr>
                    <td> {person.city.name}</td>
                    <td>{person.socialSecurityNr}</td>
                    <td>{person.phoneNr}</td> 
                    <td> <button onClick={() => deletePersonFunction(person)} 
                            className="btn btn-warning">DELETE</button> 
                    </td>
                </tr>
            </tbody>
         </table>     
        </div>
 )
}

function Person({person, deletePersonFunction}){
    const [showDetails, setShowDetails] = React.useState(false); 
    
    return (

        <tr>
           
            <td colspan={showDetails ? 1 : 2}>{person.firstName}</td>
            <td colspan={showDetails ? 1 : 2}>{person.lastName}</td> 
                    
            <CSSTransition
                in={showDetails}
                timeout={500}
                classNames="people">

            <td colspan={4} className="details">
                { 
                showDetails ?
                <PersonDetails person={person} deletePersonFunction={deletePersonFunction} 
                hideDetails={val => setShowDetails(val)}/> 
                : 
                <button className="btn btn-primary" 
                    onClick={() => setShowDetails(true)}>
                    { showDetails ?  'Hide details' : 'Show details' }
                </button>
                }
            </td>
    
            </CSSTransition>
            
        </tr>
    )
}



const Table = ({people, deletePersonFunction}) => {
    return (
        <table className="table">
            <thead className="thead-dark">
            <tr>
                <th colspan={2}>Name</th>
                <th colspan={2}>Lastname</th>
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