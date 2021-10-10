import axios from 'axios';
import React from 'react';

const url = "https://localhost:44350/react"

export default class CreatePersonForm extends React.Component {
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