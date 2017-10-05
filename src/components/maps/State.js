import * as React from 'react'
import '../../App.css'
import './Map.css';
import { getHoveredStateData } from '../../actions/actions';
import { connect } from 'react-redux';
import { geoPath } from 'd3';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}

class State extends React.Component {

  constructor(props) {
    super(props);
		this.getStateColor = this.getStateColor.bind(this);
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.getJSX = this.getJSX.bind(this);
  }

  // a simple method to retun a color for a state
  // based on the number of shootings per capita
	getStateColor(shootingsPerCapita) {

		if (shootingsPerCapita < 1) {
      return "rgb(247,251,255)";
    }
    else if (shootingsPerCapita < 3) {
      return "rgb(222,235,247)";
    }
    else if (shootingsPerCapita < 5) {
      return "rgb(198,219,239)";
    }
    else if (shootingsPerCapita < 7) {
      return "rgb(158,202,225)";
    }
    else if (shootingsPerCapita < 10) {
      return "rgb(107,174,214)";
    }
    else if (shootingsPerCapita < 12) {
      return "rgb(66,146,198)";
    }
    else if (shootingsPerCapita < 15) {
      return "rgb(33,113,181)";
    }
    else {
      return "rgb(8,81,156)";
    }
	}

	onMouseEnterHandler(event) {

    const { stateName, numShootings, population, dispatch } = this.props;

    // when a user hovers on a state, dispatch an action to set this state
    // as the activeState in the mapsReducer
		let state = {
      stateName,
      shootings: numShootings,
			shootingsPerMillion: numShootings / population * 1000000
		};

		dispatch(getHoveredStateData(state));
  }
  
  getJSX() {

    const { mapType, numShootings, population, feature, path, radius, i } = this.props;

    // define a function to get the appropriate JSX based on mapType
    const data = () => {
      switch(mapType) {
        case 'choropleth':
          let fill = this.getStateColor(numShootings / population * 1000000);
        
          return <path className='states' d={path} fill={fill} stroke="#FFFFFF" strokeWidth={0.25} onMouseEnter={this.onMouseEnterHandler} />;
        case 'proportional':
          console.log(i);
          let translate = geoPath().centroid(feature);
          return (
            <CSSTransitionGroup
              transitionName={`state-transition-${i}`}
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}
              component={FirstChild}>
              <circle className={`states raw state-transition-${i}`} r={radius} fill={"#B24739"} stroke="#FFFFFF" strokeWidth={0.5} transform={"translate(" + translate + ")"} opacity={0.75} onMouseEnter={this.onMouseEnterHandler}/>
          </CSSTransitionGroup>);
        default:
          return;
      }
    };

    // invoke the function to get the elements
    let elements = data();
    return elements;
  }

  render() {

    let JSX = this.getJSX();
    return JSX;
    
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
    stateName: ownProps.stateName,
    numShootings: ownProps.numShootings,
    population: ownProps.population,
    path: ownProps.path,
    feature: ownProps.feature,
    radius: ownProps.radius
  };
};

export default connect(mapStateToProps)(State);

// State.propTypes = {
//   stateName: PropTypes.string.isRequired,
//   numShootings: PropTypes.number.isRequired,
//   population: PropTypes.number.isRequired,
//   path: PropTypes.string.isRequired,
//   feature: PropTypes.object.isRequired,
//   radius: PropTypes.number
// };
