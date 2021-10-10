import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

const PersonDetails = ({person}) => {
 return (
       
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
                    
                </tr>
            </tbody>
         </table>     
 )
}

function Person({person, deletePersonFunction}){
    const [showDetails, setShowDetails] = React.useState(false); 
    
    return (
            !showDetails ? 
            <tr>
                            
                <td>{person.firstName}</td>
                <td>{person.lastName}</td>  
                <td> <button className="btn btn-primary" 
                    onClick={() => setShowDetails(true)}>
                    'Show details' 
                </button>  
                </td>
            </tr>   

                : 
           <tr>
                <td>
           <button onClick={() => deletePersonFunction(person)} 
                            className="btn btn-warning">DELETE</button> 
                    
            </td>
            <td className="person-details">
                
                    <PersonDetails person={person} deletePersonFunction={deletePersonFunction} /> 
            </td>    
           
            <td>   
                <button className="btn btn-primary" 
                onClick={() => setShowDetails(false)}>
                   Hide details
                </button>
            </td>
           </tr>
    )
}

const Table = ({people, deletePersonFunction}) => {
    return (
        <table className="table">
            <thead className="thead-dark">
            <tr>
                <th>Name</th>
                <th>Lastname</th>
            </tr>
            </thead>
            <tbody>
                {people.map(p => <Person deletePersonFunction={deletePersonFunction} key={p.id} person={p}/>)}   
            </tbody>
        </table>
    );
}

export default Table;
