import React, { Component } from 'react';
import { List, Segment, Input, Image, Dropdown, Button, Icon} from 'semantic-ui-react'
import '../assets/NavBar.css'
import logo from '../assets/parts_pricing_icon.png'
import history from '../history'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return ({
        loggedIn: state.loggedIn,
        name: state.currentUserName,
        searchTerm: state.searchTerm
    })
}

const mapDispatchToProps = {
    loggedInCheck: () => dispatch => {
        if (localStorage.auth_token) {
            fetch(`http://localhost:8000/users/token/${localStorage.auth_token}`)
                .then(res => res.json())
                .then(user => {
                    if (user) {
                        dispatch({ type: 'USER_LOGGED_IN', loggedIn: true, name: { firstname: user.firstname, lastname: user.lastname } })
                    } else {
                        dispatch({ type: 'USER_LOGGED_IN', loggedIn: false })
                    }
                })
        } else {
            dispatch({ type: 'USER_LOGGED_IN', loggedIn: false })
        }
    },
    searchTermChange: (value) => (
        { type: 'CHANGE_SEARCH_TERM', searchTerm: value }
    ),
    searchType: (value) => (
        // {type:'CHANGE_SEARCH_TYPE', searchType: value}
        console.log(value)
    )
}

class NavBar extends Component {

    componentDidMount() {
        this.props.loggedInCheck()
    }

    logout() {
        localStorage.removeItem('auth_token')
        this.props.loggedInCheck()
    }

    render() {
        return (
            <div>
                <Segment basic style={{ height: 200}}/>
                <div style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100000 }}>
                    <Segment basic className='mainDiv' >
                        <List className='list'>
                            <List.Item className='listItem home'>
                                <a className="active nav-a" href="/">
                                    <Image src={logo} size='small' />
                                </a>
                            </List.Item>
                            <List.Item className='listItemCart' size='large'>
                                <Segment basic>
                                    <Icon onClick={() => { history.push('/cart') }} link inverted color='green' name='shopping cart' size='huge'></Icon>
                                </Segment>
                            </List.Item>
                            <List.Item className='searchListItem'>
                                <Segment basic className='searchDiv'>
                                    <Input onChange={(e) => { this.props.searchTermChange(e.target.value) }} value={this.props.searchTerm} className='inputSearch' placholder='Search...' action={<Button onClick={() => { history.push('/') }}><Icon name='search' /></Button>} actionPosition='left' />
                                </Segment>
                            </List.Item>
                            <List.Item className='signupListItem'>
                                {this.props.loggedIn ?
                                    <Segment basic className='signupSegment'>
                                        <Dropdown closeOnBlur button text='Profile'>
                                            <Dropdown.Menu icon='arrow'>
                                                <Dropdown.Item disabled='true' text={<span>Signed in as <strong>{this.props.name.firstname + ' ' + this.props.name.lastname}</strong></span>} />
                                                <Dropdown.Item onClick={() => { history.push('/orders') }} text='Orders' />
                                                <Dropdown.Item onClick={() => { this.logout() }} text='Sign Out' />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Segment>
                                    :
                                    <Segment basic className='signupSegment'>
                                        <Dropdown closeOnBlur button text='Login/Sign Up'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => { history.push('/login') }} text='Login' />
                                                <Dropdown.Item onClick={() => { history.push('/signup') }} text='Sign Up' />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Segment>}
                            </List.Item>
                        </List>
                    </Segment>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)